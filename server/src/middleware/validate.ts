import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, output } from 'zod';
import { ValidationError } from '../utils/errors.js';

/**
 * 参数校验中间件工厂
 * - 校验 body / query / params
 * - 返回结构化错误信息
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.validated = parseInput(schema, req[source]);
    next();
  };
}

export function getValidated<T extends ZodSchema>(res: Response): output<T> {
  return res.locals.validated as output<T>;
}

export function parseInput<T extends ZodSchema>(schema: T, data: unknown): output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.issues.map((issue) => ({
      path: issue.path.join('.'), message: issue.message,
    })));
  }
  return result.data;
}

import { Router } from 'express';
import { dataService } from '../services/data.js';
import { validate, getValidated, parseInput } from '../middleware/validate.js';
import { idParamSchema, paginationSchema } from '../schemas/common.schema.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

const router = Router();

/**
 * GET /api/events
 * 获取所有田径项目
 */
router.get('/', (req, res) => {
  const { category } = req.query;

  let events = dataService.getEvents();

  if (category && typeof category === 'string') {
    events = dataService.getEventsByCategory(category);
  }

  sendSuccess(res, events);
});

/**
 * GET /api/events/:id
 * 获取项目详情
 */
router.get('/:id', validate(idParamSchema, 'params'), (req, res) => {
  const { id } = getValidated<typeof idParamSchema>(res);
  const event = dataService.getEventById(id);

  if (!event) {
    throw new NotFoundError('田径项目', id);
  }

  sendSuccess(res, event);
});

/**
 * GET /api/events/:id/results
 * 获取项目比赛记录
 */
router.get('/:id/results', validate(idParamSchema, 'params'), (req, res) => {
  const { id } = getValidated<typeof idParamSchema>(res);
  const event = dataService.getEventById(id);

  if (!event) {
    throw new NotFoundError('田径项目', id);
  }

  const results = dataService.getResultsByEvent(event.id);
  const { page, limit } = parseInput(paginationSchema, req.query);
  const start = (page - 1) * limit;

  sendPaginated(res, results.slice(start, start + limit), results.length, page, limit);
});

export default router;

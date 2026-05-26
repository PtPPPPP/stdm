import type { CompetitionResult, DataMeta } from './types';

const REQUIRED_RESULT_FIELDS: (keyof CompetitionResult)[] = [
  'id',
  'athleteId',
  'athleteName',
  'athleteEnglishName',
  'competitionName',
  'competitionSlug',
  'date',
  'event',
  'mark',
];

const REQUIRED_SOURCE_FIELDS: (keyof CompetitionResult['source'])[] = [
  'sourceName',
  'sourceUrl',
  'sourceType',
  'updatedAt',
  'verified',
];

export interface ValidationError {
  id: string;
  field: string;
  message: string;
}

export function validateCompetitionResult(result: CompetitionResult): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = result.id ?? 'unknown';

  for (const field of REQUIRED_RESULT_FIELDS) {
    if (!result[field]) {
      errors.push({ id: prefix, field, message: `缺少必填字段: ${field}` });
    }
  }

  if (result.date && isNaN(Date.parse(result.date))) {
    errors.push({ id: prefix, field: 'date', message: `日期格式无效: ${result.date}` });
  }

  const source = result.source;
  if (!source) {
    errors.push({ id: prefix, field: 'source', message: '缺少 source 对象' });
  } else {
    for (const field of REQUIRED_SOURCE_FIELDS) {
      if (!source[field as keyof typeof source]) {
        errors.push({ id: prefix, field: `source.${field}`, message: `缺少必填字段: source.${field}` });
      }
    }
    if (source.verified && !['verified', 'pending', 'unverified'].includes(source.verified)) {
      errors.push({ id: prefix, field: 'source.verified', message: `verified 值不合法: ${source.verified}` });
    }
  }

  return errors;
}

export function validateCompetitionResults(results: CompetitionResult[]): ValidationError[] {
  const allErrors: ValidationError[] = [];
  for (const r of results) {
    allErrors.push(...validateCompetitionResult(r));
  }
  return allErrors;
}

export function validateDataMeta(meta: DataMeta): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!meta.lastManualUpdate) {
    errors.push({ id: 'dataMeta', field: 'lastManualUpdate', message: '缺少 lastManualUpdate' });
  }
  if (meta.lastManualUpdate && isNaN(Date.parse(meta.lastManualUpdate))) {
    errors.push({
      id: 'dataMeta',
      field: 'lastManualUpdate',
      message: `日期格式无效: ${meta.lastManualUpdate}`,
    });
  }
  if (meta.lastAutoSync && isNaN(Date.parse(meta.lastAutoSync))) {
    errors.push({
      id: 'dataMeta',
      field: 'lastAutoSync',
      message: `日期格式无效: ${meta.lastAutoSync}`,
    });
  }
  if (!meta.dataPolicy) {
    errors.push({ id: 'dataMeta', field: 'dataPolicy', message: '缺少 dataPolicy' });
  }
  return errors;
}

export function warnValidationErrors(scope: string, errors: ValidationError[]): void {
  const viteEnv = (import.meta as unknown as { env?: { DEV?: boolean } }).env;
  if (errors.length === 0 || !viteEnv?.DEV) return;
  console.warn(`[${scope}] 发现 ${errors.length} 个数据问题：`);
  for (const error of errors) {
    console.warn(`  [${error.id}] ${error.field}: ${error.message}`);
  }
}

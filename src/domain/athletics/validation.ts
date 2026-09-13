import { getMarkUnit, getResultEventCategory, parseMarkValue } from './markUtils';
import type { Athlete, CompetitionResult, DataMeta } from './types';

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

  if (result.date && !isCalendarDate(result.date)) {
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

  const parsedMark = parseMarkValue(result.mark);
  if (result.markValue !== undefined && (parsedMark === undefined || !Number.isFinite(result.markValue) || Math.abs(result.markValue - parsedMark) > 0.000001)) {
    errors.push({ id: prefix, field: 'markValue', message: '成绩数值与显示成绩不一致' });
  }
  if (result.markUnit && result.markUnit !== getMarkUnit(result.mark, result.event)) {
    errors.push({ id: prefix, field: 'markUnit', message: '成绩单位与项目不一致' });
  }
  if (result.eventCategory !== getResultEventCategory(result.event)) {
    errors.push({ id: prefix, field: 'eventCategory', message: '项目分类不一致' });
  }
  if (result.place != null && (!Number.isInteger(result.place) || result.place < 1)) {
    errors.push({ id: prefix, field: 'place', message: '名次必须为正整数' });
  }
  if (source) {
    if (!isCalendarDate(source.updatedAt)) errors.push({ id: prefix, field: 'source.updatedAt', message: '来源更新日期无效' });
    try {
      const url = new URL(source.sourceUrl);
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid protocol');
      if (source.verified === 'verified' && url.pathname === '/') {
        errors.push({ id: prefix, field: 'source.sourceUrl', message: '已核验记录必须提供具体结果页或报道，不能只链接网站首页' });
      }
    } catch {
      errors.push({ id: prefix, field: 'source.sourceUrl', message: '来源链接无效' });
    }
  }

  return errors;
}

export function validateCompetitionResults(results: CompetitionResult[]): ValidationError[] {
  const allErrors: ValidationError[] = [];
  const ids = new Set<string>();
  for (const r of results) {
    allErrors.push(...validateCompetitionResult(r));
    if (ids.has(r.id)) allErrors.push({ id: r.id, field: 'id', message: '比赛记录 ID 重复' });
    ids.add(r.id);
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

function isCalendarDate(value: string): boolean {
  const date = new Date(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateAthleteReferences(athletes: Athlete[], results: CompetitionResult[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const ids = new Set(athletes.map((athlete) => athlete.id));
  const seen = new Set<string>();
  for (const athlete of athletes) {
    if (seen.has(athlete.id)) errors.push({ id: athlete.id, field: 'id', message: '运动员 ID 重复' });
    seen.add(athlete.id);
    if (!athlete.events.includes(athlete.mainEvent)) errors.push({ id: athlete.id, field: 'mainEvent', message: '主项不在参赛项目中' });
    for (const id of athlete.similarAthleteIds) {
      if (!ids.has(id)) errors.push({ id: athlete.id, field: 'similarAthleteIds', message: `相关运动员不存在: ${id}` });
    }
    if (Object.values(athlete.styleProfile).some((score) => !Number.isFinite(score) || score < 0 || score > 100)) {
      errors.push({ id: athlete.id, field: 'styleProfile', message: '风格评分必须在 0–100 之间' });
    }
  }
  for (const result of results) {
    if (!ids.has(result.athleteId)) errors.push({ id: result.id, field: 'athleteId', message: '运动员不存在' });
  }
  return errors;
}

import { z } from 'zod';
/**
 * 数据加载服务
 *
 * 从 server/data/ 目录加载 JSON 数据（由 scripts/export-data.ts 生成）
 * 后续可替换为数据库查询
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../../data');

// Validate the fields used by queries; preserve the remaining profile fields.
const athleteSchema = z.object({
  id: z.string(), name: z.string(), englishName: z.string(), country: z.string(),
  gender: z.enum(['male', 'female']), events: z.array(z.string()),
}).passthrough();
const eventSchema = z.object({ id: z.string(), name: z.string(), category: z.string() }).passthrough();
const resultSchema = z.object({
  id: z.string(), athleteId: z.string(), event: z.string(), date: z.string(),
  competitionSlug: z.string(), competitionName: z.string(), mark: z.string(),
  markValue: z.number().optional(), place: z.number().optional(),
  source: z.object({ verified: z.enum(['verified', 'pending', 'unverified']) }).passthrough(),
}).passthrough();
const metaSchema = z.object({ lastManualUpdate: z.string(), dataPolicy: z.string() }).passthrough();

function loadJSON<T>(filename: string, schema: z.ZodType<T>): T {
  try {
    return schema.parse(JSON.parse(readFileSync(resolve(DATA_DIR, filename), 'utf-8')));
  } catch (cause) {
    throw new Error(`无法加载数据文件 ${filename}，请检查数据并运行 npx tsx scripts/export-data.ts`, { cause });
  }
}

let athletes: z.infer<typeof athleteSchema>[] | undefined;
let results: z.infer<typeof resultSchema>[] | undefined;
let events: z.infer<typeof eventSchema>[] | undefined;
let meta: z.infer<typeof metaSchema> | undefined;

function getAthletes() { return athletes ??= loadJSON('athletes.json', z.array(athleteSchema)); }
function getResults() { return results ??= loadJSON('results.json', z.array(resultSchema)); }
function getEvents() { return events ??= loadJSON('events.json', z.array(eventSchema)); }
function getDataMeta() { return meta ??= loadJSON('meta.json', metaSchema); }

// ── 查询函数 ──

function getAthleteById(id: string) {
  return getAthletes().find((a) => a.id === id);
}

function searchAthletes(query: string, filters?: { country?: string; gender?: string; event?: string }) {
  let result = getAthletes();

  if (query) {
    const q = query.toLowerCase();
    result = result.filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.englishName.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    );
  }

  if (filters?.country) {
    result = result.filter((a) => a.country === filters.country);
  }

  if (filters?.gender) {
    result = result.filter((a) => a.gender === filters.gender);
  }

  const event = filters?.event;
  if (event) {
    result = result.filter((a) => a.events.includes(event));
  }

  return result;
}

function getResultsByAthleteId(athleteId: string) {
  return getResults()
    .filter((r) => r.athleteId === athleteId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getResultsByEvent(event: string) {
  return getResults()
    .filter((r) => r.event === event)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getResultsByCompetition(competitionSlug: string) {
  return getResults()
    .filter((r) => r.competitionSlug === competitionSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getEventById(id: string) {
  return getEvents().find((e) => e.id === id);
}

function getEventsByCategory(category: string) {
  return getEvents().filter((e) => e.category === category);
}

function getAllCountries() {
  const countries = new Set(getAthletes().map((a) => a.country));
  return Array.from(countries).sort();
}

export const dataService = {
  getAthletes,
  getResults,
  getEvents,
  getDataMeta,
  getAthleteById,
  searchAthletes,
  getResultsByAthleteId,
  getResultsByEvent,
  getResultsByCompetition,
  getEventById,
  getEventsByCategory,
  getAllCountries,
};

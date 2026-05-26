import fs from 'node:fs';
import path from 'node:path';
import type {
  CompetitionResult,
  EventCategory,
  MarkUnit,
  ResultSource,
  ResultSourceType,
  VerificationStatus,
} from '../../src/domain/athletics/types.js';
import { athletes, competitionResults, dataMeta } from '../../src/data/index.js';
import { validateCompetitionResults } from '../../src/domain/athletics/validation.js';
import { slugify } from '../../src/lib/slug.js';
import {
  writeCompetitionResultsGenerated,
  writeDataMetaGenerated,
} from './write-generated-files.js';

interface RawManualResult {
  id?: string;
  athleteId?: string;
  athleteName?: string;
  athleteEnglishName?: string;
  country?: string;
  competitionName?: string;
  competitionSlug?: string;
  competitionGroup?: string;
  venue?: string;
  city?: string;
  countryCode?: string;
  date?: string;
  event?: string;
  eventCategory?: EventCategory;
  round?: string;
  place?: number;
  mark?: string;
  markValue?: number;
  markUnit?: MarkUnit;
  wind?: string;
  reactionTime?: string;
  points?: number;
  recordTags?: string[];
  source?: Partial<ResultSource>;
}

const RAW_PATH = path.resolve('data-import/raw/manual-results.json');
const NORMALIZED_PATH = path.resolve('data-import/normalized/results.normalized.json');
const AUDIT_DIR = path.resolve('data-import/audit');
const UNMATCHED_PATH = path.join(AUDIT_DIR, 'unmatched-athletes.md');
const MISSING_FIELDS_PATH = path.join(AUDIT_DIR, 'manual-results-missing-fields.md');

function ensureImportDirs(): void {
  fs.mkdirSync(path.dirname(NORMALIZED_PATH), { recursive: true });
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

function readManualResults(): RawManualResult[] | null {
  if (!fs.existsSync(RAW_PATH)) {
    console.log(`未找到 ${RAW_PATH}。如需手动导入，请复制 data-import/raw/manual-results.example.json 为 manual-results.json 后再运行。`);
    return null;
  }

  const parsed = JSON.parse(fs.readFileSync(RAW_PATH, 'utf-8')) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error('manual-results.json 必须是数组。');
  }
  return parsed as RawManualResult[];
}

function findAthlete(raw: RawManualResult) {
  const english = raw.athleteEnglishName?.trim().toLowerCase();
  const name = raw.athleteName?.trim().toLowerCase();
  const id = raw.athleteId?.trim();

  return athletes.find((athlete) => {
    if (id && athlete.id === id) return true;
    if (english && athlete.englishName.toLowerCase() === english) return true;
    if (name && athlete.name.toLowerCase() === name) return true;
    if (name && athlete.englishName.toLowerCase() === name) return true;
    return false;
  });
}

function inferEventCategory(event: string): EventCategory {
  const normalized = event.toLowerCase();
  if (/(100m|200m|400m|relay)/.test(normalized) && !normalized.includes('h')) return 'sprints';
  if (/(800m|1500m|mile)/.test(normalized)) return 'middle-distance';
  if (/(3000m|5000m|10000m|marathon|steeple|sc)/.test(normalized)) return 'long-distance';
  if (/(hurdle|h$|mh|110mh|100mh|400mh)/.test(normalized)) return 'hurdles';
  if (/(jump|vault)/.test(normalized)) return 'jumps';
  if (/(shot|discus|javelin|hammer|throw)/.test(normalized)) return 'throws';
  return 'other';
}

function inferMarkUnit(mark: string): MarkUnit {
  if (/m$/i.test(mark)) return 'm';
  if (/^\d+:\d/.test(mark)) return 'time';
  if (/s$/i.test(mark) || /^\d{1,2}\.\d+$/.test(mark)) return 's';
  return 'unknown';
}

function inferSourceType(source?: Partial<ResultSource>): ResultSourceType {
  const haystack = `${source?.sourceName ?? ''} ${source?.sourceUrl ?? ''}`.toLowerCase();
  if (haystack.includes('diamondleague') || haystack.includes('diamond league')) return 'diamond-league';
  if (haystack.includes('worldathletics') || haystack.includes('world athletics')) return 'world-athletics';
  return source?.sourceType ?? 'manual';
}

function normalizeVerified(value: VerificationStatus | undefined): VerificationStatus {
  if (value === 'verified') return 'pending';
  return value ?? 'pending';
}

function normalizeRawResult(raw: RawManualResult, index: number): CompetitionResult {
  const athlete = findAthlete(raw);
  const athleteName = raw.athleteName ?? athlete?.name ?? raw.athleteEnglishName ?? 'Unknown Athlete';
  const athleteEnglishName = raw.athleteEnglishName ?? athlete?.englishName ?? athleteName;
  const athleteId = raw.athleteId ?? athlete?.id ?? slugify(athleteEnglishName);
  const competitionName = raw.competitionName ?? 'Unknown Competition';
  const date = raw.date ?? new Date().toISOString().slice(0, 10);
  const event = raw.event ?? 'unknown-event';
  const mark = raw.mark ?? 'NM';
  const source = raw.source ?? {};

  return {
    id: raw.id ?? `${athleteId}-${date.replace(/-/g, '')}-${slugify(event) || index}`,
    athleteId,
    athleteName,
    athleteEnglishName,
    country: raw.country ?? athlete?.country,
    competitionName,
    competitionSlug: raw.competitionSlug ?? slugify(competitionName),
    competitionGroup: raw.competitionGroup,
    venue: raw.venue,
    city: raw.city,
    countryCode: raw.countryCode ?? athlete?.countryCode,
    date,
    event,
    eventCategory: raw.eventCategory ?? inferEventCategory(event),
    round: raw.round,
    place: raw.place,
    mark,
    markValue: raw.markValue,
    markUnit: raw.markUnit ?? inferMarkUnit(mark),
    wind: raw.wind,
    reactionTime: raw.reactionTime,
    points: raw.points,
    recordTags: raw.recordTags,
    source: {
      sourceName: source.sourceName ?? 'Manual import',
      sourceUrl: source.sourceUrl ?? 'https://www.diamondleague.com/',
      sourceType: inferSourceType(source),
      updatedAt: source.updatedAt ?? new Date().toISOString().slice(0, 10),
      verified: normalizeVerified(source.verified),
      notes: source.notes,
    },
  };
}

function writeUnmatchedReport(rows: RawManualResult[]): void {
  if (rows.length === 0) {
    fs.writeFileSync(UNMATCHED_PATH, '# Unmatched Athletes\n\nNo unmatched athletes.\n', 'utf-8');
    return;
  }

  const lines = [
    '# Unmatched Athletes',
    '',
    'These rows did not match `athletes.manual.ts` by `athleteId`, `athleteEnglishName`, or `athleteName`.',
    '',
    '| athleteName | athleteEnglishName | competition | date |',
    '| --- | --- | --- | --- |',
    ...rows.map(
      (row) =>
        `| ${row.athleteName ?? ''} | ${row.athleteEnglishName ?? ''} | ${row.competitionName ?? ''} | ${row.date ?? ''} |`
    ),
    '',
  ];
  fs.writeFileSync(UNMATCHED_PATH, lines.join('\n'), 'utf-8');
}

function writeMissingFieldsReport(errors: string[]): void {
  const lines =
    errors.length === 0
      ? ['# Manual Results Missing Fields', '', 'No missing required fields.', '']
      : ['# Manual Results Missing Fields', '', ...errors.map((error) => `- ${error}`), ''];
  fs.writeFileSync(MISSING_FIELDS_PATH, lines.join('\n'), 'utf-8');
}

function mergeResults(existing: CompetitionResult[], imported: CompetitionResult[]): CompetitionResult[] {
  const byId = new Map(existing.map((result) => [result.id, result]));
  for (const result of imported) {
    byId.set(result.id, result);
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function main(): void {
  ensureImportDirs();
  const rawResults = readManualResults();
  if (!rawResults) return;

  const unmatched = rawResults.filter((row) => !findAthlete(row));
  writeUnmatchedReport(unmatched);

  const missingFieldErrors: string[] = [];
  rawResults.forEach((row, index) => {
    for (const field of ['athleteName', 'athleteEnglishName', 'competitionName', 'date', 'event', 'mark'] as const) {
      if (!row[field]) missingFieldErrors.push(`[${index}] 缺少字段: ${field}`);
    }
  });
  writeMissingFieldsReport(missingFieldErrors);

  if (missingFieldErrors.length > 0) {
    console.error(`手动导入数据存在 ${missingFieldErrors.length} 个缺失字段，已写入 ${MISSING_FIELDS_PATH}`);
    process.exit(1);
  }

  const normalized = rawResults.map(normalizeRawResult);
  const errors = validateCompetitionResults(normalized);
  if (errors.length > 0) {
    writeMissingFieldsReport(errors.map((error) => `[${error.id}] ${error.field}: ${error.message}`));
    console.error(`标准化后仍有 ${errors.length} 个校验问题，未覆盖旧 generated 数据。`);
    process.exit(1);
  }

  fs.writeFileSync(NORMALIZED_PATH, JSON.stringify(normalized, null, 2), 'utf-8');

  const merged = mergeResults(competitionResults, normalized);
  writeCompetitionResultsGenerated(merged);
  writeDataMetaGenerated({
    ...dataMeta,
    lastManualUpdate: new Date().toISOString().slice(0, 10),
    latestCompletedMeet: merged[0]?.competitionName ?? dataMeta.latestCompletedMeet,
    latestCompletedMeetDate: merged[0]?.date ?? dataMeta.latestCompletedMeetDate,
  });

  console.log(`已标准化 ${normalized.length} 条手动导入记录。`);
  console.log(`normalized: ${NORMALIZED_PATH}`);
  console.log(`audit: ${UNMATCHED_PATH}`);
}

main();

import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import type {
  CompetitionResult,
  EventCategory,
  MarkUnit,
} from '../../src/domain/athletics/types.js';
import { athletes, competitionResults, dataMeta } from '../../src/data/index.js';
import { validateCompetitionResults } from '../../src/domain/athletics/validation.js';
import { slugify } from '../../src/lib/slug.js';
import { dataSources, type DataSourceConfig } from './sources.js';
import {
  writeCompetitionResultsGenerated,
  writeDataMetaGenerated,
} from './write-generated-files.js';

interface SyncAuditSource {
  id: string;
  name: string;
  url: string;
  ok: boolean;
  status?: number;
  parsedResults: number;
  error?: string;
  notes: string[];
}

interface SyncAuditReport {
  syncedAt: string;
  generated: boolean;
  existingResults: number;
  newCompetitions: number;
  parsedResults: number;
  newResults: number;
  pendingResults: number;
  sources: SyncAuditSource[];
}

const NORMALIZED_PATH = path.resolve('data-import/normalized/results.normalized.json');
const AUDIT_JSON_PATH = path.resolve('data-import/audit/sync-report.json');
const AUDIT_MD_PATH = path.resolve('data-import/audit/sync-report.md');

function ensureImportDirs(): void {
  fs.mkdirSync(path.dirname(NORMALIZED_PATH), { recursive: true });
  fs.mkdirSync(path.dirname(AUDIT_JSON_PATH), { recursive: true });
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

function findAthleteByName(name: string) {
  const target = name.trim().toLowerCase();
  return athletes.find(
    (athlete) =>
      athlete.englishName.toLowerCase() === target ||
      athlete.name.toLowerCase() === target
  );
}

function parseHeaderIndex(headers: string[], names: string[]): number {
  return headers.findIndex((header) => names.some((name) => header.includes(name)));
}

function parseDate(value: string): string | null {
  const match = value.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function parseTableResults($: CheerioAPI, source: DataSourceConfig): CompetitionResult[] {
  const results: CompetitionResult[] = [];

  $('table').each((_, table) => {
    const headers = $(table)
      .find('thead th, tr:first-child th, tr:first-child td')
      .map((__, header) => $(header).text().trim().toLowerCase())
      .get();

    const athleteIndex = parseHeaderIndex(headers, ['athlete', 'competitor', 'name']);
    const markIndex = parseHeaderIndex(headers, ['mark', 'result', 'performance']);
    const eventIndex = parseHeaderIndex(headers, ['event', 'discipline']);
    const dateIndex = parseHeaderIndex(headers, ['date']);
    const placeIndex = parseHeaderIndex(headers, ['place', 'rank', 'pos']);

    if (athleteIndex < 0 || markIndex < 0 || eventIndex < 0 || dateIndex < 0) {
      return;
    }

    $(table)
      .find('tbody tr')
      .each((rowIndex, row) => {
        const cells = $(row)
          .find('td')
          .map((__, cell) => $(cell).text().trim().replace(/\s+/g, ' '))
          .get();
        const athleteName = cells[athleteIndex];
        const mark = cells[markIndex];
        const event = cells[eventIndex];
        const date = parseDate(cells[dateIndex] ?? '');

        if (!athleteName || !mark || !event || !date) return;

        const athlete = findAthleteByName(athleteName);
        const athleteId = athlete?.id ?? slugify(athleteName);
        const place = Number.parseInt(cells[placeIndex] ?? '', 10);

        results.push({
          id: `${athleteId}-${date.replace(/-/g, '')}-${slugify(event) || rowIndex}`,
          athleteId,
          athleteName: athlete?.name ?? athleteName,
          athleteEnglishName: athlete?.englishName ?? athleteName,
          country: athlete?.country,
          competitionName: source.name,
          competitionSlug: source.competitionSlug,
          competitionGroup: 'Diamond League',
          date,
          event,
          eventCategory: inferEventCategory(event),
          place: Number.isFinite(place) ? place : undefined,
          mark,
          markUnit: inferMarkUnit(mark),
          source: {
            sourceName: source.name,
            sourceUrl: source.url,
            sourceType: source.type,
            updatedAt: new Date().toISOString().slice(0, 10),
            verified: 'pending',
            notes: '自动同步生成，等待人工核验。',
          },
        });
      });
  });

  return results;
}

async function fetchHtml(source: DataSourceConfig): Promise<{ html: string; status: number }> {
  const response = await fetch(source.url);
  const html = await response.text();
  return { html, status: response.status };
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

function writeAudit(report: SyncAuditReport): void {
  fs.writeFileSync(AUDIT_JSON_PATH, JSON.stringify(report, null, 2), 'utf-8');

  const lines = [
    '# Diamond League Sync Report',
    '',
    `- Synced at: ${report.syncedAt}`,
    `- Generated files: ${report.generated ? 'yes' : 'no'}`,
    `- Existing results: ${report.existingResults}`,
    `- New competitions: ${report.newCompetitions}`,
    `- Parsed results: ${report.parsedResults}`,
    `- New results: ${report.newResults}`,
    `- Pending results: ${report.pendingResults}`,
    '',
    '| Source | URL | OK | Parsed | Notes |',
    '| --- | --- | --- | ---: | --- |',
    ...report.sources.map(
      (source) =>
        `| ${source.name} | ${source.url} | ${source.ok ? 'yes' : 'no'} | ${source.parsedResults} | ${(source.error ?? source.notes.join('; ')).replace(/\|/g, '/')} |`
    ),
    '',
  ];
  fs.writeFileSync(AUDIT_MD_PATH, lines.join('\n'), 'utf-8');
}

async function main(): Promise<void> {
  ensureImportDirs();

  const enabledSources = dataSources.filter((source) => source.enabled);
  const parsedResults: CompetitionResult[] = [];
  const auditSources: SyncAuditSource[] = [];

  for (const source of enabledSources) {
    const audit: SyncAuditSource = {
      id: source.id,
      name: source.name,
      url: source.url,
      ok: false,
      parsedResults: 0,
      notes: [],
    };

    try {
      const { html, status } = await fetchHtml(source);
      audit.status = status;
      if (status < 200 || status >= 300) {
        throw new Error(`HTTP ${status}`);
      }

      const $ = cheerio.load(html);
      const sourceResults = parseTableResults($, source);
      audit.parsedResults = sourceResults.length;

      if (sourceResults.length === 0) {
        audit.notes.push('未发现稳定的结果表格结构，未生成猜测数据。');
      } else {
        audit.ok = true;
        parsedResults.push(...sourceResults);
      }
    } catch (error) {
      audit.error = error instanceof Error ? error.message : String(error);
    }

    auditSources.push(audit);
  }

  const validationErrors = validateCompetitionResults(parsedResults);
  const newIds = new Set(competitionResults.map((result) => result.id));
  const addedResults = parsedResults.filter((result) => !newIds.has(result.id));
  const newResults = addedResults.length;
  const existingCompetitionSlugs = new Set(competitionResults.map((result) => result.competitionSlug));
  const newCompetitions = new Set(
    addedResults
      .filter((result) => !existingCompetitionSlugs.has(result.competitionSlug))
      .map((result) => result.competitionSlug)
  ).size;
  const pendingResults = parsedResults.filter((result) => result.source.verified === 'pending').length;

  const report: SyncAuditReport = {
    syncedAt: new Date().toISOString(),
    generated: false,
    existingResults: competitionResults.length,
    newCompetitions,
    parsedResults: parsedResults.length,
    newResults,
    pendingResults,
    sources: auditSources,
  };

  if (parsedResults.length === 0 || validationErrors.length > 0) {
    if (validationErrors.length > 0) {
      report.sources.push({
        id: 'validation',
        name: 'Validation',
        url: '',
        ok: false,
        parsedResults: 0,
        error: `${validationErrors.length} validation errors`,
        notes: validationErrors.map((error) => `[${error.id}] ${error.field}: ${error.message}`),
      });
    }
    writeAudit(report);
    console.log(`未生成新数据。audit: ${AUDIT_MD_PATH}`);
    return;
  }

  fs.writeFileSync(NORMALIZED_PATH, JSON.stringify(parsedResults, null, 2), 'utf-8');

  const merged = mergeResults(competitionResults, parsedResults);
  writeCompetitionResultsGenerated(merged);
  writeDataMetaGenerated({
    ...dataMeta,
    lastAutoSync: new Date().toISOString().slice(0, 10),
    latestCompletedMeet: merged[0]?.competitionName ?? dataMeta.latestCompletedMeet,
    latestCompletedMeetDate: merged[0]?.date ?? dataMeta.latestCompletedMeetDate,
  });

  report.generated = true;
  writeAudit(report);
  console.log(`同步完成，新增 ${newResults} 条记录。`);
}

main().catch((error) => {
  ensureImportDirs();
  const report: SyncAuditReport = {
    syncedAt: new Date().toISOString(),
    generated: false,
    existingResults: competitionResults.length,
    newCompetitions: 0,
    parsedResults: 0,
    newResults: 0,
    pendingResults: 0,
    sources: [
      {
        id: 'runtime',
        name: 'Runtime',
        url: '',
        ok: false,
        parsedResults: 0,
        error: error instanceof Error ? error.message : String(error),
        notes: ['同步异常，旧 generated 数据已保留。'],
      },
    ],
  };
  writeAudit(report);
  console.error(`同步失败，旧数据已保留。audit: ${AUDIT_MD_PATH}`);
  process.exit(1);
});

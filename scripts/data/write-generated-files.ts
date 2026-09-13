import fs from 'node:fs';
import path from 'node:path';
import type { CompetitionResult, DataMeta } from '../../src/domain/athletics/types.js';

const GENERATED_DIR = path.resolve('src/data/generated');

function stableJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function ensureGeneratedDir(): void {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

export function writeCompetitionResultsGenerated(results: CompetitionResult[]): void {
  ensureGeneratedDir();
  const content = `import type { CompetitionResult } from '../../domain/athletics/types';\n\nexport const competitionResults: CompetitionResult[] = ${stableJson(results)};\n`;

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'competitionResults.generated.ts'),
    content,
    'utf-8'
  );
}

export function writeDataMetaGenerated(meta: DataMeta): void {
  ensureGeneratedDir();
  const content = `import type { DataMeta } from '../../domain/athletics/types';\nimport { getResultsFreshnessStatus } from '../../domain/athletics/resultUtils';\n\nexport const dataMeta: DataMeta = ${stableJson(meta)};\n\nexport function getFreshnessStatus(): 'fresh' | 'aging' | 'stale' {\n  return getResultsFreshnessStatus(dataMeta);\n}\n`;

  fs.writeFileSync(path.join(GENERATED_DIR, 'dataMeta.generated.ts'), content, 'utf-8');
}


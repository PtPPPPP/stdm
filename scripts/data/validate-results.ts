/**
 * 数据校验脚本
 * 用法: npx tsx scripts/data/validate-results.ts
 *
 * 校验 src/data/competitionResults.ts 中的所有比赛记录，
 * 输出问题清单。可用于 pre-commit hook 或 CI。
 */

import { competitionResults, dataMeta } from '../../src/data/index.js';
import {
  validateCompetitionResults,
  validateDataMeta,
} from '../../src/domain/athletics/validation.js';

function main() {
  const errors = [
    ...validateCompetitionResults(competitionResults),
    ...validateDataMeta(dataMeta),
  ];

  if (errors.length === 0) {
    console.log(`\n✓ 全部 ${competitionResults.length} 条记录校验通过\n`);
    process.exit(0);
  }

  console.log(`\n⚠ 发现 ${errors.length} 个问题：\n`);
  for (const err of errors) {
    console.log(`  [${err.id}] ${err.field}: ${err.message}`);
  }
  console.log('');
  process.exit(1);
}

main();

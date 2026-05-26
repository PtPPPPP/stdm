import { competitionResults, dataMeta } from '../../src/data/index.js';
import { writeDataMetaGenerated } from './write-generated-files.js';

function getLatestMeet(): { name: string; date: string } | null {
  const sorted = [...competitionResults].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  if (sorted.length === 0) return null;
  const latest = sorted[0];
  return { name: latest.competitionName, date: latest.date };
}

function main(): void {
  const latest = getLatestMeet();
  const today = new Date().toISOString().slice(0, 10);

  writeDataMetaGenerated({
    ...dataMeta,
    lastAutoSync: dataMeta.lastAutoSync ?? today,
    latestCompletedMeet: latest?.name ?? dataMeta.latestCompletedMeet,
    latestCompletedMeetDate: latest?.date ?? dataMeta.latestCompletedMeetDate,
  });

  console.log(`dataMeta.generated.ts 已更新。当前比赛记录：${competitionResults.length} 条`);
}

main();


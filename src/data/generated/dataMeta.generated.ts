import type { DataMeta } from '../../domain/athletics/types';
import { getResultsFreshnessStatus } from '../../domain/athletics/resultUtils';

export const dataMeta: DataMeta = {
  "lastManualUpdate": "2026-05-26",
  "lastAutoSync": "2026-05-26",
  "latestCompletedMeet": "Xiamen Diamond League 2026",
  "latestCompletedMeetDate": "2026-05-23",
  "nextMeet": "Rabat Diamond League 2026",
  "nextMeetDate": "2026-05-31",
  "dataPolicy": "本站为田径科普项目，比赛成绩以 Diamond League、World Athletics 官方结果页和赛事官方报道为准。",
  "recommendedSources": [
    {
      "name": "Diamond League Calendar 2026",
      "url": "https://www.diamondleague.com/calendar/"
    },
    {
      "name": "Shanghai/Keqiao 2026 Results",
      "url": "https://shanghai.diamondleague.com/programme-results/"
    },
    {
      "name": "Xiamen 2026 Results",
      "url": "https://xiamen.diamondleague.com/programme-results/"
    },
    {
      "name": "World Athletics Calendar & Results",
      "url": "https://worldathletics.org/competition/calendar-results"
    }
  ]
};

export function getFreshnessStatus(): 'fresh' | 'aging' | 'stale' {
  return getResultsFreshnessStatus(dataMeta);
}

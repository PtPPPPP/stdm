import type { CompetitionResult } from '../types/athletics';
import { competitionResults, getResultsByAthleteId as getById } from '../data/competitionResults';

/**
 * 按运动员 ID 获取比赛记录，按日期倒序。
 * 同时兜底用 englishName / athleteName 匹配。
 */
export function getResultsByAthleteId(
  athleteId: string,
  englishName?: string,
  chineseName?: string
): CompetitionResult[] {
  const byId = getById(athleteId);
  if (byId.length > 0) return byId;

  // 兜底：按英文名或中文名匹配
  return competitionResults
    .filter((r) => {
      if (englishName && r.athleteName.toLowerCase() === englishName.toLowerCase()) return true;
      if (chineseName && r.athleteName === chineseName) return true;
      return false;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** 获取某运动员最新一条比赛记录 */
export function getLatestResultByAthleteId(
  athleteId: string,
  englishName?: string,
  chineseName?: string
): CompetitionResult | undefined {
  const results = getResultsByAthleteId(athleteId, englishName, chineseName);
  return results[0];
}

/** 按英文名模糊匹配最新比赛记录 */
export function getLatestResultsByAthleteName(
  englishName: string,
  limit = 5
): CompetitionResult[] {
  return competitionResults
    .filter((r) => r.athleteName.toLowerCase().includes(englishName.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/** 获取运动员展示用的最新结果（用于首页和卡片） */
export function getAthleteDisplayLatestResult(
  athleteId: string,
  englishName?: string,
  chineseName?: string
): CompetitionResult | undefined {
  return getLatestResultByAthleteId(athleteId, englishName, chineseName);
}

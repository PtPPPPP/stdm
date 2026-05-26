import type { Athlete, CompetitionResult, DataMeta } from './types';

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

export function sortResultsByDateDesc(results: CompetitionResult[]): CompetitionResult[] {
  return [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getResultsByAthleteId(
  results: CompetitionResult[],
  athleteId: string
): CompetitionResult[] {
  return sortResultsByDateDesc(results.filter((result) => result.athleteId === athleteId));
}

export function getResultsByAthleteName(
  results: CompetitionResult[],
  name: string
): CompetitionResult[] {
  const target = normalizeName(name);
  return sortResultsByDateDesc(
    results.filter((result) => {
      const names = [result.athleteName, result.athleteEnglishName].map(normalizeName);
      return names.some((candidate) => candidate === target || candidate.includes(target));
    })
  );
}

export function getLatestResultByAthleteId(
  results: CompetitionResult[],
  athleteId: string
): CompetitionResult | undefined {
  return getResultsByAthleteId(results, athleteId)[0];
}

export function getLatestResultsByAthleteId(
  results: CompetitionResult[],
  athleteId: string,
  limit = 5
): CompetitionResult[] {
  return getResultsByAthleteId(results, athleteId).slice(0, limit);
}

export function getResultsByCompetition(
  results: CompetitionResult[],
  competitionSlug: string
): CompetitionResult[] {
  return sortResultsByDateDesc(
    results.filter((result) => result.competitionSlug === competitionSlug)
  );
}

export function getResultsByEvent(
  results: CompetitionResult[],
  event: string
): CompetitionResult[] {
  const target = normalizeName(event);
  return sortResultsByDateDesc(
    results.filter((result) => normalizeName(result.event) === target)
  );
}

export function getAthleteDisplayLatestResult(
  athlete: Pick<Athlete, 'id' | 'englishName' | 'name'>,
  results: CompetitionResult[]
): CompetitionResult | undefined {
  return getResultsForAthlete(results, athlete)[0];
}

export function getResultsForAthlete(
  results: CompetitionResult[],
  athlete: Pick<Athlete, 'id' | 'englishName' | 'name'>
): CompetitionResult[] {
  const byId = getLatestResultByAthleteId(results, athlete.id);
  if (byId) return getResultsByAthleteId(results, athlete.id);

  return sortResultsByDateDesc(
    results.filter((result) => {
      const names = [result.athleteName, result.athleteEnglishName].map(normalizeName);
      return names.includes(normalizeName(athlete.englishName)) || names.includes(normalizeName(athlete.name));
    })
  );
}

export function groupResultsByCompetition(
  results: CompetitionResult[]
): Map<string, CompetitionResult[]> {
  const groups = new Map<string, CompetitionResult[]>();

  for (const result of sortResultsByDateDesc(results)) {
    const group = groups.get(result.competitionSlug) ?? [];
    group.push(result);
    groups.set(result.competitionSlug, group);
  }

  return groups;
}

export function getVerifiedResults(results: CompetitionResult[]): CompetitionResult[] {
  return results.filter((result) => result.source.verified === 'verified');
}

export function getPendingResults(results: CompetitionResult[]): CompetitionResult[] {
  return results.filter((result) => result.source.verified === 'pending');
}

export type FreshnessStatus = 'fresh' | 'aging' | 'stale';

export function getResultsFreshnessStatus(dataMeta: DataMeta): FreshnessStatus {
  const lastUpdated = dataMeta.lastAutoSync ?? dataMeta.lastManualUpdate;
  const last = new Date(lastUpdated);
  if (Number.isNaN(last.getTime())) return 'stale';

  const days = Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 30) return 'fresh';
  if (days <= 60) return 'aging';
  return 'stale';
}

export function getTaggedResultsByAthleteId(
  results: CompetitionResult[],
  athlete: Pick<Athlete, 'id' | 'englishName' | 'name'>,
  tag: 'PB' | 'SB'
): CompetitionResult[] {
  return getResultsForAthlete(results, athlete).filter((result) => result.recordTags?.includes(tag));
}

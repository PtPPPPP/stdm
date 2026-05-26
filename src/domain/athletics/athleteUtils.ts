import type { Athlete } from './types';

export function getAthleteById(athletes: Athlete[], id: string): Athlete | undefined {
  return athletes.find((athlete) => athlete.id === id);
}

export function getSimilarAthletes(athletes: Athlete[], athlete: Athlete): Athlete[] {
  const byId = new Map(athletes.map((item) => [item.id, item]));
  return athlete.similarAthleteIds
    .map((id) => byId.get(id))
    .filter((item): item is Athlete => item !== undefined);
}

export function getAllCountries(athletes: Athlete[]): string[] {
  return Array.from(new Set(athletes.map((athlete) => athlete.country))).sort();
}

export function searchAthletes(athletes: Athlete[], query: string): Athlete[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return athletes;

  return athletes.filter((athlete) => {
    const haystack = [
      athlete.name,
      athlete.englishName,
      athlete.country,
      athlete.mainEvent,
      ...athlete.events,
      ...athlete.tags,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}


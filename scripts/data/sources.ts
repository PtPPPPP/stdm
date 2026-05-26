export interface DataSourceConfig {
  id: string;
  name: string;
  competitionSlug: string;
  date: string;
  url: string;
  type: 'diamond-league' | 'world-athletics';
  enabled: boolean;
}

export const dataSources: DataSourceConfig[] = [
  {
    id: 'diamond-league-calendar-2026',
    name: 'Diamond League Calendar 2026',
    competitionSlug: 'diamond-league-calendar-2026',
    date: '2026',
    url: 'https://www.diamondleague.com/calendar/',
    type: 'diamond-league',
    enabled: true,
  },
  {
    id: 'world-athletics-diamond-league-results-2026',
    name: 'World Athletics Diamond League Results 2026',
    competitionSlug: 'world-athletics-diamond-league-results-2026',
    date: '2026',
    url: 'https://worldathletics.org/competition/calendar-results?competitionGroupId=627&hideCompetitionsWithNoResults=true',
    type: 'world-athletics',
    enabled: true,
  },
];


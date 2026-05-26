export interface PersonalBest {
  event: string;
  result: string;
  date?: string;
  location?: string;
}

export interface SeasonBest {
  event: string;
  result: string;
  year: number;
}

export interface StyleProfile {
  speed: number;
  endurance: number;
  power: number;
  technique: number;
  consistency: number;
  mentality: number;
}

export interface Athlete {
  id: string;
  name: string;
  englishName: string;
  country: string;
  countryCode: string;
  gender: 'male' | 'female';
  birthYear?: number;
  events: string[];
  mainEvent: string;
  avatar?: string;
  tags: string[];
  personalBest: PersonalBest[];
  seasonBest?: SeasonBest[];
  diamondLeagueHighlights: string[];
  majorHonors: string[];
  styleProfile: StyleProfile;
  strengths: string[];
  weaknessOrRisks?: string[];
  story: string;
  watchingTips: string[];
  similarAthleteIds: string[];
  sources?: string[];
  notes?: string;
}

export type EventCategory =
  | 'sprint'
  | 'distance'
  | 'hurdle'
  | 'jump'
  | 'throw';

export interface TrackEvent {
  id: string;
  name: string;
  englishName: string;
  category: EventCategory;
  gender: 'male' | 'female' | 'both';
  description: string;
  keyTechniques: string[];
  watchingPoints: string[];
  commonTerms: { term: string; explanation: string }[];
  representativeAthleteIds: string[];
  diamondLeagueEvent: boolean;
}

export type StyleProfileKey = keyof StyleProfile;

export const STYLE_LABELS: Record<StyleProfileKey, string> = {
  speed: '速度',
  endurance: '耐力',
  power: '爆发力',
  technique: '技术',
  consistency: '稳定性',
  mentality: '心理素质',
};

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  sprint: '短跑',
  distance: '中长跑',
  hurdle: '跨栏',
  jump: '跳跃',
  throw: '投掷',
};

export const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
  sprint: 'bg-track-sprint/20 text-track-sprint border-track-sprint/30',
  distance: 'bg-track-distance/20 text-track-distance border-track-distance/30',
  hurdle: 'bg-track-hurdle/20 text-track-hurdle border-track-hurdle/30',
  jump: 'bg-track-jump/20 text-track-jump border-track-jump/30',
  throw: 'bg-track-throw/20 text-track-throw border-track-throw/30',
};

export const EVENT_CATEGORY_TAG_CLASS: Record<EventCategory, string> = {
  sprint: 'event-tag-sprint',
  distance: 'event-tag-distance',
  hurdle: 'event-tag-hurdle',
  jump: 'event-tag-jump',
  throw: 'event-tag-throw',
};

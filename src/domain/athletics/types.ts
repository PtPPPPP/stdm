/**
 * 钻石田径图鉴 — 统一领域类型
 * 所有 Athlete、CompetitionResult、DataMeta 类型均由此文件定义。
 */

export type Gender = 'male' | 'female';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export type ResultSourceType = 'diamond-league' | 'world-athletics' | 'manual' | 'news' | 'unknown';
export type MarkUnit = 's' | 'm' | 'points' | 'time' | 'unknown';

export interface ResultSource {
  sourceName: string;
  sourceUrl: string;
  sourceType: ResultSourceType;
  updatedAt: string;
  verified: VerificationStatus;
  notes?: string;
}

export type EventCategory =
  | 'sprints'
  | 'middle-distance'
  | 'long-distance'
  | 'hurdles'
  | 'jumps'
  | 'throws'
  | 'combined'
  | 'other';

export interface CompetitionResult {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteEnglishName: string;
  country?: string;
  competitionName: string;
  competitionSlug: string;
  competitionGroup?: string;
  venue?: string;
  city?: string;
  countryCode?: string;
  date: string;
  event: string;
  eventCategory: EventCategory;
  round?: string;
  place?: number;
  mark: string;
  markValue?: number;
  markUnit?: MarkUnit;
  wind?: string;
  reactionTime?: string;
  points?: number;
  recordTags?: string[];
  source: ResultSource;
}

export interface Athlete {
  id: string;
  name: string;
  englishName: string;
  country: string;
  countryCode?: string;
  gender: Gender;
  birthYear?: number;
  events: string[];
  mainEvent: string;
  avatar?: string;
  tags: string[];
  styleProfile: StyleProfile;
  strengths: string[];
  weaknessOrRisks?: string[];
  story: string;
  watchingTips: string[];
  similarAthleteIds: string[];
  sources?: string[];
  notes?: string;
}

export interface StyleProfile {
  speed: number;
  endurance: number;
  power: number;
  technique: number;
  consistency: number;
  mentality: number;
}

export type StyleProfileKey = keyof StyleProfile;

export interface DataMeta {
  lastManualUpdate: string;
  lastAutoSync?: string;
  latestCompletedMeet?: string;
  latestCompletedMeetDate?: string;
  nextMeet?: string;
  nextMeetDate?: string;
  dataPolicy: string;
  recommendedSources: { name: string; url: string }[];
}

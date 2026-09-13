import type { EventCategory, MarkUnit } from './types';

const EVENT_CATEGORIES: Record<string, EventCategory> = {
  '100m': 'sprints', '200m': 'sprints', '400m': 'sprints',
  '4×100m': 'sprints', '4×400m': 'sprints',
  '800m': 'middle-distance', '1500m': 'middle-distance', 'mile': 'middle-distance',
  '3000m': 'long-distance', '5000m': 'long-distance', '10000m': 'long-distance',
  '3000msc': 'long-distance', 'marathon': 'long-distance',
  '100mh': 'hurdles', '110mh': 'hurdles', '300mh': 'hurdles', '400mh': 'hurdles',
  'high-jump': 'jumps', 'long-jump': 'jumps', 'triple-jump': 'jumps', 'pole-vault': 'jumps',
  'shot-put': 'throws', 'discus': 'throws', 'javelin': 'throws', 'hammer': 'throws',
};

export function getResultEventCategory(event: string): EventCategory {
  return EVENT_CATEGORIES[event.toLowerCase()] ?? 'other';
}

/** Convert m:ss or h:mm:ss to seconds; reject partial and invalid marks. */
export function parseMarkValue(mark: string): number | undefined {
  const value = mark.trim();
  if (/^\d+(?::[0-5]\d){1,2}(?:\.\d+)?$/.test(value)) {
    return value.split(':').reduce((seconds, part) => seconds * 60 + Number(part), 0);
  }
  if (/^\d+(?:\.\d+)?(?:m|s)?$/.test(value)) {
    return Number(value.replace(/[ms]$/, ''));
  }
  return undefined;
}

export function getMarkUnit(mark: string, event: string): MarkUnit {
  if (parseMarkValue(mark) === undefined) return 'unknown';
  const category = getResultEventCategory(event);
  if (category === 'jumps' || category === 'throws') return 'm';
  if (mark.includes(':')) return 'time';
  if (category === 'sprints' || category === 'hurdles' || category === 'middle-distance' || category === 'long-distance') return 's';
  return 'unknown';
}

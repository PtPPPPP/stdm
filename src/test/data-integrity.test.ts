import { describe, expect, it } from 'vitest';
import { athletes, competitionResults } from '../data';
import type { CompetitionResult } from '../data';
import { parseMarkValue, getMarkUnit, getResultEventCategory } from '../domain/athletics/markUtils';
import { getRecordedBests, getResultsForAthlete, getResultsFreshnessStatus } from '../domain/athletics/resultUtils';
import { validateCompetitionResults, validateAthleteReferences } from '../domain/athletics/validation';

const athlete = athletes[0];
const sample = competitionResults.find((result) => result.athleteId === athlete.id)!;
function result(overrides: Partial<CompetitionResult>): CompetitionResult {
  return { ...sample, id: 'test', event: '100m', eventCategory: 'sprints', mark: '9.79s', markValue: 9.79, markUnit: 's', recordTags: ['PB'], ...overrides };
}

describe('result integrity', () => {
  it.each([
    ['7:25.77', 445.77], ['2:22:55', 8575], ['9.79s', 9.79], ['21.09m', 21.09],
    ['1:60.00', undefined], ['12.3junk', undefined], ['DNF', undefined], ['-1', undefined],
  ])('parses %s without dropping units of time', (mark, expected) => {
    const actual = parseMarkValue(mark);
    if (expected === undefined) expect(actual).toBeUndefined();
    else expect(actual).toBeCloseTo(expected);
  });
  it('classifies 300m hurdles and un-suffixed field marks', () => {
    expect(getResultEventCategory('300mH')).toBe('hurdles');
    expect(getMarkUnit('8.43', 'long-jump')).toBe('m');
  });
  it('validates the shipped data and athlete references', () => {
    expect(validateCompetitionResults(competitionResults)).toEqual([]);
    expect(validateAthleteReferences(athletes, competitionResults)).toEqual([]);
  });
  it('rejects duplicate result IDs', () => {
    expect(validateCompetitionResults([sample, sample]).some((error) => error.field === 'id')).toBe(true);
  });
  it('rejects a calendar date that JavaScript silently rolls into March', () => {
    expect(validateCompetitionResults([result({ date: '2026-02-30' })]).some((error) => error.field === 'date')).toBe(true);
  });
  it('rejects truncated time values', () => {
    expect(validateCompetitionResults([result({ mark: '7:25.77', markValue: 7 })]).some((error) => error.field === 'markValue')).toBe(true);
  });
  it('rejects homepage-only verification', () => {
    const row = result({ source: { ...sample.source, sourceUrl: 'https://worldathletics.org/' } });
    expect(validateCompetitionResults([row]).some((error) => error.field === 'source.sourceUrl')).toBe(true);
  });
  it('reports broken athlete references', () => {
    expect(validateAthleteReferences([athlete], [result({ athleteId: 'missing' })]).some((error) => error.field === 'athleteId')).toBe(true);
  });
  it('does not merge a different athlete with the same name', () => {
    expect(getResultsForAthlete([result({ athleteId: 'different-id' })], athlete)).toEqual([]);
  });
  it('uses the main event and removes superseded personal-best records', () => {
    const main = result({ id: 'main', event: athlete.mainEvent, mark: '19.31s', markValue: 19.31 });
    const older = result({ id: 'old', event: athlete.mainEvent, mark: '19.50s', markValue: 19.5 });
    expect(getRecordedBests([sample, older, main], athlete, 'PB').map((row) => row.id)).toEqual(['main', sample.id]);
  });
  it('uses higher marks for jumps and throws', () => {
    const vaulter = { ...athlete, mainEvent: 'pole-vault' };
    const rows = [6.25, 6.31].map((mark) => result({ id: String(mark), event: 'pole-vault', eventCategory: 'jumps', mark: `${mark}m`, markValue: mark, markUnit: 'm' }));
    expect(getRecordedBests(rows, vaulter, 'PB')[0].mark).toBe('6.31m');
  });
  it('does not present old or unverified SB records as the current season', () => {
    const old = result({ id: 'old', date: '2024-08-04', recordTags: ['SB'] });
    const pending = result({ id: 'pending', date: '2026-05-01', recordTags: ['SB'], source: { ...sample.source, verified: 'pending' } });
    expect(getRecordedBests([old, pending], athlete, 'SB', 2026)).toEqual([]);
  });
  it('does not make old coverage look fresh after an editorial correction', () => {
    expect(getResultsFreshnessStatus({ lastManualUpdate: new Date().toISOString(), latestCompletedMeetDate: '2020-01-01', dataPolicy: 'test', recommendedSources: [] })).toBe('stale');
  });
});

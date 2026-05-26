/**
 * Diamond Track Atlas unified data entry.
 *
 * Pages and components should import app data from this file instead of reading
 * manual or generated files directly.
 */

import {
  athletes as manualAthletes,
  getAllCountries,
  getAllEvents,
  getAthleteById,
  getAthletesByCountry,
  getAthletesByEvent,
  getAthletesByGender,
  getSimilarAthletes,
  searchAthletes,
} from './manual/athletes.manual';
import {
  getEventById,
  getEventsByCategory,
  trackEvents,
} from './manual/events.manual';
import {
  competitionResults as generatedResults,
  getLatestResultDate,
  getLatestResults,
} from './generated/competitionResults.generated';
import { dataMeta, getFreshnessStatus } from './generated/dataMeta.generated';

export const athletes = manualAthletes;
export const competitionResults = generatedResults;

export {
  dataMeta,
  getAllCountries,
  getAllEvents,
  getAthleteById,
  getAthletesByCountry,
  getAthletesByEvent,
  getAthletesByGender,
  getEventById,
  getEventsByCategory,
  getFreshnessStatus,
  getLatestResultDate,
  getLatestResults,
  getSimilarAthletes,
  searchAthletes,
  trackEvents,
};


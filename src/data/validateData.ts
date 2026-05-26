import { competitionResults, dataMeta } from './index';
import {
  validateCompetitionResults,
  validateDataMeta,
  warnValidationErrors,
} from '../domain/athletics/validation';

export function validateData(): string[] {
  const errors = [
    ...validateCompetitionResults(competitionResults),
    ...validateDataMeta(dataMeta),
  ];

  warnValidationErrors('数据校验', errors);
  return errors.map((error) => `[${error.id}] ${error.field}: ${error.message}`);
}


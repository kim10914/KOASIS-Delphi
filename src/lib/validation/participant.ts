import {
  genderOptions,
  infoErrors,
  infoRules,
  regionOptions,
} from "@/constants/info";
import type { InfoFieldName } from "@/constants/info";
import type { Participant } from "@/types/survey";

const namePattern = /^[\p{L}\p{M}'\-.· ]+$/u;
const birthDatePattern = /^\d{8}$/;

function isAllowedOption(
  options: ReadonlyArray<{ value: string }>,
  value: string,
) {
  return options.some((option) => option.value === value);
}

function validateName(value: string) {
  const name = value.trim();
  if (!name) {
    return infoErrors.nameRequired;
  }
  const isValidLength =
    name.length >= infoRules.nameMin && name.length <= infoRules.nameMax;
  if (!isValidLength || !namePattern.test(name)) {
    return infoErrors.nameInvalid;
  }
  return "";
}

function validateBirthDate(value: string, today: Date) {
  if (!value) {
    return infoErrors.birthDateRequired;
  }
  if (!birthDatePattern.test(value)) {
    return infoErrors.birthDateFormat;
  }
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  if (year < infoRules.minBirthYear || year > today.getFullYear()) {
    return infoErrors.birthDateRange;
  }
  const date = new Date(year, month - 1, day);
  date.setFullYear(year);
  const exists =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  if (!exists) {
    return infoErrors.birthDateInvalid;
  }
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  if (date > startOfToday) {
    return infoErrors.birthDateRange;
  }
  return "";
}

function validateJob(value: string) {
  const job = value.trim();
  if (!job) {
    return infoErrors.jobRequired;
  }
  if (job.length > infoRules.jobMax) {
    return infoErrors.jobTooLong;
  }
  return "";
}

/**
 * 필드 하나를 검증하고 오류 메시지를 반환한다. 유효하면 빈 문자열이다.
 */
export function validateParticipantField(
  field: InfoFieldName,
  value: string,
  today: Date = new Date(),
) {
  switch (field) {
    case "name":
      return validateName(value);
    case "birthDate":
      return validateBirthDate(value, today);
    case "gender":
      return isAllowedOption(genderOptions, value)
        ? ""
        : infoErrors.genderRequired;
    case "job":
      return validateJob(value);
    case "region":
      return isAllowedOption(regionOptions, value)
        ? ""
        : infoErrors.regionRequired;
  }
}

export function validateParticipant(values: Participant) {
  const fields = Object.keys(values) as InfoFieldName[];
  const errors: Partial<Record<InfoFieldName, string>> = {};
  for (const field of fields) {
    const message = validateParticipantField(field, values[field]);
    if (message) {
      errors[field] = message;
    }
  }
  return errors;
}

import {
  birthDateLength,
  birthDateMinYear,
  genderOptions,
  infoErrors,
  jobMaxLength,
  nameMaxLength,
  regionOptions,
} from "@/constants/info";
import type { Participant } from "@/types/survey";

export type ParticipantErrors = Partial<Record<keyof Participant, string>>;

export function validateBirthDate(
  value: string,
  today: Date = new Date(),
): string | undefined {
  if (value === "") {
    return infoErrors.birthDateRequired;
  }
  if (!new RegExp(`^\\d{${birthDateLength}}$`).test(value)) {
    return infoErrors.birthDateFormat;
  }
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return infoErrors.birthDateInvalid;
  }
  const date = new Date(year, month - 1, day);
  // Date 생성자는 0~99년을 1900년대로 해석하므로 연도를 직접 지정한다.
  date.setFullYear(year);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  if (!isRealDate) {
    return infoErrors.birthDateInvalid;
  }
  if (year < birthDateMinYear) {
    return infoErrors.birthDateTooOld;
  }
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  if (date > todayStart) {
    return infoErrors.birthDateFuture;
  }
  return undefined;
}

export function validateField(
  field: keyof Participant,
  value: string,
): string | undefined {
  const trimmed = value.trim();
  switch (field) {
    case "birthDate":
      return validateBirthDate(value);
    case "name":
      if (trimmed === "") {
        return infoErrors.name;
      }
      return trimmed.length > nameMaxLength
        ? infoErrors.nameTooLong
        : undefined;
    case "job":
      if (trimmed === "") {
        return infoErrors.job;
      }
      return trimmed.length > jobMaxLength ? infoErrors.jobTooLong : undefined;
    case "gender":
      return genderOptions.some((option) => option.value === value)
        ? undefined
        : infoErrors.gender;
    case "region":
      return regionOptions.some((option) => option.value === value)
        ? undefined
        : infoErrors.region;
  }
}

export function validateParticipant(values: Participant): ParticipantErrors {
  const errors: ParticipantErrors = {};
  (Object.keys(values) as Array<keyof Participant>).forEach((field) => {
    const message = validateField(field, values[field]);
    if (message) {
      errors[field] = message;
    }
  });
  return errors;
}

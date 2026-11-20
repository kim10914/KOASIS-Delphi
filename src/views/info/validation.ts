import {
  birthDateLength,
  birthDateMinYear,
  infoErrors,
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
  const date = new Date(year, month - 1, day);
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
  if (field === "birthDate") {
    return validateBirthDate(value);
  }
  return value.trim() === "" ? infoErrors[field] : undefined;
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

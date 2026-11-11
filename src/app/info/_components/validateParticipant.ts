import type { Participant } from "@/types/survey";

export type ParticipantErrors = Partial<Record<keyof Participant, string>>;

const NAME_PATTERN = /^[가-힣a-zA-Z ]{2,20}$/;
const BIRTH_DATE_PATTERN = /^\d{8}$/;

function isValidBirthDate(value: string): boolean {
  if (!BIRTH_DATE_PATTERN.test(value)) {
    return false;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(year, month - 1, day);

  // 2월 30일 같은 존재하지 않는 날짜를 걸러낸다.
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isRealDate && year >= 1900 && date <= new Date();
}

export function validateParticipant(values: Participant): ParticipantErrors {
  const errors: ParticipantErrors = {};

  if (!values.name.trim()) {
    errors.name = "이름을 입력해주세요.";
  } else if (!NAME_PATTERN.test(values.name.trim())) {
    errors.name = "이름은 한글 또는 영문 2~20자로 입력해주세요.";
  }

  if (!values.birthDate) {
    errors.birthDate = "생년월일을 입력해주세요.";
  } else if (!isValidBirthDate(values.birthDate)) {
    errors.birthDate = "생년월일 8자리를 올바르게 입력해주세요. (예: 19900101)";
  }

  if (!values.gender) {
    errors.gender = "성별을 선택해주세요.";
  }

  if (!values.job) {
    errors.job = "직업을 선택해주세요.";
  }

  if (!values.region) {
    errors.region = "지역을 선택해주세요.";
  }

  return errors;
}

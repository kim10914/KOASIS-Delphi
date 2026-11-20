import type { Participant } from "@/types/survey";

export type InfoFieldName = keyof Participant;

export const infoText = {
  title: "참여자의 간단한 정보를 입력해주세요.",
  // 처리 방식 확정 전까지 익명 저장, 비식별 완료를 보장하지 않는 임시 문구
  privacyNotice:
    "입력해주신 정보는 연구 조사 진행과 통계 활용 목적으로만 사용됩니다.",
  restoredNotice: "이전에 입력한 정보입니다. 다른 참여자라면 지워주세요.",
  clearSaved: "입력 지우기",
  submit: "제출하기",
  formLabel: "참여자 정보 입력",
} as const;

export const infoFields = {
  name: {
    label: "이름",
    placeholder: "이름을 입력해주세요.",
  },
  birthDate: {
    label: "생년월일",
    placeholder: "8자리를 입력하세요.",
    helperText: "예: 20100315",
    maxLength: 8,
  },
  gender: {
    label: "성별",
    placeholder: "성별을 선택해주세요.",
  },
  job: {
    label: "직업",
    placeholder: "직업을 입력해주세요.",
  },
  region: {
    label: "지역",
    placeholder: "지역을 선택해주세요.",
  },
} as const;

export const infoRules = {
  nameMax: 20,
  jobMax: 50,
  minBirthYear: 1900,
} as const;

export const genderOptions = [
  { value: "남성", label: "남성" },
  { value: "여성", label: "여성" },
  { value: "응답하지 않음", label: "응답하지 않음" },
] as const;

export const regionOptions = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
].map((region) => ({ value: region, label: region }));

export const infoErrors = {
  nameRequired: "이름을 입력해주세요.",
  nameTooLong: `이름은 ${infoRules.nameMax}자 이하로 입력해주세요.`,
  birthDateRequired: "생년월일을 입력해주세요.",
  birthDateFormat: "생년월일은 숫자 8자리(예: 20100315)로 입력해주세요.",
  birthDateInvalid: "존재하는 날짜를 입력해주세요.",
  birthDateRange: "1900년 이후 오늘까지의 날짜를 입력해주세요.",
  genderRequired: "성별을 선택해주세요.",
  jobRequired: "직업을 입력해주세요.",
  jobTooLong: `직업은 ${infoRules.jobMax}자 이하로 입력해주세요.`,
  regionRequired: "지역을 선택해주세요.",
} as const;

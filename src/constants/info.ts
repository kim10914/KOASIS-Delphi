export const participantStorageKey = "mindMirror.participant";

export const infoStep = 1;

export const birthDateLength = 8;

export const birthDateMinYear = 1900;

export const nameMaxLength = 20;

export const jobMaxLength = 50;

export const infoText = {
  titleLines: ["참여자의 간단한 정보를", "입력해주세요."],
  privacyNotice:
    "입력하신 정보는 조사 참여를 위해 수집됩니다. 정보의 상세한 처리 및 보관 방침은 확정되는 안내문에 따릅니다.",
  submitLabel: "제출하기",
} as const;

export const infoFields = {
  name: {
    label: "이름",
    placeholder: "이름을 입력해주세요",
  },
  birthDate: {
    label: "생년월일",
    placeholder: "8자리 숫자를 입력하세요",
    helperText: "예: 20100315",
  },
  gender: {
    label: "성별",
    placeholder: "성별을 선택해주세요",
  },
  job: {
    label: "직업",
    placeholder: "직업을 입력해주세요",
  },
  region: {
    label: "지역",
    placeholder: "지역을 선택해주세요",
  },
} as const;

export const infoErrors = {
  name: "이름을 입력해주세요.",
  nameTooLong: `이름은 ${nameMaxLength}자 이하로 입력해주세요.`,
  birthDateRequired: "생년월일을 입력해주세요.",
  birthDateFormat: "생년월일은 8자리 숫자로 입력해주세요.",
  birthDateInvalid: "존재하는 날짜를 입력해주세요.",
  birthDateFuture: "미래의 날짜는 입력할 수 없습니다.",
  birthDateTooOld: "1900년 이후의 날짜를 입력해주세요.",
  gender: "성별을 선택해주세요.",
  job: "직업을 입력해주세요.",
  jobTooLong: `직업은 ${jobMaxLength}자 이하로 입력해주세요.`,
  region: "지역을 선택해주세요.",
} as const;

export const genderOptions = [
  { value: "남성", label: "남성" },
  { value: "여성", label: "여성" },
  { value: "응답하지 않음", label: "응답하지 않음" },
] as const;

export const regionNames = [
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
] as const;

export const regionOptions = regionNames.map((region) => ({
  value: region,
  label: region,
}));

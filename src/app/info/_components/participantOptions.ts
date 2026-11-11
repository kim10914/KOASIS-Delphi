export const genderOptions = [
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "other", label: "기타 / 응답하지 않음" },
];

export const jobOptions = [
  { value: "student", label: "학생" },
  { value: "office", label: "직장인" },
  { value: "business", label: "자영업" },
  { value: "freelancer", label: "프리랜서" },
  { value: "homemaker", label: "주부" },
  { value: "none", label: "무직" },
  { value: "other", label: "기타" },
];

export const regionOptions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
].map((name) => ({ value: name, label: name }));

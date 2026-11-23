import type { MoodPhase, MoodQuadrant } from "@/types/survey";

// 감정 격자 한 변의 칸 수(6x6)
export const moodGridSize = 6;

// 행 1~3은 에너지 높음, 4~6은 에너지 낮음. 열 1~3은 기분 좋지 않음, 4~6은 기분 좋음.
// "\n"은 화면에서 줄바꿈하는 위치이고, 감정 이름은 "\n"을 공백으로 바꾼 값이다.
const moodEmotionRows: readonly (readonly string[])[] = [
  ["격분한", "스트레스\n받는", "충격받은", "놀란", "흥겨운", "황홀한"],
  [
    "화가\n치밀어 오른",
    "화난",
    "안절부절\n못하는",
    "기운이\n넘치는",
    "낙관적인",
    "흥분한",
  ],
  [
    "불쾌한",
    "근심하는",
    "마음이\n불편한",
    "유쾌한",
    "희망찬",
    "더없이\n행복한",
  ],
  ["역겨운", "의욕 없는", "냉담한", "속 편한", "자족하는", "충만한"],
  ["비참한", "쓸쓸한", "피곤한", "여유로운", "편안한", "안정적인"],
  ["절망한", "고독한", "진이 빠진", "나른한", "고요한", "안온한"],
];

// 같은 반(상단 3행, 하단 3행)의 같은 열은 같은 색을 쓴다. 밝은 배경에는 어두운 글자를 쓴다.
const moodColumnColors = {
  high: ["#ab0000", "#f83e00", "#ff4651", "#ff8a37", "#ffbb3c", "#fddd3b"],
  low: ["#5a8eaa", "#7eb1cf", "#c8dee6", "#c1cf95", "#a0ac79", "#667a37"],
} as const;

const moodDarkTextColumns = {
  high: [1, 2, 3, 4, 5],
  low: [0, 1, 2, 3, 4],
} as const;

export type MoodCell = {
  row: number;
  col: number;
  emotion: string;
  label: string;
  quadrant: MoodQuadrant;
  backgroundColor: string;
  darkText: boolean;
};

function getQuadrant(row: number, col: number): MoodQuadrant {
  const high = row <= moodGridSize / 2;
  const positive = col > moodGridSize / 2;
  if (high) {
    return positive ? "highEnergyPositive" : "highEnergyNegative";
  }
  return positive ? "lowEnergyPositive" : "lowEnergyNegative";
}

export const moodCells: readonly MoodCell[] = moodEmotionRows.flatMap(
  (emotions, rowIndex) =>
    emotions.map((label, colIndex) => {
      const row = rowIndex + 1;
      const col = colIndex + 1;
      const half = row <= moodGridSize / 2 ? "high" : "low";
      return {
        row,
        col,
        emotion: label.replaceAll("\n", " "),
        label,
        quadrant: getQuadrant(row, col),
        backgroundColor: moodColumnColors[half][colIndex],
        darkText: (moodDarkTextColumns[half] as readonly number[]).includes(
          colIndex,
        ),
      };
    }),
);

export function findMoodCell(row: number, col: number) {
  return moodCells.find((cell) => cell.row === row && cell.col === col);
}

export const moodGridText = {
  groupLabel: "감정 격자",
} as const;

export const moodStep = 3;

type MoodScreenText = {
  title: string;
  description: string;
  submitLabel: string;
  selectedSummary: ((emotion: string) => string) | null;
  showStepIndicator: boolean;
};

export const moodScreenText: Record<MoodPhase, MoodScreenText> = {
  pre: {
    title: "내 기분 체크하기",
    description:
      "본격적인 조사에 앞서 내 마음의 컨디션이 어떤지 체크해주세요.\n오늘 내 기분은 다른 날에 비해 어떤 상태인가요?",
    submitLabel: "제출하기",
    selectedSummary: null,
    showStepIndicator: true,
  },
  post: {
    title: "테스트를 마친 지금, 기분이 어떤가요?",
    description: "조사 전과 비교해 기분이 어떻게 달라졌는지 선택해 주세요.",
    submitLabel: "감정 기록하기",
    selectedSummary: (emotion) =>
      `내가 선택한 오늘의 기분은 ‘${emotion}’ 이에요.`,
    showStepIndicator: false,
  },
};

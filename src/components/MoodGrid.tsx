import { moodCells, moodGridText } from "@/constants/mood";
import type { MoodCell } from "@/constants/mood";

type MoodGridProps = {
  selected: { row: number; col: number } | null;
  onSelect: (cell: MoodCell) => void;
};

/**
 * 사전·사후 무드미터가 함께 쓰는 6x6 감정 격자.
 * 한 칸만 선택할 수 있는 라디오 그룹으로 동작하고, 터치 영역은 44px 이상이다.
 */
export default function MoodGrid({ selected, onSelect }: MoodGridProps) {
  return (
    <div
      role="radiogroup"
      aria-label={moodGridText.groupLabel}
      className="grid grid-cols-6 gap-1.5"
    >
      {moodCells.map((cell) => {
        const isSelected =
          selected !== null &&
          selected.row === cell.row &&
          selected.col === cell.col;
        return (
          <button
            key={`${cell.row}-${cell.col}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={cell.emotion}
            onClick={() => onSelect(cell)}
            style={{ backgroundColor: cell.backgroundColor }}
            className={`flex aspect-square min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-[10px] px-0.5 text-center text-[clamp(10px,3vw,12px)] leading-tight font-medium break-keep whitespace-pre-line [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-strong ${
              cell.darkText ? "text-text-strong" : "text-white"
            } ${
              isSelected
                ? "z-10 scale-105 ring-[3px] ring-text-strong ring-offset-2"
                : ""
            }`}
          >
            <span aria-hidden="true">{cell.label}</span>
          </button>
        );
      })}
    </div>
  );
}

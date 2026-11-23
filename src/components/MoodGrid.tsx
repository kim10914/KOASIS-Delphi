import { useId } from "react";
import { moodCells, moodGridText } from "@/constants/mood";
import type { MoodCell } from "@/constants/mood";

type MoodGridProps = {
  selected: { row: number; col: number } | null;
  onSelect: (cell: MoodCell) => void;
  disabled?: boolean;
};

/**
 * 사전·사후 무드미터가 함께 쓰는 6x6 감정 격자.
 * 네이티브 라디오 그룹으로 키보드 방향키 이동을 지원하고, 360px 이상에서 터치 영역은 44px 이상이다.
 */
export default function MoodGrid({
  selected,
  onSelect,
  disabled = false,
}: MoodGridProps) {
  const groupName = useId();

  return (
    <div
      role="radiogroup"
      aria-label={moodGridText.groupLabel}
      className="grid grid-cols-6 gap-1 min-[360px]:gap-1.5"
    >
      {moodCells.map((cell) => {
        const isSelected =
          selected !== null &&
          selected.row === cell.row &&
          selected.col === cell.col;
        const inputId = `${groupName}-${cell.row}-${cell.col}`;
        return (
          <div key={inputId} className="min-w-0">
            <input
              id={inputId}
              type="radio"
              name={groupName}
              value={`${cell.row}-${cell.col}`}
              checked={isSelected}
              disabled={disabled}
              aria-label={`${cell.emotion} (${cell.row}행 ${cell.col}열)`}
              onChange={() => onSelect(cell)}
              className="peer sr-only"
            />
            <label
              htmlFor={inputId}
              style={{ backgroundColor: cell.backgroundColor }}
              className={`flex aspect-square min-h-11 min-w-0 cursor-pointer items-center justify-center rounded-[10px] px-0.5 text-center text-[clamp(10px,3vw,12px)] leading-tight font-medium break-keep whitespace-pre-line [overflow-wrap:anywhere] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-text-strong peer-disabled:cursor-not-allowed peer-disabled:opacity-60 min-[360px]:min-w-11 ${
                cell.darkText ? "text-text-strong" : "text-white"
              } ${
                isSelected
                  ? "relative z-10 scale-105 ring-[3px] ring-text-strong ring-offset-2"
                  : ""
              }`}
            >
              <span aria-hidden="true">{cell.label}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
}

import type { Participant } from "@/types/survey";

const participantKey = "mindMirror.participant";

const participantFields: (keyof Participant)[] = [
  "name",
  "birthDate",
  "gender",
  "job",
  "region",
];

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return participantFields.every((field) => typeof record[field] === "string");
}

export function saveParticipant(participant: Participant) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(participantKey, JSON.stringify(participant));
  } catch {
    // 저장소를 쓸 수 없는 환경에서는 저장을 건너뛴다.
  }
}

export function loadParticipant(): Participant | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(participantKey);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isParticipant(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

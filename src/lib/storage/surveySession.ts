import { genderOptions, regionOptions } from "@/constants/info";
import type { Participant } from "@/types/survey";

const participantKey = "mindMirror.participant";

const participantFields: (keyof Participant)[] = [
  "name",
  "birthDate",
  "gender",
  "job",
  "region",
];

type Listener = () => void;

const listeners = new Set<Listener>();
let cachedRaw: string | null | undefined;
let cachedParticipant: Participant | null = null;

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return participantFields.every((field) => typeof record[field] === "string");
}

function sanitizeParticipant(participant: Participant): Participant {
  const hasGender = genderOptions.some(
    (option) => option.value === participant.gender,
  );
  const hasRegion = regionOptions.some(
    (option) => option.value === participant.region,
  );
  return {
    ...participant,
    gender: hasGender ? participant.gender : "",
    region: hasRegion ? participant.region : "",
  };
}

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeParticipant(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getParticipantServerSnapshot(): Participant | null {
  return null;
}

export function saveParticipant(participant: Participant) {
  if (typeof window === "undefined") {
    return;
  }
  const sanitized = sanitizeParticipant(participant);
  const serialized = JSON.stringify(sanitized);
  cachedRaw = serialized;
  cachedParticipant = sanitized;
  try {
    window.sessionStorage.setItem(participantKey, serialized);
  } catch {
    // 저장소를 쓸 수 없는 환경에서는 저장을 건너뛴다.
  }
  notifyListeners();
}

export function clearParticipant() {
  if (typeof window === "undefined") {
    return;
  }
  cachedRaw = null;
  cachedParticipant = null;
  try {
    window.sessionStorage.removeItem(participantKey);
  } catch {
    // 저장소를 쓸 수 없는 환경에서는 삭제를 건너뛴다.
  }
  notifyListeners();
}

export function loadParticipant(): Participant | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(participantKey);
    if (raw === cachedRaw) {
      return cachedParticipant;
    }
    cachedRaw = raw;
    if (!raw) {
      cachedParticipant = null;
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    cachedParticipant = isParticipant(parsed)
      ? sanitizeParticipant(parsed)
      : null;
    return cachedParticipant;
  } catch {
    cachedRaw = null;
    cachedParticipant = null;
    return null;
  }
}

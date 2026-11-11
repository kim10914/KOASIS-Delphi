import type { Participant } from "@/types/survey";

const PARTICIPANT_KEY = "mindMirror:participant";
const CONSENT_KEY = "mindMirror:consent";

export type Consent = {
  // 이용약관 동의 여부
  terms: boolean;
  // 표정 녹화 동의 여부 ("오늘은 조사만 하기"를 고르면 false)
  faceRecording: boolean;
};

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(key);

    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function saveParticipant(participant: Participant) {
  writeJson(PARTICIPANT_KEY, participant);
}

export function loadParticipant(): Participant | null {
  return readJson<Participant>(PARTICIPANT_KEY);
}

export function saveConsent(consent: Consent) {
  writeJson(CONSENT_KEY, consent);
}

export function loadConsent(): Consent | null {
  return readJson<Consent>(CONSENT_KEY);
}

import { consentTextVersion } from "@/constants/consent";
import { genderOptions, regionOptions } from "@/constants/info";
import type { FaceConsent, Participant } from "@/types/survey";

const participantKey = "mindMirror.participant";

const faceConsentKey = "mindMirror.faceConsent";

const participantFields: (keyof Participant)[] = [
  "name",
  "birthDate",
  "gender",
  "job",
  "region",
];

type Listener = () => void;

type StorageReadResult = {
  raw: string | null;
  value: unknown;
};

function readStorageJson(key: string): StorageReadResult {
  if (typeof window === "undefined") {
    return { raw: null, value: null };
  }
  try {
    const raw = window.sessionStorage.getItem(key);
    if (raw === null) {
      return { raw: null, value: null };
    }
    return { raw, value: JSON.parse(raw) as unknown };
  } catch {
    // 저장소를 읽을 수 없거나 JSON이 깨진 경우 값 없음으로 취급한다.
    return { raw: null, value: null };
  }
}

function writeStorageJson(key: string, serialized: string) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(key, serialized);
  } catch {
    // 저장소를 쓸 수 없는 환경에서는 저장을 건너뛴다.
  }
}

function removeStorageKey(key: string) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // 저장소를 쓸 수 없는 환경에서는 삭제를 건너뛴다.
  }
}

// useSyncExternalStore가 같은 값에 같은 참조를 받도록 캐시와 리스너를 가진 저장소를 만든다.
function createSessionStore<T>(
  key: string,
  parse: (value: unknown) => T | null,
) {
  const listeners = new Set<Listener>();
  let cachedRaw: string | null | undefined;
  let cachedValue: T | null = null;

  function notify() {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    load(): T | null {
      if (typeof window === "undefined") {
        return null;
      }
      const { raw, value } = readStorageJson(key);
      if (raw === cachedRaw) {
        return cachedValue;
      }
      cachedRaw = raw;
      cachedValue = raw === null ? null : parse(value);
      return cachedValue;
    },
    save(value: T) {
      if (typeof window === "undefined") {
        return;
      }
      const serialized = JSON.stringify(value);
      cachedRaw = serialized;
      cachedValue = value;
      writeStorageJson(key, serialized);
      notify();
    },
    clear() {
      if (typeof window === "undefined") {
        return;
      }
      cachedRaw = null;
      cachedValue = null;
      removeStorageKey(key);
      notify();
    },
  };
}

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return participantFields.every((field) => typeof record[field] === "string");
}

function isFaceConsent(value: unknown): value is FaceConsent {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.agreed === "boolean" &&
    typeof record.at === "string" &&
    typeof record.textVersion === "string"
  );
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

const participantStore = createSessionStore<Participant>(
  participantKey,
  (value) => (isParticipant(value) ? sanitizeParticipant(value) : null),
);

const faceConsentStore = createSessionStore<FaceConsent>(
  faceConsentKey,
  (value) => (isFaceConsent(value) ? value : null),
);

export const subscribeParticipant = participantStore.subscribe;

export function getParticipantServerSnapshot(): Participant | null {
  return null;
}

export function saveParticipant(participant: Participant) {
  participantStore.save(sanitizeParticipant(participant));
}

export function clearParticipant() {
  participantStore.clear();
}

export function loadParticipant(): Participant | null {
  return participantStore.load();
}

export const subscribeFaceConsent = faceConsentStore.subscribe;

export function getFaceConsentServerSnapshot(): FaceConsent | null {
  return null;
}

export function saveFaceConsent(
  agreed: boolean,
  textVersion: string = consentTextVersion,
): void {
  faceConsentStore.save({
    agreed,
    at: new Date().toISOString(),
    textVersion,
  });
}

export function loadFaceConsent(): FaceConsent | null {
  return faceConsentStore.load();
}

export function clearFaceConsent(): void {
  faceConsentStore.clear();
}

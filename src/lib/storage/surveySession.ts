import { moodGridSize } from "@/constants/flow";
import { genderOptions, regionOptions } from "@/constants/info";
import type {
  ImageResponse,
  MoodCheck,
  MoodPhase,
  Participant,
  PrivacyConsent,
  SurveyResultSummary,
  SurveySession,
} from "@/types/survey";

// 같은 탭 이어가기에 필요한 최소 상태만 sessionStorage에 둔다. localStorage는 쓰지 않는다.
const sessionKey = "mindMirror.session";

const resultKey = "mindMirror.result";

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
  try {
    window.sessionStorage.setItem(key, serialized);
  } catch {
    // 저장소를 쓸 수 없는 환경에서는 저장을 건너뛴다.
  }
}

function removeStorageKey(key: string) {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isParticipant(value: unknown): value is Participant {
  if (!isRecord(value)) {
    return false;
  }
  return participantFields.every((field) => typeof value[field] === "string");
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isGridIndex(value: unknown) {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= moodGridSize
  );
}

function isScale(value: unknown) {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 7
  );
}

function isMoodCheck(value: unknown): value is MoodCheck {
  return (
    isRecord(value) &&
    typeof value.emotion === "string" &&
    typeof value.quadrant === "string" &&
    isGridIndex(value.row) &&
    isGridIndex(value.col) &&
    typeof value.checkedAt === "string"
  );
}

// 정상 응답은 두 척도가 모두 1~7이고, 건너뛴 응답(skipped)은 두 척도가 모두 null이다.
function isScaleOrSkipped(value: Record<string, unknown>) {
  if (value.skipped === true) {
    return value.valence === null && value.arousal === null;
  }
  if (value.skipped !== undefined && value.skipped !== false) {
    return false;
  }
  return isScale(value.valence) && isScale(value.arousal);
}

function isImageResponse(value: unknown): value is ImageResponse {
  return (
    isRecord(value) &&
    typeof value.imageId === "string" &&
    typeof value.orderIndex === "number" &&
    Number.isInteger(value.orderIndex) &&
    value.orderIndex >= 0 &&
    isScaleOrSkipped(value) &&
    isNonNegativeNumber(value.responseMs) &&
    typeof value.respondedAt === "string"
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

function isPrivacyConsent(value: unknown): value is PrivacyConsent {
  return (
    isRecord(value) &&
    value.agreed === true &&
    typeof value.at === "string" &&
    typeof value.textVersion === "string"
  );
}

// 구조가 어긋난 저장값(수동 편집, 버전 변경)은 통째로 버려 잘못된 상태로 이어가지 않는다.
function parseSession(value: unknown): SurveySession | null {
  if (
    !isRecord(value) ||
    typeof value.sessionId !== "string" ||
    typeof value.startedAt !== "string" ||
    !isParticipant(value.participant) ||
    !isNonNegativeNumber(value.currentImageElapsedMs) ||
    !Array.isArray(value.responses) ||
    !value.responses.every(isImageResponse)
  ) {
    return null;
  }
  const imageOrder =
    Array.isArray(value.imageOrder) &&
    value.imageOrder.every((id) => typeof id === "string")
      ? (value.imageOrder as string[])
      : null;
  const responses = value.responses as ImageResponse[];
  // 응답은 이미지 순서의 앞에서부터 차례로 쌓인 것이어야 한다.
  const responsesMatchOrder = responses.every(
    (response, index) =>
      imageOrder !== null &&
      response.orderIndex === index &&
      imageOrder[index] === response.imageId,
  );
  if (!responsesMatchOrder) {
    return null;
  }
  return {
    sessionId: uuidPattern.test(value.sessionId)
      ? value.sessionId
      : createSessionId(),
    startedAt: value.startedAt,
    participant: sanitizeParticipant(value.participant),
    privacyConsent: isPrivacyConsent(value.privacyConsent)
      ? value.privacyConsent
      : null,
    preMood: isMoodCheck(value.preMood) ? value.preMood : null,
    imageOrder,
    responses,
    currentImageElapsedMs: value.currentImageElapsedMs,
    postMood: isMoodCheck(value.postMood) ? value.postMood : null,
  };
}

function parseResult(value: unknown): SurveyResultSummary | null {
  if (
    !isRecord(value) ||
    typeof value.sessionId !== "string" ||
    typeof value.participantName !== "string" ||
    !isMoodCheck(value.postMood)
  ) {
    return null;
  }
  return {
    sessionId: value.sessionId,
    participantName: value.participantName,
    postMood: value.postMood,
  };
}

const sessionStore = createSessionStore<SurveySession>(
  sessionKey,
  parseSession,
);

const resultStore = createSessionStore<SurveyResultSummary>(
  resultKey,
  parseResult,
);

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createSessionId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// 진행 중인 세션이 있을 때만 변경을 적용한다. 세션이 없으면 아무것도 하지 않는다.
function updateSession(update: (session: SurveySession) => SurveySession) {
  const session = sessionStore.load();
  if (!session) {
    return;
  }
  sessionStore.save(update(session));
}

// ---- 세션 전체 ----

export const subscribeSession = sessionStore.subscribe;

export function getSessionServerSnapshot(): SurveySession | null {
  return null;
}

export function loadSession(): SurveySession | null {
  return sessionStore.load();
}

export function clearSession() {
  sessionStore.clear();
}

// ---- 결과 요약 ----

export const subscribeResult = resultStore.subscribe;

export function getResultServerSnapshot(): SurveyResultSummary | null {
  return null;
}

export function loadResult(): SurveyResultSummary | null {
  return resultStore.load();
}

export function saveResult(summary: SurveyResultSummary) {
  resultStore.save(summary);
}

export function clearResult() {
  resultStore.clear();
}

// ---- 참여자 정보 (세션 시작점) ----

export const subscribeParticipant = sessionStore.subscribe;

export function getParticipantServerSnapshot(): Participant | null {
  return null;
}

// 세션이 없으면 새 세션을 시작하고, 있으면 같은 세션의 참여자 정보와 동의 내역을 갱신한다.
export function saveParticipant(
  participant: Participant,
  privacyConsent: PrivacyConsent,
) {
  const sanitized = sanitizeParticipant(participant);
  const session = sessionStore.load();
  if (session) {
    sessionStore.save({ ...session, participant: sanitized, privacyConsent });
    return;
  }
  resultStore.clear();
  sessionStore.save({
    sessionId: createSessionId(),
    startedAt: new Date().toISOString(),
    participant: sanitized,
    privacyConsent,
    preMood: null,
    imageOrder: null,
    responses: [],
    currentImageElapsedMs: 0,
    postMood: null,
  });
}

// 다른 참여자가 처음부터 시작할 수 있도록 세션 전체를 지운다.
export function clearParticipant() {
  sessionStore.clear();
}

let cachedParticipant: Participant | null = null;

// 응답 저장 등으로 세션이 바뀌어도 참여자 정보가 같으면 같은 참조를 돌려준다.
export function loadParticipant(): Participant | null {
  const next = sessionStore.load()?.participant ?? null;
  if (JSON.stringify(next) !== JSON.stringify(cachedParticipant)) {
    cachedParticipant = next;
  }
  return cachedParticipant;
}

// ---- 무드미터 ----

export function saveMood(phase: MoodPhase, mood: MoodCheck) {
  updateSession((session) =>
    phase === "pre"
      ? { ...session, preMood: mood }
      : { ...session, postMood: mood },
  );
}

// ---- 본조사 ----

// 이미지 순서는 한 번만 확정한다. 이미 있으면(새로고침, 뒤로가기) 그대로 둔다.
export function startTest(imageOrder: string[]) {
  updateSession((session) =>
    session.imageOrder
      ? session
      : {
          ...session,
          imageOrder,
          responses: [],
          currentImageElapsedMs: 0,
        },
  );
}

export type ImageResponseInput = Pick<
  ImageResponse,
  "valence" | "arousal" | "responseMs" | "skipped"
>;

// 현재 위치의 이미지에 대한 응답을 추가하고 다음 이미지로 넘어간다.
export function submitImageResponse(input: ImageResponseInput) {
  updateSession((session) => {
    const order = session.imageOrder;
    const index = session.responses.length;
    if (!order || index >= order.length) {
      return session;
    }
    return {
      ...session,
      responses: [
        ...session.responses,
        {
          imageId: order[index],
          orderIndex: index,
          valence: input.valence,
          arousal: input.arousal,
          ...(input.skipped ? { skipped: true } : {}),
          responseMs: Math.max(0, Math.round(input.responseMs)),
          respondedAt: new Date().toISOString(),
        },
      ],
      currentImageElapsedMs: 0,
    };
  });
}

// 새로고침·탭 숨김으로 끊기기 전까지 표시된 시간을 현재 이미지의 누적 시간에 더한다.
export function addCurrentImageElapsedMs(deltaMs: number) {
  if (deltaMs <= 0) {
    return;
  }
  updateSession((session) => ({
    ...session,
    currentImageElapsedMs: session.currentImageElapsedMs + Math.round(deltaMs),
  }));
}

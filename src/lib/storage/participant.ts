import {
  genderOptions,
  participantStorageKey,
  regionOptions,
} from "@/constants/info";
import type { Participant } from "@/types/survey";

export function saveParticipant(participant: Participant): void {
  try {
    window.sessionStorage.setItem(
      participantStorageKey,
      JSON.stringify(participant),
    );
  } catch {
    // 저장소를 쓸 수 없어도 흐름은 막지 않는다.
  }
}

export function loadParticipant(): Participant | null {
  try {
    const raw = window.sessionStorage.getItem(participantStorageKey);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    const data = parsed as Record<string, unknown>;
    const name = typeof data.name === "string" ? data.name : "";
    const birthDate = typeof data.birthDate === "string" ? data.birthDate : "";
    const job = typeof data.job === "string" ? data.job : "";
    const gender =
      typeof data.gender === "string" &&
      genderOptions.some((option) => option.value === data.gender)
        ? data.gender
        : "";
    const region =
      typeof data.region === "string" &&
      regionOptions.some((option) => option.value === data.region)
        ? data.region
        : "";
    return { name, birthDate, gender, job, region };
  } catch {
    return null;
  }
}

export function clearParticipant(): void {
  try {
    window.sessionStorage.removeItem(participantStorageKey);
  } catch {
    // 저장소를 쓸 수 없으면 지울 값도 없다.
  }
}

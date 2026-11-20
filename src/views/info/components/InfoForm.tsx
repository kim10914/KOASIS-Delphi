"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import {
  birthDateLength,
  genderOptions,
  infoFields,
  infoText,
  participantStorageKey,
  regionOptions,
} from "@/constants/info";
import { routes } from "@/constants/routes";
import type { Participant } from "@/types/survey";
import {
  validateField,
  validateParticipant,
  type ParticipantErrors,
} from "../validation";

const emptyParticipant: Participant = {
  name: "",
  birthDate: "",
  gender: "",
  job: "",
  region: "",
};

function readStoredParticipant(): Participant | null {
  try {
    const raw = window.sessionStorage.getItem(participantStorageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<Participant>;
    return {
      name: String(parsed.name ?? ""),
      birthDate: String(parsed.birthDate ?? ""),
      gender: String(parsed.gender ?? ""),
      job: String(parsed.job ?? ""),
      region: String(parsed.region ?? ""),
    };
  } catch {
    return null;
  }
}

export default function InfoForm() {
  const router = useRouter();
  const [values, setValues] = useState<Participant>(emptyParticipant);
  const [errors, setErrors] = useState<ParticipantErrors>({});

  useEffect(() => {
    // 하이드레이션 이후 같은 탭의 저장값으로 폼을 복원한다.
    const stored = readStoredParticipant();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(stored);
    }
  }, []);

  function updateField(field: keyof Participant, rawValue: string) {
    const value =
      field === "birthDate" ? rawValue.replace(/\D/g, "") : rawValue;
    setValues((previous) => ({ ...previous, [field]: value }));
    // 이미 오류가 표시된 필드만 입력에 맞춰 다시 검증한다.
    if (errors[field] !== undefined) {
      setErrors((previous) => ({
        ...previous,
        [field]: validateField(field, value),
      }));
    }
  }

  function handleChange(field: keyof Participant) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      updateField(field, event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateParticipant(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    const participant: Participant = {
      ...values,
      name: values.name.trim(),
      job: values.job.trim(),
    };
    try {
      window.sessionStorage.setItem(
        participantStorageKey,
        JSON.stringify(participant),
      );
    } catch {
      // 저장소를 쓸 수 없어도 흐름은 막지 않는다.
    }
    router.push(routes.consent);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <h1 className="mt-6 text-xl font-bold text-text-strong">
        {infoText.title}
      </h1>
      <p className="mt-3 text-sm text-text-muted">{infoText.privacyNotice}</p>
      <div className="mt-6 flex flex-col gap-5">
        <Input
          label={infoFields.name.label}
          placeholder={infoFields.name.placeholder}
          autoComplete="off"
          value={values.name}
          onChange={handleChange("name")}
          error={errors.name}
        />
        <Input
          label={infoFields.birthDate.label}
          placeholder={infoFields.birthDate.placeholder}
          inputMode="numeric"
          maxLength={birthDateLength}
          autoComplete="off"
          value={values.birthDate}
          onChange={handleChange("birthDate")}
          error={errors.birthDate}
        />
        <Select
          label={infoFields.gender.label}
          placeholder={infoFields.gender.placeholder}
          options={genderOptions}
          value={values.gender}
          onChange={handleChange("gender")}
          error={errors.gender}
        />
        <Input
          label={infoFields.job.label}
          placeholder={infoFields.job.placeholder}
          autoComplete="off"
          value={values.job}
          onChange={handleChange("job")}
          error={errors.job}
        />
        <Select
          label={infoFields.region.label}
          placeholder={infoFields.region.placeholder}
          options={regionOptions}
          value={values.region}
          onChange={handleChange("region")}
          error={errors.region}
        />
      </div>
      <div className="mt-auto pt-8 pb-6">
        <Button type="submit" variant="primary">
          {infoText.submitLabel}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import {
  birthDateLength,
  genderOptions,
  infoFields,
  infoText,
  jobMaxLength,
  nameMaxLength,
  regionOptions,
} from "@/constants/info";
import { routes } from "@/constants/routes";
import { saveParticipant } from "@/lib/storage/participant";
import type { Participant } from "@/types/survey";
import {
  validateField,
  validateParticipant,
  type ParticipantErrors,
} from "../validation";

type InfoFormProps = {
  initialParticipant: Participant;
};

export default function InfoForm({ initialParticipant }: InfoFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Participant>(initialParticipant);
  const [errors, setErrors] = useState<ParticipantErrors>({});
  const isFormValid = Object.keys(validateParticipant(values)).length === 0;

  function updateField(
    field: keyof Participant,
    rawValue: string,
    alwaysValidate: boolean,
  ) {
    const value =
      field === "birthDate" ? rawValue.replace(/\D/g, "") : rawValue;
    setValues((previous) => ({ ...previous, [field]: value }));
    // 이미 오류가 표시된 필드와 선택 필드는 입력에 맞춰 바로 다시 검증한다.
    if (alwaysValidate || errors[field] !== undefined) {
      setErrors((previous) => ({
        ...previous,
        [field]: validateField(field, value),
      }));
    }
  }

  function handleChange(field: keyof Participant, alwaysValidate = false) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      updateField(field, event.target.value, alwaysValidate);
  }

  function handleBlur(field: keyof Participant) {
    return (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const message = validateField(field, event.target.value);
      setErrors((previous) => ({ ...previous, [field]: message }));
    };
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
    saveParticipant(participant);
    router.push(routes.consent);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <h1 className="text-2xl leading-snug font-bold text-text-strong">
        {infoText.titleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-text-muted">
        {infoText.privacyNotice}
      </p>
      <div className="mt-8 flex flex-col gap-5">
        <Input
          label={infoFields.name.label}
          placeholder={infoFields.name.placeholder}
          autoComplete="off"
          maxLength={nameMaxLength}
          value={values.name}
          onChange={handleChange("name")}
          onBlur={handleBlur("name")}
          error={errors.name}
        />
        <Input
          label={infoFields.birthDate.label}
          placeholder={infoFields.birthDate.placeholder}
          helperText={infoFields.birthDate.helperText}
          inputMode="numeric"
          maxLength={birthDateLength}
          autoComplete="off"
          value={values.birthDate}
          onChange={handleChange("birthDate")}
          onBlur={handleBlur("birthDate")}
          error={errors.birthDate}
        />
        <Select
          label={infoFields.gender.label}
          placeholder={infoFields.gender.placeholder}
          options={genderOptions}
          value={values.gender}
          onChange={handleChange("gender", true)}
          onBlur={handleBlur("gender")}
          error={errors.gender}
        />
        <Input
          label={infoFields.job.label}
          placeholder={infoFields.job.placeholder}
          autoComplete="off"
          maxLength={jobMaxLength}
          value={values.job}
          onChange={handleChange("job")}
          onBlur={handleBlur("job")}
          error={errors.job}
        />
        <Select
          label={infoFields.region.label}
          placeholder={infoFields.region.placeholder}
          options={regionOptions}
          value={values.region}
          onChange={handleChange("region", true)}
          onBlur={handleBlur("region")}
          error={errors.region}
        />
      </div>
      <div className="mt-8 pb-8">
        <Button type="submit" disabled={!isFormValid}>
          {infoText.submitLabel}
        </Button>
      </div>
    </form>
  );
}

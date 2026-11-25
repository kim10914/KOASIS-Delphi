"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import {
  genderOptions,
  infoFields,
  infoPrivacyConsent,
  infoRules,
  infoText,
  regionOptions,
} from "@/constants/info";
import type { InfoFieldName } from "@/constants/info";
import { routes } from "@/constants/routes";
import { saveParticipant } from "@/lib/storage/surveySession";
import {
  validateParticipant,
  validateParticipantField,
} from "@/lib/validation/participant";
import type { Participant } from "@/types/survey";

type InfoFormProps = {
  initialValues: Participant;
  initialPrivacyAgreed: boolean;
};

type FormErrors = Partial<Record<InfoFieldName, string>>;

export default function InfoForm({
  initialValues,
  initialPrivacyAgreed,
}: InfoFormProps) {
  const router = useRouter();
  const privacyDetailsId = useId();
  const [values, setValues] = useState<Participant>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(initialPrivacyAgreed);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const isFormValid =
    Object.keys(validateParticipant(values)).length === 0 && isPrivacyAgreed;

  function setFieldError(field: InfoFieldName, value: string) {
    const message = validateParticipantField(field, value);
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handleChange(field: InfoFieldName, rawValue: string) {
    const value =
      field === "birthDate" ? rawValue.replace(/\D/g, "") : rawValue;
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setFieldError(field, value);
    }
  }

  function fieldProps(field: InfoFieldName) {
    return {
      value: values[field],
      error: errors[field] || undefined,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        handleChange(field, event.target.value),
      onBlur: () => setFieldError(field, values[field]),
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateParticipant(values);
    if (Object.keys(nextErrors).length > 0 || !isPrivacyAgreed) {
      setErrors(nextErrors);
      return;
    }
    saveParticipant(
      {
        ...values,
        name: values.name.trim(),
        job: values.job.trim(),
      },
      {
        agreed: true,
        at: new Date().toISOString(),
        textVersion: infoPrivacyConsent.textVersion,
      },
    );
    router.push(routes.moodPre);
  }

  return (
    <form
      noValidate
      aria-label={infoText.formLabel}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <Input
        label={infoFields.name.label}
        placeholder={infoFields.name.placeholder}
        autoComplete="off"
        maxLength={infoRules.nameMax}
        {...fieldProps("name")}
      />
      <Input
        label={infoFields.birthDate.label}
        placeholder={infoFields.birthDate.placeholder}
        helperText={infoFields.birthDate.helperText}
        inputMode="numeric"
        maxLength={infoFields.birthDate.maxLength}
        autoComplete="off"
        {...fieldProps("birthDate")}
      />
      <Select
        label={infoFields.gender.label}
        placeholder={infoFields.gender.placeholder}
        options={genderOptions}
        {...fieldProps("gender")}
      />
      <Input
        label={infoFields.job.label}
        placeholder={infoFields.job.placeholder}
        autoComplete="off"
        maxLength={infoRules.jobMax}
        {...fieldProps("job")}
      />
      <Select
        label={infoFields.region.label}
        placeholder={infoFields.region.placeholder}
        options={regionOptions}
        {...fieldProps("region")}
      />
      <div className="flex flex-col gap-2 rounded-[var(--radius-input)] border border-border bg-surface-muted/50 px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-2.5 text-sm font-medium text-text-strong">
            <input
              type="checkbox"
              checked={isPrivacyAgreed}
              onChange={(event) => setIsPrivacyAgreed(event.target.checked)}
              className="h-5 w-5 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-strong"
            />
            <span className="break-keep">{infoPrivacyConsent.label}</span>
          </label>
          <button
            type="button"
            aria-expanded={isPrivacyOpen}
            aria-controls={privacyDetailsId}
            onClick={() => setIsPrivacyOpen((prev) => !prev)}
            className="min-h-11 shrink-0 px-2 text-xs font-semibold text-text-muted underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-strong"
          >
            {isPrivacyOpen
              ? infoPrivacyConsent.toggleHide
              : infoPrivacyConsent.toggleShow}
          </button>
        </div>
        <ul
          id={privacyDetailsId}
          hidden={!isPrivacyOpen}
          className={
            isPrivacyOpen
              ? "flex list-disc flex-col gap-1 pb-2 pl-5 text-sm leading-relaxed text-text-strong"
              : "hidden"
          }
        >
          {infoPrivacyConsent.details.map((item) => (
            <li key={item} className="break-keep">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Button type="submit" disabled={!isFormValid} className="mt-2 mb-8">
        {infoText.submit}
      </Button>
    </form>
  );
}

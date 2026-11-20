"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import {
  genderOptions,
  infoFields,
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
};

type FormErrors = Partial<Record<InfoFieldName, string>>;

export default function InfoForm({ initialValues }: InfoFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Participant>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const isFormValid = Object.keys(validateParticipant(values)).length === 0;

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
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    saveParticipant({
      ...values,
      name: values.name.trim(),
      job: values.job.trim(),
    });
    router.push(routes.consent);
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
        {...fieldProps("job")}
      />
      <Select
        label={infoFields.region.label}
        placeholder={infoFields.region.placeholder}
        options={regionOptions}
        {...fieldProps("region")}
      />
      <Button type="submit" disabled={!isFormValid} className="mt-2 mb-8">
        {infoText.submit}
      </Button>
    </form>
  );
}

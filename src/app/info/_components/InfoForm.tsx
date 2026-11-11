"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import AppHeader from "@/components/AppHeader";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import StepIndicator from "@/components/StepIndicator";
import { routes } from "@/constants/routes";
import { loadParticipant, saveParticipant } from "@/lib/surveySession";
import type { Participant } from "@/types/survey";
import { genderOptions, jobOptions, regionOptions } from "./participantOptions";
import { validateParticipant } from "./validateParticipant";

const emptyParticipant: Participant = {
  name: "",
  birthDate: "",
  gender: "",
  job: "",
  region: "",
};

type TouchedFields = Partial<Record<keyof Participant, boolean>>;

export default function InfoForm() {
  const router = useRouter();
  const [values, setValues] = useState<Participant>(emptyParticipant);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitted, setSubmitted] = useState(false);

  // 뒤로 가기 후 재진입 시 입력값을 복원한다. (SSR 하이드레이션 불일치를 피하려고 마운트 후 읽는다)
  useEffect(() => {
    const saved = loadParticipant();

    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(saved);
    }
  }, []);

  const errors = validateParticipant(values);
  const isValid = Object.keys(errors).length === 0;

  const getError = (field: keyof Participant) =>
    touched[field] || submitted ? errors[field] : undefined;

  const handleChange =
    (field: keyof Participant) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleBirthDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 8);

    setValues((prev) => ({ ...prev, birthDate: digits }));
  };

  const handleBlur = (field: keyof Participant) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      return;
    }

    saveParticipant({ ...values, name: values.name.trim() });
    router.push(routes.consent);
  };

  return (
    <main className="pageContainer gap-6 pb-6">
      <AppHeader title="참여자 정보" />
      <StepIndicator current={1} total={2} />

      <h2 className="text-2xl font-bold">
        참여자의 간단한 정보를 입력해주세요.
      </h2>

      <form noValidate onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex flex-col gap-5">
          <Input
            label="이름"
            name="name"
            autoComplete="off"
            value={values.name}
            onChange={handleChange("name")}
            onBlur={handleBlur("name")}
            error={getError("name")}
            maxLength={20}
          />
          <Input
            label="생년월일"
            name="birthDate"
            inputMode="numeric"
            placeholder="19900101"
            value={values.birthDate}
            onChange={handleBirthDateChange}
            onBlur={handleBlur("birthDate")}
            error={getError("birthDate")}
            helperText="숫자 8자리로 입력해주세요."
          />
          <Select
            label="성별"
            name="gender"
            options={genderOptions}
            value={values.gender}
            onChange={handleChange("gender")}
            onBlur={handleBlur("gender")}
            error={getError("gender")}
          />
          <Select
            label="직업"
            name="job"
            options={jobOptions}
            value={values.job}
            onChange={handleChange("job")}
            onBlur={handleBlur("job")}
            error={getError("job")}
          />
          <Select
            label="지역"
            name="region"
            options={regionOptions}
            value={values.region}
            onChange={handleChange("region")}
            onBlur={handleBlur("region")}
            error={getError("region")}
          />
        </div>

        <p className="mt-6 rounded-[var(--radius-button)] bg-surface-muted p-4 text-sm text-text-muted">
          입력하신 정보는 비식별 처리되어 개인을 식별할 수 없는 형태로 관리되며,
          연구 목적으로만 사용됩니다.
        </p>

        <div className="mt-auto pt-6">
          <Button type="submit" disabled={!isValid}>
            제출하기
          </Button>
        </div>
      </form>
    </main>
  );
}

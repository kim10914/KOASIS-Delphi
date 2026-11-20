import AppHeader from "@/components/AppHeader";
import StepIndicator from "@/components/StepIndicator";
import { infoStep } from "@/constants/info";
import InfoForm from "./InfoForm";

export default function InfoScreen() {
  return (
    <main className="pageContainer pt-[env(safe-area-inset-top)]">
      <AppHeader />
      <StepIndicator currentStep={infoStep} />
      <InfoForm />
    </main>
  );
}

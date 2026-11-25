import SurveyGuard from "@/components/SurveyGuard";
import DoneScreen from "@/views/flow/components/DoneScreen";

export default function Page() {
  return (
    <SurveyGuard route="done">
      <DoneScreen />
    </SurveyGuard>
  );
}

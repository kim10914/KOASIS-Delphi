import SurveyGuard from "@/components/SurveyGuard";
import ReadyScreen from "@/views/flow/components/ReadyScreen";

export default function Page() {
  return (
    <SurveyGuard route="ready">
      <ReadyScreen />
    </SurveyGuard>
  );
}

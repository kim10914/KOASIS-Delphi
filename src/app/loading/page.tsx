import SurveyGuard from "@/components/SurveyGuard";
import SaveScreen from "@/views/flow/components/SaveScreen";

export default function Page() {
  return (
    <SurveyGuard route="loading">
      <SaveScreen />
    </SurveyGuard>
  );
}

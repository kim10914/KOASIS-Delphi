import SurveyGuard from "@/components/SurveyGuard";
import TestScreen from "@/views/test/components/TestScreen";

export default function Page() {
  return (
    <SurveyGuard route="test">
      <TestScreen />
    </SurveyGuard>
  );
}

import SurveyGuard from "@/components/SurveyGuard";
import FlowStubScreen from "@/views/flow/components/FlowStubScreen";

export default function Page() {
  return (
    <SurveyGuard route="moodPre">
      <FlowStubScreen stage="moodPre" />
    </SurveyGuard>
  );
}

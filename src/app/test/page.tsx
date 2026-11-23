import SurveyGuard from "@/components/SurveyGuard";
import FlowStubScreen from "@/views/flow/components/FlowStubScreen";

export default function Page() {
  return (
    <SurveyGuard route="test">
      <FlowStubScreen stage="test" />
    </SurveyGuard>
  );
}

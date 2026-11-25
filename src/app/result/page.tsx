import SurveyGuard from "@/components/SurveyGuard";
import ResultStubScreen from "@/views/flow/components/ResultStubScreen";

export default function Page() {
  return (
    <SurveyGuard route="result">
      <ResultStubScreen />
    </SurveyGuard>
  );
}

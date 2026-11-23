import SurveyGuard from "@/components/SurveyGuard";
import ConsentScreen from "@/views/consent/components/ConsentScreen";

export default function Page() {
  return (
    <SurveyGuard route="consent">
      <ConsentScreen />
    </SurveyGuard>
  );
}

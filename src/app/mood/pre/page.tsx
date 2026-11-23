import SurveyGuard from "@/components/SurveyGuard";
import MoodScreen from "@/views/mood/components/MoodScreen";

export default function Page() {
  return (
    <SurveyGuard route="moodPre">
      <MoodScreen phase="pre" />
    </SurveyGuard>
  );
}

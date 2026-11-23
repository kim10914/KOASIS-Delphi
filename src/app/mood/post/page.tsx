import SurveyGuard from "@/components/SurveyGuard";
import MoodScreen from "@/views/mood/components/MoodScreen";

export default function Page() {
  return (
    <SurveyGuard route="moodPost">
      <MoodScreen phase="post" />
    </SurveyGuard>
  );
}

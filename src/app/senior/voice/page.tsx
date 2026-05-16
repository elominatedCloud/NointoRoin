import { Suspense } from "react";
import { VoiceClient } from "@/components/senior/VoiceClient";

export default function SeniorVoicePage() {
  return (
    <Suspense fallback={null}>
      <VoiceClient />
    </Suspense>
  );
}

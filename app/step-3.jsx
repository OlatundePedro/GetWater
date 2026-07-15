import { useRouter } from "expo-router";
import OnboardingScreen from "../components/onboarding/onboardinScreen";

export default function OnboardingStep3() {
  const router = useRouter();

  return (
    <OnboardingScreen
      image={require("../assets/images/Illustration - Delivery, Business, Media _ multimedia, truck, woman, social media, running, speed.png")}
      title={"Fast and responsibily \ndelivery"}
      subtitle={
        "Order in seconds, stay hydrated, and enjoy \nconvenience with every delivery."
      }
      currentStep={2}
      totalSteps={3}
      buttonLabel="GET STARTED"
      onBack={() => router.back()}
      onNext={() => router.replace("/welcome")}
    />
  );
}

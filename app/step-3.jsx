import { useRouter } from "expo-router";
import OnboardingScreen from "../components/onboarding/onboardinScreen";

export default function OnboardingStep3() {
  const router = useRouter();

  return (
    <OnboardingScreen
      image={require("../assets/images/Illustration - Delivery, Business, Media _ multimedia, truck, woman, social media, running, speed.png")}
      title={"Fast and responsibily \ndelivery"}
      subtitle={
        "Experience crystal-clear purity in every \nrefreshing sip you take"
      }
      currentStep={2}
      totalSteps={3}
      buttonLabel="GET STARTED"
      onBack={() => router.back()}
      onNext={() => router.replace("/welcome")}
    />
  );
}

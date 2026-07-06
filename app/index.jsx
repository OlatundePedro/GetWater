import { useRouter } from "expo-router";
import OnboardingScreen from "../components/onboarding/onboardinScreen";

export default function OnboardingStep1() {
  const router = useRouter();

  return (
    <OnboardingScreen
      image={require("../assets/images/Illustration - Leisure _ drinking, alcohol, hangover, woman, bottle, energy, drink, beverage.png")}
      title={"We provide best quality \nwater"}
      subtitle={
        "Experience crystal-clear purity in every \nrefreshing sip you take"
      }
      currentStep={0}
      totalSteps={3}
      buttonLabel="NEXT"
      onNext={() => router.push("./step-2")}
    />
  );
}

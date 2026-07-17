import { useRouter } from "expo-router";
import OnboardingScreen from "../components/onboarding/onboardinScreen";

export default function OnboardingStep2() {
  const router = useRouter();

  return (
    <OnboardingScreen
      image={require("../assets/images/Illustration - Shopping, e-commerce _ purchase, shopping, shop, commerce, payment, store.png")}
      title={"Schedule when you want \nyour water delivered"}
      subtitle={
        "Fresh water, delivered right to your doorstep \nwhereever, whenever."
      }
      currentStep={1}
      totalSteps={3}
      buttonLabel="NEXT"
      onBack={() => router.back()}
      onNext={() => router.push("./step-3")}
    />
  );
}

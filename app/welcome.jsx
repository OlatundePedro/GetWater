import { useRouter } from "expo-router";
import WelcomeScreen from "../components/welcomeScreen";
export default function Welcome() {
  const router = useRouter();

  return (
    <WelcomeScreen
      onCreateAccount={() => router.push("/signup")}
      onLogin={() => router.push("/login")}
      onGuest={() => router.replace("/(guest)")}
    />
  );
}

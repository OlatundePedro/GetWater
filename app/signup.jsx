import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import RegistrationScreen from "../components/RegistrationSceen";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (name, email, password) => {
    setLoading(true);
    try {
      const { session } = await register(name, email, password);

      if (!session) {
        Alert.alert(
          "Check your email",
          "We've sent a confirmation link to your email address.",
        );
        router.replace("/login");
        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Sign up failed", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegistrationScreen
      loading={loading}
      onBack={() => router.back()}
      onRegister={handleRegister}
      onSignIn={() => router.push("/login")}
    />
  );
}

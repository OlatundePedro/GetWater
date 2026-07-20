import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import LoginScreen from "../components/LoginScreen";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login failed", friendlyError(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginScreen
      loading={loading}
      onBack={() => router.back()}
      onLogin={handleLogin}
      onForgotPassword={() => router.push("/forget-password")}
      onSignUp={() => router.push("/signup")}
    />
  );
}

function friendlyError(message) {
  if (message?.includes("Invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (message?.includes("Email not confirmed")) {
    return "Please confirm your email before logging in.";
  }
  return message || "Something went wrong. Please try again.";
}

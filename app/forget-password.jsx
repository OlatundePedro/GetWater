import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import ForgotPasswordScreen from "../components/ForgetPasswordScreen";
import { supabase } from "../config/supabase";

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (email) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "getwater://reset-password",
      });
      if (error) throw error;
      setSent(true);
    } catch (error) {
      Alert.alert(
        "Couldn't send reset email",
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordScreen
      loading={loading}
      sent={sent}
      onBack={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}

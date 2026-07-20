import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import ResetPasswordScreen from "../components/ResetPasswordScreen";
import { supabase } from "../config/supabase";

export default function ResetPassword() {
  const router = useRouter();
  const { code } = useLocalSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const exchangeCode = async () => {
      if (!code) {
        setVerifying(false);
        return;
      }
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        setVerified(true);
      } catch (error) {
        Alert.alert(
          "Link expired or invalid",
          "Please request a new password reset email.",
        );
      } finally {
        setVerifying(false);
      }
    };

    exchangeCode();
  }, [code]);

  const handleSubmit = async (newPassword) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      Alert.alert("Success", "Your password has been updated.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (error) {
      Alert.alert(
        "Couldn't update password",
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetPasswordScreen
      verifying={verifying}
      verified={verified}
      loading={loading}
      onSubmit={handleSubmit}
      onBack={() => router.replace("/login")}
    />
  );
}

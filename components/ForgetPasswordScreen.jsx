import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function ForgotPasswordScreen({
  onBack,
  onSubmit,
  loading,
  sent,
}) {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) return;
    onSubmit(email.trim());
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>

          {sent ? (
            <>
              <Text style={[styles.title, { color: colors.primary }]}>
                Check your email
              </Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                We've sent a password reset link to {"\n"}
                <Text style={{ fontFamily: "GoogleSansFlex-Bold" }}>
                  {email}
                </Text>
                . Follow the link there to set a new password.
              </Text>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: colors.primary, marginTop: 40 },
                ]}
                onPress={onBack}
              >
                <Text style={styles.loginButtonText}>BACK TO LOGIN</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.primary }]}>
                Forgot Password?
              </Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Enter the email linked to your account and {"\n"}we'll send you
                a link to reset your password.
              </Text>

              <Text style={[styles.label, { color: colors.textMuted }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.text },
                ]}
                placeholder="example@gmail.com"
                placeholderTextColor={colors.textFaint}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <View style={{ flex: 1 }} />

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.loginButtonText}>SEND RESET LINK</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 24,
  },
  backButton: { marginBottom: 20, marginTop: 15 },
  title: {
    fontSize: 20,
    fontFamily: "GoogleSansFlex-Bold",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
    lineHeight: 22,
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 17,
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Regular",
    marginBottom: 24,
  },
  loginButton: {
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-Bold",
    fontSize: 14,
    letterSpacing: 1,
  },
});

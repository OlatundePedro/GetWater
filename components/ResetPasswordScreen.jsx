import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function ResetPasswordScreen({
  verifying,
  verified,
  loading,
  onSubmit,
  onBack,
}) {
  const { colors } = useTheme();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (password.length < 6) {
      Alert.alert("Password too short", "Use at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match", "Please re-enter your password.");
      return;
    }
    onSubmit(password);
  };

  if (verifying) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[
              styles.subtitle,
              { color: colors.textMuted, marginTop: 16 },
            ]}
          >
            Verifying reset link...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!verified) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centered}>
          <Text
            style={[
              styles.title,
              { color: colors.primary, textAlign: "center" },
            ]}
          >
            Link expired or invalid
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.textMuted, textAlign: "center" },
            ]}
          >
            Please request a new password reset email.
          </Text>
          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: colors.primary, marginTop: 20, width: "100%" },
            ]}
            onPress={onBack}
          >
            <Text style={styles.loginButtonText}>BACK TO LOGIN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={[styles.title, { color: colors.primary }]}>
            Set New Password
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Choose a new password for {"\n"}your account.
          </Text>

          <Text style={[styles.label, { color: colors.textMuted }]}>
            New Password
          </Text>
          <View
            style={[styles.passwordWrapper, { borderColor: colors.border }]}
          >
            <TextInput
              style={[styles.passwordInput, { color: colors.text }]}
              placeholder="******************"
              placeholderTextColor={colors.textFaint}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color={colors.textFaint}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: colors.textMuted }]}>
            Confirm Password
          </Text>
          <View
            style={[styles.passwordWrapper, { borderColor: colors.border }]}
          >
            <TextInput
              style={[styles.passwordInput, { color: colors.text }]}
              placeholder="******************"
              placeholderTextColor={colors.textFaint}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={20}
                color={colors.textFaint}
              />
            </TouchableOpacity>
          </View>

          {password.length > 0 && password.length < 6 && (
            <Text style={[styles.errorText, { color: colors.danger }]}>
              Password must be at least 6 characters.
            </Text>
          )}
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <Text style={[styles.errorText, { color: colors.danger }]}>
              Passwords do not match.
            </Text>
          )}

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>UPDATE PASSWORD</Text>
            )}
          </TouchableOpacity>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
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
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 17,
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Regular",
  },
  eyeButton: {
    paddingLeft: 10,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Regular",
    marginTop: -16,
    marginBottom: 16,
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

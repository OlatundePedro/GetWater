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

export default function LoginScreen({
  onBack,
  onLogin,
  onForgotPassword,
  onSignUp,
  loading,
}) {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter both email and password.");
      return;
    }
    onLogin(email, password);
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

          <Text style={[styles.title, { color: colors.primary }]}>
            Welcome Back!
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Please fill in your email password to login to {"\n"}your account.
          </Text>

          <Text style={[styles.label, { color: colors.textMuted }]}>Email</Text>
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

          <Text style={[styles.label, { color: colors.textMuted }]}>
            Password
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

          <TouchableOpacity
            onPress={onForgotPassword}
            style={styles.forgotWrapper}
          >
            <Text style={[styles.forgotText, { color: colors.text }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onSignUp} style={styles.signupWrapper}>
            <Text style={[styles.signupText, { color: colors.textMuted }]}>
              Don't have an account?{" "}
              <Text style={[styles.signupLink, { color: colors.primary }]}>
                Sign up
              </Text>
            </Text>
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
  forgotWrapper: { alignItems: "flex-end", marginBottom: 40 },
  forgotText: {
    fontFamily: "GoogleSansFlex-SemiBold",
    fontSize: 12,
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
  signupWrapper: { alignItems: "center" },
  signupText: {
    fontSize: 13,
    textDecorationLine: "underline",
    marginBottom: 160,
    fontFamily: "GoogleSansFlex-Regular",
  },
  signupLink: {
    fontFamily: "GoogleSansFlex-Bold",
    textDecorationLine: "underline",
  },
});

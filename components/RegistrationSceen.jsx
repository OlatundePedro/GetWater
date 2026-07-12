import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
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

export default function RegistrationScreen({
  onBack,
  onRegister,
  onSignIn,
  loading,
}) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    if (!isChecked) {
      Alert.alert(
        "Accept Terms",
        "Please accept the Terms of Service and Privacy Policy.",
      );
      return;
    }
    onRegister(name, email, password);
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
            Create your Account
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Please fill in your details to create your {"\n"}account
          </Text>

          <Text style={[styles.label, { color: colors.textMuted }]}>Name</Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text },
            ]}
            placeholder="John Doe"
            placeholderTextColor={colors.textFaint}
            value={name}
            onChangeText={setName}
          />

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
          <View style={styles.privacy}>
            <Checkbox
              color={isChecked ? colors.primary : colors.textFaint}
              style={styles.checkbox}
              value={isChecked}
              onValueChange={() => setChecked((prev) => !prev)}
            />
            <Text style={[styles.policyText, { color: colors.textMuted }]}>
              By signing up, you agree to the{" "}
              <Text style={{ color: colors.primary }}>
                Terms of {"\n"}services and Privacy Policy
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>CREATE AN ACCOUNT</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onSignIn} style={styles.signinWrapper}>
            <Text style={[styles.signinText, { color: colors.textMuted }]}>
              Already have an account?{" "}
              <Text style={[styles.signinLink, { color: colors.primary }]}>
                Sign in
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: "GoogleSansFlex-Regular",
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
    marginBottom: 20,
    fontFamily: "GoogleSansFlex-Regular",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
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
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  policyText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 10,
    fontFamily: "GoogleSansFlex-Regular",
  },
  checkbox: {
    borderRadius: 0,
  },
  registerButton: {
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 45,
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-Bold",
    fontSize: 14,
    letterSpacing: 1,
  },
  signinWrapper: { alignItems: "center" },
  signinText: {
    fontSize: 13,
    fontFamily: "GoogleSansFlex-Regular",
    textDecorationLine: "underline",
  },
  signinLink: {
    fontFamily: "GoogleSansFlex-Bold",
    textDecorationLine: "underline",
  },
});

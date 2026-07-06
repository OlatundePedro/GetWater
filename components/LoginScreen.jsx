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

export default function LoginScreen({
  onBack,
  onLogin,
  onForgotPassword,
  onSignUp,
  loading,
}) {
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={26} color="#5AC8F2" />
          </TouchableOpacity>

          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Please fill in your email password to login to {"\n"}your account.
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor="#625D5D"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="******************"
              placeholderTextColor="#625D5D"
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
                color="#625D5D"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onForgotPassword}
            style={styles.forgotWrapper}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={styles.loginButton}
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
            <Text style={styles.signupText}>
              Don't have an account?{" "}
              <Text style={styles.signupLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
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
    color: "#5DCCFC",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
    color: "#625D5D",
    lineHeight: 22,
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
    color: "#625D5D",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#625D5D",
    paddingHorizontal: 16,
    paddingVertical: 17,
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Regular",
    color: "#1F2937",
    marginBottom: 24,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#625D5D",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 17,
    fontSize: 12,
    color: "#1F2937",
    fontFamily: "GoogleSansFlex-Regular",
  },
  eyeButton: {
    paddingLeft: 10,
  },
  forgotWrapper: { alignItems: "flex-end", marginBottom: 40 },
  forgotText: {
    color: "#374151",
    fontFamily: "GoogleSansFlex-SemiBold",
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: "#5DCCFC",
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
    color: "#625D5D",
    fontSize: 13,
    textDecorationLine: "underline",
    marginBottom: 160,
    fontFamily: "GoogleSansFlex-Regular",
  },
  signupLink: {
    color: "#5DCCFC",
    fontFamily: "GoogleSansFlex-Bold",
    textDecorationLine: "underline",
  },
});

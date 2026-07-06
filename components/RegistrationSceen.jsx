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

export default function RegistrationScreen({
  onBack,
  onRegister,
  onSignIn,
  loading,
}) {
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

          <Text style={styles.title}>Create your Account</Text>
          <Text style={styles.subtitle}>
            Please fill in your details to create your {"\n"}account
          </Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#625D5D"
            value={name}
            onChangeText={setName}
          />

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

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="******************"
              placeholderTextColor="#625D5D"
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
                color="#625D5D"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.privacy}>
            <Checkbox
              color={isChecked ? "#5DCCFC" : "#625D5D"}
              style={styles.checkbox}
              value={isChecked}
              onValueChange={() => setChecked((prev) => !prev)}
            />
            <Text style={styles.policyText}>
              By signing up, you agree to the{" "}
              <Text style={{ color: "#5DCCFC" }}>
                Terms of {"\n"}services and Privacy Policy
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
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
            <Text style={styles.signinText}>
              Already have an account?{" "}
              <Text style={styles.signinLink}>Sign in</Text>
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#625D5D",
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: "GoogleSansFlex-Regular",
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
    color: "#1F2937",
    marginBottom: 20,
    fontFamily: "GoogleSansFlex-Regular",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#625D5D",
    paddingHorizontal: 16,
    marginBottom: 20,
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
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  policyText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 10,
    color: "#625D5D",
    fontFamily: "GoogleSansFlex-Regular",
  },
  checkbox: {
    borderRadius: 0,
  },
  registerButton: {
    backgroundColor: "#5DCCFC",
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
    color: "#625D5D",
    fontSize: 13,
    fontFamily: "GoogleSansFlex-Regular",
    textDecorationLine: "underline",
  },
  signinLink: {
    color: "#5DCCFC",
    fontFamily: "GoogleSansFlex-Bold",
    textDecorationLine: "underline",
  },
});

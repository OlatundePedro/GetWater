import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen({ onCreateAccount, onLogin, onGuest }) {
  return (
    <ImageBackground
      source={require("../assets/images/welcomeImage.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.4)", "rgb(0, 0, 0)"]}
        locations={[0, 0.55, 1]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.content}>
          <View style={styles.textBlock}>
            <Text style={styles.title}>Welcome to Get Water</Text>
            <Text style={styles.subtitle}>Water Delivery app</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onCreateAccount}
          >
            <Text style={styles.primaryButtonText}>CREATE AN ACCOUNT</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onLogin}>
            <Text style={styles.secondaryButtonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton} onPress={onGuest}>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  textBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "GoogleSansFlex-ExtraBold",
    textAlign: "center",
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 6,
    opacity: 0.9,
    fontFamily: "GoogleSansFlex-Regular",
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryButtonText: {
    color: "#1F2937",
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
    letterSpacing: 1,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
    letterSpacing: 1,
  },
  guestButton: {
    alignItems: "center",
    marginBottom: 60,
  },
  guestText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "GoogleSansFlex-Regular",
  },
});

import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PaginationDots from "./pagination";

export default function OnboardingScreen({
  image,
  title,
  subtitle,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  buttonLabel = "NEXT",
}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={32} color="#12a5e4" />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Image
          source={image}
          style={styles.illustration}
          resizeMode="contain"
        />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <PaginationDots total={totalSteps} current={currentStep} />
      </View>

      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  backButton: {
    position: "absolute",
    top: 16,
    right: 38,
    marginTop: 45,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  illustration: {
    width: 310,
    height: 310,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: "GoogleSansFlex-Bold",
    color: "#625D5D",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-regular",
    color: "#625D5D",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#12a5e4",
    paddingVertical: 18,
    marginHorizontal: 20,
    marginBottom: 55,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
    letterSpacing: 1,
  },
});

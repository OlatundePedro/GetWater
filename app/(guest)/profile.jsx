import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function GuestProfile() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ color: colors.text }}>You're browsing as a guest</Text>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={{ color: colors.primary, fontWeight: "700" }}>
          Log in or sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

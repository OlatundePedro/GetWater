import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function GuestProfile() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text>You're browsing as a guest</Text>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={{ color: "#5DCCFC", fontWeight: "700" }}>
          Log in or sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

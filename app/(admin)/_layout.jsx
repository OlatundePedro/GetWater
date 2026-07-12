// app/(admin)/_layout.jsx
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useProfile } from "../../context/ProfileContext";

export default function AdminLayout() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const allowed = profile?.role === "staff" || profile?.role === "admin";
  if (!allowed) return <Redirect href="/" />;

  return <Slot />;
}

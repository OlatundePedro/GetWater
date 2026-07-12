import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import AvatarPicker from "./AvaterPicker";
import EditableField from "./EditableField";

export default function ProfileScreen({
  profile,
  email,
  onUpdateField,
  onUploadAvatar,
  onLogout,
}) {
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter(); // add this if not already imported

  const isStaff = profile?.role === "staff" || profile?.role === "admin";
  const isAdmin = profile?.role === "admin";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.primary }]}>Profile</Text>

        <AvatarPicker
          avatarUrl={profile?.avatar_url}
          onUploaded={onUploadAvatar}
        />

        <Text style={[styles.email, { color: colors.textMuted }]}>{email}</Text>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account Information
          </Text>

          <EditableField
            label="Full Name"
            value={profile?.full_name}
            onSave={(v) => onUpdateField("full_name", v)}
          />
          <EditableField
            label="Delivery Address"
            value={profile?.address}
            onSave={(v) => onUpdateField("address", v)}
          />
          <EditableField
            label="Phone Number"
            value={profile?.phone}
            onSave={(v) => onUpdateField("phone", v)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Settings{" "}
          </Text>

          {isStaff && (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Admin
              </Text>
              <TouchableOpacity onPress={() => router.push("/(admin)")}>
                <Text style={{ color: colors.primary, paddingVertical: 8 }}>
                  Manage Products
                </Text>
              </TouchableOpacity>
              {isAdmin && (
                <TouchableOpacity onPress={() => router.push("/(admin)/staff")}>
                  <Text style={{ color: colors.primary, paddingVertical: 8 }}>
                    Manage Staff Roles
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
          >
            <View style={styles.settingLabelRow}>
              <Ionicons name="moon-outline" size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Dark Theme
              </Text>
            </View>
            <Switch
              style={{ marginTop: -55, marginBottom: -35 }}
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#D1D5DB", true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <TouchableOpacity style={styles.logoutRow} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={[styles.logoutText, { color: colors.danger }]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: "GoogleSansFlex-Bold",
    marginBottom: 20,
  },
  email: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
    textAlign: "center",
    marginBottom: 28,
  },
  section: {
    borderRadius: 5,
    padding: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-SemiBold",
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: -25,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 25,
    marginTop: -10,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { Redirect, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { useTheme } from "../../context/ThemeContext";

const ROLES = ["customer", "staff", "admin"];

export default function StaffManagement() {
  const { colors } = useTheme();
  const router = useRouter();
  const { profile } = useProfile();
  const { user } = useAuth();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPeople = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .order("full_name", { ascending: true });

    if (error) {
      Alert.alert("Failed to load users", error.message);
    } else {
      setPeople(data);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPeople();
    }, [fetchPeople]),
  );

  // Admin-only gate — staff can view products but not touch roles
  if (profile?.role !== "admin") {
    return <Redirect href="/(admin)" />;
  }

  const changeRole = (person, newRole) => {
    if (person.id === user.id && newRole !== "admin") {
      Alert.alert(
        "Careful",
        "You're about to remove your own admin access. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            style: "destructive",
            onPress: () => applyRoleChange(person, newRole),
          },
        ],
      );
      return;
    }
    applyRoleChange(person, newRole);
  };

  const applyRoleChange = async (person, newRole) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", person.id);

    if (error) {
      Alert.alert("Update failed", error.message);
      return;
    }
    setPeople((prev) =>
      prev.map((p) => (p.id === person.id ? { ...p, role: newRole } : p)),
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Manage Roles</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchPeople}
        renderItem={({ item }) => (
          <View
            style={[
              styles.row,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.name, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.full_name || "Unnamed user"}
              {item.id === user.id && (
                <Text style={{ color: colors.textFaint }}> (you)</Text>
              )}
            </Text>

            <View style={styles.roleRow}>
              {ROLES.map((r) => {
                const active = item.role === r;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.roleChip,
                      {
                        backgroundColor: active
                          ? colors.primary
                          : colors.background,
                      },
                      { borderColor: colors.border },
                    ]}
                    onPress={() => changeRole(item, r)}
                  >
                    <Text
                      style={{
                        color: active ? "#FFFFFF" : colors.textMuted,
                        fontSize: 11,
                      }}
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: "GoogleSansFlex-Bold",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
  },
  row: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  name: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
  },
  roleRow: {
    flexDirection: "row",
    gap: 8,
  },
  roleChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
});

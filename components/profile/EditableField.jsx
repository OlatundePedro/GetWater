import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function EditableField({
  label,
  value,
  onSave,
  keyboardType = "default",
}) {
  const { colors } = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  const startEdit = () => {
    setDraft(value || "");
    setEditing(true);
  };

  const confirmEdit = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.textFaint }]}>{label}</Text>

      {editing ? (
        <View style={styles.editRow}>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.primary },
            ]}
            value={draft}
            onChangeText={setDraft}
            keyboardType={keyboardType}
            autoFocus
          />
          <TouchableOpacity onPress={confirmEdit} style={styles.saveButton}>
            <Ionicons name="checkmark" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.viewRow} onPress={startEdit}>
          <Text style={[styles.value, { color: colors.text }]}>
            {value || "Not set"}
          </Text>
          <Ionicons name="pencil-outline" size={18} color={colors.textFaint} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  label: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Regular",
    marginBottom: 6,
  },
  viewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
    flexShrink: 1,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1.5,
    paddingVertical: 6,
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
  },
  saveButton: {
    padding: 6,
  },
});

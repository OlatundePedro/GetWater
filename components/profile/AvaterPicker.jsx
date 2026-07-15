import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function AvatarPicker({ avatarUrl, onUploaded }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [urlInputVisible, setUrlInputVisible] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split(".").pop() || "jpg";
      const filePath = `${user.id}/avatar.${fileExt}`;

      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
          contentType: blob.type || "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      onUploaded(`${data.publicUrl}?t=${Date.now()}`); // cache-bust
    } catch (err) {
      console.warn("Avatar upload failed:", err.message);
    } finally {
      setUploading(false);
      setModalVisible(false);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const useOnlineUrl = () => {
    if (!urlValue.trim()) return;
    onUploaded(urlValue.trim());
    setUrlValue("");
    setUrlInputVisible(false);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.avatarWrapper}
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: colors.border },
            ]}
          >
            <Ionicons name="person" size={40} color={colors.textFaint} />
          </View>
        )}
        <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
          {uploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.sheet, { backgroundColor: colors.card }]}>
            {!urlInputVisible ? (
              <>
                <TouchableOpacity
                  style={styles.sheetOption}
                  onPress={pickFromGallery}
                >
                  <Ionicons
                    name="images-outline"
                    size={20}
                    color={colors.text}
                  />
                  <Text
                    style={[styles.sheetOptionText, { color: colors.text }]}
                  >
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sheetOption}
                  onPress={pickFromCamera}
                >
                  <Ionicons
                    name="camera-outline"
                    size={20}
                    color={colors.text}
                  />
                  <Text
                    style={[styles.sheetOptionText, { color: colors.text }]}
                  >
                    Take Photo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sheetOption}
                  onPress={() => setUrlInputVisible(true)}
                >
                  <Ionicons name="link-outline" size={20} color={colors.text} />
                  <Text
                    style={[styles.sheetOptionText, { color: colors.text }]}
                  >
                    Use Image from URL
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ gap: 12 }}>
                <TextInput
                  placeholder="Paste image URL"
                  placeholderTextColor={colors.textFaint}
                  value={urlValue}
                  onChangeText={setUrlValue}
                  autoCapitalize="none"
                  style={[
                    styles.urlInput,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                />
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={useOnlineUrl}
                >
                  <Text style={styles.confirmButtonText}>Use this image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    alignSelf: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 40,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  sheetOptionText: {
    fontSize: 16,
    fontFamily: "GoogleSansFlex-Regular",
  },
  urlInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-Bold",
    fontSize: 15,
  },
});

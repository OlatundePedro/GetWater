import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../../config/supabase";
import { useProducts } from "../../../context/ProductContext";
import { useTheme } from "../../../context/ThemeContext";

const WATER_TYPES = ["Purified", "Distilled", "Spring"]; // adjust to your real waterTypes

export default function ProductEditor() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isNew = id === "new";
  const { refreshProducts } = useProducts();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    type: WATER_TYPES[0],
    image_url: "",
    sizes: "",
    in_stock: true,
  });

  useEffect(() => {
    if (isNew) return;

    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert("Failed to load product", error.message);
        router.back();
        return;
      }

      setForm({
        name: data.name || "",
        description: data.description || "",
        price: String(data.price ?? ""),
        type: data.type || WATER_TYPES[0],
        image_url: data.image_url || "",
        sizes: (data.sizes || []).join(", "),
        in_stock: data.in_stock,
      });
      setLoading(false);
    })();
  }, [id]);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const pickAndUploadImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          "Please allow photo library access to upload an image.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        Alert.alert("Image error", "No image was returned by the picker.");
        return;
      }

      const uri = asset.uri;
      const fileExt = (uri.split(".").pop() || "jpg").toLowerCase();

      if (!["jpg", "jpeg", "png"].includes(fileExt)) {
        Alert.alert("Unsupported format", "Please choose a JPG or PNG image.");
        return;
      }

      setUploadingImage(true);

      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const filePath = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, arrayBuffer, {
          contentType: blob.type || `image/${fileExt}`,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("products").getPublicUrl(filePath);
      update("image_url", data.publicUrl);
    } catch (err) {
      console.error("Image picker/upload error:", err);
      Alert.alert(
        "Image upload failed",
        err?.message || "Something went wrong picking or uploading the image.",
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      Alert.alert("Missing info", "Name and price are required.");
      return;
    }
    const priceNum = Number(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      Alert.alert("Invalid price", "Enter a valid non-negative number.");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: priceNum,
      type: form.type,
      image_url: form.image_url.trim() || null,
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      in_stock: form.in_stock,
      updated_at: new Date(),
    };

    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", id);

    setSaving(false);

    if (error) {
      Alert.alert("Save failed", error.message);
      return;
    }

    await refreshProducts();
    router.back();
  };

  if (loading) return null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {isNew ? "New Product" : "Edit Product"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Name</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text },
          ]}
          placeholder="Product name"
          placeholderTextColor={colors.textFaint}
          value={form.name}
          onChangeText={(v) => update("name", v)}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>
          Description
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.multiline,
            { borderColor: colors.border, color: colors.text },
          ]}
          placeholder="Short description"
          placeholderTextColor={colors.textFaint}
          value={form.description}
          onChangeText={(v) => update("description", v)}
          multiline
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>
          Price (₦)
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text },
          ]}
          placeholder="0"
          placeholderTextColor={colors.textFaint}
          value={form.price}
          onChangeText={(v) => update("price", v)}
          keyboardType="decimal-pad"
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>Type</Text>
        <View style={styles.typeRow}>
          {WATER_TYPES.map((t) => {
            const active = form.type === t;
            return (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeChip,
                  { backgroundColor: active ? colors.primary : colors.card },
                ]}
                onPress={() => update("type", t)}
              >
                <Text
                  style={{
                    color: active ? "#FFFFFF" : colors.text,
                    fontSize: 12,
                  }}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.textMuted }]}>
          Product Image
        </Text>
        <TouchableOpacity
          style={[styles.imagePickerBox, { borderColor: colors.border }]}
          onPress={pickAndUploadImage}
          disabled={uploadingImage}
        >
          {form.image_url ? (
            <Image
              source={{ uri: form.image_url }}
              style={styles.imagePreview}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="image-outline"
                size={28}
                color={colors.textFaint}
              />
              <Text
                style={{ color: colors.textFaint, fontSize: 12, marginTop: 6 }}
              >
                Tap to choose an image
              </Text>
            </View>
          )}

          {uploadingImage && (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        <Text style={[styles.label, { color: colors.textMuted }]}>
          Sizes (comma-separated)
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text },
          ]}
          placeholder="50cl, 75cl, 1L"
          placeholderTextColor={colors.textFaint}
          value={form.sizes}
          onChangeText={(v) => update("sizes", v)}
        />

        <View style={styles.stockRow}>
          <Text
            style={[styles.label, { color: colors.textMuted, marginBottom: 0 }]}
          >
            In Stock
          </Text>
          <Switch
            value={form.in_stock}
            onValueChange={(v) => update("in_stock", v)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={saving || uploadingImage}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Medium",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  imagePickerBox: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  stockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  saveButton: {
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-Bold",
    fontSize: 15,
  },
});

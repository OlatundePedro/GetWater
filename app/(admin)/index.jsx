import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../config/supabase";
import { useTheme } from "../../context/ThemeContext";

export default function AdminProductList() {
  const { colors } = useTheme();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Failed to load products", error.message);
    } else {
      setProducts(data);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts]),
  );

  const handleDelete = (product) => {
    Alert.alert(
      "Delete product",
      `Delete "${product.name}"? This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("products")
              .delete()
              .eq("id", product.id);
            if (error) {
              Alert.alert("Delete failed", error.message);
            } else {
              setProducts((prev) => prev.filter((p) => p.id !== product.id));
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Products</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(admin)/product/new")}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchProducts}
        ListEmptyComponent={
          !loading && (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No products yet.
            </Text>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.row,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => router.push(`/(admin)/product/${item.id}`)}
          >
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.thumb} />
            ) : (
              <View
                style={[styles.thumb, { backgroundColor: colors.border }]}
              />
            )}

            <View style={{ flex: 1 }}>
              <Text
                style={[styles.name, { color: colors.text }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                {item.type} · ₦{item.price}
              </Text>
              {!item.in_stock && (
                <Text style={[styles.outOfStock, { color: colors.danger }]}>
                  Out of stock
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => handleDelete(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
          </TouchableOpacity>
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
    paddingTop: 30,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "GoogleSansFlex-Bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-Bold",
    fontSize: 13,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  name: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
  },
  meta: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Regular",
    marginTop: 2,
  },
  outOfStock: {
    fontSize: 11,
    fontFamily: "GoogleSansFlex-Bold",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontFamily: "GoogleSansFlex-Regular",
  },
});

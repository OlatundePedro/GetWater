import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProducts } from "../context/ProductContext";
import { useTheme } from "../context/ThemeContext";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";
import PromoBanner from "./PromoBanner";

export default function HomeScreen({
  user,
  onSignUp,
  onQuickShop,
  onProductPress,
}) {
  const { colors } = useTheme();
  const { products, waterTypes, loading, refreshProducts } = useProducts();
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0];

  const filteredProducts = products.filter(
    (p) =>
      (selectedType === "All" || p.type === selectedType) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView
        style={[styles.header, { backgroundColor: colors.primary }]}
        edges={["top"]}
      >
        <View style={styles.headerTop}>
          {user ? (
            <View>
              <Text style={styles.welcomeBackLabel}>Welcome Back!</Text>
              <Text style={styles.welcomeBackName}>{displayName}!</Text>
            </View>
          ) : (
            <>
              <Text style={styles.welcomeTitle}>Welcome!</Text>
              <TouchableOpacity onPress={onSignUp}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Something...."
            placeholderTextColor="rgba(255,255,255,0.8)"
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" size={20} color="#FFFFFF" />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PromoBanner onPress={onQuickShop} />

        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          Water type
        </Text>
        <CategoryFilter
          types={waterTypes}
          selected={selectedType}
          onSelect={setSelectedType}
        />

        <View style={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => onProductPress?.(product)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    // height removed — SafeAreaView + padding size this naturally now
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-Bold",
    marginBottom: 10,
    // marginTop removed
  },
  welcomeBackLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-Medium",
    // marginTop removed
  },
  welcomeBackName: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-SemiBold",
    marginTop: 5,
  },
  signUpLink: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
    marginTop: 14,
    fontFamily: "GoogleSansFlex-SemiBold",
    fontSize: 10,
  },
  searchBar: {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Regular",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "GoogleSansFlex-Medium",
    marginTop: 15,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

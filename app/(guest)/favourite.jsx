import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useFavourites } from "../../context/FavouritesContext";
import { useTheme } from "../../context/ThemeContext";

export default function Favourite() {
  const router = useRouter();
  const { favourites } = useFavourites();
  const { addToCart } = useCart();
  const { colors } = useTheme();

  const handleAddToCart = (product) => {
    addToCart(product, product.sizes[0], 1);
    router.push("/cart");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Favourites
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {favourites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={48} color={colors.textFaint} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Your Favourites is empty
          </Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => handleAddToCart(item)} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: "GoogleSansFlex-Bold",
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
  },
});

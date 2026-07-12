import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFavourites } from "../context/FavouritesContext";
import { useTheme } from "../context/ThemeContext";

export default function ProductCard({ product, onPress }) {
  const { toggleFavourite, isFavorited } = useFavourites();
  const { colors } = useTheme();
  const favorited = isFavorited(product.id);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavourite(product)}
        >
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={18}
            color={favorited ? colors.danger : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
      <Text style={[styles.price, { color: colors.textMuted }]}>
        ₦{product.price}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 20,
    marginTop: 15,
  },
  imageWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#F3F4F6",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderRadius: 8,
    padding: 6,
  },
  name: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
  },
  price: {
    fontSize: 11,
    fontFamily: "GoogleSansFlex-Regular",
    marginTop: 2,
  },
});

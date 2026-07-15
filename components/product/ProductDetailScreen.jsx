import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { useFavourites } from "../../context/FavouritesContext";
import { useTheme } from "../../context/ThemeContext";

export default function ProductDetailScreen({
  product,
  onBack,
  onCart,
  onBuy,
}) {
  const { height: windowHeight } = useWindowDimensions();

  const { toggleFavourite, isFavorited } = useFavourites();
  const { addToCart } = useCart();
  const { colors } = useTheme();

  const favorited = isFavorited(product.id);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    onCart?.({ product, size: selectedSize, quantity });
  };

  const handleBuy = () => {
    if (!product.in_stock) {
      Alert.alert("Out of stock", "This product is currently unavailable.");
      return;
    }
    addToCart(product, selectedSize, quantity);
    onBuy?.({ product, size: selectedSize, quantity });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.imageWrapper, { height: windowHeight * 0.42 }]}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, { backgroundColor: colors.border }]} />
        )}

        <SafeAreaView style={styles.imageOverlay}>
          <TouchableOpacity style={styles.iconButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleFavourite(product)}
          >
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={24}
              color={favorited ? colors.danger : "#FFFFFF"}
            />
          </TouchableOpacity>
        </SafeAreaView>

        <TouchableOpacity
          style={[styles.cartButton, { backgroundColor: colors.card }]}
          onPress={handleAddToCart}
        >
          <Ionicons name="bag-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: colors.text }]}>
            {product.name}
          </Text>
          <Text
            style={[
              styles.stock,
              { color: colors.textFaint },
              !product.in_stock && { color: colors.danger },
            ]}
          >
            {product.in_stock ? "(Available In Stock)" : "(Out of Stock)"}
          </Text>
        </View>

        <Text style={[styles.price, { color: colors.text }]}>
          ₦{product.price}
        </Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          {product.description}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={18} color="#F5B301" />
          <Text style={[styles.ratingValue, { color: colors.text }]}>
            {product.rating}
          </Text>
          <Text style={[styles.reviewCount, { color: colors.textFaint }]}>
            ({product.review_count} reviews)
          </Text>
        </View>

        <View style={styles.optionsRow}>
          <View style={styles.optionColumn}>
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              Bottle size
            </Text>
            <TouchableOpacity
              style={[styles.sizeSelector, { borderColor: colors.primary }]}
              onPress={() => setSizePickerOpen(true)}
            >
              <Text style={[styles.sizeText, { color: colors.text }]}>
                {selectedSize}
              </Text>
              <View
                style={[
                  styles.sizeChevron,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.optionColumn}>
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              Quantity
            </Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  { backgroundColor: colors.card },
                ]}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Text style={[styles.quantitySign, { color: colors.text }]}>
                  -
                </Text>
              </TouchableOpacity>
              <Text style={[styles.quantityValue, { color: colors.text }]}>
                {quantity}
              </Text>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  { backgroundColor: colors.card },
                ]}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Text style={[styles.quantitySign, { color: colors.text }]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.buyButton,
            { backgroundColor: colors.primary },
            !product.in_stock && { backgroundColor: colors.textFaint },
          ]}
          onPress={handleBuy}
        >
          <Text style={styles.buyButtonText}>BUY</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={sizePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSizePickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSizePickerOpen(false)}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            {product.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedSize(size);
                  setSizePickerOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    { color: colors.text },
                    size === selectedSize && {
                      color: colors.primary,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconButton: {
    borderRadius: 10,
    padding: 8,
  },
  heartButton: {
    backgroundColor: "#1F2937",
    borderRadius: 6,
    padding: 12,
  },
  cartButton: {
    position: "absolute",
    bottom: 12,
    right: 20,
    borderRadius: 5,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 30,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontFamily: "GoogleSansFlex-Bold",
  },
  stock: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Regular",
  },
  price: {
    fontSize: 18,
    fontFamily: "GoogleSansFlex-Regular",
    marginTop: 8,
  },
  description: {
    fontSize: 12,
    lineHeight: 22,
    marginTop: 16,
    fontFamily: "GoogleSansFlex-Regular",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 6,
  },
  ratingValue: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-SemiBold",
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 28,
  },
  optionColumn: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: "GoogleSansFlex-Medium",
    fontSize: 11,
    marginBottom: 10,
  },
  sizeSelector: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderRadius: 6,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  sizeText: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: "GoogleSansFlex-Medium",
  },
  sizeChevron: {
    paddingHorizontal: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginLeft: 70,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  quantitySign: {
    fontSize: 18,
    fontFamily: "GoogleSansFlex-Medium",
  },
  quantityValue: {
    fontSize: 18,
    fontFamily: "GoogleSansFlex-Medium",
  },
  buyButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 36,
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: "GoogleSansFlex-Medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalOptionText: {
    fontSize: 16,
  },
});

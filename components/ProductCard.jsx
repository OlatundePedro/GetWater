import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductCard({ product, onPress }) {
  const [favorited, setFavorited] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        <Image source={product.image} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => setFavorited(!favorited)}
        >
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₦{product.price}</Text>
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
    backgroundColor:
      "linear-gradient(90deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2))",
    borderRadius: 8,
    padding: 6,
  },
  name: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
    color: "#1F2937",
  },
  price: {
    fontSize: 11,
    fontFamily: "GoogleSansFlex-Regular",
    color: "#6B7280",
    marginTop: 2,
  },
});

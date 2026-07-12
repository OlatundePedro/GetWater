import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import ProductDetailScreen from "../../../components/product/ProductDetailScreen";
import { supabase } from "../../../config/supabase";
import { useCart } from "../../../context/CartContext";
import { useTheme } from "../../../context/ThemeContext";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { colors } = useTheme();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!cancelled) {
        if (error) {
          console.warn("Failed to load product:", error.message);
          setProduct(null);
        } else {
          setProduct(data);
        }
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.text }}>Product not found</Text>
      </View>
    );
  }

  return (
    <ProductDetailScreen
      product={product}
      onBack={() => router.back()}
      onFavorite={(product, isFavorited) => {
        console.log(isFavorited ? "Favorited" : "Unfavorited", product.name);
      }}
      onCart={() => router.push("/cart")}
      onBuy={({ product, size, quantity }) => {
        addToCart(product, size, quantity);
        router.push("/cart");
      }}
    />
  );
}

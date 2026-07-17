import { useRouter } from "expo-router";
import HomeScreen from "../../components/HomeScreen";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <HomeScreen
      user={user}
      onSignUp={() => router.push("/signup")}
      onQuickShop={() => router.push("/(tabs)/cart")}
      onProductPress={(product) => router.push(`/product/${product.id}`)}
    />
  );
}

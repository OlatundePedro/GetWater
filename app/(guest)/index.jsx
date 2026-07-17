import { useRouter } from "expo-router";
import HomeScreen from "../../components/HomeScreen";

export default function GuestHome() {
  const router = useRouter();

  return (
    <HomeScreen
      user={null}
      onSignUp={() => router.push("/signup")}
      onQuickShop={() => router.push("/(guest)/cart")}
      onProductPress={(product) => router.push(`/product/${product.id}`)}
    />
  );
}

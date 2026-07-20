import { useRouter } from "expo-router";
import MyOrdersScreen from "../components/order/MyOrderScreen";

export default function MyOrders() {
  const router = useRouter();
  return <MyOrdersScreen onBack={() => router.back()} />;
}

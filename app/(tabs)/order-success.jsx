import { useLocalSearchParams, useRouter } from "expo-router";
import OrderSuccessScreen from "../../components/order/OrderSuccessScreen";

export default function OrderSuccess() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <OrderSuccessScreen
      orderId={orderId}
      onContinueShopping={() => router.replace("/(tabs)")}
      onTrackOrder={() => router.push(`/track-order?orderId=${orderId}`)}
    />
  );
}

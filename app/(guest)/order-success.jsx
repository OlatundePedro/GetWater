import { useLocalSearchParams, useRouter } from "expo-router";
import OrderSuccessScreen from "../../components/order/OrderSuccessScreen";

export default function GuestOrderSuccess() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <OrderSuccessScreen
      orderId={orderId}
      onContinueShopping={() => router.replace("/(guest)")}
      onTrackOrder={() => router.push(`/track-order?orderId=${orderId}`)}
    />
  );
}

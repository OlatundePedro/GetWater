import { useLocalSearchParams, useRouter } from "expo-router";
import TrackOrderScreen from "../components/order/TrackOrderScreen";

export default function TrackOrder() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  return <TrackOrderScreen orderId={orderId} onClose={() => router.back()} />;
}

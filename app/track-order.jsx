import { useLocalSearchParams, useRouter } from "expo-router";
import TrackOrderScreen from "../components/order/TrackOrderScreen";

export default function TrackOrder() {
  const router = useRouter();
  const { address, orderId } = useLocalSearchParams();

  return <TrackOrderScreen toAddress={address} onClose={() => router.back()} />;
}

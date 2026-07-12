import { useRouter } from "expo-router";
import CheckoutScreen from "../../components/checkout/CheckoutScreen";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useProfile } from "../../context/ProfileContext";
import { paymentMethods } from "../../data/paymentMethods";
import { generateOrderId } from "../../utils/generateOrderId"; // NEW

const DELIVERY_FEE = 10;

// Placeholder — replace with the user's real saved address (e.g. from Supabase)
const address = {
  name: "Pedro Olatunde",
  line1: "7, Jobak Estate, Pen-Cinema, Agege",
  city: "Lagos",
  Country: "Nigeria",
  phone: "08021326598",
};

export default function Checkout() {
  const router = useRouter();
  const { total, clearCart } = useCart();
  const { profile } = useProfile();
  const { user } = useAuth();

  const address = {
    name: profile?.full_name || "Your Name",
    line1: profile?.address || "Add a delivery address in Profile",
    city: "", // combine into `address` field in Profile if you'd rather split it
    phone: profile?.phone || "Add a phone number in Profile",
  };

  const handlePlaceOrder = (orderDetails) => {
    console.log("Placing order:", orderDetails);
    // TODO: save order + orderDetails to Supabase, charge payment, etc.

    const orderId = generateOrderId(); // NEW
    clearCart();
    router.replace(`/order-success?orderId=${orderId}`); // CHANGED — was Alert + router.replace("/")
  };

  return (
    <CheckoutScreen
      address={address}
      paymentMethods={paymentMethods}
      subtotal={total}
      deliveryFee={DELIVERY_FEE}
      onBack={() => router.back()}
      onChangeAddress={() => router.push("/(tabs)/profile")}
      onAddCard={() => router.push("/payment/add-address")}
      onPlaceOrder={handlePlaceOrder}
    />
  );
}

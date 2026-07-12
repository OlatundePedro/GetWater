import { useRouter } from "expo-router";
import CheckoutScreen from "../../components/checkout/CheckoutScreen";
import { useCart } from "../../context/CartContext";
import { paymentMethods } from "../../data/paymentMethods";
import { generateOrderId } from "../../utils/generateOrderId"; // NEW

const DELIVERY_FEE = 10;

const address = {
  name: "Guest",
  line1: "Add a delivery address",
  city: "",
  phone: "",
};

export default function GuestCheckout() {
  const router = useRouter();
  const { total, clearCart } = useCart();

  const handlePlaceOrder = (orderDetails) => {
    console.log("Placing order:", orderDetails);

    const orderId = generateOrderId();
    clearCart();
    router.replace(`/order-success?orderId=${orderId}`);
  };

  return (
    <CheckoutScreen
      address={address}
      paymentMethods={paymentMethods}
      subtotal={total}
      deliveryFee={DELIVERY_FEE}
      onBack={() => router.back()}
      onChangeAddress={() => router.push("/login")}
      onAddCard={() => router.push("/login")}
      onPlaceOrder={handlePlaceOrder}
    />
  );
}

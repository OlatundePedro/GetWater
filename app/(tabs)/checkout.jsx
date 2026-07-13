import { useRouter } from "expo-router";
import { PayWithFlutterwave } from "flutterwave-react-native";
import { useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import CheckoutScreen from "../../components/checkout/CheckoutScreen";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useProfile } from "../../context/ProfileContext";
import { paymentMethods } from "../../data/paymentMethods";
import { generateOrderId } from "../../utils/generateOrderId";

const DELIVERY_FEE = 10;

export default function Checkout() {
  const router = useRouter();
  const { total, clearCart } = useCart();
  const { profile } = useProfile();
  const { user } = useAuth();

  const orderDetailsRef = useRef(null);

  const address = {
    name: profile?.full_name || "Your Name",
    line1: profile?.address || "Add a delivery address in Profile",
    city: "",
    phone: profile?.phone || "Add a phone number in Profile",
  };

  const handleRedirect = (data) => {
    if (data.status === "successful" || data.status === "completed") {
      console.log("Payment successful:", data, orderDetailsRef.current);

      const orderId = generateOrderId();
      clearCart();
      router.replace(`/order-success?orderId=${orderId}`);
    } else {
      Alert.alert("Payment cancelled", "Your payment was not completed.");
    }
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
      renderFooterButton={(orderDetails) => {
        orderDetailsRef.current = orderDetails; // keep latest snapshot for handleRedirect

        return (
          <PayWithFlutterwave
            style={styles.payButtonWrapper}
            onRedirect={handleRedirect}
            options={{
              tx_ref: `getwater-${Date.now()}`,
              authorization: process.env.EXPO_PUBLIC_FLW_PUBLIC_KEY,
              amount: orderDetails.total, // already includes delivery fee
              currency: "NGN",
              payment_options: "card,mobilemoney,ussd",
              customer: {
                email: user?.email || "guest@getwater.com",
                phone_number: address.phone,
                name: address.name,
              },
              customizations: {
                title: "GetWater",
                description: "Payment for items in cart",
                logo: "https://your-logo-url.com/logo.png",
              },
            }}
            customButton={(props) => (
              <TouchableOpacity
                style={[
                  styles.payButton,
                  props.disabled && styles.payButtonDisabled,
                ]}
                onPress={props.onPress}
                disabled={props.disabled}
              >
                {props.isInitializing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.payButtonText}>
                    Pay ₦{orderDetails.total}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  payButtonWrapper: {
    backgroundColor: "transparent",
  },
  payButton: {
    backgroundColor: "#3FBDF1",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    borderRadius: 8,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-Medium",
    fontSize: 16,
  },
});

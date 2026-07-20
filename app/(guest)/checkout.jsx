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
import { supabase } from "../../config/supabase"; // same client useOrder.js points to
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useProfile } from "../../context/ProfileContext";
import { paymentMethods } from "../../data/paymentMethods";

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

  const handleRedirect = async (data) => {
    if (data.status !== "successful" && data.status !== "completed") {
      Alert.alert("Payment cancelled", "Your payment was not completed.");
      return;
    }

    try {
      const deliveryAddress = [address.line1, address.city]
        .filter(Boolean)
        .join(", ");

      // this is the write that makes TrackOrderScreen work — it creates the
      // row useOrder(orderId) fetches and subscribes to
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          delivery_address: deliveryAddress,
          status: "order_made",
        })
        .select()
        .single();

      if (error) throw error;

      console.log(
        "Payment successful, order created:",
        order,
        orderDetailsRef.current,
      );

      clearCart();
      router.replace(`/order-success?orderId=${order.id}`);
    } catch (err) {
      console.error("Failed to create order after payment:", err);
      Alert.alert(
        "Payment received",
        "Your payment went through, but we couldn't save your order. Please contact support with your payment reference.",
      );
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
                logo: "https://doiiiebyybbmnxksgnkf.supabase.co/storage/v1/object/public/app-icon/icon.png",
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
    backgroundColor: "#12a5e4",
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

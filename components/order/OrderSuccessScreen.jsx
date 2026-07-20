import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useOrder } from "../../hooks/useOrder";

export default function OrderSuccessScreen({ orderId, onContinueShopping }) {
  const { colors } = useTheme();
  const router = useRouter();
  const { order } = useOrder(orderId);

  const handleTrackOrder = () => {
    router.push({
      pathname: "/track-order",
      params: { orderId },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.orderIdText, { color: colors.textMuted }]}>
          Order Id: {order?.order_code || "..."}
        </Text>

        <Image
          source={require("../../assets/images/box.png")}
          style={styles.boxImage}
          resizeMode="contain"
        />

        <Text style={[styles.title, { color: colors.text }]}>
          Order Successful
        </Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          Thank you for allowing us go this journey with {"\n"}you, We hope you
          experience crystal-clear {"\n"}purity in every refreshing sip you take
        </Text>

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={onContinueShopping}
        >
          <Text style={styles.continueText}>Continue shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTrackOrder}>
          <Text style={[styles.trackText, { color: colors.text }]}>
            Track Order
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  orderIdText: {
    fontSize: 22,
    marginBottom: 24,
  },
  boxImage: {
    width: 260,
    height: 220,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    fontFamily: "GoogleSansFlex-Bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 36,
    fontFamily: "GoogleSansFlex-Regular",
  },
  continueButton: {
    paddingVertical: 18,
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: 18,
  },
  continueText: {
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-Bold",
    fontSize: 16,
  },
  trackText: {
    fontSize: 16,
    fontFamily: "GoogleSansFlex-SemiBold",
  },
});

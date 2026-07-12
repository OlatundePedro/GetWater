import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import CartItem from "./CartItem";

export default function CartScreen({
  items,
  total,
  onBack,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>Cart</Text>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={48} color={colors.textFaint} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Your cart is empty
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onIncrease={() => onIncrease(item.id)}
              onDecrease={() => onDecrease(item.id)}
              onRemove={() => onRemove(item.id)}
            />
          )}
        />
      )}

      {items.length > 0 && (
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View>
            <Text style={[styles.totalLabel, { color: colors.textFaint }]}>
              TOTAL
            </Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              ₦{total}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
            onPress={onCheckout}
          >
            <Text style={styles.checkoutText}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "GoogleSansFlex-Bold",
  },
  list: {
    paddingHorizontal: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
  },
  totalValue: {
    fontSize: 18,
    fontFamily: "GoogleSansFlex-Bold",
  },
  checkoutButton: {
    paddingVertical: 18,
    paddingHorizontal: 50,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-Bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});

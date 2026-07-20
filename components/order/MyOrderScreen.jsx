import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useMyOrders } from "../../hooks/useMyOrders";

const STATUS_LABELS = {
  order_made: "Order Made",
  packaged: "Packaged",
  in_transit: "Out for Delivery",
  delivered: "Delivered",
};

function OrderRow({ order, colors, onPress }) {
  const isDelivered = order.status === "delivered";

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.orderId, { color: colors.textMuted }]}>
          #{order.id.slice(0, 8)}
        </Text>
        <Text
          style={[styles.address, { color: colors.text }]}
          numberOfLines={1}
        >
          {order.delivery_address || "No address on file"}
        </Text>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isDelivered ? colors.primary : colors.border,
              alignSelf: "flex-start",
            },
          ]}
        >
          <Text
            style={[
              styles.statusPillText,
              { color: isDelivered ? "#FFFFFF" : colors.text },
            ]}
          >
            {STATUS_LABELS[order.status] || order.status}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textFaint} />
    </TouchableOpacity>
  );
}

export default function MyOrdersScreen({ onBack }) {
  const { colors } = useTheme();
  const router = useRouter();
  const { orders, loading, error, refresh } = useMyOrders();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const openOrder = (order) => {
    router.push({
      pathname: "/track-order",
      params: { orderId: order.id },
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>My Orders</Text>
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          Couldn't load your orders. Pull down to retry.
        </Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              You haven't placed any orders yet.
            </Text>
          }
          renderItem={({ item }) => (
            <OrderRow
              order={item}
              colors={colors}
              onPress={() => openOrder(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "GoogleSansFlex-Bold",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontFamily: "GoogleSansFlex-Regular",
    paddingHorizontal: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  orderId: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Medium",
    marginBottom: 4,
  },
  address: {
    fontSize: 15,
    fontFamily: "GoogleSansFlex-SemiBold",
    marginBottom: 8,
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: "GoogleSansFlex-SemiBold",
  },
});

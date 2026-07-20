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
import { NEXT_STATUS, useAdminOrders } from "../../hooks/useAdminOrders";

const STATUS_LABELS = {
  order_made: "Order Made",
  packaged: "Packaged",
  in_transit: "Out for Delivery",
  delivered: "Delivered",
};

const NEXT_ACTION_LABELS = {
  order_made: "Mark as Packaged",
  packaged: "Mark as Out for Delivery",
  in_transit: "Mark as Delivered",
};

function OrderCard({ order, onAdvance, updating, colors }) {
  const nextStatus = NEXT_STATUS[order.status];

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.orderId, { color: colors.textMuted }]}>
          #{order.id.slice(0, 8)}
        </Text>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor:
                order.status === "delivered" ? colors.primary : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.statusPillText,
              {
                color: order.status === "delivered" ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            {STATUS_LABELS[order.status] || order.status}
          </Text>
        </View>
      </View>

      <Text style={[styles.address, { color: colors.text }]} numberOfLines={2}>
        {order.delivery_address || "No address on file"}
      </Text>

      {nextStatus ? (
        <TouchableOpacity
          style={[styles.advanceButton, { backgroundColor: colors.primary }]}
          onPress={() => onAdvance(order)}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.advanceButtonText}>
              {NEXT_ACTION_LABELS[order.status]}
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={[styles.doneRow]}>
          <Text style={[styles.doneText, { color: colors.textFaint }]}>
            Delivered — no further action
          </Text>
        </View>
      )}
    </View>
  );
}

export default function AdminOrdersScreen() {
  const { colors } = useTheme();
  const { orders, loading, error, updatingId, advanceStatus, refresh } =
    useAdminOrders();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleAdvance = async (order) => {
    try {
      await advanceStatus(order);
    } catch (e) {
      console.warn("Failed to advance order status:", e.message);
    }
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

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text }}>
          Couldn't load orders. Pull down to retry.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.primary }]}>Orders</Text>

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
            No orders yet.
          </Text>
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onAdvance={handleAdvance}
            updating={updatingId === item.id}
            colors={colors}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 22,
    fontFamily: "GoogleSansFlex-Bold",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 16,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontFamily: "GoogleSansFlex-Regular",
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderId: {
    fontSize: 13,
    fontFamily: "GoogleSansFlex-Medium",
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-SemiBold",
  },
  address: {
    fontSize: 15,
    fontFamily: "GoogleSansFlex-Regular",
    marginBottom: 14,
    lineHeight: 20,
  },
  advanceButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  advanceButtonText: {
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-SemiBold",
    fontSize: 14,
  },
  doneRow: {
    paddingVertical: 8,
  },
  doneText: {
    fontSize: 13,
    fontFamily: "GoogleSansFlex-Regular",
    fontStyle: "italic",
  },
});

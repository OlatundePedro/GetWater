import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useOrder } from "../../hooks/useOrder";

const STEPS = [
  {
    key: "order_made",
    icon: "lock-closed-outline",
    title: "Order Made",
    subtitle: "Your order has been confirmed",
  },
  {
    key: "packaged",
    icon: "cube-outline",
    title: "Packaged & Labelled",
    subtitle: "Your goods have been packaged and sent to delivery",
  },
  {
    key: "in_transit",
    icon: "car-outline",
    title: "Out for Delivery",
    subtitle: "Your order is on its way",
  },
  {
    key: "delivered",
    icon: "location-outline",
    title: "My Location",
    subtitle: "Destination",
  },
];

export default function TrackOrderScreen({ orderId, onClose }) {
  const { colors } = useTheme();
  const { order, loading, error, saving, currentStepIndex, updateAddress } =
    useOrder(orderId);

  const [editing, setEditing] = useState(false);
  const [draftAddress, setDraftAddress] = useState("");

  const startEditing = () => {
    setDraftAddress(order?.delivery_address || "");
    setEditing(true);
  };

  const cancelEditing = () => setEditing(false);

  const saveAddress = async () => {
    const trimmed = draftAddress.trim();
    if (!trimmed) return;
    try {
      await updateAddress(trimmed);
      setEditing(false);
    } catch (e) {
      // swap for your toast/alert pattern
      console.warn("Failed to update delivery address:", e.message);
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

  if (error || !order) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text }}>Couldn't load this order.</Text>
        <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.primary }}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          Track Order
        </Text>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.routeCard, { backgroundColor: colors.card }]}>
          <View style={styles.routeRow}>
            <View style={styles.routeDots}>
              <View
                style={[styles.dot, { backgroundColor: colors.textMuted }]}
              />
              <View
                style={[styles.dotLine, { backgroundColor: colors.border }]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.routeLabel, { color: colors.textFaint }]}>
                From
              </Text>
              <Text style={[styles.routeValue, { color: colors.text }]}>
                {order.from_label || "Get Water"}
              </Text>
            </View>
          </View>

          <View
            style={[styles.routeDivider, { backgroundColor: colors.border }]}
          />

          <View style={styles.routeRow}>
            <View style={styles.routeDots}>
              <View
                style={[styles.dot, { backgroundColor: colors.textMuted }]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.toHeaderRow}>
                <Text style={[styles.routeLabel, { color: colors.textFaint }]}>
                  To
                </Text>
                {!editing && (
                  <TouchableOpacity onPress={startEditing} hitSlop={8}>
                    <Text style={[styles.editLink, { color: colors.primary }]}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {editing ? (
                <View>
                  <TextInput
                    value={draftAddress}
                    onChangeText={setDraftAddress}
                    placeholder="Enter delivery address"
                    placeholderTextColor={colors.textFaint}
                    style={[
                      styles.addressInput,
                      {
                        color: colors.text,
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                    multiline
                    autoFocus
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity
                      onPress={cancelEditing}
                      style={styles.editActionBtn}
                    >
                      <Text style={{ color: colors.textMuted }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={saveAddress}
                      disabled={saving}
                      style={styles.editActionBtn}
                    >
                      {saving ? (
                        <ActivityIndicator
                          color={colors.primary}
                          size="small"
                        />
                      ) : (
                        <Text
                          style={{ color: colors.primary, fontWeight: "700" }}
                        >
                          Save
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text style={[styles.routeValue, { color: colors.text }]}>
                  {order.delivery_address || "Add a delivery address"}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={[styles.etaCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.etaLabel}>Estimated Time of Delivery</Text>
          <Text style={styles.etaValue}>{order.eta_label || "4 days"}</Text>
        </View>

        <View style={styles.timeline}>
          {STEPS.map((step, index) => {
            const completed = index <= currentStepIndex;
            const isLast = index === STEPS.length - 1;

            return (
              <View key={step.key} style={styles.timelineRow}>
                <View style={styles.timelineIconColumn}>
                  <Ionicons
                    name={step.icon}
                    size={22}
                    color={completed ? colors.primary : colors.textFaint}
                  />
                </View>

                <View style={styles.timelineLineColumn}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: completed
                          ? colors.primary
                          : colors.border,
                        borderColor: completed ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    {completed && (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineConnector,
                        {
                          backgroundColor:
                            index < currentStepIndex
                              ? colors.primary
                              : colors.border,
                        },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineTextColumn}>
                  <Text style={[styles.timelineTitle, { color: colors.text }]}>
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.timelineSubtitle,
                      { color: colors.textMuted },
                    ]}
                  >
                    {step.subtitle}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "GoogleSansFlex-Bold",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  routeCard: {
    borderRadius: 8,
    padding: 20,
  },
  routeRow: {
    flexDirection: "row",
    gap: 14,
  },
  routeDots: {
    alignItems: "center",
    width: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  routeLabel: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Regular",
    marginBottom: 4,
  },
  routeValue: {
    fontSize: 17,
    fontFamily: "GoogleSansFlex-Bold",
  },
  routeDivider: {
    height: 1,
    marginVertical: 14,
  },
  toHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editLink: {
    fontSize: 13,
    fontFamily: "GoogleSansFlex-SemiBold",
  },
  addressInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    fontFamily: "GoogleSansFlex-Regular",
    minHeight: 44,
    marginTop: 4,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 18,
    marginTop: 8,
  },
  editActionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  etaCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 22,
    marginTop: 20,
  },
  etaLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "GoogleSansFlex-Bold",
  },
  etaValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "GoogleSansFlex-Bold",
  },
  timeline: {
    marginTop: 32,
  },
  timelineRow: {
    flexDirection: "row",
    gap: 16,
  },
  timelineIconColumn: {
    width: 24,
    alignItems: "center",
    paddingTop: 2,
  },
  timelineLineColumn: {
    alignItems: "center",
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineConnector: {
    width: 3,
    flex: 1,
    minHeight: 50,
  },
  timelineTextColumn: {
    flex: 1,
    paddingBottom: 30,
  },
  timelineTitle: {
    fontSize: 17,
    fontFamily: "GoogleSansFlex-SemiBold",
    marginBottom: 4,
  },
  timelineSubtitle: {
    fontSize: 13,
    fontFamily: "GoogleSansFlex-Regular",
  },
});

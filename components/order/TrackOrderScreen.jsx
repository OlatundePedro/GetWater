import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

const STEPS = [
  {
    key: "order_made",
    icon: "lock-closed-outline",
    title: "Order Successful",
    subtitle: "Your order has been confirmed",
  },
  {
    key: "packaged",
    icon: "cube-outline",
    title: "Packaged & Sent out",
    subtitle: "Your goods have been packaged \nand sent to delivery",
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

export default function TrackOrderScreen({
  fromLabel = "Get Water Warehouse",
  toAddress,
  etaLabel = "4 days",
  currentStepIndex = 1, // 0-based index of the last completed step
  onClose,
}) {
  const { colors } = useTheme();

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
                {fromLabel}
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
              <Text style={[styles.routeLabel, { color: colors.textFaint }]}>
                To
              </Text>
              <Text style={[styles.routeValue, { color: colors.text }]}>
                {toAddress || "Delivery address"}
              </Text>
            </View>
          </View>
        </View>

        {/* Uses colors.primary (same brand blue in both themes) instead of
            colors.text as background, so the white label/value never goes
            invisible in dark mode. */}
        <View style={[styles.etaCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.etaLabel}>Estimated Time of Delivery</Text>
          <Text style={styles.etaValue}>{etaLabel}</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 15,
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
    borderRadius: 14,
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
    fontFamily: "GoogleSansFlex-Semi-Bold",
    marginBottom: 4,
  },
  routeValue: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
  },
  routeDivider: {
    height: 1,
    marginVertical: 14,
  },
  etaCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 22,
    marginTop: 20,
  },
  etaLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
  },
  etaValue: {
    color: "#FFFFFF",
    fontSize: 15,
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
    fontSize: 15,
    fontFamily: "GoogleSansFlex-SemiBold",
    marginBottom: 4,
  },
  timelineSubtitle: {
    fontSize: 13,
    fontFamily: "GoogleSansFlex-Regular",
  },
});

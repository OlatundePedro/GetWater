import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import CalendarPicker from "./CalenderPicker";
import DeliveryOptionCard from "./DeliveryOptionCard";
import PaymentCarousel from "./PaymentCarousel";

const TIME_SLOTS = ["13:00", "15:45", "18:50"];

export default function CheckoutScreen({
  address: initialAddress,
  paymentMethods: initialPaymentMethods,
  subtotal,
  deliveryFee,
  onBack,
  onChangeAddress,
  onAddCard,
  renderFooterButton, // NEW — replaces onPlaceOrder
}) {
  const { colors } = useTheme();
  const [address, setAddress] = useState(initialAddress);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);

  const [deliveryType, setDeliveryType] = useState("standard"); // "standard" | "scheduled"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [selectedCardId, setSelectedCardId] = useState(paymentMethods[0]?.id);

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState(initialAddress);

  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardDraft, setCardDraft] = useState({
    name: "",
    number: "",
    expiry: "",
  });

  const total = subtotal + deliveryFee;

  const openAddressModal = () => {
    setAddressDraft(address);
    setAddressModalOpen(true);
  };

  const saveAddress = () => {
    setAddress(addressDraft);
    setAddressModalOpen(false);
    onChangeAddress?.(addressDraft);
  };

  const openCardModal = () => {
    setCardDraft({ name: "", number: "", expiry: "" });
    setCardModalOpen(true);
  };

  const saveCard = () => {
    if (!cardDraft.number.trim()) return;

    const newCard = {
      id: `card-${Date.now()}`,
      name: cardDraft.name,
      last4: cardDraft.number.slice(-4),
      expiry: cardDraft.expiry,
    };

    setPaymentMethods((prev) => [...prev, newCard]);
    setSelectedCardId(newCard.id);
    setCardModalOpen(false);
    onAddCard?.(newCard);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>
            Checkout
          </Text>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.addressRow}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            Delivery Address
          </Text>
          <TouchableOpacity onPress={openAddressModal}>
            <Text style={[styles.changeLink, { color: colors.text }]}>
              Change
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.addressName, { color: colors.text }]}>
          {address.name}
        </Text>
        <Text style={[styles.addressLine, { color: colors.text }]}>
          {address.line1}
        </Text>
        <Text style={[styles.addressLine, { color: colors.text }]}>
          {address.city}.
        </Text>
        <Text style={[styles.addressPhone, { color: colors.text }]}>
          {address.phone}
        </Text>

        <View style={styles.deliveryOptionsRow}>
          <DeliveryOptionCard
            title="Standard"
            subtitle="10-20 Min"
            selected={deliveryType === "standard"}
            onPress={() => setDeliveryType("standard")}
          />
          <DeliveryOptionCard
            title="Schedule Ahead"
            subtitle="Choose Your Time"
            selected={deliveryType === "scheduled"}
            onPress={() => setDeliveryType("scheduled")}
          />
        </View>

        {deliveryType === "scheduled" && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              Date
            </Text>
            <CalendarPicker
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <Text
              style={[
                styles.sectionLabel,
                { color: colors.text, marginTop: 24 },
              ]}
            >
              Time
            </Text>
            <View style={styles.timeRow}>
              {TIME_SLOTS.map((slot) => {
                const isActive = slot === selectedTime;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeChip,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : colors.card,
                      },
                    ]}
                    onPress={() => setSelectedTime(slot)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        { color: isActive ? "#FFFFFF" : colors.text },
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.paymentHeader}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            Payment
          </Text>
          <TouchableOpacity
            style={styles.addCardButton}
            onPress={openCardModal}
          >
            <Ionicons name="add" size={18} color={colors.text} />
            <Text style={[styles.addCardText, { color: colors.text }]}>
              Add New Card
            </Text>
          </TouchableOpacity>
        </View>

        <PaymentCarousel
          cards={paymentMethods}
          selectedId={selectedCardId}
          onSelect={setSelectedCardId}
        />

        <View style={[styles.summary, { borderTopColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textFaint }]}>
              Sub Total
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ₦{subtotal}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textFaint }]}>
              Delivery fee
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ₦{deliveryFee}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text
              style={[styles.summaryLabelBold, { color: colors.textMuted }]}
            >
              Total
            </Text>
            <Text style={[styles.summaryValueBold, { color: colors.text }]}>
              ₦{total}
            </Text>
          </View>
        </View>

        {renderFooterButton?.({
          deliveryType,
          date: deliveryType === "scheduled" ? selectedDate : null,
          time: deliveryType === "scheduled" ? selectedTime : null,
          cardId: selectedCardId,
          total,
        })}
      </ScrollView>

      <Modal
        visible={addressModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAddressModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Address
            </Text>

            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Full name"
              placeholderTextColor={colors.textFaint}
              value={addressDraft.name}
              onChangeText={(text) =>
                setAddressDraft((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Address line"
              placeholderTextColor={colors.textFaint}
              value={addressDraft.line1}
              onChangeText={(text) =>
                setAddressDraft((prev) => ({ ...prev, line1: text }))
              }
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, color: colors.text },
              ]}
              placeholder="City"
              placeholderTextColor={colors.textFaint}
              value={addressDraft.city}
              onChangeText={(text) =>
                setAddressDraft((prev) => ({ ...prev, city: text }))
              }
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Phone"
              placeholderTextColor={colors.textFaint}
              keyboardType="phone-pad"
              value={addressDraft.phone}
              onChangeText={(text) =>
                setAddressDraft((prev) => ({ ...prev, phone: text }))
              }
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  { backgroundColor: colors.border },
                ]}
                onPress={() => setAddressModalOpen(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSaveButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={saveAddress}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={cardModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCardModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add New Card
            </Text>

            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Name on card"
              placeholderTextColor={colors.textFaint}
              value={cardDraft.name}
              onChangeText={(text) =>
                setCardDraft((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Card number"
              placeholderTextColor={colors.textFaint}
              keyboardType="number-pad"
              value={cardDraft.number}
              onChangeText={(text) =>
                setCardDraft((prev) => ({ ...prev, number: text }))
              }
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, color: colors.text },
              ]}
              placeholder="MM/YY"
              placeholderTextColor={colors.textFaint}
              value={cardDraft.expiry}
              onChangeText={(text) =>
                setCardDraft((prev) => ({ ...prev, expiry: text }))
              }
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  { backgroundColor: colors.border },
                ]}
                onPress={() => setCardModalOpen(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSaveButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={saveCard}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: "GoogleSansFlex-Bold",
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
  },
  changeLink: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Medium",
    textDecorationLine: "underline",
  },
  addressName: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
    marginTop: 10,
  },
  addressLine: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: "GoogleSansFlex-Regular",
  },
  addressPhone: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Bold",
    marginTop: 10,
  },
  deliveryOptionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  timeChip: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Medium",
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addCardText: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-Bold",
  },
  summary: {
    marginTop: 28,
    borderTopWidth: 1,
    paddingTop: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
  },
  summaryValue: {
    fontSize: 17,
    fontFamily: "GoogleSansFlex-Medium",
  },
  summaryLabelBold: {
    fontSize: 16,
    fontFamily: "GoogleSansFlex-Bold",
  },
  summaryValueBold: {
    fontSize: 17,
    fontFamily: "GoogleSansFlex-Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "GoogleSansFlex-Bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
    marginBottom: 12,
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelText: {
    fontFamily: "GoogleSansFlex-Medium",
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  modalSaveText: {
    fontFamily: "GoogleSansFlex-Medium",
    color: "#FFFFFF",
  },
});

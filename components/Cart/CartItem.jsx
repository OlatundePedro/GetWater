import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      {item.product.image_url ? (
        <Image
          source={{ uri: item.product.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, { backgroundColor: colors.border }]} />
      )}

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: colors.text }]}>
            {item.product.name}
          </Text>
          <Text style={[styles.size, { color: colors.textMuted }]}>
            {item.size}
          </Text>
        </View>

        <Text style={[styles.price, { color: colors.primary }]}>
          ₦{item.product.price}
        </Text>

        <View style={styles.controlsRow}>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.card }]}
              onPress={onDecrease}
            >
              <Text style={[styles.quantitySign, { color: colors.text }]}>
                -
              </Text>
            </TouchableOpacity>
            <Text style={[styles.quantityValue, { color: colors.text }]}>
              {item.quantity}
            </Text>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.card }]}
              onPress={onIncrease}
            >
              <Text style={[styles.quantitySign, { color: colors.text }]}>
                +
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.card }]}
            onPress={onRemove}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  image: {
    width: 100,
    height: 110,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 17,
    fontFamily: "GoogleSansFlex-Bold",
    flexShrink: 1,
  },
  size: {
    fontSize: 15,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  quantitySign: {
    fontSize: 16,
    fontWeight: "700",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

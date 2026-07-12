import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.79;
const CARD_SPACING = 14;

const CARD_LOGOS = {
  visa: require("../../assets/images/visa.png"),
  mastercard: require("../../assets/images/masterdcard.png"),
  verve: require("../../assets/images/Verve.png"),
};

export default function PaymentCarousel({ cards, selectedId, onSelect }) {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING),
    );
    setActiveIndex(index);
    if (cards[index]) onSelect(cards[index].id);
  };

  return (
    <View>
      <FlatList
        ref={listRef}
        data={cards}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH) / -3 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          const logo = CARD_LOGOS[item.brand?.toLowerCase()];

          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: item.color,
                  marginRight: CARD_SPACING,
                  width: CARD_WIDTH,
                },
              ]}
            >
              <View style={styles.numberRow}>
                <Text style={styles.dots}>•••• •••• ••••</Text>
                <Text style={styles.last4}>{item.last4}</Text>
              </View>

              <View style={styles.bottomRow}>
                <View>
                  <Text style={styles.label}>Card Holder</Text>
                  <Text style={styles.value}>{item.holder}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Expires</Text>
                  <Text style={styles.value}>{item.expiry}</Text>
                </View>
              </View>

              {logo ? (
                <Image
                  source={logo}
                  style={styles.brandLogo}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.brand}>{item.brand}</Text>
              )}
            </View>
          );
        }}
      />

      <View style={styles.dotsRow}>
        {cards.map((_, i) => (
          <View
            key={i}
            style={[
              styles.pageDot,
              { backgroundColor: colors.border },
              i === activeIndex && { backgroundColor: colors.primary },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 20,
    height: 180,
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  brand: {
    position: "absolute",
    right: 20,
    bottom: 16,
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 30,
    fontStyle: "italic",
    fontFamily: "GoogleSansFlex-Bold",
  },
  brandLogo: {
    position: "absolute",
    right: -25,
    bottom: -33,
    width: 160,
    height: 140,
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  dots: {
    color: "#FFFFFF",
    fontSize: 22,
    letterSpacing: 5,
    marginTop: 35,
  },
  last4: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "GoogleSansFlex-Regular",
    marginTop: 28,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 90,
  },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontFamily: "GoogleSansFlex-Regular",
  },
  value: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "GoogleSansFlex-Regular",
    marginTop: 2,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
    gap: 7,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

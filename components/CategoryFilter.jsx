import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function CategoryFilter({ types, selected, onSelect }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {types.map((type) => {
        const isActive = type === selected;
        return (
          <TouchableOpacity
            key={type}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.card,
              },
            ]}
            onPress={() => onSelect(type)}
          >
            <Text
              style={[
                styles.chipText,
                { color: isActive ? "#FFFFFF" : colors.textMuted },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    flex: 1, // ← evenly divides available width
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center", // center the text since padding is no longer manual
  },
  chipText: {
    fontFamily: "GoogleSansFlex-Regular",
    fontSize: 11,
  },
});

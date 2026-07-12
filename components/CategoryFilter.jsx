import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function CategoryFilter({ types, selected, onSelect }) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
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
            >
              {type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 20,
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 6,
    marginRight: 0,
  },
  chipText: {
    fontFamily: "GoogleSansFlex-Regular",
    fontSize: 11,
  },
});

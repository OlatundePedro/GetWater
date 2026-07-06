import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CategoryFilter({ types, selected, onSelect }) {
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
              isActive ? styles.activeChip : styles.inactiveChip,
            ]}
            onPress={() => onSelect(type)}
          >
            <Text
              style={[
                styles.chipText,
                isActive ? styles.activeText : styles.inactiveText,
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
    paddingHorizontal: 31,
    borderRadius: 6,
    marginRight: 0,
  },
  activeChip: {
    backgroundColor: "#1F2937",
  },
  inactiveChip: {
    backgroundColor: "#9CA3AF",
  },
  chipText: {
    fontFamily: "GoogleSansFlex-Regular",
    fontSize: 9,
  },
  activeText: {
    color: "#FFFFFF",
  },
  inactiveText: {
    color: "#FFFFFF",
  },
});

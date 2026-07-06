import { StyleSheet, View } from "react-native";

export default function PaginationDots({ total, current }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === current ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
    marginTop: 15,
  },
  activeDot: {
    width: 28,
    backgroundColor: "#5DCCFC",
  },
  inactiveDot: {
    width: 10,
    backgroundColor: "#E5E7EB",
  },
});

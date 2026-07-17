import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PromoBanner({ onPress }) {
  return (
    <ImageBackground
      source={require("../assets/images/Mask.png")}
      style={styles.banner}
      imageStyle={styles.bannerImage}
    >
      <View style={styles.overlay} />
      <Text style={styles.title}>Get Springs</Text>
      <Text style={styles.subtitle}>Bottle water delivery</Text>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Quick Shop</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 160,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  bannerImage: {
    borderRadius: 14,
    width: "135%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "GoogleSansFlex-ExtraBold",
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 10,
    marginTop: 4,
    marginBottom: 18,
    fontFamily: "GoogleSansFlex-Regular",
  },
  button: {
    backgroundColor: "#FFC33A",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "flex-end",
    height: 30,
    width: 90,
  },
  buttonText: {
    fontWeight: "600",
    color: "#000000",
    fontSize: 9,
    fontFamily: "GoogleSansFlex-Regular",
  },
});

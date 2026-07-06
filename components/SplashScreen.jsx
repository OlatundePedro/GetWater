import { StatusBar, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5DCCFC" />

      <View style={styles.content}>
        <View style={styles.dropWrapper}>
          <Svg
            width={90}
            height={110}
            viewBox="0 0 90 110"
            style={styles.smallDrop}
          >
            <Path
              d="M45 0 C45 0 85 45 85 72 C85 93 67 110 45 110 C23 110 5 93 5 72 C5 45 45 0 45 0 Z"
              fill="#FFFFFF"
            />
          </Svg>

          <Svg
            width={210}
            height={255}
            viewBox="0 0 210 255"
            style={styles.largeDrop}
          >
            <Path
              d="M105 0 C105 0 200 105 200 168 C200 217 157 255 105 255 C53 255 10 217 10 168 C10 105 105 0 105 0 Z"
              fill="#FFFFFF"
            />
          </Svg>
        </View>

        <Text style={styles.title}>Get Water</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5DCCFC",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  dropWrapper: {
    width: 210,
    height: 255,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  largeDrop: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  smallDrop: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontFamily: "GoogleSansFlex-Bold",
    letterSpacing: 0.5,
  },
});

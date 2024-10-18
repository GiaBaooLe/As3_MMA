import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const Header = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require("../image/b.jpeg")} />
      <Text style={styles.text}>Art Tools</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#434313",
    overlayColor: "#434313",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    position: "absolute",
    color: "white",
   fontStyle:"bold",
    zIndex: 1, 
  },
  img: {
   width: 500,
   height:130
  },
});

export default Header;

import { StyleSheet, Text, View } from "react-native";
import { VStack } from "native-base";
import React from "react";

const Header = () => {
  return (
    <VStack>
      <Text style={styles.header}>Balkrushna Technology Pvt.Ltd</Text>
    </VStack>
  );
};

export default Header;
const styles = StyleSheet.create({
  header: {
    textAlign:'center',
    borderRadius: 5,
    fontSize: 26,
    paddingVertical:10,
    backgroundColor: "white",
    color: "blue",
  },
});

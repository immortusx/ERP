import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Divider } from 'native-base';
const InnerSection = () => {
  return (
    <View style={styles.innersection}>
      <View>
        <Text style={styles.heading}>Officer Rank</Text>
      </View>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="star" size={24} color="black" />
        <MaterialCommunityIcons name="star" size={24} color="black" />
        <MaterialCommunityIcons name="star" size={24} color="black" />
      </View>
      <Divider orientation="vertical" mx="3" _light={{
        bg: "muted.800"
      }} _dark={{
        bg: "muted.50"
      }} />
      <View style={styles.textnumber}>
        <Text style={styles.number}>4.5</Text>
      </View>
    </View>
  );
};

export default InnerSection;

const styles = StyleSheet.create({
  heading: {
    paddingVertical: 10,
    color: "blue",
  },
  innersection: {
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "white",
  },
  icon: {
    marginLeft: 5,
    flexDirection: "row",
  },
  
});

import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const Section = () => {
  return (
    <View style={styles.section}>
      <View style={styles.viewstyle}>
        <View>
          <Feather style={styles.iconstyle} name="phone-call" color="black" />
        </View>
        <View style={styles.namesection}>
          <Text style={[{ color: "red" }, styles.text]}>Name</Text>
          <Text style={styles.text}>ID</Text>
          <Text style={styles.text}>Designation</Text>
        </View>
      </View>
      <View>
        <AntDesign style={styles.icon} name="sharealt" color="black" />
      </View>
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  section: {
    borderRadius: 5,
    backgroundColor: "white",
    padding: 15,
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
  },
  viewstyle: {
    alignItems: "center",
    flexDirection: "row",
  },
  namesection: {
    marginLeft: 30,
  },
  iconstyle: {
    backgroundColor: "#DDA0DD",
    borderRadius: 50,
    padding: 20,
    fontSize: 30,
  },
  text: {
    fontSize: 20,
    marginBottom: 5,
  },
  icon: {
    color: "green",
    fontSize: 30,
  },
});

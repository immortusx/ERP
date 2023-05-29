import { StyleSheet, Text,TouchableOpacity } from "react-native";
import { Octicons } from "@expo/vector-icons";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Feather} from "@expo/vector-icons";
import {Ionicons} from "@expo/vector-icons";
import {FontAwesome5} from "@expo/vector-icons";
import {MaterialIcons} from "@expo/vector-icons";
import {Entypo} from "@expo/vector-icons";
import React from "react";
import { useNavigation } from '@react-navigation/native';
import { Flex} from 'native-base';
const Content = () => {

  return (
    <Flex direction="row" flexWrap="wrap" justifyContent="center"   >
      <TouchableOpacity style={styles.icondiv}>
        <Octicons name="database" size={24} color="black" />
        <Text>Data Bank</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv} >
      <MaterialCommunityIcons name="human-white-cane" size={24} color="black" />
        <Text>Task</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <Feather name="plus-circle" size={24} color="black"/>
        <Text>Attendance</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <Feather name="arrow-up-right" size={24} color="black"/>
        <Text>Travelling</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv} >
      <Ionicons name="time-outline" size={24} color="black" />
        <Text>Over Time</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <FontAwesome5 name="wallet" size={24} color="black"/>
        <Text>Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <FontAwesome5 name="google-wallet" size={24} color="black"/>
        <Text>Payment Collection</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <MaterialCommunityIcons name="book-outline" size={24} color="black" />
        <Text>Booking/Delivery Upload</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <FontAwesome5 name="user-alt" size={24} color="black"/>
        <Text>maintenance</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <Octicons name="workflow" size={24} color="black" />
        <Text>Workshop</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv} >
      <Entypo name="flag" size={24} color="black" />
        <Text>My Inquiry</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv} >
      <Entypo name="arrow-bold-right" size={24} color="black"/>
        <Text>View Inquiry</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <FontAwesome5 name="user-edit" size={24} color="black"/>
        <Text>My Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <FontAwesome5 name="user-alt" size={24} color="black" />
        <Text>View Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <FontAwesome5 name="chevron-circle-right" size={24} color="black"/>
        <Text>Feedback/Review</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <Entypo name="bar-graph" size={24} color="black"/>
        <Text>my Score Board</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <Entypo name="bar-graph" size={24} color="black"/>
        <Text>Score Board</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="black"/>
        <Text>Delivery Report</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <Ionicons name="location-sharp" size={24} color="black"/>
        <Text>Employee Tracker</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <MaterialIcons name="meeting-room" size={24} color="black"/>
        <Text>Meeting Room</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icondiv}>
      <FontAwesome5 name="book-open" size={24} color="black"/>
        <Text>CashBook</Text>
      </TouchableOpacity>
      </Flex>
  );
};

export default Content;
const styles = StyleSheet.create({
  icondiv: {
    width: "25%",
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 8,
    margin: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

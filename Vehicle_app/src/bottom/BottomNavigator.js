import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AddEnquiry from '../components/AddEnquiry';
import AddMore from '../components/AddMore';
import AddBooking from '../components/AddBooking';
const Bottom = createBottomTabNavigator();
const BottomNavigator = () => {
  return (
    <Bottom.Navigator initialRouteName='AddMore'>
      <Bottom.Screen
        name="AddEnquiry"
        component={AddEnquiry}
        options={{
          headerShown: false,
          tabBarLabel: "Enquriy",
          tabBarIcon: () => {
            return (
              <TouchableOpacity style={[styles.button, styles.enquiryBtn]}>
                <Text style={styles.buttonText}>Add Enquiry</Text>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Bottom.Screen
        name="AddMore"
        component={AddMore}
        options={{
          headerShown: false,
          // tabBarLabel: () => null,
          tabBarIcon: () => {
            return (
              <TouchableOpacity style={[styles.button, styles.plusBtn]}>
                <Image style={styles.plusImg} source={require('../../assets/plus.png')} />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Bottom.Screen
        name="AddBooking"
        component={AddBooking}
        options={{
          headerShown: false,
          // tabBarLabel: () => null,
          tabBarIcon: () => {
            return (
              <TouchableOpacity style={[styles.button, styles.bookingBtn]}>
                <Text style={styles.buttonText}>Add Booking</Text>
              </TouchableOpacity>
            );
          },
        }}
      />
    </Bottom.Navigator>
  )
}
const styles = StyleSheet.create({
    button: {
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
      justifyContent:'space-around'
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    enquiryBtn: {
      backgroundColor: '#0D8BD8',
    },
   
    bookingBtn: {
      backgroundColor: '#0D8BD8',
    },
    plusImg: {
      width: 55
    }
  });
export default BottomNavigator
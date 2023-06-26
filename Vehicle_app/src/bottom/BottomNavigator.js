import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AddEnquiry from '../components/AddEnquiry';
import AddMore from '../components/AddMore';
import AddBooking from '../components/AddBooking';
import {useNavigation} from '@react-navigation/native';
const Bottom = createBottomTabNavigator();
const BottomNavigator = () => {
  const navigation = useNavigation();
  const handleNavigate = path => {
    navigation.navigate(path);
  };
  return (
    <Bottom.Navigator initialRouteName="AddMore">
      <Bottom.Screen
        name="AddEnquiry"
        component={AddEnquiry}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return (
              <TouchableOpacity
                style={[styles.button, styles.enquiryBtn, styles.roundedPill]}
                onPress={() => {
                  handleNavigate('AddEnquiry');
                }}>
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
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return (
              <TouchableOpacity
                style={[styles.button, styles.plusBtn, styles.roundedPill]}
                onPress={() => {
                  handleNavigate('AddMore');
                }}>
                <Image
                  style={styles.plusImg}
                  source={require('../../assets/plus.png')}
                />
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
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return (
              <TouchableOpacity
                style={[styles.button, styles.bookingBtn, styles.roundedPill]}
                onPress={() => {
                  handleNavigate('AddBooking');
                }}>
                <Text style={styles.buttonText}>Add Booking</Text>
              </TouchableOpacity>
            );
          },
        }}
      />
    </Bottom.Navigator>
  );
};
const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-around',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  enquiryBtn: {
    backgroundColor: '#000080',
  },

  bookingBtn: {
    backgroundColor: '#000080',
  },
  plusImg: {
    width: 50,
    height: 50
  },
});
export default BottomNavigator;

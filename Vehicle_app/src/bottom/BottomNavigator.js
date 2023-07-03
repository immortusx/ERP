import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';
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
    <Bottom.Navigator initialRouteName="AddMore" 
    screenOptions={{
      style: {
        height: 60
      }
    }}>
      <Bottom.Screen
        name="AddEnquiry"
        component={AddEnquiry}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  handleNavigate('AddEnquiry');
                }}>
                <View
                  style={[
                    styles.button,
                    styles.enquiryBtn,
                    styles.roundedPill,
                  ]}>
                  <Text style={styles.buttonText}>Add Enquiry</Text>
                </View>
              </TouchableWithoutFeedback>
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
              <TouchableWithoutFeedback
                onPress={() => {
                  handleNavigate('AddMore');
                }}>
                <View
                  style={[styles.button, styles.plusBtn, styles.roundedPill]}>
                  <Image
                    style={styles.plusImg}
                    source={require('../../assets/hom.png')}
                  />
                </View>
              </TouchableWithoutFeedback>
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
              <TouchableWithoutFeedback
                onPress={() => {
                  handleNavigate('AddBooking');
                }}>
                <View
                  style={[
                    styles.button,
                    styles.bookingBtn,
                    styles.roundedPill,
                  ]}>
                  <Text style={styles.buttonText}>Add Booking</Text>
                </View>
              </TouchableWithoutFeedback>
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
    fontSize: 13,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  enquiryBtn: {
    backgroundColor: '#0984DF',
  },
  bookingBtn: {
    backgroundColor: '#0984DF',
  },
  plusImg: {
    width: 51,
    height: 51,
  },
});

export default BottomNavigator;

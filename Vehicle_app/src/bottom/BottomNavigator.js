import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useSelector } from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AddEnquiry from '../components/AddEnquiry';
import AddMore from '../components/AddMore';
import AddBooking from '../components/AddBooking';
import {useNavigation} from '@react-navigation/native';
import translations from '../../assets/locals/translations';

const Bottom = createBottomTabNavigator();

const BottomNavigator = () => {
  const navigation = useNavigation();
  const currentLanguage = useSelector((state) => state.language.language);
  const handleNavigate = path => {
    navigation.navigate(path);
  };

  return (
    <Bottom.Navigator
      initialRouteName="HOME"
      tabBarStyle={styles.tabBar}
      screenOptions={({route}) => ({
        tabBarStyle: {
          height: 55,
          backgroundColor: '#2471A2',
        },
        tabBarShowLabel: false,
        tabBarLabelStyle: [styles.tabBarLabel, styles.tabBarLabelSmall],
        tabBarIcon: ({focused}) => {
          let iconName;
          if (route.name === translations[currentLanguage]?.addenq || "Add Enquiry") {
            iconName = focused
              ? require('../../assets/addEnquiry.png')
              : require('../../assets/addEnquiry.png');
          } else if (route.name === translations[currentLanguage]?.Home || "HOME") {
            iconName = focused
              ? require('../../assets/home.png')
              : require('../../assets/home.png');
          } else if (route.name === translations[currentLanguage]?.addbooking || "Add Booking") {
            iconName = focused
              ? require('../../assets/addBooking.png')
              : require('../../assets/addBooking.png');
          }
          return (
            <TouchableOpacity
              onPress={() => handleNavigate(route.name)}
              style={styles.tabBarButton}>
              <View style={styles.tabBarIconContainer}>
                <Image style={styles.tabBarIcon} source={iconName} />
              </View>
              <Text style={styles.tabBarLabelText}>{route.name}</Text>
            </TouchableOpacity>
          );
        },
        tabBarActiveTintColor: '#3AA4F7',
      })}>
      <Bottom.Screen
        name={translations[currentLanguage]?.addenq || "Add Enquiry"}
        component={AddEnquiry}
        options={{headerShown: false, tabBarLabel: 'Add Enquiry'}}
      />
      <Bottom.Screen
        name={translations[currentLanguage]?.Home || "HOME"}
        component={AddMore}
        options={{headerShown: false, tabBarLabel: 'HOME'}}
      />
      <Bottom.Screen
        name={translations[currentLanguage]?.addbooking || "Add Booking"}
        component={AddBooking}
        options={{headerShown: false, tabBarLabel: 'Add Booking'}}
      />
    </Bottom.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    justifyContent: 'center',
  },
  tabBarLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  tabBarLabelSmall: {
    fontSize: 14,
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarIconContainer: {
    marginBottom: 5,
  },
  tabBarIcon: {
    width: 23,
    height: 23,
    marginBottom: 2,
  },
  tabBarLabelText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default BottomNavigator;

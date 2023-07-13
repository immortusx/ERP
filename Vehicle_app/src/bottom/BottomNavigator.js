import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddEnquiry from '../components/AddEnquiry';
import AddMore from '../components/AddMore';
import AddBooking from '../components/AddBooking';
import { useNavigation } from '@react-navigation/native';

const Bottom = createBottomTabNavigator();

const BottomNavigator = () => {
  const navigation = useNavigation();

  const handleNavigate = (path) => {
    navigation.navigate(path);
  };

  return (
    <Bottom.Navigator
      initialRouteName="AddMore"
      tabBarStyle={styles.tabBar}
      screenOptions={({ route }) => ({
        tabBarLabelStyle: [styles.tabBarLabel, styles.tabBarLabelSmall],
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'AddEnquiry') {
            iconName = focused
              ? require('../../assets/addEnquiry.png')
              : require('../../assets/addEnquiry.png');
          } else if (route.name === 'AddMore') {
            iconName = focused
              ? require('../../assets/homm.png')
              : require('../../assets/homm.png');
          } else if (route.name === 'AddBooking') {
            iconName = focused
              ? require('../../assets/addBooking.png')
              : require('../../assets/addBooking.png');
          }
          return (
            <TouchableOpacity
              onPress={() => handleNavigate(route.name)}
              style={styles.tabBarButton}
            >
              <View style={styles.tabBarIconContainer}>
                <Image style={styles.tabBarIcon} source={iconName} />
              </View>
              <Text style={styles.tabBarLabelText}>{route.name}</Text>
            </TouchableOpacity>
          );
        },
        tabBarActiveTintColor: '#3AA4F7'
      })}
    >
      <Bottom.Screen name="AddEnquiry" component={AddEnquiry} options={{headerShown: false,
      tabBarLabel: 'Add Enquiry'}}/>
      <Bottom.Screen name="AddMore" component={AddMore} options={{headerShown: false, 
       tabBarLabel: 'Home'}}/>
      <Bottom.Screen name="AddBooking" component={AddBooking} options={{headerShown: false,
       tabBarLabel: 'Add Booking'}}/>
    </Bottom.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    justifyContent: 'center',
  },
  tabBarLabel: {
    fontSize: 15,
    marginBottom: 3,
    fontWeight: 'bold',
  },
  tabBarLabelSmall: {
    fontSize: 15,
    marginTop: -30,
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
    width: 25,
    height: 25,
    marginBottom: 2,
  },
  tabBarLabelText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    
  },
});

export default BottomNavigator;

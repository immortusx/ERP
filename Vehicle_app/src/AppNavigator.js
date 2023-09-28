import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './rootNav/Splash';
import Login from './components/Login';
import Main from './rootNav/Main';
import AddLocation from './components/AddLocation';
import AddManufacturDetails from './components/AddManufacturDetails';
import AdditonalDetails from './components/AdditonalDetails';
import ScheduleCall from './components/ScheduleCall';
import FastEnquiry from './components/FastEnquiry';
import DetailEnquiry from './components/DetailEnquiry';
import DeliveryScreen from './components/Delivery';
import EnquiryList from './components/EnquiryList';
import WorkList from './components/WorkList'
import EnquiryVillageList from './components/EnquiryVillageList';
import Category from './components/Category';
import VillageEnquiryLists from './components/VillageEnquiryLists';
import VillageEnquiry from './components/VillageEnquiry';
import UserTaskDetails from './components/UserTaskDetails';
const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Add Location"
          component={AddLocation}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Add Manufacturer Details"
          component={AddManufacturDetails}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Additional Details"
          component={AdditonalDetails}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Schedule Call"
          component={ScheduleCall}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Fast Enquiry"
          component={FastEnquiry}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Detail Enquiry"
          component={DetailEnquiry}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Edit Detail Enquiry"
          component={DetailEnquiry}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Delivery"
          component={DeliveryScreen}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Enquiry List"
          component={EnquiryList}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="WorkReport List"
          component={WorkList}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        
        <Stack.Screen
          name="Village List"
          component={EnquiryVillageList}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Category"
          component={Category}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Available Enquiry"
          component={VillageEnquiryLists}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Enquiry Village"
          component={VillageEnquiry}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
        <Stack.Screen
          name="Task Details"
          component={UserTaskDetails}
          options={{
            headerShown: true,
            headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from './Home';
import Test from '../components/Test';
import AddLocation from '../components/AddLocation';
import {useNavigation} from '@react-navigation/native';
import Profile from '../components/Profile';
import AddEnquiry from '../components/AddEnquiry';
import AddBooking from '../components/AddBooking';
import Master from '../components/Master';
import Sales from '../components/Sales';
import Products from '../components/Products';
import Manage from '../components/Manage';
import CustomDrawer from '../components/CustomDrawer';
const Drawer = createDrawerNavigator();
const SidebarMenu = () => {
  const navigation = useNavigation();
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{headerShown: false, drawerLabelStyle: {marginLeft: -11},
      drawerActiveBackgroundColor: '#0984DF',
      drawerActiveTintColor: 'white',
     }}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          headerStyle: {
            borderWidth: 0.9,
            borderColor: 'grey',
          },
          drawerIcon: () => (
            <Image
              style={styles.personImg}
              source={require('../../assets/home.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          headerStyle: {
            borderWidth: 0.9,
            borderColor: 'grey',
          },
          drawerIcon: () => (
            <Image
              style={styles.personImg}
              source={require('../../assets/person.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Enquiry"
        component={AddEnquiry}
        options={{
          headerShown: true,
          headerStyle: {
            borderWidth: 0.9,
            borderColor: 'grey',
          },
          drawerIcon: () => (
            <Image
              style={styles.personImg}
              source={require('../../assets/enquiry.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Booking"
        component={AddBooking}
        options={{
          headerShown: true,
          headerStyle: {
            borderWidth: 0.9,
            borderColor: 'grey',
          },
          drawerIcon: () => (
            <Image
              style={styles.personImg}
              source={require('../../assets/booking.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Master"
        component={Master}
        options={{
          headerShown: true,
          headerStyle: {
            borderWidth: 0.9,
            borderColor: 'grey',
          },
          drawerIcon: () => (
            <Image
              style={styles.personImg}
              source={require('../../assets/setting.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Sales"
        component={Sales}
        options={{
          headerShown: true,
          headerStyle: {
            borderWidth: 0.9,
            borderColor: 'grey',
          },
          drawerIcon: () => (
            <Image
              style={styles.personImg}
              source={require('../../assets/sales.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Products"
        component={Products}
        options={{
          headerShown: true,
          headerStyle: {
            borderWidth: 0.9,
            borderColor: 'grey',
          },
          drawerIcon: () => (
            <Image
              style={styles.personImg}
              source={require('../../assets/product.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Manage"
        component={Manage}
        options={{
          headerShown: true,
          headerStyle: {
            borderWidth: 0.9,
            borderColor: 'grey',
          },
          drawerIcon: () => (
            <Image
              style={styles.personImg}
              source={require('../../assets/manage.png')}
            />
          ),
        }}
      />
      
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  personImg: {
    width: 25,
    height: 25,
  },
});
export default SidebarMenu;

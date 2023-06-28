import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from './Home';
import Test from '../components/Test';
import AddLocation from '../components/AddLocation';
const Drawer = createDrawerNavigator();
const SidebarMenu = () => {
  return (
    <Drawer.Navigator>
        <Drawer.Screen name='Home' component={Home} options={{headerShown: true, headerStyle: {
              borderWidth: 0.9,
              borderColor: 'grey',
            }}}/>
        <Drawer.Screen name='Profile' component={Test} options={{headerShown: true}}/>
        <Drawer.Screen name='Enquiry' component={Test} options={{headerShown: true}}/>
        <Drawer.Screen name='Booking' component={Test} options={{headerShown: true}}/>
        <Drawer.Screen name='Master' component={Test} options={{headerShown: true}}/>
        <Drawer.Screen name='Sales' component={Test} options={{headerShown: true}}/>
        <Drawer.Screen name='Products' component={Test} options={{headerShown: true}}/>
        <Drawer.Screen name='Manage' component={Test} options={{headerShown: true}}/>
        <Drawer.Screen name='Sign Out' component={Test} options={{headerShown: true}}/>
    </Drawer.Navigator>
  )
}

export default SidebarMenu
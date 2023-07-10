import {View, Text, ImageBackground, Image} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
const CustomDrawer = props => {
  const dispatch = useDispatch();
  const profileData =  useSelector(state => state.getUserProfileSlice.profile.currentUserData.result);
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: '#AED6F1'}}>
        <ImageBackground source={require("../../assets/sidecover.jpg")} style={{padding: 30}}>
            <Image source={require("../../assets/cover.jpg")} style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}/>
            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>Harilal Mehta</Text>
            <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>8765445670</Text>
        </ImageBackground>
        <View style={{backgroundColor: 'white'}}>

        <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 10, borderTopWidth: 0.2, borderEndColor: '#ccc', marginVertical: 10}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Sign Out <Image style={{width: 20, height: 20}} source={require("../../assets/signout.png")}/></Text>
      </View>
    </View>
  );
};

export default CustomDrawer;

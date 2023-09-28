import {
  View,
  Text,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearCurrentUserData} from '../redux/slice/getUserProfile';
import {clearLoginState} from '../redux/slice/getUserLogin';
import {API_URL} from '@env';
const CustomDrawer = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const profileData = useSelector(
    state => state.getUserProfileSlice.profile.currentUserData.result,
  );
  console.log(profileData, 'profileData');
  const firstName = profileData?.first_name ?? '';
  const lastName = profileData?.last_name ?? '';
  const phoneNumber = profileData?.phone_number ?? '';
  const documentPath = profileData?.document_path ?? '';

  const handleSignOut = async () => {
    try {
      setIsloading(true);
      const token = await AsyncStorage.getItem('rbacToken');
      if (token !== null) {
        await AsyncStorage.removeItem('rbacToken');
        await AsyncStorage.clear();
        dispatch(clearCurrentUserData());
        dispatch(clearLoginState());
        navigation.navigate('Login');
      }
      setIsloading(false);
    } catch (error) {
      console.log('Error occurred during sign-out:', error);
      setIsloading(false);
    }
  };
  
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#AED6F1'}}>
        <ImageBackground
          source={require('../../assets/sidecover.jpg')}
          style={{padding: 30}}>
          <Image
            source={{uri: `${API_URL}/api${documentPath}`}}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            {firstName} {lastName}
          </Text>
          <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>
            {phoneNumber}
          </Text>
        </ImageBackground>
        <View style={{backgroundColor: 'white'}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          padding: 10,
          borderTopWidth: 0.3,
          borderColor: '#76D7C4',
          marginVertical: 10,
        }}>
        {isLoading ? (
          <View>
            <ActivityIndicator size={30} color="blue" />
            <Text style={{color: '#2471A3', textAlign: 'center', marginTop: 2}}>
              Signing You Out...
            </Text>
          </View>
        ) : (
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              {'  '}{' '}
              <Image
                style={{width: 20, height: 20}}
                source={require('../../assets/signout.png')}
              />
              {'   '} Sign Out
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomDrawer;

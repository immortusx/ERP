import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileData } from '../redux/slice/getUserProfile';

const Splash = ({ navigation }) => {
  const dispatch = useDispatch();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const profileData = useSelector((state) => state.getUserProfileSlice.profile);

  useEffect(() => {
    const checkLoginAndNavigate = async () => {
      const token = await AsyncStorage.getItem('rbacToken');

      if (token) {
        setTimeout(() => {
          setInitialCheckDone(true);
          dispatch(getProfileData());
        }, 2000);
      } else {
        setTimeout(() => {
          setInitialCheckDone(true);
          navigation.navigate('Login');
        }, 2000);
      }
    };

    checkLoginAndNavigate();
  }, [navigation, dispatch]);

  useEffect(() => {
    if (initialCheckDone) {
      if (profileData.isSuccess && profileData.currentUserData.isSuccess) {
        navigation.navigate('Main');
      } else {
        navigation.navigate('Login');
      }
    }
  }, [profileData, navigation, initialCheckDone]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/cover.jpg')}
        style={styles.image}>
        <Text style={styles.text}>New Keshav Tractors</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Splash;

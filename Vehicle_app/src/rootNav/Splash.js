import React, {useEffect, useState} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {getProfileData} from '../redux/slice/getUserProfile';

const Splash = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginAndNavigate = async () => {
      const token = await AsyncStorage.getItem('rbacToken');
      if (token) {
        setLoggedIn(true);
        dispatch(getProfileData());
        navigation.navigate('Main');
      } else {
        setLoggedIn(true);
        navigation.navigate('Login');
      }
    };

    setTimeout(checkLoginAndNavigate, 2000);
  }, []);

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

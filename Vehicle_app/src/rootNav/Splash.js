import React, {useEffect, useState} from 'react';
import {View, Image, Text, ImageBackground, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileData} from '../redux/slice/getUserProfile';
import {API_URL} from '@env';
import axios from 'axios';
import { agencyDb } from '../redux/slice/agencyDataSlice';

const Splash = ({navigation}) => {
  const dispatch = useDispatch();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [agencydata, setAgencyData] = useState([]);
  const profileData = useSelector(state => state.getUserProfileSlice.profile);
  const agencyData = useSelector(
    state => state.agencyDataSlice.agencyDataState,
  );
  console.log(agencyData, 'agencyDataagencyDataagencyDataagencyData');

  const getAgencyData = async () => {
    const url = `${API_URL}/api/agency/get-agencylogo`;
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    try {
      const response = await axios.get(url, config);
      if (response && response.data.result) {
        console.log(response.data.result, 'AgencyData');
        setAgencyData(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching user task list:', error);
    }
  };

  useEffect(() => {
    getAgencyData();
  }, []);

  const valuesByKey = {};

  for (const item of agencydata) {
    valuesByKey[item.key_name] = item.value;
  }

  const name = valuesByKey['name'];
  const contact = valuesByKey['contact'];
  const email = valuesByKey['email'];
  const logo = valuesByKey['logo'];

 
console.log('Name:', name);
console.log('Contact:', contact);
console.log('Email:', email);
console.log('Logo:', logo);

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
        source={{uri: `${API_URL}/api${logo}`}}
        style={styles.image}>
        
        <Text style={styles.text}> {name}</Text>
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
    color: 'black',
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',   
  },
  logo: {
    height: 100,
    width: 100,
    borderRadius:50,
  },
});

export default Splash;

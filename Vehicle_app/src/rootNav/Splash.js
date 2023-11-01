import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileData} from '../redux/slice/getUserProfile';
import {API_URL} from '@env';
import axios from 'axios';
import {getAgencyData} from '../redux/slice/AgencyDataSlice';

const Splash = ({navigation}) => {
  const dispatch = useDispatch();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const profileData = useSelector(state => state.getUserProfileSlice.profile);
  const agencyData = useSelector(
    state => state.agencyData.agencyDataState.result,
  );
  const [agency, setAgency] = useState({
    agencyName: '',
    agencyLogo: null,
  });
  useEffect(() => {
    dispatch(getAgencyData());
  }, []);
  useEffect(() => {
    if (agencyData && agencyData.result) {
      console.log(agencyData.result, 'agencyDta spalsh');
      const valueObj = {};
      for (const item of agencyData.result) {
        valueObj[item.key_name] = item.value;
      }
      const {name, logo} = valueObj;
      setAgency({
        agencyName: name,
        agencyLogo: logo,
      });
    }
  }, [agencyData]);
  useEffect(() => {
    const checkLoginAndNavigate = async () => {
      const token = await AsyncStorage.getItem('rbacToken');

      if (token) {
        setTimeout(() => {
          setShowSpinner(false);
          setInitialCheckDone(true);
          dispatch(getProfileData());
        }, 2000);
      } else {
        setTimeout(() => {
          setShowSpinner(false);
          setInitialCheckDone(true);
          navigation.navigate('Login');
        }, 2000);
      }
    };

    checkLoginAndNavigate();
  }, [navigation, dispatch]);

  useEffect(() => {
    if (initialCheckDone && profileData.isSuccess) {
      if (profileData.isSuccess && profileData.currentUserData.isSuccess) {
        navigation.navigate('Main');
      } else {
        navigation.navigate('Login');
      }
    }
  }, [profileData, navigation, initialCheckDone]);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.logoContainer}>
          <Image
            source={{uri: `${API_URL}/api${agency.agencyLogo}`}}
            style={styles.logo}
          />
        </View>
        <Text style={styles.agencyName}>{agency.agencyName}</Text>
      </View>
      <View style={styles.bottomContent}>
        <ActivityIndicator animating={showSpinner} size={30} color="grey" />
        <View style={styles.line}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    borderRadius: 150,
    padding: 6
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 150,
    padding: 10
  },
  agencyName: {
    fontSize: 20,
    fontFamily: 'Helvetica',
    color: '#333',
    letterSpacing: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    paddingVertical: 6,
  },
  bottomContent: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 10
  },
  line: {
    backgroundColor: 'lightgrey',
    height: 2,
    alignSelf: 'stretch',
    marginVertical: 9,
  },
});

export default Splash;

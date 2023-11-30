import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  Image,
  ActivityIndicator,
  FlatList
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import BackgroundImage from '../../assets/cover.jpg';
import { getLoginUser } from '../redux/slice/getUserLogin';
import getUserProfile, { getProfileData } from '../redux/slice/getUserProfile';
import LoadingSpinner from './subCom/LoadingSpinner';
import UpdatePopUp from './AppUpdatePopUp';
import { API_URL } from '@env';
import LanguageOptions from './LanguageOptions';
import translations from '../../assets/locals/translations'
import LanguageSlice from '../redux/slice/LanguageSlice';
import LinearGradient from 'react-native-linear-gradient';
import CallLogs from 'react-native-call-log'
import { PermissionsAndroid } from 'react-native';
import { setLogs, setPermissionStatus } from '../redux/slice/callLogsSlice';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [updateScreen, setUpdateScreen] = useState(false);
  const [agencydata, setAgencyData] = useState([]);
  const loginState = useSelector(state => state.getLoginSlice.loginState);
  const appVersion = '1.0';
  const updated = '1.2';
  const agencyData = useSelector(
    state => state.agencyData.agencyDataState.result,
  );
  const [agency, setAgency] = useState({
    agencyName: '',
    agencyLogo: null,
  });
  const profileData = useSelector(
    state => state.getUserProfileSlice.profile.currentUserData,
  );
  const currentLanguage = useSelector((state) => state.language.language);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const permissionStatus = useSelector(state => state.callLog.permissionStatus);
  const logs = useSelector(state => state.callLog.logs);

  useEffect(() => {
    if (agencyData && agencyData.result) {
      const valueObj = {};
      for (const item of agencyData.result) {
        valueObj[item.key_name] = item.value;
      }
      const { name, logo } = valueObj;
      setAgency({
        agencyName: name,
        agencyLogo: logo,
      });
    }
  }, [agencyData]);

  const onChangeHandler = (value, field) => {
    if (field === 'username') {
      setLoginData(registerData => ({ ...loginData, username: value }));
    } else if (field === 'password') {
      setLoginData(registerData => ({ ...loginData, password: value }));
    }
  };

  const updateDetails = {
    features: [
      'Added some new features.',
      'Improved performance and stability.',
      'Enhanced user interface.',
    ],
    bugFixes: ['Fixed a crash issue when loading the profile.'],
  };

  const handleUpdateNow = () => {
    setUpdateScreen(false);
  };

  const handleUpdateDismiss = () => {
    setUpdateScreen(false);
  };

  useEffect(() => {
    if (loginState.isSuccess === true) {
      if (loginState.result.message === 'success') {
        setIsLoading(true);
        AsyncStorage.setItem(
          'branchesList',
          JSON.stringify(loginState.result.result.branchResult),
        );
        AsyncStorage.setItem(
          'currentBranchId',
          JSON.stringify(loginState.result.result.currentBranch),
        );
        AsyncStorage.setItem('rbacToken', loginState.result.result.tokenIs);
        AsyncStorage.getItem('rbacToken').then(token => {
          setIsLoading(false);
          if (!token) {
            return;
          }
          dispatch(getProfileData());
          navigation.navigate('Main');
          setLoginData({
            username: '',
            password: '',
          });
        });
        setLoggedIn(true);
      } else if (loginState.result.message !== 'success') {
        alert('Credentials are wrong');
      } else {
        alert('Something is wrong');
      }
    } else if (loginState.isError === true) {
      alert('An error occurred. Please try again.');
    }
  }, [loginState]);

  useEffect(() => {
    if (profileData) {
      const username = profileData?.result?.email ?? '';
      setLoginData(prevData => ({ ...prevData, username }));
      const password = 'adminadmin';
      setLoginData(prevData => ({ ...prevData, password }));
    }
  }, [profileData]);

  const handleLogin = () => {
    if (loginData.username.length > 0 && loginData.password.length > 0) {
      dispatch(getLoginUser(loginData));
    } else {
      alert('Please fill in all the fields');
    }
  };

  // const componentDidMount = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
  //       {
  //         title: 'Call Log Example',
  //         message: 'Access your call logs',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       }
  //     );
  //     console.log('Permission status:', granted);

  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       CallLogs.load(20).then((callLogs) => {
  //         console.log(callLogs, 'hjdhsjdslllllllllllllllllll');
  //       });
  //     } else {
  //       console.log('Call Log permission denied');
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <>
      <View>
        {permissionStatus === PermissionsAndroid.RESULTS.GRANTED && (
          <FlatList
            data={logs.filter(item => item && item.id)}
            keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
            renderItem={({ item }) => <Text>{item.someProperty}</Text>}
          />
        )}
      </View>

      <LinearGradient
        colors={['#91b8d0', '#a7c6d9']}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <View style={styles.languageIcon}>
              <LanguageOptions modalShow={true} />
            </View>
            <View style={styles.centerContent}>
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: `${API_URL}/api${agency.agencyLogo}` }}
                  style={styles.logo}
                />
              </View>
              <Text style={styles.agencyName}>{agency.agencyName}</Text>
            </View>
            <View style={styles.bottomView}>
              <Text style={styles.loginText}>{translations[currentLanguage]?.login || 'Login'}</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder={translations[currentLanguage]?.emailemobile || 'Enter Email/Mobile Number'}
                  autoCapitalize="none"
                  value={loginData.username}
                  onChangeText={value => onChangeHandler(value, 'username')}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder={translations[currentLanguage]?.epassword || 'Enter Password'}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  value={loginData.password}
                  onChangeText={value => onChangeHandler(value, 'password')}
                />
              </View>
              <Text style={styles.fpText}>{translations[currentLanguage]?.forgotPassword || "Forgot Password?"}</Text>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="white" />
                  ) : (
                    translations[currentLanguage]?.login || "Login"
                  )}
                </Text>
              </TouchableOpacity>
              <Text style={styles.registerText}>
                {translations[currentLanguage]?.donthanaccount || "Don't have an account ?"}
                <Text style={{ color: '#006400', fontFamily: 'SourceSansProBold' }}>
                  {translations[currentLanguage]?.register || "Register"}
                </Text>
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <UpdatePopUp
          isVisible={updateScreen}
          onUpdate={handleUpdateNow}
          onDismiss={handleUpdateDismiss}
          updateDetails={updateDetails}
        />
      </LinearGradient>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  titleText: {
    position: 'absolute',
    top: Dimensions.get('screen').height * 0.1,
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'SourceSansProBold',
    fontSize: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  bottomView: {
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  loginText: {
    color: 'black',
    fontFamily: 'SourceSansProBold',
    fontSize: 24,
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  inputView: {
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f1f3f6',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    paddingHorizontal: 8,
  },
  input: {
    height: 40,
    flex: 1,
    fontFamily: 'SourceSansProRegular',
    fontSize: 16,
    color: 'black',
  },
  loginButton: {
    backgroundColor: '#006400',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontFamily: 'SourceSansProBold',
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    alignSelf: 'center',
    marginTop: 12,
    fontFamily: 'SourceSansProRegular',
    fontSize: 16,
  },
  fpText: {
    marginTop: 10,
    alignSelf: 'flex-end',
    fontFamily: 'SourceSansProBold',
    fontSize: 16,
    color: '#006400',
  },
  centerContent: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    transform: [{ translateY: -50 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 150,
  },
  agencyName: {
    fontSize: 30,
    fontFamily: 'Helvetica',
    color: '#333',
    letterSpacing: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    paddingVertical: 6,
  },
  personImg: {
    width: 30,
    height: 30
  },
  languageIcon: {
    position: 'absolute',
    top: 10,
    right: 10
  }
});

export default Login;

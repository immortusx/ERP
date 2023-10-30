import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import BackgroundImage from '../../assets/cover.jpg';
import {getLoginUser} from '../redux/slice/getUserLogin';
import getUserProfile, {getProfileData} from '../redux/slice/getUserProfile';
import LoadingSpinner from './subCom/LoadingSpinner';
import UpdatePopUp from './AppUpdatePopUp';
import {API_URL} from '@env';
const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [updateScreen, setUpdateScreen] = useState(false);
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
    state => state.getUserProfileSlice.profile.currentUserData.result,
  );
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
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
  const onChangeHandler = (value, field) => {
    if (field === 'username') {
      setLoginData(registerData => ({...loginData, username: value}));
    } else if (field === 'password') {
      setLoginData(registerData => ({...loginData, password: value}));
    }
  };
  const updateDetails = {
    features: [
      'Added a some new feature.',
      'Improved performance and stability.',
      'Enhanced user interface.',
    ],
    bugFixes: ['Fixed a crash issue when loading the profile.'],
  };
  // useEffect(() => {
  //   if (appVersion !== updated) {
  //     setUpdateScreen(true);
  //   }
  // }, [updated]);

  const handleUpdateNow = () => {
    // Implement code to navigate to the app store or initiate the update.
    // For simplicity, we'll just dismiss the pop-up here.
    setUpdateScreen(false);
  };

  const handleUpdateDismiss = () => {
    setUpdateScreen(false);
  };

  useEffect(() => {
    if (loginState.isSuccess === true) {
      if (loginState.result.message === 'success') {
        setIsLoading(true);
        console.log(loginState.result.result.tokenIs);
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
          console.log(token, 'token_--__--he');
          navigation.navigate('Main');
          setLoginData({
            username: '',
            password: '',
          });
        });
        setLoggedIn(true);
      } else if (loginState.result.message !== 'success') {
        console.log('Credentials are wrong');
        alert('Credentials are wrong');
        // dispatch(setShowMessage("Credentials are wrong"));
      } else {
        console.log('Something is wrong');
        alert('Something is wrong');
        // dispatch(setShowMessage("Something is wrong"));
      }
    } else if (loginState.isError === true) {
      console.log('An error occurred. Please try again.');
      alert('An error occurred. Please try again.');
    }
    console.log('loginState', loginState);
  }, [loginState]);

  useEffect(() => {
    if (profileData) {
      const username = profileData?.email ?? '';
      setLoginData(prevData => ({...prevData, username}));
      const password = 'adminadmin';
      setLoginData(prevData => ({...prevData, password}));
    }
  }, [profileData]);
  const handleLogin = () => {
    if (loginData.username.length > 0 && loginData.password.length > 0) {
      dispatch(getLoginUser(loginData));
    } else {
      // dispatch(setShowMessage("Please fill all the field"));
      console.log('please fill credentials first');
      alert('Please fill in all the fields');
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.centerContent}>
            <View style={{marginVertical: 140}}>
              <View style={styles.logoContainer}>
                <Image
                  source={{uri: `${API_URL}/api${agency.agencyLogo}`}}
                  style={styles.logo}
                />
              </View>
            <Text style={styles.agencyName}>{agency.agencyName}</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            <Text style={styles.loginText}>Login</Text>
            <View style={styles.inputView}>
              {/* <Icon
              style={styles.inputIcon}
              name="person"
              type="ionicons"
              color="#5352ed"
            /> */}
              <TextInput
                style={styles.input}
                placeholder="Enter Email/Mobile Number"
                autoCapitalize="none"
                value={loginData.username}
                onChangeText={value => onChangeHandler(value, 'username')}
              />
            </View>
            <View style={styles.inputView}>
              {/* <Icon
              style={styles.inputIcon}
              name="lock"
              type="ionicons"
              color="#5352ed"
            /> */}
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                secureTextEntry={true}
                autoCapitalize="none"
                value={loginData.password}
                onChangeText={value => onChangeHandler(value, 'password')}
              />
            </View>
            <Text style={styles.fpText}>Forgot Password?</Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  'Login'
                )}
              </Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>
              Don't have an account?
              <Text style={{color: '#006400', fontFamily: 'SourceSansProBold'}}>
                {' Register'}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#fff',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    borderRadius: 150,
    padding: 6,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 150,
    padding: 10,
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
});

export default Login;

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
const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const loginState = useSelector(state => state.getLoginSlice.loginState);
  const profileData = useSelector(
    state => state.getUserProfileSlice.profile.currentUserData.result,
  );
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const onChangeHandler = (value, field) => {
    if (field === 'email') {
      setLoginData(registerData => ({...loginData, email: value}));
    } else if (field === 'password') {
      setLoginData(registerData => ({...loginData, password: value}));
    }
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
            email: '',
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

  useEffect(()=> {
    if(profileData){
      const email = profileData?.email ?? '';
      setLoginData((prevData) => ({ ...prevData, email }));
      const password = 'admin';
      setLoginData((prevData) => ({ ...prevData, password }));
    }
  },[profileData])
  const handleLogin = () => {
    if (loginData.email.length > 0 && loginData.password.length > 0) {
      dispatch(getLoginUser(loginData));
    } else {
      // dispatch(setShowMessage("Please fill all the field"));
      console.log('please fill credentials first');
      alert('Please fill in all the fields');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Image
            style={{flex: 1, width: null, marginTop: -500}}
            source={BackgroundImage}
          />
        </View>
        <Text>Keshav Tractors</Text>
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
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={loginData.email}
              onChangeText={value => onChangeHandler(value, 'email')}
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
              placeholder="Password"
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
});

export default Login;

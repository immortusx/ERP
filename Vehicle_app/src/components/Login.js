import React, {useState} from 'react';
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
} from 'react-native';
import BackgroundImage from '../../assets/cover.jpg';
const Login = ({navigation}) => {
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

  const handleLogin = () => {
    console.warn(loginData)
    navigation.navigate('Main');
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
              onChangeText={(value) => onChangeHandler(value, "email")}
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
            <Text style={styles.loginButtonText}>Login</Text>
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
    color: '#333',
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

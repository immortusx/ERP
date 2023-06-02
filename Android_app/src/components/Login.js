import React, { useState,useEffect } from "react";
import { Input,Button,Box } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import {Alert,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useSelector,useDispatch } from "react-redux";
import { getLoginUser,clearLoginState } from "../redux/slice/getuserlogin";
import {getProfileData,clearProfileDataSliceState} from "../redux/slice/getuserProfile";
import { setShowMessage } from "../redux/slice/notificationSlice";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
})

function onChangeHandler(value, field) {
  if (field === 'email') {
      setLoginData(registerData => ({ ...loginData, 'email': value}))
  } else if (field === 'password') {
      setLoginData(registerData => ({ ...loginData, 'password': value }))
  }
}
  const dispatch = useDispatch()
  const loginState = useSelector(state => state.getLoginSlice.loginState)
  const profileDataState = useSelector(state => state.profileData.profile)

  useEffect(() => {
    if (profileDataState.isSuccess && profileDataState.currentUserData.isSuccess) {
        const rolesArray = [];
        Array.from(profileDataState.currentUserData.result.features).filter(i => {
            rolesArray.push(i.feature)
        })
        AsyncStorage.setItem('rolesArray', rolesArray)
        AsyncStorage.setItem('userData', JSON.stringify(profileDataState.currentUserData.result))

        dispatch(clearProfileDataSliceState())
        // navigate('/home')
    }
}, [profileDataState])


useEffect(() => {
    if (loginState.isSuccess === true) {
        if (loginState.result.message == 'success') {
            // taking first branch for login 

            AsyncStorage.setItem('branchesList', JSON.stringify(loginState.result.result.branchResult))
            AsyncStorage.setItem('currentBranchId', loginState.result.result.currentBranch)
            AsyncStorage.setItem('rbacToken', loginState.result.result.tokenIs)
            AsyncStorage.getItem('rbacToken')
            .then((token)=>{
              if (!token) {
                return
            } else {
              // const token = AsyncStorage.getItem('rbacToken')
              
              dispatch(getProfileData(token))
              console.log(token,"aSDFGHJKDSFGHJDSFGSDFGHJ")
              console.log('Welcome to Vehicle Management System')
              alert('Welcome to Vehicle Management System')
              // dispatch(setShowMessage('Welcome to Vehicle Management System'))
              navigation.navigate("main");
            }
          })
        } else if (loginState.result.message != 'success') {
          console.log('Credentials are wrong')
          alert('Credentials are wrong')
            dispatch(setShowMessage('Credentials are wrong'))
        } else {
          console.log('Something is wrong')
          alert('Something is wrong')
            dispatch(setShowMessage('Something is wrong'))
        }
        dispatch(clearLoginState())
    } else if (loginState.isError === true) {
      console.log('Something is wrong')
      alert('Something is wrong')
        dispatch(setShowMessage('Something is wrong'))
    }
}, [loginState])

function handleSubmit() {
    if (loginData.email.length > 0 && loginData.password.length > 0) {
        dispatch(getLoginUser(loginData))
    } else {
        dispatch(setShowMessage('Please fill all the field'))
    }
}

  const [show, setShow] = useState(false);

  const navigation = useNavigation();
 
  
  const handleClick = () => setShow(!show)

  return (
    <SafeAreaView style={styles.safeview}>
   <View>
   <Text style={styles.textheader}> Vehicle Magagement System</Text>
   </View>
      <View style={styles.content}>
      <Text style={styles.text}> Login</Text>
      <Box style={styles.inputbox}>
        <Text style={styles.textlable}>email:</Text>
        <Input
          placeholder="email"
          size="lg"
          placeholderTextColor="black"
          value={loginData.email}
          onChangeText={(value) => onChangeHandler(value, 'email')}
        />
      
      </Box>
      <Box style={styles.inputbox}>
        <Text style={styles.textlable}>password:</Text>
        <Input
        type={show ? "text" : "password"}
          keyboardType="numeric"
          size="lg"
          onChangeText={(value) => onChangeHandler(value, 'password')}
          placeholderTextColor="black"
          value={loginData.password}
          InputRightElement={<Button size="lg"  onPress={handleClick}>
            {show ? <Ionicons name="md-eye-sharp" size={24} color="black" /> : <Ionicons name="md-eye-off-sharp" size={24} color="black" /> }
        
          </Button>} placeholder="password"  />

       
      </Box>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
const styles = StyleSheet.create({
  safeview:{
 flex: 1,
    justifyContent: "center",
  },
  textheader:{
fontSize:20,
textAlign:"center",
marginBottom:10,
  },
  content: {
    marginHorizontal:20,
    borderRadius:20,
    backgroundColor: "#fff",
   paddingHorizontal: 50,
   paddingVertical:30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputbox:{
    marginBottom:20,
  },
  text: {
    textAlign: "center",
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },

  textlable: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: "bold",
  },

  button: {
    marginHorizontal: 80,
    backgroundColor: "grey",
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 15,
  },
});


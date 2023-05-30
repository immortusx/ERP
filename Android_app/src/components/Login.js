import React, { useState } from "react";
import axios from "axios";
import { Input,Button,Box } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Login = () => {

  const [show, setShow] = React.useState(false);

  const navigation = useNavigation();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState({ field: "", message: "" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(Email);

  const validPassword = /^\d{8}$/;
  const isValidPassword = validPassword.test(Password);
  
  const handleClick = () => setShow(!show)

  const onsubmit = () => {
    let error = { field: "", message: "" };
    if (!isValidEmail) {
      error.field = "Email";
      error.message = "Please enter  valid Email!";
      setError(error);
    } else if (!isValidPassword) {
      error.field = "Password";
      error.message = "Please enter correct password!";
      setError(error);
    }else {
      axios
        .post("https://crm.balkrushna.com/api/login", {
          Email,
          Password,
        })
        .then((response) => {
          if (response.data.message) {
            console.log("login fail")
            alert("Login failed");
          } else {
            navigation.navigate("main");
            alert("user successfully Logged In");
            console.log(response.data)
          }
        })
        .catch((error) => "Error", error.message);
      setEmail(""), setPassword(""), setError("");
    }
  };
  
  return (
    <SafeAreaView style={styles.safeview}>
   <View>
   <Text style={styles.textheader}> Vehicle Magagement System</Text>
   </View>
      <View style={styles.content}>
      <Text style={styles.text}> Login</Text>
      <Box style={styles.inputbox}>
        <Text style={styles.textlable}>Email:</Text>
        <Input
          placeholder="Email"
          size="lg"
          placeholderTextColor="black"
          value={Email}
          onChangeText={(value) => setEmail(value)}
        />
        {error.field === "Email" && (
          <Text style={styles.error}>{error.message}</Text>
        )}
      </Box>
      <Box style={styles.inputbox}>
        <Text style={styles.textlable}>Password:</Text>
        <Input
        type={show ? "text" : "password"}
          keyboardType="numeric"
          size="lg"
          onChangeText={(value) => setPassword(value)}
          placeholderTextColor="black"
          value={Password}
          InputRightElement={<Button size="lg"  onPress={handleClick}>
            {show ? <Ionicons name="md-eye-sharp" size={24} color="black" /> : <Ionicons name="md-eye-off-sharp" size={24} color="black" /> }
        
          </Button>} placeholder="Password"  />

        {error.field === "Password" && (
          <Text style={styles.error}>{error.message}</Text>
        )}
      </Box>
      <TouchableOpacity style={styles.button} onPress={onsubmit}>
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


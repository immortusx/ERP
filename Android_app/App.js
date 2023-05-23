import { StyleSheet } from "react-native";
import React from "react";
import MainComponent from "./src/components/MainComponent";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Enquiry from "./src/components/Enquiry";
import Form from "./src/components/Form";
import Login from "./src/components/Login";
import Header from "./src/components/Header";
import { NativeBaseProvider } from "native-base";
import HomeScreen from "./src/components/HomeScreen";


const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NativeBaseProvider>
      <NavigationContainer style={styles.container} >
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
        <Stack.Screen name="Login" component={Login}  options={{ title: "User Login " }} />
          <Stack.Screen
            name="main"
            component={MainComponent}
            options={{ headerLeft: () => <HomeScreen />, title: "Balkrushna Technologies " }}
          />
          <Stack.Screen name="Enquiry" component={Enquiry} options={{title:"Enqiury "}}  />
          <Stack.Screen name="form" component={Form}  options={{ title: "New Enquiry"}}/>
          <Stack.Screen name="header" component={Header}  options={{ title: "header"}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  
  container: {
    backgroundColor: '#fff',
  },
});

// <View >
// <View>
// <MainComponent/>
// </View>
// </View>

// headerStyle: {
            //   backgroundColor: '#f4511e',
            // },
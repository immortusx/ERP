import { StyleSheet, Text, View,TouchableOpacity } from "react-native";
import React,{useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign,MaterialIcons } from '@expo/vector-icons';
import { Entypo } from "@expo/vector-icons";
import {  Menu,Pressable,Icon,Box } from "native-base";
const HomeScreen = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle the icon toggle
  const handleIconPress = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log("opencdcdfd")
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    console.log("closecdffg")
  };

  const navigation = useNavigation();
const pressProfile=()=>{
  navigation.navigate("profile");
}
const pressEnquiry=()=>{
  navigation.navigate("Enquiry");
}
const pressBooking=()=>{
  navigation.navigate("Booking");
}
const pressMster=()=>{
  navigation.navigate("master");
}
const pressProduct=()=>{
  navigation.navigate("products");
}
const pressSales=()=>{
  navigation.navigate("sales");
}
const pressManage=()=>{
  navigation.navigate("manage");
}

  return (
    <Box>
      <Menu
        mt="10"
        isOpen={isMenuOpen}
        onOpen={handleIconPress}
        onClose={handleCloseMenu}
        trigger={(triggerProps) => {
          return (
            <TouchableOpacity onPress={handleIconPress} {...triggerProps}>
            <Icon as={AntDesign} name={isMenuOpen ?'caretup':'caretdown'} size={5} style={{ color: 'white', marginRight:5 }}  />
            </TouchableOpacity>
          );
        }}
      >
        <Menu
          mt="5"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps} style={styles.menu}>    
              <Icon as={MaterialIcons} name="dashboard"  size={5} style={styles.icon}  />
                <Text>Home</Text>
              </Pressable>
            );
          }}
        >
          <Menu.Item>
            <Text onPress={pressProfile}>Profile</Text>
          </Menu.Item>
         
        </Menu>
        <Menu
          mt="5"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps} style={styles.menu}>
              <Icon as={MaterialIcons} name="dashboard"  size={5} style={styles.icon}  />
                
                <Text>Sale</Text>
              </Pressable>
            );
          }}
        >
         
          <Menu.Item>
            <Text onPress={pressEnquiry}>Enqiury</Text>
          </Menu.Item>
          <Menu.Item>
            <Text onPress={pressBooking}>Booking</Text>
          </Menu.Item>
        </Menu>
      
        <Menu
          mt="5"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps} style={styles.menu}>
              <Icon as={AntDesign} name="team"  size={5}  style={styles.icon}  /> 
                <Text>Service</Text>
              </Pressable>
            );
          }}
        >
        <Menu.Item>
            <Text onPress={pressProduct}>Products</Text>
          </Menu.Item>
        <Menu.Item>
            <Text onPress={pressSales}>Sales</Text>
          </Menu.Item>
          
        </Menu>
        <Menu
          mt="5"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps} style={styles.menu}>
              <Icon as={Entypo}  name="arrow-with-circle-up"  size={5} style={styles.icon}  />
                <Text>Management</Text>
              </Pressable>
            );
          }}
        >
          <Menu.Item>
            <Text onPress={pressManage}>Manage</Text>
          </Menu.Item>
        </Menu>
        <Menu
          mt="5"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps} style={styles.menu}>
              <Icon as={Entypo}  name="arrow-with-circle-up"  size={5} style={styles.icon}  />
                <Text>Administration</Text>
              </Pressable>
            );
          }}
        >
          <Menu.Item>
            <Text>Role</Text>
          </Menu.Item>
          <Menu.Item>
            <Text>Users</Text>
          </Menu.Item>
          <Menu.Item>
            <Text>Enquiry categories</Text>
          </Menu.Item>
          <Menu.Item>
            <Text>Agency</Text>
          </Menu.Item>
        </Menu>
        <Menu
          mt="5"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps} style={styles.menu}>
              <Icon as={Entypo}  name="arrow-with-circle-up"  size={5} style={styles.icon}  />
                <Text>Master</Text>
              </Pressable>
            );
          }}
        >
          <Menu.Item>
            <Text onPress={pressMster}>Master</Text>
          </Menu.Item>
        
        </Menu>
      </Menu>
    </Box>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  menu: {
    paddingHorizontal:20,
    marginBottom: 15,
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
    color: 'red'
  },
});

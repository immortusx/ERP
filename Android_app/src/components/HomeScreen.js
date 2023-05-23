import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Menu, Pressable } from "native-base";
const HomeScreen = () => {
  const navigation = useNavigation();
const pressEnquiry=()=>{
  navigation.navigate("Enquiry");
}

  return (
    <View>
      <Menu
        mt="10"
        trigger={(triggerProps) => {
          return (
            <Pressable {...triggerProps}>
              <AntDesign
                style={styles.icon}
                name="indent-left"
                size={24}
                color="white"
              />
            </Pressable>
          );
        }}
      >
        <Menu
          mt="5"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps} style={styles.menu}>
                <MaterialIcons
                  style={styles.icon}
                  name="dashboard"
                  size={24}
                  color="green"
                />
                <Text>Home</Text>
              </Pressable>
            );
          }}
        >
          <Menu.Item>
            <Text>Profile</Text>
          </Menu.Item>
          <Menu.Item>
            <Text onPress={pressEnquiry}>Enqiury</Text>
          </Menu.Item>
        </Menu>
        <Menu
          mt="5"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps} style={styles.menu}>
                <AntDesign
                  style={styles.icon}
                  name="team"
                  size={20}
                  color="black"
                />
                <Text>Service</Text>
              </Pressable>
            );
          }}
        >
          <Menu.Item>
            <Text>Product</Text>
          </Menu.Item>
          <Menu.Item>
            <Text>Sales</Text>
          </Menu.Item>
        </Menu>
        <Menu
          mt="5"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps} style={styles.menu}>
                <Entypo
                  style={styles.icon}
                  name="arrow-with-circle-up"
                  size={24}
                  color="green"
                />
                <Text>Management</Text>
              </Pressable>
            );
          }}
        >
          <Menu.Item>
            <Text>Manage</Text>
          </Menu.Item>
        </Menu>
        <Menu
          mt="5"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps} style={styles.menu}>
                <Entypo
                  style={styles.icon}
                  name="arrow-with-circle-up"
                  size={24}
                  color="red"
                />
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
      </Menu>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  menu: {
    paddingHorizontal:20,
    marginBottom: 10,
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
  },
});

import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { InputGroup, Input, Divider } from "native-base";
const InputSection = () => {
  return (
    <View style={styles.inputstyle}>
      <InputGroup
        w={{
          base: "70%",
          md: "285",
        }}
      >
        <MaterialIcons
          style={styles.icon}
          name="phone-iphone"
          size={24}
          color="black"
        />
        <Input
          variant="unstyled"
          w={{
            base: "100%",
            md: "25%",
          }}
          placeholder="number"
        />
        <Divider
          orientation="vertical"
          mx="3"
          _light={{
            bg: "muted.800",
          }}
          _dark={{
            bg: "muted.50",
          }}
        />
        <EvilIcons style={styles.icon} name="search" size={24} color="black" />
      </InputGroup>
    </View>
  );
};

export default InputSection;

const styles = StyleSheet.create({
  inputstyle: {
    marginTop: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 5,
  },
  icon: {
    marginTop: 10,
    marginLeft: 10,
  },
});

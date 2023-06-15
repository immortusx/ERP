import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { Input, Icon, Box, Button, HStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import style from "../style/externalStyle";

const Booking = () => {
  const [value, setValue] = useState(null);
  const data = [
    { label: "Select Booking Amount", value: "0" },
    { label: "Cash", value: "1" },
  ];

  // const [selectedOption, setSelectedOption] = useState('');
  const [showNextInput, setShowNextInput] = useState(false);
  const [nextInputValue, setNextInputValue] = useState("");
  const [isPlus, setIsPlus] = useState(true);
  const handleIconToggle = () => {
    setIsPlus((prevState) => !prevState);
  };


  const handleOptionChange = (value) => {
    setValue(value);
    setShowNextInput(true);
  };

  const handleNextInputChange = (value) => {
    setNextInputValue(value);
  };

  const navigation = useNavigation();
  const onNextclick = () => {
    navigation.navigate("RtoDetails");
  };

  return (
    <ScrollView>
      <View style={style.animatednav}>
        <Text style={[style.circleicon, { backgroundColor: "blue" }]}>1</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "blue" }]}>2</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "blue" }]}>3</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "blue" }]}>4</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>5</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>6</Text>
      </View>
      <SafeAreaView style={style.content}>
        <View style={styles.inputflex}>
          <Box style={[style.inputstyel, styles.inputmargin]}>
            <Dropdown
              style={style.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select Booking Amount"
              value={value}
              onChange={handleOptionChange}
            />
          </Box>
          <TouchableOpacity onPress={handleIconToggle}>
          <Icon as={AntDesign} name={isPlus ? "plus" : "minus"} size={10} style={styles.icon} />
        </TouchableOpacity>
        </View>
        {showNextInput && (
          <View>
            <Box style={style.inputstyel} alignItems="center">
              <Input
                keyboardType="default"
                mx="3"
                size="lg"
                w="100%"
                placeholder="Enter Cash Amount"
                placeholderTextColor="black"
                value={nextInputValue}
                onChangeText={handleNextInputChange}
              />
            </Box>
          </View>
        )}

        {!isPlus && (
          <View style={styles.inputflex}>
          <Box style={[style.inputstyel, styles.inputmargin]}>
            <Dropdown
              style={style.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select Booking Amount"
              value={value}
              // onChange={handleOptionChange}
            />
          </Box>
          <TouchableOpacity onPress={handleIconToggle}>
          <Icon as={AntDesign} name={!isPlus ? "plus" : "minus"} size={10} style={styles.icon} />
        </TouchableOpacity>
        </View>
        )}

        <HStack space={3} justifyContent="center">
          <Button onPress={onNextclick} style={style.btn} px="7" my="3">
            Next
          </Button>
        </HStack>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Booking;

const styles = StyleSheet.create({
  icon: {
    color: "blue",
  },

  inputmargin: {
    width: "80%",
  },

  inputflex: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

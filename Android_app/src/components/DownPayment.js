import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { Input, Icon, Box, Button, HStack } from "native-base";
import { useNavigation,useRoute } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import style from "../style/externalStyle";

const DownPayment = () => {
  const route = useRoute();
  const { formData } = route.params;
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const data = [
    { label: "Select Booking Amount", value: "0" },
    { label: "Cash", value: "1" },
  ];
  const data1 = [
    { label: "Select Booking Bank", value: "0" },
    { label: "Bank", value: "1" },
  ];

  // const [selectedOption, setSelectedOption] = useState('');
  const [showNextInput, setShowNextInput] = useState(false);
  const [showNextInput1, setShowNextInput1] = useState(false);
  const [nextInputValue, setNextInputValue] = useState("");
  const [nextInputValue1, setNextInputValue1] = useState("");
  const [isPlus, setIsPlus] = useState(true);

  const [formData4, setFormData4] = useState({
    ...formData,
    down_payment: "",
    // Add other form fields
  });

  const changehandler = (value, name)=>{
    setFormData4((formData)=>({
     ...formData,
 [name]: value
    }))
   }
  const handleIconToggle = () => {
    setIsPlus((prevState) => !prevState);
  };

  const handleOptionChange = (value) => {
    setValue(value);
    setShowNextInput(true);
  };
  const handleOptionChange1 = (value) => {
    setValue1(value);
    setShowNextInput1(true);
  };

  const handleNextInputChange = (value) => {
    setNextInputValue(value);
  };
  const handleNextInputChange1 = (value) => {
    setNextInputValue1(value);
  };

  const navigation = useNavigation();
     const onNextclick = ()=>{
        navigation.navigate("RtoDetails",{formData: formData4 });
        console.log( formData4, "formData4")

     } 
 

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
                keyboardType="numeric"
                mx="3"
                size="lg"
                w="100%"
                placeholder="Enter Cash Amount"
                placeholderTextColor="black"
                value={formData4.down_payment}
                onChangeText={(item) => {
                  changehandler(item,"down_payment");
                }}
              />
            </Box>
          </View>
        )}

        {!isPlus && (
          <View style={styles.inputflex}>
          <Box style={[style.inputstyel, styles.inputmargin]}>
            <Dropdown
              style={style.input}
              data={data1}
              labelField="label"
              valueField="value"
              placeholder="Select Booking Bank"
              value={value1}
              onChange={handleOptionChange1}
            />
          </Box>
          <TouchableOpacity onPress={handleIconToggle}>
          <Icon as={AntDesign} name={!isPlus ? "plus" : "minus"} size={10} style={styles.icon} />
        </TouchableOpacity>
        </View>
        )}
        {showNextInput1 && (
          <View>
            <Box style={style.inputstyel} alignItems="center">
              <Input
                keyboardType="default"
                mx="3"
                size="lg"
                w="100%"
                placeholder="Enter Cash Bank"
                placeholderTextColor="black"
                value={nextInputValue1}
                onChangeText={handleNextInputChange1}
              />
            </Box>
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

export default DownPayment;

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

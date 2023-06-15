import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { Input, Icon, Box, Flex, Button, HStack, Checkbox } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import style from "../style/externalStyle";

const Booking = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const handleCheckboxToggle = () => {
    console.log("checkedsdsds", isChecked);
    setIsChecked(!isChecked);
  };
  const handleCheckboxToggle1 = () => {
    console.log("checkedsdsds", isChecked);
    setIsChecked1(!isChecked1);
  };
  const handleCheckboxToggle2 = () => {
    console.log("checkedsdsds", isChecked);
    setIsChecked2(!isChecked2);
  };

  const [checkboxStates, setCheckboxStates] = useState([
    { value: "Hood(canopy)", ischecked: false },
    { value: "TopLink", ischecked: false },
    { value: "DrawBar", ischecked: false },
    { value: "ToolKit", ischecked: false },
    { value: "Bumper", ischecked: false },
    { value: "Hitch", ischecked: false },
  ]);

  const handleCheckboxToggle3 = (index) => {
    setCheckboxStates((prevStates) => {
      const updatedCheckboxStates = [...prevStates];
      const checkbox = updatedCheckboxStates[index];

      if (checkbox) {
        checkbox.ischecked = !checkbox.ischecked;
      }

      return updatedCheckboxStates;
    });
  };
  const navigation = useNavigation();

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
        <Text style={[style.circleicon, { backgroundColor: "blue" }]}>5</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "blue" }]}>6</Text>
      </View>
      <SafeAreaView style={style.content}>
        <Checkbox.Group accessibilityLabel="choose numbers">
          <Checkbox value="one" my={2} onPress={handleCheckboxToggle}>
            Consumer Skim
          </Checkbox>
        </Checkbox.Group>
        {isChecked && (
          <View style={{ marginLeft: 10, marginTop: 10 }}>
            <View>
              <Box style={style.inputstyel} alignItems="center">
                <Input
                  keyboardType="default"
                  mx="3"
                  size="lg"
                  w="100%"
                  placeholder="Discription"
                  placeholderTextColor="black"
                />
              </Box>
            </View>
            <View>
              <Box style={style.inputstyel} alignItems="center">
                <Input
                  keyboardType="default"
                  mx="3"
                  size="lg"
                  w="100%"
                  placeholder="Amount"
                  placeholderTextColor="black"
                />
              </Box>
            </View>
          </View>
        )}
        <Checkbox.Group accessibilityLabel="choose numbers">
          <Checkbox value="two" my={2} onPress={handleCheckboxToggle1}>
            Accessories
          </Checkbox>
        </Checkbox.Group>
        {isChecked1 && (
          <View style={{ marginLeft: 20, marginTop: 10 }}>
            {checkboxStates.map((checkbox, index) => (
              <View style={{ marginBottom: 20 }}>
                <Checkbox
                  key={index}
                  value={checkbox.value}
                  isChecked={checkbox.ischecked}
                  onPress={() => handleCheckboxToggle3(index)}
                >
                  {checkbox.value}
                </Checkbox>
              </View>
            ))}
          </View>
        )}

        <Checkbox.Group accessibilityLabel="choose numbers">
          <Checkbox value="three" my={2} onPress={handleCheckboxToggle2}>
            Referral Skim
          </Checkbox>
        </Checkbox.Group>
        {isChecked2 && (
          <View style={{ marginLeft: 10, marginTop: 10 }}>
            <View>
              <Box style={style.inputstyel} alignItems="center">
                <Input
                  keyboardType="default"
                  mx="3"
                  size="lg"
                  w="100%"
                  placeholder="Enter Referral Name"
                  placeholderTextColor="black"
                />
              </Box>
            </View>
            <View>
              <Box style={style.inputstyel} alignItems="center">
                <Input
                  keyboardType="default"
                  mx="3"
                  size="lg"
                  w="100%"
                  placeholder="Enter Mobile no"
                  placeholderTextColor="black"
                />
              </Box>
            </View>
            <View>
              <Box style={style.inputstyel} alignItems="center">
                <Input
                  keyboardType="default"
                  mx="3"
                  size="lg"
                  w="100%"
                  placeholder="Discription"
                  placeholderTextColor="black"
                />
              </Box>
            </View>
            <View>
              <Box style={style.inputstyel} alignItems="center">
                <Input
                  keyboardType="default"
                  mx="3"
                  size="lg"
                  w="100%"
                  placeholder="Amount"
                  placeholderTextColor="black"
                />
              </Box>
            </View>
          </View>
        )}

        <HStack space={3} justifyContent="center">
          <Button style={style.btn} px="7" my="3">
            Submit
          </Button>
        </HStack>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Booking;

const styles = StyleSheet.create({
  
});

// <View>
//         <View>
//         <Box style={styles.inputstyel}>
//         <Dropdown
//           style={styles.input}
//           data={data3}
//           labelField="label"
//           valueField="value"
//           placeholder="Referral Skim"
//           value={value3}
//           onChange={(item)=>{setValue3(item.value)}}
//         />
//       </Box>
//         </View>
//         <View>
//         <Box style={styles.inputstyel}>
//         <Dropdown
//           style={styles.input}
//           data={data3}
//           labelField="label"
//           valueField="value"
//           placeholder="Referral Skim"
//           value={value3}
//           onChange={(item)=>{setValue3(item.value)}}
//         />
//       </Box>
//         </View>
//         <View>
//         <Box style={styles.inputstyel}>
//         <Dropdown
//           style={styles.input}
//           data={data3}
//           labelField="label"
//           valueField="value"
//           placeholder="Referral Skim"
//           value={value3}
//           onChange={(item)=>{setValue3(item.value)}}
//         />
//       </Box>
//         </View>
//         <View>
//         <Box style={styles.inputstyel}>
//         <Dropdown
//           style={styles.input}
//           data={data3}
//           labelField="label"
//           valueField="value"
//           placeholder="Referral Skim"
//           value={value3}
//           onChange={(item)=>{setValue3(item.value)}}
//         />
//       </Box>
//         </View>
//         <View>
//         <Box style={styles.inputstyel}>
//         <Dropdown
//           style={styles.input}
//           data={data3}
//           labelField="label"
//           valueField="value"
//           placeholder="Referral Skim"
//           value={value3}
//           onChange={(item)=>{setValue3(item.value)}}
//         />
//       </Box>
//         </View>
//         <View>
//         <Box style={styles.inputstyel}>
//         <Dropdown
//           style={styles.input}
//           data={data3}
//           labelField="label"
//           valueField="value"
//           placeholder="Referral Skim"
//           value={value3}
//           onChange={(item)=>{setValue3(item.value)}}
//         />
//       </Box>
//         </View>
//         </View>

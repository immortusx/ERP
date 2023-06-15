import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { Checkbox, Center, Button, HStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import style from "../style/externalStyle";

const Booking = () => {
  const [isChecked, setIsChecked] = useState(false);
  

  
  const handleCheckboxToggle = () => {
    console.log("checkedsdsds", isChecked);
    setIsChecked(!isChecked);
  };
  


  const [checkboxStates, setCheckboxStates] = useState([
    { value: "RTO", ischecked: false },
    { value: "RTO Tax", ischecked: false },
    { value: "RTO Passing", ischecked: false },
    { value: "Insurance", ischecked: false },
    { value: "Agent Fee", ischecked: false },
  ]);
  
  const handleCheckboxToggle1 = (index) => {
    setCheckboxStates((prevStates) => {
      const updatedCheckboxStates = [...prevStates];
      const checkbox = updatedCheckboxStates[index];
  
      if (checkbox) {
        checkbox.ischecked = !checkbox.ischecked;
  
        // Check/uncheck all subsequent checkboxes based on the parent checkbox state
        if (checkbox.ischecked) {
          for (let i = index + 1; i < updatedCheckboxStates.length; i++) {
            const subsequentCheckbox = updatedCheckboxStates[i];
            if (subsequentCheckbox) {
              subsequentCheckbox.ischecked = true;
            }
          }
        } else {
          for (let i = index + 1; i < updatedCheckboxStates.length; i++) {
            const subsequentCheckbox = updatedCheckboxStates[i];
            if (subsequentCheckbox) {
              subsequentCheckbox.ischecked = false;
            }
          }
        }
      }
  
      return updatedCheckboxStates;
    });
  };
  const navigation = useNavigation();
  const onNextclick = () => {
    navigation.navigate("ConsumerSkim");
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
        <Text style={[style.circleicon, { backgroundColor: "blue" }]}>5</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>6</Text>
      </View>
      <SafeAreaView style={style.content}>
          <Checkbox
            my={2}
            onPress={handleCheckboxToggle}
            isChecked={isChecked}
          >
            RTO
          </Checkbox>
          {isChecked && (
            <View style={{ marginLeft: 20 }}>
            
          {checkboxStates.map((checkbox, index) => (
            <View style={{ marginBottom: 10 }}>
            <Checkbox
              key={index}
              value={checkbox.value}
              isChecked={checkbox.ischecked}
              onPress={() => handleCheckboxToggle1(index)}
            >
              {checkbox.value}
            </Checkbox>
            </View>
          ))}
         
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
 
});



 
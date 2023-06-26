import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { Checkbox, Button, HStack } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import style from "../style/externalStyle";

const RtoDetails = () => {
  const route = useRoute();
  const { formData } = route.params;
  const [formData5, setFormData5] = useState({
    ...formData,
    booking_id:"",
    rto_tax: "",
    rto_passing: "",
    insurance: "",
    agent_fee: "",
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxToggle = () => {
    console.log("checkedsdsds", isChecked);
    setIsChecked(!isChecked);
  };
  const [checkboxStates, setCheckboxStates] = useState([
    {name:"booking_id", value: "RTO", ischecked: false },
    {name:"rto_tax", value: "RTO Tax", ischecked: false },
    {name:"rto_passing", value: "RTO Passing", ischecked: false},
    {name:"insurance", value: "Insurance", ischecked: false },
    {name:"agent_fee", value: "Agent Fee", ischecked: false },
  ]);

  const handleCheckboxToggle1 = (index) => {
    setCheckboxStates((prevCheckboxStates) => {
      const updatedCheckboxStates = [...prevCheckboxStates];
      const checkbox = updatedCheckboxStates[index];

      console.log("checkbox **** ", checkbox);
      if (checkbox) {
        checkbox.ischecked = !checkbox.ischecked;
        console.log(checkbox.ischecked);
        setFormData5((formData) => {
          const updatedFormData = { ...formData };
  
          if (checkbox.name === "booking_id") {
            updatedFormData.booking_id = checkbox.ischecked;
          } 
          if (checkbox.name === "rto_tax") {
            updatedFormData.rto_tax = checkbox.ischecked;
          } 
          if (checkbox.name === "rto_passing") {
            updatedFormData.rto_passing = checkbox.ischecked;
          }
           if (checkbox.name === "insurance") {
            updatedFormData.insurance = checkbox.ischecked;
          } 
           if (checkbox.name === "agent_fee") {
            updatedFormData.agent_fee = checkbox.ischecked;
          }
  
          return updatedFormData;
        });
      }
      return updatedCheckboxStates;
    });
  };
  const navigation = useNavigation();
  const onNextclick = () => {
    navigation.navigate("ConsumerSkim", { formData: formData5 });
    console.log(formData5, "formData5");
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
        <Checkbox my={2} onPress={handleCheckboxToggle} isChecked={isChecked}>
          RTO
        </Checkbox>
        {isChecked && (
          <View style={{ marginLeft: 20 }}>
            {checkboxStates.map((checkbox, index) => (
              <View style={{ marginBottom: 10 }}>
                <Checkbox
                  key={index}
                  value={checkbox.ischecked}
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

export default RtoDetails;

const styles = StyleSheet.create({});


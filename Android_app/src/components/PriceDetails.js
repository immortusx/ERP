import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import React,{useEffect, useState} from 'react'
import { Input, Icon, Box, Flex, Button, HStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import config from "../config";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import style from "../style/externalStyle";

import numberToWords from 'number-to-words';
const Booking = () => {
    const [selectedValue, setSelectedValue] = useState("");
    const [newlist, setNewList] = useState([""]);
    const [number, setNumber] = useState('');
  const [word, setWord] = useState('');

  const handleNumberChange = (text) => {
    const parsedNumber = parseFloat(text);
    if(!isNaN(parsedNumber)){

      setNumber(text);
      const wordRepresentation = numberToWords.toWords(text);
      setWord(wordRepresentation);
    }
    else{
      setNumber('')
      setWord('')
    }
  };

    async function getRoles() {
      const url = `${API_URL}/roles/get-roles-to-edit`;
      // const url = `${config.API_URL}/api/enquiry/get-dsp/${id}`;
      const token = await AsyncStorage.getItem("rbacToken");
      const conf = {
        headers: {
          token: token,
        },
      };
      await axios.get(url, conf).then((response) => {
        if (response.data) {
          if (response.data.isSuccess) {
            console.log("response.data rollist", response.data.result);
            const list = response.data.result;
            setNewList(
              list.map((list) => ({
                label: list.role,
                value: list.id,
              }))
            );
            console.log(listdspdata, "RolIST");
          }
        }
      });
    }

    useEffect(()=>{
      getRoles();
     },[])
    const navigation = useNavigation();
     const onNextclick = ()=>{
        navigation.navigate("CoustomerDetails");
     } 

  return (
    <ScrollView>
    <View style={style.animatednav}>
    <Text style={[style.circleicon, { backgroundColor: 'blue' }]}>1</Text>
     <Text style={style.line}></Text>
    <Text style={[style.circleicon, { backgroundColor: 'blue' }]}>2</Text>
     <Text style={style.line}></Text>
    <Text style={[style.circleicon, { backgroundColor: 'white' }]}>3</Text>
     <Text style={style.line}></Text>
    <Text style={[style.circleicon, { backgroundColor: 'white' }]}>4</Text>
     <Text style={style.line}></Text>
    <Text style={[style.circleicon, { backgroundColor: 'white' }]}>5</Text>
     <Text style={style.line}></Text>
    <Text style={[style.circleicon, { backgroundColor: 'white' }]}>6</Text>
    </View>
      <SafeAreaView style={style.content}>
        <View>
        <Box style={style.inputstyel} alignItems="center">
        <Input
          keyboardType="default"
          mx="3"
          size="lg"
          w="100%"
          value={number}
          onChangeText={handleNumberChange}
          placeholder="Deal Price"
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
          value={word}
          editable={false}
          placeholder="Price in words"
          placeholderTextColor="black"
        />
      </Box>
        </View>
        <View>
          <Box style={style.inputstyel}>
            <Dropdown
              style={style.input}
              data={newlist}
              labelField="label"
              valueField="value"
              placeholder="With GST"
              value={selectedValue}
              onChange={(selectedItem) => {
                setSelectedValue(selectedItem.value);
              }}
            />
          </Box>
        </View>
       
        <HStack space={3} justifyContent="center">
          <Button onPress={onNextclick} style={style.btn} px="7" my="3">
            Next
          </Button>
          
        </HStack>
      </SafeAreaView>
    </ScrollView>
  )
}

export default Booking

const styles = StyleSheet.create({
  
    
})
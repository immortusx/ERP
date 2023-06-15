import { StyleSheet, View, ScrollView, Text, SafeAreaView,TouchableWithoutFeedback } from "react-native";
import React,{useState,useEffect} from 'react'
import { Input,  Box,  Button, HStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import config from "../config";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from "moment/moment";
import style from "../style/externalStyle";

const Booking = () => {
   

    const [selectedValue, setSelectedValue] = useState("");
    const [newlist, setNewList] = useState([""]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [enquirydate, setEnquiryDate] = useState("");

    const handleConfirmDate = (date) => {
      console.log("Date confirm")
      setDatePickerVisibility(false);
      setEnquiryDate(moment(date).format("MM/DD/YYYY"));
    };
    const handleDateCancel = () => {
      console.log("Date is cancle")
      setDatePickerVisibility(false);
    };
  
    const handleShowDatePicker = () => {
      console.log("datepicker is visible")
      setDatePickerVisibility(true);
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
        navigation.navigate("DownPayment");
     } 

  return (
    
    <ScrollView>
    <View style={style.animatednav}>
    <Text style={[style.circleicon, { backgroundColor: 'blue' }]}>1</Text>
    <Text style={style.line}></Text>
    <Text style={[style.circleicon, { backgroundColor: 'blue' }]}>2</Text>
    <Text style={style.line}></Text>
    <Text style={[style.circleicon, { backgroundColor: 'blue' }]}>3</Text>
    <Text style={style.line}></Text>
    <Text style={[style.circleicon, { backgroundColor: 'white' }]}>4</Text>
    <Text style={style.line}></Text>
    <Text style={[style.circleicon, { backgroundColor: 'white' }]}>5</Text>
    <Text style={style.line}></Text>
    <Text style={[style.circleicon, { backgroundColor: 'white' }]}>6</Text>
    </View>
      <SafeAreaView style={[style.content, { marginBottom:30 }]}>
        <View>
        <TouchableWithoutFeedback onPress={handleShowDatePicker}>
        <Box style={style.inputstyel} alignItems="center">
        <Input
        keyboardType="default"
        mx="3"
        size="lg"
        w="100%"
        placeholder="Select Date"
        placeholderTextColor="black"
        onChangeText={(value) => setEnquiryDate(value)}
        value={enquirydate}
        editable={false}
        />
        </Box>
        </TouchableWithoutFeedback>
        <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={handleDateCancel}
        />
        </View>
        <View>
        <Box style={style.inputstyel} alignItems="center">
        <Input
          keyboardType="numeric"
          mx="3"
          size="lg"
          w="100%"
          placeholder="Mobile No"
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
          placeholder="Enter First Name"
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
          placeholder="Enter Last Name"
          placeholderTextColor="black"
        />
      </Box>
        </View>
        <View>
        <Box style={style.inputstyel} alignItems="center">
        <Input
          keyboardType="numeric"
          mx="3"
          size="lg"
          w="100%"
          placeholder="WhatsApp No"
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
          placeholder="Enter State"
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
          placeholder="Enter City"
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
          placeholder="Enter District"
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
          placeholder="Enter Taluko"
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
          placeholder="Enter Village"
          placeholderTextColor="black"
        />
      </Box>
        </View>
        <View>
        <Box style={style.inputstyel}>
        <Dropdown 
        style={[style.input,{ backgroundColor: 'green' }]}
        data={newlist}
        labelField="label"
        valueField="value"
          placeholder="agricultural"
          placeholderTextColor="black"
          value={selectedValue}
          onChange={(selectedItem) => {
            setSelectedValue(selectedItem.value);
          }}
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
              placeholder="Payment"
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
import { StyleSheet, View, ScrollView, Text, SafeAreaView,TouchableWithoutFeedback } from "react-native";
import React,{useState,useEffect} from 'react'
import { Input,  Box,  Button, HStack } from "native-base";
import { useNavigation,useRoute } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import config from "../config";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from "moment/moment";
import style from "../style/externalStyle";

const CoustomerDetails = () => {
  const route = useRoute();
  const { formData } = route.params;
    const [newlist, setNewList] = useState([""]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [enquirydate, setEnquiryDate] = useState("");
    const [deliverydate, setDeliveryDate] = useState("");
    const [formData3, setFormData3] = useState({
      ...formData,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      whatsapp_number: "",
      state: "",
      city: "",
      district: "",
      taluka: "",
      village: "",
      payment_mode: "",
      booking_date: "",
      delivery_date:"",
      type_of_use: "",
    });
  const changehandler = (value, name)=>{
   setFormData3((formData)=>({
    ...formData,
[name]: value
   }))
  }

    const handleConfirmDate = (date) => {
      console.log("Date confirm")
      setDatePickerVisibility(false);
      const formattedDate = moment(date).format("YYYY-MM-DD");
  setEnquiryDate(formattedDate);
      setFormData3((formData) => ({
        ...formData,
        booking_date: formattedDate,
      }));
    }
    const handleConfirmDate1 = (date) => {
      console.log("Date confirm")
      setDatePickerVisibility(false);
      const deliverydDate = moment(date).format("YYYY-MM-DD");
  setDeliveryDate(deliverydDate);
      setFormData3((formData) => ({
        ...formData,
        delivery_date: deliverydDate,
      }));
    }
    const handleDateCancel = () => {
      console.log("Date is cancle")
      setDatePickerVisibility(false);
    };
  
    const handleDateCancel1 = () => {
      console.log("Date is cancle")
      setDatePickerVisibility(false);
    };
  
    const handleShowDatePicker = () => {
      console.log("datepicker is visible")
      setDatePickerVisibility(true);
    };
    const handleShowDatePicker1 = () => {
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
        navigation.navigate("DownPayment",{formData: formData3 });
        console.log( formData3, "formData3")

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
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>4</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>5</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>6</Text>
      </View>
      <SafeAreaView style={[style.content, { marginBottom: 30 }]}>
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
                value={formData3.booking_date}
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
          <TouchableWithoutFeedback onPress={handleShowDatePicker}>
            <Box style={style.inputstyel} alignItems="center">
              <Input
                keyboardType="default"
                mx="3"
                size="lg"
                w="100%"
                placeholder="Select Delivery Date"
                placeholderTextColor="black"
                onChangeText={(value) =>setDeliveryDate(value)}
                value={formData3.delivery_date}
                editable={false}
              />
            </Box>
          </TouchableWithoutFeedback>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate1}
            onCancel={handleDateCancel1}
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
              value={formData3.phone_number}
              onChangeText={(item) => {
                changehandler(item, "phone_number");
              }}
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
              value={formData3.first_name}
              onChangeText={(item) => {
                changehandler(item, "first_name");
              }}
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
              placeholder="Enter  Last Name"
              placeholderTextColor="black"
              value={formData3.last_name}
              onChangeText={(item) => {
                changehandler(item, "last_name");
              }}
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
              placeholder="Enter Email"
              placeholderTextColor="black"
              value={formData3.email}
              onChangeText={(item) => {
                changehandler(item, "email");
              }}
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
              value={formData3.whatsapp_number}
              onChangeText={(item) => {
                changehandler(item, "whatsapp_number");
              }}
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
              value={formData3.state}
              onChangeText={(item) => {
                changehandler(item, "state");
              }}
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
              value={formData3.city}
              onChangeText={(item) => {
                changehandler(item, "city");
              }}
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
              value={formData3.district}
              onChangeText={(item) => {
                changehandler(item, "district");
              }}
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
              value={formData3.taluka}
              onChangeText={(item) => {
                changehandler(item, "taluka");
              }}
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
              value={formData3.village}
              onChangeText={(item) => {
                changehandler(item, "village");
              }}
            />
          </Box>
        </View>
        <View>
          <Box style={style.inputstyel}>
            <Dropdown
              style={[style.input, { backgroundColor: "green" }]}
              data={newlist}
              labelField="label"
              valueField="value"
              placeholder="agricultural"
              placeholderTextColor="black"
              value={formData3.type_of_use}
              onChange={(item) => {
                changehandler(item.label, "type_of_use");
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
              value={formData3.payment_mode}
              onChange={(item) => {
                changehandler(item.label, "payment_mode");
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
  );
}

export default CoustomerDetails

const styles = StyleSheet.create({
  
})
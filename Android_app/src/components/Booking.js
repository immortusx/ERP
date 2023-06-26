import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { Input, Icon, Box, Flex, Button, HStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import config from "../config";
import { API_URL } from "@env";
import style from "../style/externalStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Booking = () => {
  const [showRolesList, setShowRolesList] = useState([]);
  const [categorieslist, setCategoriesList] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    email: "",
    state: "",
    district: "",
    taluka: "",
    village: "",
    products: "",
    model: "",
    price: "",
    down_payment: "",
    payment_mode: "",
    booking_date: "",
    delivery_date: "",
    delivery_date: "",
    type_of_use: "",
    booking_id: "",
    rto_tax: "",
    rto_passing: "",
    insurance: "",
    agent_fee: "",
  });

  const changehandler = (value, name) => {
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  async function getRoles() {
    const url = `${API_URL}/roles/get-roles-to-edit`;
    const token = await AsyncStorage.getItem("rbacToken");
    const conf = {
      headers: {
        token: token,
      },
    };
    await axios.get(url, conf).then((response) => {
      if (response.data?.isSuccess) {
        const rollist = response.data.result;
        setShowRolesList(
          rollist.map((list) => ({
            label: list.role,
            value: list.id,
          }))
        );
        console.log("get-roles-to-edit result", response.data.result);
      }
    });
  }

  async function getEnquiryCategories() {
    console.log(">>>>>>getEnquiryCategories");
    const url = `${API_URL}/enquiry/get-enquiry-categories`;
    const token = await AsyncStorage.getItem("rbacToken");
    const config = {
      headers: {
        token: token,
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data) {
        // setRoles(response.data.result)
        if (response.data.isSuccess) {
          const getcategory = response.data.result;
          setCategoriesList(
            getcategory.map((list) => ({
              label: list.category_name,
              value: list.id,
            }))
          );
        }
      }
    });
  }
  useEffect(() => {
    getRoles();
    getEnquiryCategories();
  }, []);

  const navigation = useNavigation();
  const Nextclick = () => {
    navigation.navigate("PriceDetails", { formData });
    console.log(formData, "formData1");
  };

  return (
    <ScrollView>
      <View style={style.animatednav}>
        <Text style={[style.circleicon, { backgroundColor: "blue" }]}>1</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>2</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>3</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>4</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>5</Text>
        <Text style={style.line}></Text>
        <Text style={[style.circleicon, { backgroundColor: "white" }]}>6</Text>
      </View>
      <SafeAreaView style={style.content}>
        <View>
          <Box style={style.inputstyel}>
            <Dropdown
              style={style.input}
              data={showRolesList}
              labelField="label"
              valueField="value"
              placeholder="Select product"
              value={formData.products}
              onChange={(item) => {
                changehandler(item.label, "products");
              }}
            />
          </Box>
        </View>
        <View>
          <Box style={style.inputstyel}>
            <Dropdown
              style={style.input}
              data={categorieslist}
              labelField="label"
              valueField="value"
              placeholder="Select Model"
              value={formData.model}
              onChange={(item) => {
                changehandler(item.label, "model");
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
              placeholder="Discriotion"
              placeholderTextColor="black"
            />
          </Box>
        </View>
        <HStack space={3} justifyContent="center">
          <Button onPress={Nextclick} style={style.btn} px="7" my="3">
            Next
          </Button>
        </HStack>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Booking;

const styles = StyleSheet.create({});

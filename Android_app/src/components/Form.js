import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { Input, Icon, Box, Flex, Button, HStack } from "native-base";
import { RadioButton } from "react-native-paper";
// import moment from "moment/moment";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setNewEnquiryDataDb,
  clearNewEnquiryState,
} from "../redux/slice/setNewEnquiryDataSlice";
import config from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { setShowMessage } from "../redux/slice/notificationSlice";
const Form = () => {
  const [value, setValue] = useState(null);
  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const oncancleclick = () => {
    navigation.navigate("Enquiry");
  };
  const [redio, setRedio] = useState("0");
  const [BirthDate, setBirthDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const getEnquiryState = (state) => state.enquiryState.enquiryState;
  const getNewEnquiryDataState = (state) =>
    state.setNewEnquiryDataState.newEnquiryState;

  const enquiryState = useSelector(getEnquiryState);
  const setNewEnquiryDataState = useSelector(getNewEnquiryDataState);

  const [newEnquiryData, setNewEnquiryData] = useState({
    branchId: "",
    dsp: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    mobileNumber: "",
    district: "",
    tehsil: "",
    block: "",
    village: "",
    ssp: "",
    make: "",
    model: "",
    enquiryPrimarySource: "",
    sourceOfEnquiry: "",
    enquiryDate: new Date(),
    deliveryDate: new Date(),
    cuustomerCategory: "",
    modeOfFinance: "",
    bank: "",
    oldTractorOwned: "0",
  });

  const [newEnquiryList, setNewEnquiryList] = useState({
    listBranch: [],
    listDsp: [],
    listDistrict: [],
    listTehsil: [],
    listBlock: [{ id: "11" }, { id: "22" }, { id: "33" }],
    listVillage: [],
    listSsp: [],
    listMake: [],
    listModel: [],
    listPrimarySource: [],
    listSourceOfEnquiry: [],
    listCustomerCategory: [],
    listModeOfFinance: [
      { id: 1, name: "Cash" },
      { id: 2, name: "Credit Card" },
      { id: 3, name: "Debit Card" },
    ],
    listBank: [
      { id: 1, name: "State Bank Of India" },
      { id: 2, name: "Bank Of Baroda" },
    ],
  });
  function clearStateAndInp() {
    setNewEnquiryData({
      branchId: "",
      dsp: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      mobileNumber: "",
      district: "",
      tehsil: "",
      block: "",
      village: "",
      ssp: "",
      make: "",
      model: "",
      enquiryPrimarySource: "",
      sourceOfEnquiry: "",
      enquiryDate: new Date(),
      deliveryDate: new Date(),
      cuustomerCategory: "",
      modeOfFinance: "",
      bank: "",
      oldTractorOwned: "0",
    });
  }
  const onsaveclick = () => {
    console.log("newEnquiryList", newEnquiryList);
    console.log("newEnquiryData", newEnquiryData);
    if (
      newEnquiryData.branchId &&
      newEnquiryData.dsp &&
      newEnquiryData.firstName &&
      newEnquiryData.lastName &&
      newEnquiryData.fatherName &&
      newEnquiryData.mobileNumber &&
      newEnquiryData.district &&
      newEnquiryData.tehsil &&
      newEnquiryData.block &&
      newEnquiryData.village &&
      newEnquiryData.make &&
      newEnquiryData.model &&
      newEnquiryData.enquiryPrimarySource &&
      newEnquiryData.sourceOfEnquiry &&
      newEnquiryData.enquiryDate
    ) {
      dispatch(setNewEnquiryDataDb(newEnquiryData));
      console.log(newEnquiryData, "formdata");
      alert("form Save Successfully");
    } else {
      dispatch(setShowMessage("Please fill mandatory fields"));
      console.log("formdata failed");
    alert("Please fill mandatory fields")
    }
  };

  useEffect(() => {
    // console.log("setNewEnquiryDataState", setNewEnquiryDataState);
    // if (setNewEnquiryDataState.isSuccess) {
    //   if (setNewEnquiryDataState.data.isSuccess) {
    //     dispatch(clearNewEnquiryState());
        clearStateAndInp()
    //     dispatch(setShowMessage("Enquiry is registered"));
    //     // // navigate('/home/enquiryies')
    //   }
    // }
  }, [setNewEnquiryDataState]);

  const [branch, setBranch] = useState([""]);
  const [district, setDistrict] = useState([""]);
  const [newlistDSP, setNewListDSP] = useState([""]);
  const [tehsil, setTehsil] = useState([""]);
  const [makelist, setMakeList] = useState([""]);
  const [sourcelist, setSourceList] = useState([""]);
  const [modeldata, setModelData] = useState([""]);
  const [villagedata, setVillageData] = useState([""]);
  const [sourceofenquiry, setSourceOfEnquiry] = useState([""]);

  async function getBranchs() {
    const url = `${API_URL}/api/enquiry/enquiry-data`;
    // const url = `${config.API_URL}/api/enquiry/enquiry-data`;
    const token = await AsyncStorage.getItem("rbacToken");
    if (!token) {
      // Redirect the user to the login page or handle unauthorized access
      return;
    }
    const conf = {
      headers: {
        token: token,
      },
    };
    await axios.get(url, conf).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          console.log(response.data.result);

          const { branches, manufacturers, primary_source, district } =
            response.data.result;
          setBranch(
            branches.map((branch) => ({ label: branch.name, value: branch.id }))
          );
          setDistrict(
            district.map((dist) => ({ label: dist.name, value: dist.id }))
          );
          setMakeList(
            manufacturers.map((make) => ({ label: make.name, value: make.id }))
          );
          setSourceList(
            primary_source.map((source) => ({
              label: source.name,
              value: source.id,
            }))
          );

          // setNewEnquiryList(newEnquiryList => ({ ...newEnquiryList, ['listBranch']: branches }))
          // setNewEnquiryList(newEnquiryList => ({ ...newEnquiryList, ['listMake']: manufacturers }))
          // setNewEnquiryList(newEnquiryList => ({ ...newEnquiryList, ['listPrimarySource']: primary_source }))
          // setNewEnquiryList(newEnquiryList => ({ ...newEnquiryList, ['listDistrict']: district }))
        }
      }
    });
  }

  async function getDspList(id) {
    const url = `${API_URL}/api/enquiry/get-dsp/${id}`;
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
          console.log("response.data dsplist", response.data.result);
          const listdspdata = response.data.result;
          setNewListDSP(
            listdspdata.map((list) => ({
              label: `${list.first_name} ${list.last_name}`,
              value: list.id,
            }))
          );
          console.log(listdspdata, "DSPlIST");
        }
      }
    });
  }
  async function getTehsilList(id) {
    const url = `${API_URL}/api/enquiry/get-tehsil/${id}`;
    // const url = `${config.API_URL}/api/enquiry/get-tehsil/${id}`;
    const token = await AsyncStorage.getItem("rbacToken");
    const conf = {
      headers: {
        token: token,
      },
    };
    await axios.get(url, conf).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          console.log("response.data dsplist", response.data.result);
          const tehsildata = response.data.result;
          setTehsil(
            tehsildata.map((list) => ({ label: list.name, value: list.id }))
          );
          console.log(tehsildata, "tehsildata");
        }
      }
    });
  }
  async function getModelList(id) {
    // const url = `${config.API_URL}/api/enquiry/get-model/${id}`;
    const url = `${API_URL}/api/enquiry/get-model/${id}`;
    const token = await AsyncStorage.getItem("rbacToken")
    const conf = {
      headers: {
        token: token,
      },
    };
    await axios.get(url, conf).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          console.log("response.data", response.data.result);
          const modlelist = response.data.result;
          setModelData(
            modlelist.map((list) => ({ label: list.name, value: list.id }))
          );
          console.log(modlelist, "modlelist");
          // setCategoriesList(response.data.result)
          // setNewEnquiryList(newEnquiryList => ({ ...newEnquiryList, ['listModel']: response.data.result }))
        }
      }
    });
  }
  async function getSourceOfEnquiryList(id) {
    // const url = `${config.API_URL}/api/enquiry/get-source-enquiry/${id}`;
    const url = `${API_URL}/api/enquiry/get-source-enquiry/${id}`;
    const token = await AsyncStorage.getItem("rbacToken")
    const conf = {
      headers: {
        token:token,
      },
    };
    await axios.get(url, conf).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          console.log("response.data", response.data.result);
          const sourceofenquiry = response.data.result;
          setSourceOfEnquiry(
            sourceofenquiry.map((list) => ({
              label: list.name,
              value: list.id,
            }))
          );
          console.log(sourceofenquiry, "sourceofenquiry");

          // setNewEnquiryList(newEnquiryList => ({ ...newEnquiryList, ['listSourceOfEnquiry']: response.data.result }))
        }
      }
    });
  }
  async function getVillageList(id) {
    // const url = `${config.API_URL}/api/enquiry/get-village/${id}`;
    const url = `${API_URL}/api/enquiry/get-village/${id}`;
    const token = await AsyncStorage.getItem("rbacToken")
    const conf = {
      headers: {
        token:token,
      },
    };
    await axios.get(url, conf).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          console.log("response.data", response.data.result);
          const villagelist = response.data.result;
          setVillageData(
            villagelist.map((list) => ({ label: list.name, value: list.id }))
          );
          console.log(villagelist, "villagelist");
          // setNewEnquiryList(newEnquiryList => ({ ...newEnquiryList, ['listVillage']: response.data.result }))
        }
      }
    });
  }

  function changeHandlerNewEnquiry(value, name) {
    console.log(
      "in changeHandlerNewEnquiry <<name>>:",
      name,
      ", <<value>>:",
      value
    );
    setNewEnquiryData((newEnquiryData) => ({
      ...newEnquiryData,
      [name]: value,
    }));
    setRedio(value);
    if (value === "" || value === 0) {
    } else {
      switch (name) {
        case "branchId":
          getDspList(value);
          break;
        case "make":
          getModelList(value);
          break;
        case "enquiryPrimarySource":
          getSourceOfEnquiryList(value);
          break;
        case "district":
          getTehsilList(value);
          break;
        case "tehsil":
          getVillageList(value);
          break;
      }
    }
  }

  useEffect(() => {
    getBranchs();
    console.log("new form");
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={styles.content}>
        <View>
          <Text style={styles.textstyle}>Select Branch*</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={branch}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.branchId}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "branchId");
              }}
            />
          </Box>
        </View>

        <View>
          <Text style={styles.textstyle}>Select DSP*</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={newlistDSP}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.dsp}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "dsp");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>First Name*</Text>
          <Box style={styles.inputstyel} alignItems="center">
            <Input
              name="firstName"
              keyboardType="default"
              mx="3"
              size="lg"
              w="100%"
              placeholderTextColor="black"
              value={newEnquiryData.firstName}
              onChangeText={(item) => {
                changeHandlerNewEnquiry(item, "firstName");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Last Name*</Text>
          <Box style={styles.inputstyel} alignItems="center">
            <Input
              name="lastName"
              keyboardType="default"
              mx="3"
              size="lg"
              w="100%"
              placeholderTextColor="black"
              value={newEnquiryData.lastName}
              onChangeText={(item) => {
                changeHandlerNewEnquiry(item, "lastName");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Father Name*</Text>
          <Box style={styles.inputstyel} alignItems="center">
            <Input
              name="fatherName"
              keyboardType="default"
              mx="3"
              size="lg"
              w="100%"
              placeholderTextColor="black"
              value={newEnquiryData.fatherName}
              onChangeText={(item) => {
                changeHandlerNewEnquiry(item, "fatherName");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Email*</Text>
          <Box style={styles.inputstyel} alignItems="center">
            <Input
              name="emailId"
              keyboardType="email"
              mx="3"
              size="lg"
              w="100%"
              placeholderTextColor="black"
              value={newEnquiryData.emailId}
              onChangeText={(item) => {
                changeHandlerNewEnquiry(item, "emailId");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Mobile Number*</Text>
          <Box style={styles.inputstyel} alignItems="center">
            <Input
              name="mobileNumber"
              keyboardType="numeric"
              mx="3"
              size="lg"
              w="100%"
              placeholderTextColor="black"
              value={newEnquiryData.mobileNumber}
              onChangeText={(item) => {
                changeHandlerNewEnquiry(item, "mobileNumber");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select District*</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={district}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.district}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "district");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select Teshil*</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={tehsil}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.tehsil}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "tehsil");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select Block*</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={newEnquiryList.listBlock.map((i) => ({
                label: i.id,
                value: i.id,
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.block}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "block");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select Village*</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={villagedata}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.village}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "village");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select SSP</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select Make*</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={makelist}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.make}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "make");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select Model*</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={modeldata}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.model}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "model");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Enquiry primary Source*</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={sourcelist}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.enquiryPrimarySource}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "enquiryPrimarySource");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select Source of Enquiry*</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={sourceofenquiry}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.sourceOfEnquiry}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "sourceOfEnquiry");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Enquiry Date*</Text>
          <Box style={styles.inputstyel} alignItems="center">
            <Input
              mx="3"
              size="lg"
              InputRightElement={
                <Icon
                  as={<Fontisto name="date" />}
                  size={5}
                  mr="2"
                  color="muted.400"
                />
              }
              placeholder="Expected Delivery Date"
              placeholderTextColor="black"
              w="100%"
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Expected Delivery Date</Text>
          <Box style={styles.inputstyel} alignItems="center">
            <Input
              mx="3"
              size="lg"
              InputRightElement={
                <Icon
                  as={<Fontisto name="date" />}
                  size={5}
                  mr="2"
                  color="muted.400"
                />
              }
              placeholder="Expected Delivery Date"
              placeholderTextColor="black"
              w="100%"
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select Customer Category</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select Mode Of Finance</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={newEnquiryList.listModeOfFinance.map((i) => ({
                label: i.name,
                value: i.id,
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.modeOfFinance}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "modeOfFinance");
              }}
            />
          </Box>
        </View>
        <View>
          <Text style={styles.textstyle}>Select Bank</Text>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={newEnquiryList.listBank.map((i) => ({
                label: i.name,
                value: i.id,
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={newEnquiryData.bank}
              onChange={(item) => {
                changeHandlerNewEnquiry(item.value, "bank");
              }}
            />
          </Box>
        </View>
        <RadioButton.Group
          onValueChange={(value) =>
            changeHandlerNewEnquiry(value, "oldTractorOwned")
          }
          value={newEnquiryData.oldTractorOwned}
        >
          <Flex direction="row" justifyContent="space-evenly">
            <View>
              <Flex direction="row" alignItems="center">
                <RadioButton value="0" />
                <Text
                  onPress={() =>
                    changeHandlerNewEnquiry("0", "oldTractorOwned")
                  }
                >
                  Old Tractor Owned Yes
                </Text>
              </Flex>
            </View>
            <View>
              <Flex direction="row" alignItems="center">
                <RadioButton value="1" />
                <Text
                  onPress={() =>
                    changeHandlerNewEnquiry("1", "oldTractorOwned")
                  }
                >
                  Old Tractor Owned No
                </Text>
              </Flex>
            </View>
          </Flex>
        </RadioButton.Group>
        <HStack space={3} justifyContent="center">
          <Button style={styles.btn} onPress={onsaveclick} px="7" my="3">
            Save
          </Button>
          <Button style={styles.btn} onPress={oncancleclick} px="7" my="3">
            Cancle
          </Button>
        </HStack>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Form;

const styles = StyleSheet.create({
  textstyle: {
    marginLeft: 10,
    fontSize: 20,
  },
  content: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },

  inputstyel: {
    marginHorizontal: 10,
    marginBottom: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
  input: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  btn: {
    backgroundColor: "grey",
    color: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
});

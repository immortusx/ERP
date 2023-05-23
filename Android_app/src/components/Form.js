import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Input, Icon, Box, Flex, Button,HStack } from "native-base";
import { RadioButton } from "react-native-paper";

const Form = () => {
  const navigation = useNavigation();
  const onsaveclick = () => {
    alert("Please fill Mendetory fields")
    // navigation.navigate("header");
  }
  const oncancleclick = () => {
    navigation.navigate("Enquiry");
  }
  const [redio, setRedio] = useState();
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const [value2, setValue2] = useState(null);
  const [value3, setValue3] = useState(null);
  const [value4, setValue4] = useState(null);
  const [value5, setValue5] = useState(null);
  const [value6, setValue6] = useState(null);
  const [value7, setValue7] = useState(null);
  const [value8, setValue8] = useState(null);
  const [value9, setValue9] = useState(null);
  const [value10, setValue10] = useState(null);
  const [value11, setValue11] = useState(null);
  const [value12, setValue12] = useState(null);

  const data = [
    { label: "Select State", value: "Select State" },
    { label: "Gujarat", value: "Gujarat" },
  ];
  const data1 = [
    { label: "Select District", value: "Select District" },
    { label: "Gujarat", value: "Gujarat" },
  ];
  const data2 = [{ label: "Select Teshil", value: "Select Teshil" }];
  const data3 = [{ label: "Select Block", value: "Select Block" }];
  const data4 = [{ label: "Select Village", value: "Select Village" }];
  const data5 = [{ label: "Select SSP", value: "Select SSP" }];
  const data6 = [{ label: "Select Make", value: "Select Make" }];
  const data7 = [{ label: "Select Model", value: "Select Model" }];
  const data8 = [
    { label: "Enquiry primary Source", value: "Enquiry primary Source" },
  ];
  const data9 = [
    { label: "Select Source of Enquiry", value: "Select Source of Enquiry" },
  ];
  const data10 = [
    { label: "Select Customer Category", value: "Select Customer Category" },
  ];
  const data11 = [
    { label: "Select Model Of Finance", value: "Select Model Of Finance" },
  ];
  const data12 = [{ label: "Select Bank", value: "Select Bank" }];

  const MyFunctionCall = () => {
    // console.log("api call");
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        const countrycity = data.map((item) => ({
          label: item.address.city,
          value: item.address.city,
        }));
        // console.log(item)
        // console.log(item.address.city)
        // console.log(countrycity, "countrycity");
        // console.log(data, "data");
        setCity(countrycity);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    MyFunctionCall();
    // const countrycity = data.map(item => item.address.city)
    // console.log(item)
    // console.log(item.address.city)
    // console.log(countrycity,'countrycity')

    // return cityname;
    // city.forEach((person) => {
    // })
    // console.log(person)
  }, []);

  return (
    <ScrollView>
    <SafeAreaView style={styles.content}>
      <View>
      <Text style={styles.textstyle}>
      Select Dealer*
       </Text>
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
        <Text style={styles.textstyle}>
        Select DSP*
         </Text>
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data1}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value1}
            onChange={(item) => {
              setValue1(item.value);
            }}
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        First Name*
         </Text>
        <Box style={styles.inputstyel} alignItems="center">
          <Input
            mx="3"
            size="lg"
            placeholderTextColor="black"
            w="100%"
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Last Name*
         </Text>
        <Box style={styles.inputstyel} alignItems="center">
          <Input
            mx="3"
            size="lg"
            placeholderTextColor="black"
            w="100%"
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Father Name*
         </Text>
        <Box style={styles.inputstyel} alignItems="center">
          <Input
            mx="3"
            size="lg"
            placeholderTextColor="black"
            w="100%"
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Email*
         </Text>
        <Box style={styles.inputstyel} alignItems="center">
          <Input
            mx="3"
            size="lg"
            placeholderTextColor="black"
            w="100%"
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Mobile Number*
         </Text>
        <Box style={styles.inputstyel} alignItems="center">
          <Input
            mx="3"
            size="lg"
            placeholderTextColor="black"
            w="100%"
          />
        </Box>
</View>
<View>
<Text style={styles.textstyle}>
Select District*
 </Text>
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data2}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value2}
            onChange={(item) => {
              setValue2(item.value);
            }}
          />
        </Box>
        </View>
        <View>
<Text style={styles.textstyle}>
Select Teshil*
 </Text>
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={city}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={selectedCity}
            onChange={(selectedItem) => {
              setSelectedCity(selectedItem.value);
            }}
          />
        </Box>
        </View>
        <View>
<Text style={styles.textstyle}>
Select Block*
 </Text>
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data3}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value3}
            onChange={(item) => {
              setValue3(item.value);
            }}
          />
        </Box>
        </View>
        <View>
<Text style={styles.textstyle}>
Select Village*
 </Text>
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data4}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value4}
            onChange={(item) => {
              setValue4(item.value);
            }}
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Select SSP
         </Text>
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data5}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value5}
            onChange={(item) => {
              setValue5(item.value);
            }}
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Select Make*
         </Text>
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data6}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value6}
            onChange={(item) => {
              setValue6(item.value);
            }}
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Select Model*
         </Text>
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data7}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value7}
            onChange={(item) => {
              setValue7(item.value);
            }}
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Enquiry primary Source*
         </Text> 
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data8}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value8}
            onChange={(item) => {
              setValue8(item.value);
            }}
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Select Source of Enquiry*
         </Text> 
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data9}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value9}
            onChange={(item) => {
              setValue9(item.value);
            }}
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Enquiry Date*
         </Text> 
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
            placeholder="Enquiry Date"
            placeholderTextColor="black"
            w="100%"
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Expected Delivery Date
         </Text> 
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
        <Text style={styles.textstyle}>
        Select Customer Category
         </Text> 
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data10}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value10}
            onChange={(item) => {
              setValue10(item.value);
            }}
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Select Mode Of Finance
         </Text> 
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data11}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value11}
            onChange={(item) => {
              setValue11(item.value);
            }}
          />
        </Box>
        </View>
        <View>
        <Text style={styles.textstyle}>
        Select Bank
         </Text> 
        <Box style={styles.inputstyel}>
          <Dropdown
            style={styles.input}
            data={data12}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={value12}
            onChange={(item) => {
              setValue12(item.value);
            }}
          />
        </Box>
</View>
        <RadioButton.Group
          onValueChange={(newValue) => setRedio(newValue)}
          value={redio}
        >
          <Flex direction="row" justifyContent="space-evenly">
            <View>
              <Flex direction="row" alignItems="center">
                <RadioButton value="one" />
                <Text>Old Tractor Owned Yes</Text>
              </Flex>
            </View>
            <View>
              <Flex direction="row" alignItems="center">
                <RadioButton value="two" />
                <Text>Old Tractor Owned No</Text>
              </Flex>
            </View>
          </Flex>
        </RadioButton.Group>
        <HStack space={3} justifyContent="center">
          <Button  style={styles.btn} onPress={onsaveclick}  px="7" my="3">
            Save
          </Button>
          <Button  style={styles.btn} onPress={oncancleclick}  px="7" my="3">
           Cancle
          </Button>
          </HStack>
    
      </SafeAreaView>
    </ScrollView>
  );
};

export default Form;

const styles = StyleSheet.create({
  textstyle:{
    marginLeft:10,
  },
  content:{
    backgroundColor:'white',
    paddingVertical:20,
    paddingHorizontal: 20,
     flex: 1,
     justifyContent: "center",
  },
 
  inputstyel: {
    marginHorizontal:10,
    marginBottom:30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
  input: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  btn:{
backgroundColor:"grey",
color:'white',
borderRadius:5,
borderWidth:1,
borderColor:'black',
  }
  
});




// <View style={styles.inputstyel}>
//   <Dropdown
//     style={styles.input}
//     data={data5}
//     labelField="label"
//     valueField="value"
//     placeholder="Select source of inquiry"
//     value={value5}
//     onChange={(item) => {
//       setValue5(item.value);
//     }}
//   />
// </View>

// <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={redio} onChange={nextValue => {
//   setRedio(nextValue);
// }}>
// <Flex direction="row"  >
// <Radio value="one" my={1}>
// <Text>Old Tractor Owned Yes</Text>
// </Radio>
// <Radio value="two" my={1}>
// <Text>Old Tractor Owned No</Text>
// </Radio>
// </Flex>
// </Radio.Group>

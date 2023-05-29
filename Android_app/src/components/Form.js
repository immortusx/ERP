import { StyleSheet, View, ScrollView, Text, SafeAreaView,TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Fontisto,MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from 'react-native-element-dropdown';
import { Input, Icon, Box, Flex, Button,HStack } from "native-base";
import { RadioButton } from "react-native-paper";
import moment from "moment/moment";


const Form = () => {
  const [value, setValue] = useState(null);
const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

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
  const [BirthDate, setBirthDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


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



  const handleConfirmDate = (date) => {
    console.log("Date confirm")
    setDatePickerVisibility(false);
    setBirthDate(moment(date).format("MM/DD/YYYY"));
  };

  const handleDateCancel = () => {
    console.log("Date is cancle")
    setDatePickerVisibility(false);
  };

  const handleShowDatePicker = () => {
    console.log("datepicker is visible")
    setDatePickerVisibility(true);
  };

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
Select Village*
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
      Select SSP
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
      Select Make*
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
      Select Model*
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
      Enquiry primary Source*
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
      Select Source of Enquiry*
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
      placeholder="Expected Delivery Date"
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
      Select Mode Of Finance
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
      Select Bank
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
    fontSize:20,
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




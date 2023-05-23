import { SafeAreaView, StyleSheet, View,Text,ScrollView } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dropdown } from "react-native-element-dropdown";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Box,HStack,Pressable,Input } from "native-base";
const Enquiry = () => {
  const navigation = useNavigation();
  const onclick = () => {
    navigation.navigate("form");
  };
 const pressnewEnquiry = () =>{
  navigation.navigate("form");
 }
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [value3, setValue3] = useState(null);
  const data = [
    { label: "Ahemdabad", value: "Ahemdabad" },
    { label: "Vdodra", value: "Vdodra" },
    { label: "Surat", value: "Surat" },
  ];
  const data2 = [
    { label: "Select Category", value: "Select Category" },
    { label: "NEW TRACTOR INQUIRY", value: "NEW TRACTOR INQUIRY" },
    { label: "OLD TRACTOR INQUIRY", value: "OLD TRACTOR INQUIRY" },
  ];
  const data3 = [
    { label: "Karjan", value: "Karjan" },
    { label: "Dubai", value: "Dubai" },
  ];
  return (
    <SafeAreaView style={styles.content}>
    <View>
    <Pressable onPress={pressnewEnquiry}>
    <HStack mt="5" justifyContent="flex-end">
    <MaterialCommunityIcons name="plus-circle-outline" size={24} color="black" />
    <Text>
    New Enqiury
    </Text>
    </HStack>
    </Pressable>
    </View>
    <View mt="50">
    <Text style={styles.textstyle}>
    Select Category
    </Text>
          <Box style={styles.viewinput}>
          <Dropdown
          style={styles.input}
          data={data2}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          value={value2}
          onChange={(item) => {
            setValue2(item.value);
            onChange={}
          }}
          />
          </Box>
          <Box alignItems="center">
          <Button px="8" mt="3" style={styles.btn}  onPress={onclick}>
          Next
          </Button>
          </Box>
          
          </View>
          <ScrollView>
          <View>
          <Text style={styles.textstyle}>
          Select city
          </Text>
                <Box style={styles.viewinput}>
                <Dropdown
                style={styles.input}
                data={data}
                labelField="label"
                valueField="value"
                placeholder="Select city"
                value={value}
                onChange={(item) => {
                  setValue(item.value);
                }}
                />
                </Box>
                </View>
                <View>
                <Text style={styles.textstyle}>
          Select taluko
          </Text>
                <Box style={styles.viewinput}>
                <Dropdown
                style={styles.input}
                data={data3}
                labelField="label"
                valueField="value"
                placeholder="Select taluko"
                value={value3}
                onChange={(item) => {
                  setValue3(item.value);
                }}
                />
                  </Box>
                </View>
                <View>
               
                <Text style={styles.textstyle} >
                Mobile No
                </Text>
                <Box style={styles.viewinput}>
                <Input
                
                placeholder="Mobile Number"
              
                />
                  </Box>
                </View>
                <View> 
                <Text style={styles.textstyle} >
               First name
                </Text>
                <Box style={styles.viewinput}>
                <Input
                
                placeholder=" First name"
              
                />
                  </Box>
                </View>
                <View>
                <Text style={styles.textstyle}>
          Select State
          </Text>
                <Box style={styles.viewinput}>
                <Dropdown
                style={styles.input}
                data={data3}
                labelField="label"
                valueField="value"
                placeholder="Select State"
                value={value3}
                onChange={(item) => {
                  setValue3(item.value);
                }}
                />
                  </Box>
                </View>
                <View> 
                <Text style={styles.textstyle} >
               Last name
                </Text>
                <Box style={styles.viewinput}>
                <Input
                
                placeholder= "Last name"
              
                />
                  </Box>
                </View>
                <View>
                <Text style={styles.textstyle}>
          Select district
          </Text>
                <Box style={styles.viewinput}>
                <Dropdown
                style={styles.input}
                data={data3}
                labelField="label"
                valueField="value"
                placeholder="Select district"
                value={value3}
                onChange={(item) => {
                  setValue3(item.value);
                }}
                />
                  </Box>
                </View>
                <View>
                <Text style={styles.textstyle}>
          Select village
          </Text>
                <Box style={styles.viewinput}>
                <Dropdown
                style={styles.input}
                data={data3}
                labelField="label"
                valueField="value"
                placeholder="Select village"
                value={value3}
                onChange={(item) => {
                  setValue3(item.value);
                }}
                />
                  </Box>
                </View>
                <View> 
                <Text style={styles.textstyle} >
               WhatsApp number
                </Text>
                <Box style={styles.viewinput}>
                <Input
                
                placeholder="WhatsApp number"
              
                />
                  </Box>
                </View><View> 
                <Text style={styles.textstyle} >
              Visit reason
                </Text>
                <Box style={styles.viewinput}>
                <Input
                
                placeholder="Visit reason"
              
                />
                  </Box>
                </View>
                </ScrollView>
                </SafeAreaView>
          );
};

export default Enquiry;

const styles = StyleSheet.create({
  textstyle:{
    marginLeft:10,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  viewinput: {
    margin: 10,
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 1,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  btn:{
    backgroundColor:"grey",
    color:'white',
    borderRadius:5,
    borderWidth:1,
    borderColor:'black',
      }
  
});



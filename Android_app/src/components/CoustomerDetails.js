import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import React,{useState} from 'react'
import { Input, Icon, Box, Flex, Button, HStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";

const Booking = () => {
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

    const navigation = useNavigation();
     const onNextclick = ()=>{
        navigation.navigate("DownPayment");
     } 

  return (
    
    <ScrollView>
    <View style={styles.animatednav}>
    <Text style={[styles.circleicon, { backgroundColor: 'blue' }]}>1</Text>
    <Text style={styles.line}></Text>
    <Text style={[styles.circleicon, { backgroundColor: 'blue' }]}>2</Text>
    <Text style={styles.line}></Text>
    <Text style={[styles.circleicon, { backgroundColor: 'blue' }]}>3</Text>
    <Text style={styles.line}></Text>
    <Text style={[styles.circleicon, { backgroundColor: 'white' }]}>4</Text>
    <Text style={styles.line}></Text>
    <Text style={[styles.circleicon, { backgroundColor: 'white' }]}>5</Text>
    <Text style={styles.line}></Text>
    <Text style={[styles.circleicon, { backgroundColor: 'white' }]}>6</Text>
    </View>
      <SafeAreaView style={styles.content}>
        <View>
        <Box style={styles.inputstyel} alignItems="center">
        <Input
        //   name="Discriotion"
          keyboardType="default"
          mx="3"
          size="lg"
          w="100%"
        //   placeholder="Discriotion"
          placeholderTextColor="black"
        />
      </Box>
        </View>
        <View>
        <Box style={styles.inputstyel} alignItems="center">
        <Input
        //   name="Discriotion"
          keyboardType="default"
          mx="3"
          size="lg"
          w="100%"
        //   placeholder="Discriotion"
          placeholderTextColor="black"
        />
      </Box>
        </View>
        <View>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select product"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </Box>
        </View>
        <View>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select product"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </Box>
        </View>
        <View>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select product"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </Box>
        </View>
        <View>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select product"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </Box>
        </View>
        <View>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select product"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </Box>
        </View>
        <View>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select product"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </Box>
        </View>
        <View>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select product"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </Box>
        </View>
        <View>
          <Box style={styles.inputstyel}>
            <Dropdown
              style={styles.input}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select product"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </Box>
        </View>
       
        <HStack space={3} justifyContent="center">
          <Button onPress={onNextclick} style={styles.btn} px="7" my="3">
            Next
          </Button>
          
        </HStack>
      </SafeAreaView>
    </ScrollView>
  )
}

export default Booking

const styles = StyleSheet.create({
  animatednav:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"center",
    marginTop:30,
  },
  circleicon:{
    borderRadius: 50,
    width: 50, 
    height: 50, 
    textAlign:"center",
    padding: 10,
    fontSize:20, 
  },
  line: {
    marginTop:22,
    width: 10,
    height:0,
    borderWidth: 1,
    color:"black",
  },
    content: {
        marginTop:30,
        marginBottom:30,
        marginHorizontal:10,
        backgroundColor: "white",
        paddingVertical: 50,
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
      btn:{
        backgroundColor: "grey",
        color: "white",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
      },
    
})
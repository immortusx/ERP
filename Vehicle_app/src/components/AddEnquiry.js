import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';

const AddEnquiry = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text>Enquiry No.</Text>
        <View style={styles.dateStyle}>
          <Text>Date:</Text>
          <Button title="Open" onPress={() => setOpen(true)} />
          <DatePicker
            mode="date"
            modal
            open={open}
            date={date}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
        
      </View>
      <View style={styles.customerContainer}>
          <Text>Customer Details</Text>
          <TextInput
            // style={styles.input}
            placeholder="First Name"
            autoCapitalize="none"
            keyboardType="firstname"
            textContentType="firstname"
            // value={loginData.email}
            // onChangeText={(value) => onChangeHandler(value, "email")}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10,
  },
  dateStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default AddEnquiry;

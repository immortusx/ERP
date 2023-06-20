import {View, Text, StyleSheet, TextInput, Button, Image} from 'react-native';
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
          <Text
            style={styles.dateText}
            placeholder="Select Date"
            onPress={() => setOpen(true)}>
            {date.toLocaleDateString()}
          </Text>
          <DatePicker
            mode="date"
            modal
            open={open}
            date={date}
            theme="dark"
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
        <Text style={{marginBottom: 5}}>Customer Details</Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="First Name"
          autoCapitalize="none"
          keyboardType="firstname"
          textContentType="firstname"
          // value={loginData.email}
          // onChangeText={(value) => onChangeHandler(value, "email")}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Last Name"
          autoCapitalize="none"
          keyboardType="lastname"
          textContentType="lastname"
          // value={loginData.email}
          // onChangeText={(value) => onChangeHandler(value, "email")}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Phone Number"
          autoCapitalize="none"
          keyboardType="phone"
          textContentType="phone"
          // value={loginData.email}
          // onChangeText={(value) => onChangeHandler(value, "email")}
        />
        <View editable={false} style={[styles.inputStyle, styles.optional]}>
          <View style={{flexDirection: 'row'}}>
          <Image
            style={styles.plusImg}
            source={require('../../assets/plus2.png')}
          />
          <Text>Add More (Optinal)</Text>
          </View>
        </View>
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
  customerContainer: {
    paddingHorizontal: 10,
  },
  dateText: {
    borderWidth: 1,
    borderColor: '#EA6A20',
    padding: 5,
    borderRadius: 33,
    borderColor: 'grey',
  },
  inputStyle: {
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#0984DF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
export default AddEnquiry;

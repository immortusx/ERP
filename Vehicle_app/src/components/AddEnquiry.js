import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';

const AddEnquiry = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text>Enquiry No.</Text>
        <View style={styles.dateStyle}>
          <Text>Select Date: </Text>
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
        <Text style={styles.mainHeader}>Customer Details</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name:</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="First Name"
            autoCapitalize="none"
            keyboardType="firstname"
            textContentType="firstname"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name:</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="Last Name"
            autoCapitalize="none"
            keyboardType="lastname"
            textContentType="lastname"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="Phone Number"
            autoCapitalize="none"
            keyboardType="phone"
            textContentType="phone"
          />
        </View>
        {/* <TextInput
          style={styles.inputStyle}
          placeholder="Last Name"
          autoCapitalize="none"
          keyboardType="lastname"
          textContentType="lastname"
          // value={loginData.email}
          // onChangeText={(value) => onChangeHandler(value, "email")}
        /> */}
        <View editable={false} style={[styles.inputStyle, styles.optional]}>
          <View>
            <TouchableOpacity
              style={styles.centeredContainer}
              onPress={() => {
                navigation.navigate('Add Location');
              }}>
              <Image
                style={styles.plusImg}
                source={require('../../assets/plus2.png')}
              />
              <Text style={styles.textMore}>Add More (Optional)</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 1,
    backgroundColor: 'white',
  },
  dateContainer: {
    marginTop: 10,
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
    marginTop: 20,
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
  centeredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textMore: {
    fontWeight: 'bold',
    color: '#3AA4F7',
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#0984DF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  mainHeader: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
});
export default AddEnquiry;

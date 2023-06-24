import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
const AddEnquiry = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openEnquirySource, setOpenEnquirySource] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [enquirySourceItem, setEnquirySourceItem] = useState([
    {label: 'Digital', value: '1'},
    {label: 'Telemarketing', value: '2'},
    {label: 'News', value: '3'},
    {label: 'Visit', value: '4'},
    {label: 'Other', value: '5'},
  ]);
  return (
   <ScrollView>
     <View style={styles.container}>
      <View style={styles.customerContainer}>
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
              <Text style={styles.textMore}>Add Location (Optional)</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View editable={false} style={[styles.inputStyle, styles.optional]}>
          <View>
            <TouchableOpacity
              style={styles.centeredContainer}
              onPress={() => {
                navigation.navigate('Add Manufacturer Details'); 
              }}>
              <Image
                style={styles.plusImg}
                source={require('../../assets/plus2.png')}
              />
              <Text style={styles.textMore}>Add Manufacturer Details (Optional)</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Enquiry Source :</Text>
          <DropDownPicker
            open={openEnquirySource}
            value={selectedSource}
            items={enquirySourceItem}
            setOpen={setOpenEnquirySource}
            setValue={setSelectedSource}
            setItems={setEnquirySourceItem}
            containerStyle={{marginTop: 5}}
            style={styles.dropBoxStyle}
            dropDownStyle={styles.dropDownStyle}
            placeholder="Select Enquriy Source"
            onChangeItem={item => setSelectedSource(item.value)}
            autoScroll
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Expected Delivery Date :</Text>
            <Text
              style={styles.deliveryDate}
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
      <View style={{paddingHorizontal: 15}}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
   </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  customerContainer: {
    paddingHorizontal: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
  },
  inputStyle: {
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#0984DF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  saveButton: {
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
  dropBoxStyle: {
    backgroundColor: '#fafafa',
    borderColor: '#0984DF',
    borderWidth: 1,
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
    borderColor: '#0984DF',
    borderWidth: 1,
  },
  deliveryDate: {
    borderWidth: 1,
    borderColor: '#EA6A20',
    padding: 5,
    borderRadius: 33,
    borderColor: 'grey',
  }
});
export default AddEnquiry;

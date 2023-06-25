import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Pressable,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';
import CustomRadioButton from './subCom/CustomRadioButton';
const AddEnquiry = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [isFocus, setIsFocus] = useState(false);
  const [enquiry, setEnquiry] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('No');
  const options = ['Yes', 'No'];
  const [modalVisible, setModalVisible] = useState(false);

  const enquirySourceItem = [
    {label: 'Digital', value: '1'},
    {label: 'Telemarketing', value: '2'},
    {label: 'News', value: '3'},
    {label: 'Visit', value: '4'},
    {label: 'Other', value: '5'},
  ];

  const conditionType = [
    {label: 'Good', value: '1'},
    {label: 'Below Average', value: '2'},
    {label: 'Average', value: '3'},
    {label: 'Vey Good', value: '4'},
  ];

  let branch = 'New Keshav Tractors';
  let dsp = 'Harilal Mehta';
  const handleSelect = option => {
    const selectedValue = option === 'Yes' ? 'Yes' : 'No';
    setSelectedOption(selectedValue);
    handleReadValue(selectedValue);
    if (selectedValue === 'Yes') {
      setModalVisible(true);
    }
  };
  const handleReadValue = () => {
    console.log(selectedOption);
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.customerContainer}>
          <View style={styles.dateContainer}>
            <Text>Enquiry No.</Text>
            <View style={styles.dateStyle}>
              <Text>Select Date : </Text>
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
            <Text style={styles.label}>Select Branch *</Text>
            <TextInput
              editable={false}
              style={styles.inputStyle}
              placeholder="Select Branch"
              autoCapitalize="none"
              keyboardType="branch"
              textContentType="branch"
              value={branch}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select DSP *</Text>
            <TextInput
              editable={false}
              style={styles.inputStyle}
              placeholder="Select Branch"
              autoCapitalize="none"
              keyboardType="dsp"
              textContentType="dsp"
              value={dsp}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter First Name"
              autoCapitalize="none"
              keyboardType="firstname"
              textContentType="firstname"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter Last Name"
              autoCapitalize="none"
              keyboardType="lastname"
              textContentType="lastname"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter Phone Number"
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
                <Text style={styles.textMore}>Add Manufacturer Details</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginBottom: 5}}>
            <Text style={styles.label}>Enquiry Primary Source :</Text>
            <View style={styles.enquirySourceContainer}>
              {/* {renderLabel()} */}
              <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={enquirySourceItem}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Manufacturer' : ' '}
                searchPlaceholder="Search..."
                value={enquiry}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setEnquiry(item.value);
                  setIsFocus(false);
                }}
                // renderLeftIcon={() => (
                //   <Text>{isFocus ? 'blue' : 'black'}</Text>
                // )}
              />
            </View>
          </View>
          <View style={{marginBottom: 5}}>
            <Text style={styles.label}>Expected Delivery Date *</Text>
            <View style={styles.deliveryDateContainer}>
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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Old Tractor Owned ?</Text>
            <CustomRadioButton
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
            />
          </View>
        </View>
        <View style={{paddingHorizontal: 15}}>
          <TouchableOpacity style={styles.saveButton} onPress={()=> {console.warn("Saving Enquiry")}}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Image
                    source={require('../../assets/cancel.png')}
                    style={styles.cancelImage}
                  />
                </Pressable>
                <Text style={styles.modalTitle}>Add Details</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Maker's Name"
                  // value={manufacturer}
                  // onChangeText={setManufacturer}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Modal"
                  // value={manufacturer}
                  // onChangeText={setManufacturer}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Variant"
                  // value={manufacturer}
                  // onChangeText={setManufacturer}
                />
                <View style={styles.deliveryDateContainer}>
                  <Text>Year of Manufactur</Text>
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
                <View style={styles.sourceContainer}>
                  <Text style={styles.label}>Condition :</Text>
                  <View style={styles.enquirySourceContainer}>
                    {/* {renderLabel()} */}
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {borderColor: 'blue'},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={conditionType}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Select Condition' : ' '}
                      searchPlaceholder="Search..."
                      value={enquiry}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setEnquiry(item.value);
                        setIsFocus(false);
                      }}
                      // renderLeftIcon={() => (
                      //   <Text>{isFocus ? 'blue' : 'black'}</Text>
                      // )}
                    />
                  </View>
                </View>
                <Pressable
                  style={[styles.roundedButton, styles.saveButton]}
                  onPress={()=> {console.warn('Saving')}}>
                  <Text style={styles.buttonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
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
    marginBottom: 10,
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 22,
    padding: 5,
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
  enquirySourceContainer: {
    marginBottom: 10,
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 5,
  },
  deliveryDateContainer: {
    width: '100%',
    marginBottom: 10,
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 5,
  },
  sourceContainer: {
    marginBottom: 5,
    width: '100%',
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
    borderColor: '#0984DF',
    padding: 5,
    borderColor: 'grey',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    height: 500,
  },

  button: {
    borderRadius: 20,
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    position: 'absolute',
    top: 2,
    right: 2,
    padding: 1,
    borderRadius: 6,
  },
  cancelImage: {
    width: 30,
    height: 30,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#0984DF',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 5,
  },
  roundedButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default AddEnquiry;

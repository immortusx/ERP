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
import React, {useState, useEffect} from 'react';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';
import CustomRadioButton from './subCom/CustomRadioButton';
import {useDispatch, useSelector} from 'react-redux';
import {setEnquiryDb} from '../redux/slice/addEnquirySlice';
import {saveEnquiryModalForm} from '../redux/slice/addEnquiryModal';
import {saveModalData} from '../redux/slice/modalDataSlice';
import SweetSuccessAlert from './subCom/SweetSuccessAlert';
const AddEnquiry = ({navigation}) => {
  const dispatch = useDispatch();
  // const enquiryState = useSelector(state => state.enquriySlice.enquiryState);
  const locationForm = useSelector(state => state.locationForm);
  const enquiryState = useSelector(state => state.enquirySlice.enquiryState);
  const {maker, modalName, variantName, year, condition_of} = useSelector(
    state => state.modalData,
  );
  const {manufacturer, modal, variant} = useSelector(
    state => state.manufacturerDetails,
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openCurentDate, setOpenCurrentDate] = useState(false);
  const [expDeliveryDate, setExpDeliveryDate] = useState(new Date());
  const [openExpDeliveryDate, setOpenExpDeliveryDate] = useState(false);
  const [manuYearDate, setManuYearDate] = useState(new Date());
  const [openManuYearDate, setOPenManuYearDate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [enquiry, setEnquiry] = useState(null);
  const [condition, setCondtion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('No');
  const options = ['Yes', 'No'];
  const [modalVisible, setModalVisible] = useState(false);
  const [oldVehicleData, setOldVehicleData] = useState({
    maker: '',
    modalName: '',
    variantName: '',
  });
  const [enquiryData, setEnquiryData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
  });

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
  const formattedDeliveryDate = expDeliveryDate.toLocaleDateString();
  const handleReadValue = () => {
    console.log(selectedOption);
  };
  const closeModal = () => {
    setModalVisible(!modalVisible);
    setSelectedOption('No');
  };
  const onChangeHandler = (value, field) => {
    setEnquiryData(preData => ({
      ...preData,
      [field]: value,
    }));
  };
  useEffect(() => {
    if (enquiryState.isSuccess === true) {
      console.log('Enquiry submitted');
      openModal();
    }
  }, [enquiryState]);
  const submitEnquiry = () => {
    const {firstname, lastname, phone} = enquiryData;
    const {state, district, taluka, native} = locationForm;
    console.log(state, district, taluka, native);
    console.log(firstname, lastname, phone);
    console.log(manufacturer, modal, variant);
    console.log(enquiry);
    console.log(expDeliveryDate);
    console.log(condition, 'consdtion');
    console.log(maker, modalName, variantName, year, condition_of);

    const formData = {
      firstName: firstname,
      lastName: lastname,
      mobileNumber: phone,
      emailId: 'admin@123',
      state: state,
      district: district,
      tehsil: taluka,
      block: 11,
      dsp: 62,
      model: 6,
      village: native,
      branchId: 2,
      enquiryDate: formattedCurrentDate,
      deliveryDate: formattedDeliveryDate,
      sourceOfEnquiry: 25,
      manufacturer,
      modal,
      variant,
      maker,
      modalName,
      variantName,
      year,
      condition_of,
    };
    if (
      enquiryData.firstname.length > 0 &&
      enquiryData.lastname.length > 0 &&
      enquiryData.phone.length > 0
    ) {
      dispatch(setEnquiryDb(formData));
    } else {
      console.warn('Please first fill the field*');
    }
  };

  const formattedCurrentDate = currentDate.toLocaleDateString();
  const formattedManuYear = manuYearDate.toLocaleDateString();
  const handleModalData = () => {
    if (
      oldVehicleData.maker.length > 0 &&
      oldVehicleData.modalName.length > 0 &&
      oldVehicleData.variantName.length > 0
    ) {
      dispatch(
        saveModalData({
          maker: oldVehicleData.maker,
          modalName: oldVehicleData.modalName,
          variantName: oldVehicleData.variantName,
          year: formattedManuYear,
          condition_of: condition,
        }),
      );
      setModalVisible(!modalVisible);
      console.warn(oldVehicleData);
    } else {
      console.warn('please first fill the field');
    }
  };
  const onChangeInputField = (value, field) => {
    setOldVehicleData(prefield => ({
      ...prefield,
      [field]: value,
    }));
  };
  const openModal = () => {
    setShowModal(true);
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.customerContainer}>
          <View style={styles.dateContainer}>
            <Text>Enquiry</Text>
            <View style={styles.dateStyle}>
              <Text>Select Date : </Text>
              <Text
                style={styles.dateText}
                placeholder="Select Date"
                onPress={() => setOpenCurrentDate(true)}>
                {formattedCurrentDate}
              </Text>
              <DatePicker
                mode="date"
                modal
                open={openCurentDate}
                date={currentDate}
                theme="dark"
                onConfirm={date => {
                  setOpenCurrentDate(false);
                  setCurrentDate(date);
                }}
                onCancel={() => {
                  setOpenCurrentDate(false);
                }}
              />
            </View>
          </View>
          <Text style={styles.mainHeader}>Customer Details</Text>
          <View>
            <Text style={styles.label}>Select Branch *</Text>
            <View
              editable={false}
              style={[styles.dataContainer, styles.optional]}>
              <TouchableOpacity>
                <Text style={styles.branchText}>New Keshav Tractors</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
          <Text style={styles.label}>Select DSP *</Text>
            <View
              editable={false}
              style={[styles.dataContainer, styles.optional]}>
              <TouchableOpacity>
                <Text style={styles.branchText}>Harilal Mehta</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter First Name"
              autoCapitalize="none"
              keyboardType="firstname"
              textContentType="firstname"
              onChangeText={value => onChangeHandler(value, 'firstname')}
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
              onChangeText={value => onChangeHandler(value, 'lastname')}
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
              onChangeText={value => onChangeHandler(value, 'phone')}
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
            <Text style={styles.label}>Enquiry Primary Source *</Text>
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
                onPress={() => setOpenExpDeliveryDate(true)}>
                {formattedDeliveryDate}
              </Text>
              <DatePicker
                mode="date"
                modal
                open={openExpDeliveryDate}
                date={expDeliveryDate}
                theme="dark"
                onConfirm={date => {
                  setOpenExpDeliveryDate(false);
                  setExpDeliveryDate(date);
                }}
                onCancel={() => {
                  setOpenExpDeliveryDate(false);
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
          <TouchableOpacity style={styles.submitButton} onPress={submitEnquiry}>
            <Text style={styles.submitButtonText}>Submit</Text>
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
                  onPress={closeModal}>
                  <Image
                    source={require('../../assets/cancel.png')}
                    style={styles.cancelImage}
                  />
                </Pressable>
                <Text style={styles.modalTitle}>Add Details</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Maker's Name"
                  autoCapitalize="none"
                  keyboardType="maker"
                  textContentType="maker"
                  // value={manufacturer}
                  onChangeText={value => onChangeInputField(value, 'maker')}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Modal"
                  autoCapitalize="none"
                  keyboardType="modal"
                  textContentType="modal"
                  // value={manufacturer}
                  onChangeText={value => onChangeInputField(value, 'modalName')}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Variant"
                  autoCapitalize="none"
                  keyboardType="variant"
                  textContentType="variant"
                  // value={manufacturer}
                  onChangeText={value =>
                    onChangeInputField(value, 'variantName')
                  }
                />
                <View style={styles.deliveryDateContainer}>
                  <Text>Year of Manufactur</Text>
                  <Text
                    style={styles.deliveryDate}
                    placeholder="Select Date"
                    onPress={() => setOPenManuYearDate(true)}>
                    {formattedManuYear}
                  </Text>
                  <DatePicker
                    mode="date"
                    modal
                    open={openManuYearDate}
                    date={manuYearDate}
                    theme="dark"
                    onConfirm={date => {
                      setOPenManuYearDate(false);
                      setManuYearDate(date);
                    }}
                    onCancel={() => {
                      setOPenManuYearDate(false);
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
                      value={condition}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setCondtion(item.value);
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
                  onPress={handleModalData}>
                  <Text style={styles.buttonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        <SweetSuccessAlert modalShow={showModal} />
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
    paddingHorizontal: 25,
  },
  inputStyle: {
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#0984DF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dataContainer: {
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#0984DF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
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
  branchText: {
    fontWeight: 'bold',
    color: '#273746',
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
  submitButton: {
    backgroundColor: '#0984DF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 2,
  },
  submitButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default AddEnquiry;

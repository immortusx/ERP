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
import {clearEnquiryState, setEnquiryDb} from '../redux/slice/addEnquirySlice';
import {saveEnquiryModalForm} from '../redux/slice/addEnquiryModal';
import {clearModalData, saveModalData} from '../redux/slice/modalDataSlice';
import SweetSuccessAlert from './subCom/SweetSuccessAlert';
import {useNavigation} from '@react-navigation/native';
import {getEnquiryData} from '../redux/slice/getEnquirySlice';
import {clearLocationForm} from '../redux/slice/locationFormSlice';
import {clearManufacturerDetails} from '../redux/slice/manufacturerDetailsSlice';
import {
  clearEditEnquiryState,
  setEditEnquiryDb,
} from '../redux/slice/editEnquirySlice';
import Calendars from './subCom/Calendars';
const DetailEnquiry = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const locationForm = useSelector(state => state.locationForm);
  const {state, district, taluka, village} = locationForm;
  const enquiryState = useSelector(state => state.enquirySlice.enquiryState);
  const editEnquiryState = useSelector(
    state => state.editEnquirySlice.editEnquiryState,
  );
  const {maker, modalName, variantName, year, condition_of} = useSelector(
    state => state.modalData,
  );
  const {manufacturer, modal, variant} = useSelector(
    state => state.manufacturerDetails,
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editData, setEditData] = useState(null);
  const [openCurentDate, setOpenCurrentDate] = useState(false);
  const [expDeliveryDate, setExpDeliveryDate] = useState('');
  const [openExpDeliveryDate, setOpenExpDeliveryDate] = useState(false);
  const [manuYearDate, setManuYearDate] = useState('');
  const [openManuYearDate, setOpenManufacturer] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [message, setMessage] = useState('');
  const [enquiry, setEnquiry] = useState(null);
  const [condition, setCondtion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('No');
  const options = ['No', 'Yes'];
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
    whatsappno: '',
  });

  const enquirySourceItem = [
    {label: 'Digital', value: '25'},
    {label: 'Telemarketing', value: '26'},
    {label: 'News', value: '27'},
    {label: 'Visit', value: '28'},
    {label: 'Other', value: '29'},
  ];

  const conditionType = [
    {label: 'Good', value: 'Good'},
    {label: 'Below Average', value: 'Below Average'},
    {label: 'Average', value: 'Average'},
    {label: 'Vey Good', value: 'Vey Good'},
  ];

  let branch = 'New Keshav Tractors';
  let dsp = 'Harilal Mehta';
  const handleSelect = option => {
    const selectedValue = option === 'Yes' ? 'Yes' : 'No';
    setSelectedOption(selectedValue);
    handleReadValue(selectedValue);
    if (selectedValue === 'Yes') {
      setModalVisible(true);
    } else if (selectedValue === 'No') {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    if (route) {
      console.log(route, '>>>>>>>>>>>>');
      // console.log(route.params,"para");
      const {editData} = route.params;
      // console.log(editData,'edit');
      setEditData(editData);
    }
  }, [route]);
  useEffect(() => {
    if (editData) {
      setEnquiryData({
        firstname: editData.first_name,
        lastname: editData.last_name,
        phone: editData.phone_number,
        whatsappno: editData.whatsapp_number,
      });
    }
  }, [editData]);
  // const formattedDeliveryDate = expDeliveryDate.toLocaleDateString();
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
    console.log(editEnquiryState, 'detail');
    if (editEnquiryState && editEnquiryState.isSuccess === true) {
      dispatch(clearEditEnquiryState());
      dispatch(clearLocationForm());
      dispatch(clearManufacturerDetails());
      dispatch(clearModalData());
      setMessage('Enquiry Updated');
      console.log('Enquiry Updated');
      // openModal();
      setShowMessageModal(true);
      dispatch(getEnquiryData()).then(() => {
        navigation.navigate('AddMore');
      });
    }
  }, [editEnquiryState]);

  useEffect(() => {
    if (enquiryState && enquiryState.isSuccess === true) {
      dispatch(clearEnquiryState());
      dispatch(clearLocationForm());
      dispatch(clearManufacturerDetails());
      dispatch(clearModalData());
      setMessage('Enquiry Submitted');
      // console.log('Enquiry submitted');
      // openModal();
      setShowMessageModal(true);
      dispatch(getEnquiryData()).then(() => {
        navigation.navigate('AddMore');
      });
    }
  }, [enquiryState]);

  const submitEnquiry = () => {
    console.log(selectedOption);
    console.log(editData, '@#@#edit');
    const {firstname, lastname, phone, whatsappno} = enquiryData;
    const {state, district, taluka, village} = locationForm;
    console.log(state, district, taluka, village);
    console.log(firstname, lastname, phone);
    console.log(manufacturer, modal, variant);
    console.log(enquiry);
    // console.log(formattedDeliveryDate);
    console.log(condition, 'consdtion');
    console.log(maker, modalName, variantName, year, condition_of);

    const formData = {
      first_name: firstname,
      last_name: lastname,
      phone_number: phone,
      whatsapp_number: whatsappno,
      state: state,
      district: district,
      taluka: taluka,
      village: village,
      deliveryDate: expDeliveryDate.toString().replace('T', ' ').slice(0, 19),
      manufacturer: manufacturer,
      modal: modal,
      variant: variant,
      maker: maker,
      modalName: modalName,
      variantName: variantName,
      year: year,
      condition_of: condition_of,
      sourceOfEnquiry: enquiry,
      old_tractor: selectedOption,
    };
    if (
      enquiryData.firstname.length > 0
      // &&
      // enquiryData.lastname.length > 0 &&
      // enquiryData.phone.length > 0 &&
      // enquiryData.whatsappno.length > 0
    ) {
      if (editData) {
        console.log('Edit Enquiry');
        formData.customer_id = editData.id;
        dispatch(setEditEnquiryDb(formData));
      } else {
        console.log('Add Enquiry');
        dispatch(setEnquiryDb(formData));
      }
      setEnquiryData({
        firstname: '',
        lastname: '',
        phone: '',
        whatsappno: '',
      });
      setExpDeliveryDate('');
      setCondtion(null);
      setOldVehicleData({
        maker: '',
        modalName: '',
        variantName: '',
      });
      setSelectedOption('No');
    } else {
      console.warn('Please first fill the field*');
    }
  };

  const formattedCurrentDate = currentDate.toLocaleDateString();
  // const formattedManuYear = manuYearDate.toLocaleDateString();

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
          year: manuYearDate,
          condition_of: condition,
        }),
      );
      setModalVisible(!modalVisible);
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
  const handleCalendarDate = selectedDate => {
    console.log(selectedDate.dateString, 'deliverydate');
    console.log(selectedDate, 'deliverydate');
    setExpDeliveryDate(selectedDate.dateString);
    setOpenExpDeliveryDate(false);
  };
  const handleManufacturYearDate = selectedDate => {
    console.log(selectedDate.dateString, 'manufacturee');
    console.log(selectedDate, 'manufacturee');
    setManuYearDate(selectedDate.dateString);
    setOpenManufacturer(false);
  };
  const openModal = () => {
    setShowMessageModal(true);
  };
  const openAddLocation = editData => {
    navigation.navigate('Add Location', {editData: editData});
  };
  const openManufactureDetails = editData => {
    navigation.navigate('Add Manufacturer Details', {editData: editData});
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.customerContainer}>
          <Text style={styles.mainHeader}>Customer Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter First Name"
              autoCapitalize="none"
              keyboardType="default"
              textContentType="firstname"
              defaultValue={enquiryData.firstname || ''}
              onChangeText={value => onChangeHandler(value, 'firstname')}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter Last Name"
              autoCapitalize="none"
              keyboardType="default"
              textContentType="lastname"
              defaultValue={enquiryData.lastname || ''}
              onChangeText={value => onChangeHandler(value, 'lastname')}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter Phone Number"
              autoCapitalize="none"
              keyboardType="default"
              textContentType="phone"
              defaultValue={enquiryData.phone || ''}
              onChangeText={value => onChangeHandler(value, 'phone')}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>WhatsApp Number *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter WhatsApp Number"
              autoCapitalize="none"
              keyboardType="default"
              textContentType="whatsappno"
              defaultValue={enquiryData.whatsappno || ''}
              onChangeText={value => onChangeHandler(value, 'whatsappno')}
            />
          </View>
          <View editable={false} style={[styles.inputStyle, styles.optional]}>
            <View>
              <TouchableOpacity
                style={styles.centeredContainer}
                onPress={() => {
                  openAddLocation(editData);
                }}>
                <Image
                  style={styles.plusImg}
                  source={require('../../assets/plus2.png')}
                />
                <Text style={styles.textMore}>Add Location (Optional)</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              color: '#A93226',
              fontSize: 12,
            }}>{`${state} ${district} ${taluka} ${village}`}</Text>
          <View editable={false} style={[styles.inputStyle, styles.optional]}>
            <View>
              <TouchableOpacity
                style={styles.centeredContainer}
                onPress={() => {
                  openManufactureDetails(editData);
                }}>
                <Image
                  style={styles.plusImg}
                  source={require('../../assets/plus2.png')}
                />
                <Text style={styles.textMore}>Add Manufacturer Details</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              color: '#A93226',
              fontSize: 12,
            }}>{`${manufacturer} ${modal} ${variant}`}</Text>

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
                placeholder={!isFocus ? 'Select Source' : ' '}
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
              <TouchableOpacity
                onPress={() => {
                  setOpenExpDeliveryDate(true);
                }}>
                <Text style={{paddingVertical: 7}}>
                  {expDeliveryDate === ''
                    ? new Date().toISOString().slice(0, 10)
                    : expDeliveryDate}
                </Text>
              </TouchableOpacity>
              <Calendars
                showModal={openExpDeliveryDate}
                selectedDate={expDeliveryDate}
                handleCalendarDate={handleCalendarDate}
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
          {modalVisible && (
            <View>
              <View style={styles.expandedView}>
                <Text style={styles.modalTitle}>Add Details *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Maker's Name"
                  autoCapitalize="none"
                  keyboardType="default"
                  textContentType="maker"
                  // value={manufacturer}
                  onChangeText={value => onChangeInputField(value, 'maker')}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Modal"
                  autoCapitalize="none"
                  keyboardType="default"
                  textContentType="modal"
                  // value={manufacturer}
                  onChangeText={value => onChangeInputField(value, 'modalName')}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Variant"
                  autoCapitalize="none"
                  keyboardType="default"
                  textContentType="variant"
                  // value={manufacturer}
                  onChangeText={value =>
                    onChangeInputField(value, 'variantName')
                  }
                />

                <View style={{marginBottom: 5}}>
                  <Text style={styles.label}>Manufactur Year *</Text>
                  <View style={styles.deliveryDateContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setOpenManufacturer(true);
                      }}>
                      <Text style={{paddingVertical: 7}}>
                        {manuYearDate === ''
                          ? new Date().toISOString().slice(0, 10)
                          : manuYearDate}
                      </Text>
                    </TouchableOpacity>
                    <Calendars
                      showModal={openManuYearDate}
                      selectedDate={manuYearDate}
                      handleCalendarDate={handleManufacturYearDate}
                    />
                  </View>
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
                <View style={styles.buttonContainer}>
                  <View style={styles.centeredButton}>
                    <Pressable
                      style={[
                        styles.roundedButton,
                        styles.saveButton,
                        styles.smallButton,
                      ]}
                      onPress={handleModalData}>
                      <Text style={[styles.buttonText, styles.smallButtonText]}>
                        Add Details
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
        <View style={{paddingHorizontal: 15}}>
          <TouchableOpacity style={styles.submitButton} onPress={submitEnquiry}>
            <Text style={styles.submitButtonText}>
              {editData ? 'Edit Enquiry' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>

        <SweetSuccessAlert message={message} modalShow={showMessageModal} />
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
    backgroundColor: '#3498DB',
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
    color: '#1B4F72',
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
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 1,
    marginBottom: 7,
  },
  fastEnquiry: {
    backgroundColor: '#C0392B',
  },
  detailsEnquiry: {
    backgroundColor: '#1ABC9C',
  },

  buttonEnquiryStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonEnquiryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  expandedView: {},
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
});
export default DetailEnquiry;
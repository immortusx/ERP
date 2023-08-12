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
  TouchableWithoutFeedback,
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
import FastEnquiry from './FastEnquiry';
import DetailEnquiry from './DetailEnquiry';
import {Calendar} from 'react-native-calendars';
import Calendars from './subCom/Calendars';
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
  const [currentDate, setCurrentDate] = useState('');
  const [renderScreen, setRenderScreen] = useState('Fast Enquiry');
  const [openCurentDate, setOpenCurrentDate] = useState(false);
  const [expDeliveryDate, setExpDeliveryDate] = useState(new Date());
  const [openExpDeliveryDate, setOpenExpDeliveryDate] = useState(false);
  const [manuYearDate, setManuYearDate] = useState(new Date());
  const [openManuYearDate, setOPenManuYearDate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openCurrentDateModal, setOpenCurrentDateModal] = useState(false);
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

  // const formattedCurrentDate = currentDate.toLocaleDateString();
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
  const handleCalendarDate = selectedDate => {
    console.log(selectedDate.dateString);
    console.log(selectedDate);
    setCurrentDate(selectedDate.dateString);
    setOpenCurrentDateModal(false);
  };
  const renderEnquiryScreen = screen => {
    setRenderScreen(screen);
  };
  const buttonEnquiryStyle = {
    borderWidth: 2,
    borderColor: 'transparent',
  };

  const buttonEnquiryPressedStyle = {
    borderColor: 'blue',
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.customerContainer}>
          <View style={styles.dateContainer}>
            <Text>Enquiry</Text>
          </View>
          <View style={styles.wrapper}>
            <TouchableWithoutFeedback
              onPress={() => {
                renderEnquiryScreen('Fast Enquiry');
              }}>
              <View
                style={[
                  styles.buttonEnquiryStyle,
                  styles.fastEnquiry,
                  renderScreen === 'Fast Enquiry' &&
                    styles.buttonEnquiryPressedStyle,
                ]}>
                <Text
                  style={[styles.buttonEnquiryText, {paddingHorizontal: 17}]}>
                  Fast Enquiry
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                renderEnquiryScreen('Detail Enquiry');
              }}>
              <View
                style={[
                  styles.buttonEnquiryStyle,
                  styles.detailsEnquiry,
                  renderScreen === 'Detail Enquiry' &&
                    styles.buttonEnquiryPressedStyle,
                ]}>
                <Text
                  style={[styles.buttonEnquiryText, {paddingHorizontal: 10}]}>
                  Detail Enquiry
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.renderContainer}>
          {renderScreen === 'Fast Enquiry' ? (
            <FastEnquiry />
          ) : (
            <DetailEnquiry />
          )}
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonEnquiryPressedStyle: {
    borderColor: '#2E86C1',
  },
  buttonEnquiryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  renderContainer: {
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
  },
});

export default AddEnquiry;

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-element-dropdown';
import Calendars from './subCom/Calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import moment from 'moment';
import CustomRadioButton from './subCom/CustomRadioButton';
import RadioButtons from './subCom/RadioButtons';
import SweetSuccessAlert from './subCom/SweetSuccessAlert';
import { useNavigation } from '@react-navigation/native';

const AddBooking = ({item}) => {
  const navigation = useNavigation();
  const [isFocus, setIsFocus] = useState(false);
  const [modal, setModal] = useState(null);
  const [manufacturer, setManufacturer] = useState('');
  const [variant, setVariant] = useState('');
  const [condition, setCondtion] = useState(null);
  const [finance, setFinance] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [oldManufacturer, setOldManufacturer] = useState(null);
  const [oldModal, setOldModal] = useState(null);
  const [oldVariant, setOldVariant] = useState(null);
  const [manuYearDate, setManuYearDate] = useState('');
  const [openManuYearDate, setOpenManufacturer] = useState(false);
  const [bank, setBank] = useState('');
  const [selectedOption, setSelectedOption] = useState('Exchange No');
  const [modalVisible, setModalVisible] = useState(false);
  const [openExpDeliveryDate, setOpenExpDeliveryDate] = useState(false);
  const [openRetailDate, setOpenRetailDate] = useState(false);
  const [expDeliveryDate, setExpDeliveryDate] = useState('');
  const [retailDate, setRetailDate] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [manufacturerData, setManufacurerData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [enquiryData, setEnquiryData] = useState({});
  const [oldVehicleData, setOldVehicleData] = useState({});
  const [deliveryData, setDeliveryData] = useState({
    phone: '',
    chassisno: '',
  });
  const [oldTractorData, setOldTractorData] = useState({
    purchasePrice: '',
    marketPrice: '',
    oldChassisNo: '',
  });
  const options = ['Exchange Yes', 'Exchange No'];

  useEffect(() => {
    if (item) {
      setEnquiryData(item);
      setCustomerId(item.id);
    }
  }, [item]);
  const manufacturItem = manufacturerData.map(item => ({
    label: item.manufacturerName,
    value: item.manufacturerId,
  }));

  const modalItem = modalData.map(item => ({
    label: item.modalName,
    value: item.id,
  }));
  const variantItem = variantData.map(item => ({
    label: item.variantName,
    value: item.id,
  }));

  const modeOfFinance = [
    {label: 'Cash', value: '1'},
    {label: 'Credit Card', value: '2'},
    {label: 'Debid Card', value: '3'},
  ];
  const bankName = [
    {label: 'State Bank Of India', value: '1'},
    {label: 'Bank Of Baroda', value: '2'},
    {label: 'Kotak Mahindra Bank', value: '3'},
    {label: 'ICICI Bank', value: '4'},
    {label: 'Axis Bank', value: '5'},
  ];
  const conditionType = [
    {label: 'Good', value: 'Good'},
    {label: 'Below Average', value: 'Below Average'},
    {label: 'Average', value: 'Average'},
    {label: 'Vey Good', value: 'Vey Good'},
  ];
  const handleSelectedOption = option => {
    console.log(option, 'selected');
    setSelectedOption(option);
    if (option === 'Exchange Yes') {
      setModalVisible(true);
    } else if (option === 'Exchange No') {
      setModalVisible(false);
    }
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
  const handleRetailDate = selectedDate => {
    setRetailDate(selectedDate.dateString);
    setOpenRetailDate(false);
  };

  useEffect(() => {
    if (modalVisible && oldVehicleData) {
      if (oldVehicleData.old_tractor === 'Yes') {
        setOldManufacturer(Number(oldVehicleData.maker));
        setOldModal(Number(oldVehicleData.modalName));
        setOldVariant(Number(oldVehicleData.variantName));
        const isYear = oldVehicleData.year_of_manufactur;
        const manufactureYear = new Date(isYear).toISOString().slice(0, 10);
        setManuYearDate(manufactureYear);
        setCondtion(oldVehicleData.condition_of);
      } else {
        setSelectedOption('Exchange No');
      }
    }
  }, [modalVisible, oldVehicleData]);
  useEffect(() => {
    const getManufacturer = async () => {
      const url = `${API_URL}/api/master/get-allmanufacturer`;
      console.log('get manufacturer', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.get(url, config).then(response => {
        if (response) {
          setManufacurerData(response.data.result);
        }
      });
    };
    getManufacturer();
  }, []);

  useEffect(() => {
    if (manufacturerData) {
      setManufacturer(1);
    }
  }, [manufacturerData]);

  useEffect(() => {
    if (manufacturer) {
      const getModal = async () => {
        console.log(manufacturer, 'id');
        const url = `${API_URL}/api/master/getmodal/${manufacturer}`;
        console.log('get modal', url);
        const token = await AsyncStorage.getItem('rbacToken');
        const config = {
          headers: {
            token: token ? token : '',
          },
        };
        console.log(config);
        await axios.get(url, config).then(response => {
          if (response) {
            setModalData(response.data.result);
          }
        });
      };
      getModal();
    }
  }, [manufacturer]);

  useEffect(() => {
    if (modal) {
      const getVariant = async () => {
        console.log(modal, 'id');
        const url = `${API_URL}/api/master/getvariant/${modal}`;
        console.log('get variant', url);
        const token = await AsyncStorage.getItem('rbacToken');
        const config = {
          headers: {
            token: token ? token : '',
          },
        };
        console.log(config);
        await axios.get(url, config).then(response => {
          if (response) {
            setVariantData(response.data.result);
          }
        });
      };
      getVariant();
    }
  }, [modal]);
  const onChangeInputField = (value, field) => {
    setDeliveryData(prefield => ({
      ...prefield,
      [field]: value,
    }));
  };
  const onChangeTextField = (value, field) => {
    setOldTractorData(prefield => ({
      ...prefield,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (modalVisible) {
      const getoldTractorData = async () => {
        const customer_id = customerId;
        const url = `${API_URL}/api/enquiry/get-old-tractor-data/${customer_id}`;
        console.log('closing enqury', url);
        const token = await AsyncStorage.getItem('rbacToken');
        const config = {
          headers: {
            token: token ? token : '',
          },
        };
        console.log(config);
        await axios.get(url, config).then(response => {
          if (response && response.data.isSuccess) {
            console.log(response.data, 'oldData');
            const data = response.data;
            setOldVehicleData(data.result[0]);
            return response.data;
          }
        });
      };
      getoldTractorData();
    }
  }, [modalVisible]);
  
  
  const submitDelivery = async () => {
    console.log(deliveryData);
    console.log(modal, variant, finance, bank, expDeliveryDate, retailDate);
    if (deliveryData.phone.length > 0) {
      const customer_id = customerId;
      const formData = {
        phone_number: deliveryData.phone,
        chassis_no: deliveryData.chassisno,
        modal: modal,
        variant: variant,
        mode_of_finance: finance,
        bank_name: bank,
        deliveryDate: expDeliveryDate,
        retailDate: retailDate,
        selectedOption: selectedOption,
        maker: oldManufacturer,
        modalName: oldModal,
        variantName: oldVariant,
        manuYearDate: manuYearDate,
        tractorCondtion: condition,
        purchasePrice: oldTractorData.purchasePrice,
        marketPrice: oldTractorData.marketPrice,
        oldChassisNo: oldTractorData.oldChassisNo,
      };
      const url = `${API_URL}/api/enquiry/set-new-booking/${customer_id}`;
      console.log('closing enqury', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.post(url, formData, config).then(response => {
        if (response && response.data.isSuccess) {
          console.log(response.data, 'booking');
          setShowMessageModal(true);
          navigation.navigate('Delivery');
        
        }
      });
    } else {
      console.log('Please fill Data');
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.deliveryName}>
            <Text style={styles.header}>
              Delivery :- {enquiryData.first_name} {enquiryData.last_name} ,
              Enquiry. {moment(enquiryData.date).format('Do MMMM YYYY')}
            </Text>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            {/* <Text style={styles.label}>Phone Number *</Text> */}
            <TextInput
              style={styles.inputField}
              placeholder="Enter Phone Number"
              onChangeText={value => onChangeInputField(value, 'phone')}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.dropDownStyle}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && {borderColor: 'blue'},
                  {paddingHorizontal: 5},
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={modalItem}
                search
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Modal' : ' '}
                searchPlaceholder="Search..."
                value={modal}
                onChange={item => {
                  setModal(item.value);
                }}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.dropDownStyle}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && {borderColor: 'blue'},
                  {paddingHorizontal: 5},
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={variantItem}
                search
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Variant' : ' '}
                searchPlaceholder="Search..."
                value={variant}
                onChange={item => {
                  setVariant(item.value);
                }}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter Chassis No"
              onChangeText={value => onChangeInputField(value, 'chassisno')}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.dropDownStyle}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && {borderColor: 'blue'},
                  {paddingHorizontal: 5},
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={modeOfFinance}
                search
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Mode Of Finance' : ' '}
                searchPlaceholder="Search..."
                value={finance}
                onChange={item => {
                  setFinance(item.value);
                }}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.dropDownStyle}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && {borderColor: 'blue'},
                  {paddingHorizontal: 5},
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={bankName}
                search
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Bank' : ' '}
                searchPlaceholder="Search..."
                value={bank}
                onChange={item => {
                  setBank(item.value);
                }}
              />
            </View>
          </View>
          <View style={{marginBottom: 5, marginTop: 10}}>
            <View style={styles.deliveryDateContainer}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 5,
                }}
                onPress={() => {
                  setOpenExpDeliveryDate(true);
                }}>
                <Text style={{paddingVertical: 7}}>
                  Delivery Date {':- '}
                  {expDeliveryDate === ''
                    ? new Date().toISOString().slice(0, 10)
                    : expDeliveryDate}
                </Text>
                <Image
                  style={styles.dateImg}
                  source={require('../../assets/date.png')}
                />
              </TouchableOpacity>
              <Calendars
                showModal={openExpDeliveryDate}
                selectedDate={expDeliveryDate}
                handleCalendarDate={handleCalendarDate}
                onClose={() => setOpenExpDeliveryDate(false)}
              />
            </View>
          </View>
          <View style={{marginBottom: 5}}>
            <View style={styles.deliveryDateContainer}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 5,
                }}
                onPress={() => {
                  setOpenRetailDate(true);
                }}>
                <Text style={{paddingVertical: 7}}>
                  Target Retail Price {':- '}
                  {retailDate === ''
                    ? new Date().toISOString().slice(0, 10)
                    : retailDate}
                </Text>
                <Image
                  style={styles.dateImg}
                  source={require('../../assets/date.png')}
                />
              </TouchableOpacity>
              <Calendars
                showModal={openRetailDate}
                selectedDate={retailDate}
                handleCalendarDate={handleRetailDate}
                onClose={() => setOpenRetailDate(false)}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <RadioButtons
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelectedOption}
            />
          </View>
          {modalVisible && (
            <View>
              <View style={styles.expandedView}>
                <Text style={styles.modalTitle}>Select Details *</Text>
                <View style={styles.sourceContainer}>
                  <View style={styles.enquirySourceContainer}>
                    {/* {renderLabel()} */}
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {borderColor: 'blue'},
                        {paddingHorizontal: 5},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={manufacturItem}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Select Manufactur' : ' '}
                      searchPlaceholder="Search..."
                      value={oldManufacturer}
                      onChange={item => {
                        setOldManufacturer(item.value);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.sourceContainer}>
                  <View style={styles.enquirySourceContainer}>
                    {/* {renderLabel()} */}
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {borderColor: 'blue'},
                        {paddingHorizontal: 5},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={modalItem}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Select Modal' : ' '}
                      searchPlaceholder="Search..."
                      value={oldModal}
                      onChange={item => {
                        setOldModal(item.value);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.sourceContainer}>
                  <View style={styles.enquirySourceContainer}>
                    {/* {renderLabel()} */}
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {borderColor: 'blue'},
                        {paddingHorizontal: 5},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={variantItem}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Select Variant' : ' '}
                      searchPlaceholder="Search..."
                      value={oldVariant}
                      onChange={item => {
                        setOldVariant(item.value);
                      }}
                    />
                  </View>
                </View>

                <View style={{marginBottom: 5}}>
                  <View style={styles.deliveryDateContainer}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 5,
                      }}
                      onPress={() => {
                        setOpenManufacturer(true);
                      }}>
                      <Text style={{paddingVertical: 7}}>
                        Manufactur Year {':- '}
                        {manuYearDate === ''
                          ? new Date().toISOString().slice(0, 10)
                          : manuYearDate}
                      </Text>
                      <Image
                        style={styles.dateImg}
                        source={require('../../assets/date.png')}
                      />
                    </TouchableOpacity>
                    <Calendars
                      showModal={openManuYearDate}
                      selectedDate={manuYearDate}
                      handleCalendarDate={handleManufacturYearDate}
                      onClose={() => setOpenManufacturer(false)}
                    />
                  </View>
                </View>

                <View style={styles.sourceContainer}>
                  <View style={styles.enquirySourceContainer}>
                    {/* {renderLabel()} */}
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {borderColor: 'blue'},
                        {paddingHorizontal: 5},
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
                      onChange={item => {
                        setCondtion(item.value);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Dealer Purchase Price"
                    onChangeText={value =>
                      onChangeTextField(value, 'purchasePrice')
                    }
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Market Price(Rs.)"
                    onChangeText={value =>
                      onChangeTextField(value, 'marketPrice')
                    }
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Old Tractor Chassis No"
                    onChangeText={value =>
                      onChangeTextField(value, 'oldChassisNo')
                    }
                  />
                </View>
              </View>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.deliveryButton}
              onPress={submitDelivery}>
              <Text style={styles.deliveryButtonText}>Save Delivery</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SweetSuccessAlert
          message={'Booking successfully'}
          modalShow={showMessageModal}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 7,
  },
  contentContainer: {
    marginHorizontal: 17,
    flex: 1,
  },
  header: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputField: {
    borderRadius: 5,
    borderColor: '#0984DF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputContainer: {
    marginVertical: 5,
  },
  dropDownStyle: {
    marginTop: 5,
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    marginBottom: 5,
  },
  deliveryName: {
    backgroundColor: '#2980B9',
    padding: 5,
    marginVertical: 16,
  },
  deliveryDateContainer: {
    width: '100%',
    marginBottom: 10,
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 5,
  },
  dateImg: {
    width: 22,
    height: 22,
  },
  retailImg: {
    width: 22,
    height: 22,
    marginHorizontal: 130,
  },
  deliveryButton: {
    backgroundColor: '#27AE60',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  expandedView: {},
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  enquirySourceContainer: {
    marginBottom: 10,
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 5,
  },
  sourceContainer: {
    marginBottom: 5,
    width: '100%',
  },
  centeredButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  modern: {
    backgroundColor: '#2E86C1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default AddBooking;

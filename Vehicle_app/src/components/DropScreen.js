import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-element-dropdown';
import Calendars from './subCom/Calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import moment from 'moment';

const DropScreen = ({item}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [modal, setModal] = useState(null);
  const [manufacturer, setManufacturer] = useState('');
  const [variant, setVariant] = useState('');
  const [finance, setFinance] = useState('');
  const [bank, setBank] = useState('');
  const [openExpDeliveryDate, setOpenExpDeliveryDate] = useState(false);
  const [openRetailDate, setOpenRetailDate] = useState(false);
  const [expDeliveryDate, setExpDeliveryDate] = useState('');
  const [retailDate, setRetailDate] = useState('');
  const [manufacturerData, setManufacurerData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [commercialData, setCommercialData] = useState([]);
  const [commecialReason, setCommercialReason] = useState(null);
  const [nonCommecialReason, setNonCommercialReason] = useState(null);
  const [enquiryData, setEnquiryData] = useState({});
  const [deliveryData, setDeliveryData] = useState({
    phone: '',
    chassisno: '',
  });

  useEffect(() => {
    if (item) {
      setEnquiryData(item);
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
  const commercialItem = commercialData.map(item => ({
    label: item.commercial_reasons,
    value: item.id,
  }));

  const nonCommercialReasonItem = commercialData.map(item => ({
    label: item.non_commercial_reasons,
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
  const handleCalendarDate = selectedDate => {
    console.log(selectedDate.dateString, 'deliverydate');
    console.log(selectedDate, 'deliverydate');
    setExpDeliveryDate(selectedDate.dateString);
    setOpenExpDeliveryDate(false);
  };
  const handleRetailDate = selectedDate => {
    setRetailDate(selectedDate.dateString);
    setOpenRetailDate(false);
  };
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
          console.log(response.data.result, 'mmmmmmmmmmmmmmmmmmmmm');
          setManufacurerData(response.data.result);
        }
      });
    };
    getManufacturer();
  }, []);

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

  useEffect(() => {
    const getCommercialList = async () => {
      const url = `${API_URL}/api/enquiry/get-commercial-reasonsList`;
      console.log('commercial', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.get(url, config).then(response => {
        if (response) {
          console.log(response.data, 'cmcmc');
          setCommercialData(response.data.result);
        }
      });
    };
    getCommercialList();
  }, []);

  

  const onChangeInputField = (value, field) => {
    setDeliveryData(prefield => ({
      ...prefield,
      [field]: value,
    }));
  };
  const submitDelivery = () => {
    console.log(deliveryData);
    console.log(modal, variant, finance, bank, expDeliveryDate, retailDate);
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.deliveryName}>
          <Text style={styles.header}>
            Lost Reason :- {enquiryData.first_name} {enquiryData.last_name} ,
            {moment(enquiryData.date).format('Do MMMM YYYY')}
          </Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <View style={styles.dropDownStyle}>
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={manufacturItem}
              search
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Maker' : ' '}
              searchPlaceholder="Search..."
              value={manufacturer}
              onChange={item => {
                setManufacturer(item.value);
              }}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.dropDownStyle}>
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
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
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setModal(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <Text>{isFocus ? 'blue' : 'black'}</Text>
              // )}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.dropDownStyle}>
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
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
          <View style={styles.dropDownStyle}>
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={commercialItem}
              search
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Commercial Reason 1' : ' '}
              searchPlaceholder="Search..."
              value={commecialReason}
              onChange={item => {
                setCommercialReason(item.value);
              }}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.dropDownStyle}>
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={nonCommercialReasonItem}
              search
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Non-Commercial Reason 2' : ' '}
              searchPlaceholder="Search..."
              value={nonCommecialReason}
              onChange={item => {
                setNonCommercialReason(item.value);
              }}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.deliveryDateContainer}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                setOpenExpDeliveryDate(true);
              }}>
              <Text style={{paddingVertical: 7}}>
                Enquiry Lost Date{' :- '}
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
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.deliveryButton}
            onPress={submitDelivery}>
            <Text style={styles.deliveryButtonText}>Save Lost Enquiry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    marginVertical: 10,
  },
  header: {
    color: 'white',
    fontSize: 16,
    // fontWeight: 'bold',
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
    marginVertical: 10,
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
    marginHorizontal: 125,
  },
  retailImg: {
    width: 22,
    height: 22,
    marginHorizontal: 130,
  },
  deliveryButton: {
    backgroundColor: '#27AE60',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    top: 135,
  },
});
export default DropScreen;

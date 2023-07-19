import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Picker,
  Button,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {API_URL} from '@env';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {saveManufacturerDetails} from '../redux/slice/manufacturerDetailsSlice';
import SweetSuccessAlert from './subCom/SweetSuccessAlert';
import {useNavigation} from '@react-navigation/native';
const AddManufacturDetails = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [value, setValue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [manufacturerData, setManufacurerData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [message, setMessage] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [manufacturer, setManufacturer] = useState('');
  const [modal, setModal] = useState('');
  const [variant, setVariant] = useState('');

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

  useEffect(() => {
    if (route) {
      console.log(route, 'editManu');
      const {editData} = route.params;
      setEditData(editData);
    }
  }, [route]);

  useEffect(() => {
    if (editData) {
      console.log(editData, 'manuedetails....');
      console.log(editData.manufacturer);
      console.log(editData.modal);
      console.log(editData.variant);
      setManufacturer(1);
      setModal(6);
      setVariant(18);
    }
  }, [editData]);
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          Select Manufacturer :
        </Text>
      );
    }
    return null;
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
            console.log(response.data.result, 'modllllllllllllll');
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
            console.log(response.data.result, 'vvvvvvvvvvvv');
            setVariantData(response.data.result);
          }
        });
      };
      getVariant();
    }
  }, [modal]);

  const saveManufacturDetails = () => {
    dispatch(
      saveManufacturerDetails({
        manufacturer,
        modal,
        variant,
      }),
    );
    setMessage(' Manufacturer Added');
    openModal();
    navigation.goBack();
  };
  const openModal = () => {
    setShowModal(true);
  };
  return (
    <View style={styles.container}>
      <View style={styles.customerContainer}>
        <Text style={styles.mainHeader}>Customer Details</Text>
        <View style={{marginBottom: 5}}>
          <Text style={styles.label}>Manufacturer *</Text>
          <View style={styles.inputContainer}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'},{paddingHorizontal: 5}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={manufacturItem}
              search
              disable={true}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Manufacturer' : ' '}
              searchPlaceholder="Search..."
              value={manufacturer}
              onChange={item => {
                setManufacturer(item.value);
              }}
            />
          </View>
        </View>
        <View style={{marginBottom: 5}}>
          <Text style={styles.label}>Modal *</Text>
          <View style={styles.inputContainer}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'},{paddingHorizontal: 5}]}
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
              value={modal}
              onChange={item => {
                setModal(item.value);
              }}
            />
          </View>
        </View>
        <View style={{marginBottom: 5}}>
          <Text style={styles.label}>Variant *</Text>
          <View style={styles.inputContainer}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'},{paddingHorizontal: 5}]}
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
              value={variant}
              onChange={item => {
                setVariant(item.value);
              }}
            />
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: 15}}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveManufacturDetails}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <SweetSuccessAlert message={message} modalShow={showModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderTopColor: 'grey',
  },
  customerContainer: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  inputContainer: {
    marginBottom: 10,
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    color: 'grey',
    marginBottom: 2,
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
    fontWeight: 'bold',
  },
  mainHeader: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  dropdownContainer: {
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#0984DF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownText: {
    color: 'red',
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
});

export default AddManufacturDetails;

import React, {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {saveManufacturerDetails} from '../redux/slice/manufacturerDetailsSlice';
import SweetSuccessAlert from './subCom/SweetSuccessAlert';
import {getEnquiryLocationData} from '../redux/slice/getEnquiryLocationSlice';
import {saveLocationForm} from '../redux/slice/locationFormSlice';
import { useNavigation } from '@react-navigation/native';
const AddManufacturDetails = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState([]);
  const [districtResult, setDisrictResult] = useState([]);
  const [talukaResult, setTalukaResult] = useState([]);
  const [villageResult, setVillageresult] = useState([]);
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [village, setVillage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [manufacturer, setManufacturer] = useState(null);
  const [modal, setModal] = useState(null);
  const [variant, setVariant] = useState(null);

  const stateData = resultData.map(stateName => ({
    label: stateName.state_name,
    value: stateName.state_name,
  }));

  const districtData = districtResult.map(item => ({
    label: item.name,
    value: item.name,
  }));

  const talukaData = talukaResult.map(taluka => ({
    label: taluka.name,
    value: taluka.name,
  }));

  const villageData = villageResult.map(village => ({
    label: village.name,
    value: village.name,
  }));

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
    const getStateList = async () => {
      const url = `${API_URL}/api/master/get-allsate`;
      console.log('get village', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.get(url, config).then(response => {
        if (response) {
          setResultData(response.data.result);
        }
      });
    };
    getStateList();
  }, []);

  useEffect(() => {
    const getEnquiryDistrict = async () => {
      const url = `${API_URL}/api/master/get-alldistrict`;
      console.log('get district', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.get(url, config).then(response => {
        if (response) {
          setDisrictResult(response.data.result);
        }
      });
    };
    getEnquiryDistrict();
  }, []);

  useEffect(() => {
    const getTaluka = async () => {
      const url = `${API_URL}/api/master/get-allTaluka`;
      console.log('get taluka', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.get(url, config).then(response => {
        if (response) {
          setTalukaResult(response.data.result);
        }
      });
    };
    getTaluka();
  }, []);

  useEffect(() => {
    const getVillage = async () => {
      const url = `${API_URL}/api/master/get-allVillage`;
      console.log('get taluka', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.get(url, config).then(response => {
        if (response) {
          setVillageresult(response.data.result);
        }
      });
    };
    getVillage();
  }, []);

  const saveLocation = () => {
    console.log(state, district, taluka, village);
    if (
      state.length > 0 &&
      district.length > 0 &&
      taluka.length > 0 &&
      village.length > 0
    ) {
      dispatch(
        saveLocationForm({
          state: state,
          district: district,
          taluka: taluka,
          village: village,
        }),
      );
      openModal();
      navigation.navigate("AddEnquiry")
    } else {
      console.warn('Please select first*');
    }
  };
  const openModal = () => {
    setShowModal(true);
  };
  return (
    <View style={styles.container}>
      <View style={styles.customerContainer}>
        <Text style={styles.mainHeader}>Customer Location</Text>
        <View style={{marginBottom: 5}}>
          <Text style={styles.label}>State *</Text>
          <View style={styles.inputContainer}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={stateData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select State' : ' '}
              searchPlaceholder="Search..."
              value={state}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setState(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <Text>{isFocus ? 'blue' : 'black'}</Text>
              // )}
            />
          </View>
        </View>
        <View style={{marginBottom: 5}}>
          <Text style={styles.label}>District *</Text>
          <View style={styles.inputContainer}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={districtData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select District' : ' '}
              searchPlaceholder="Search..."
              value={district}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setDistrict(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <Text>{isFocus ? 'blue' : 'black'}</Text>
              // )}
            />
          </View>
        </View>
        <View style={{marginBottom: 5}}>
          <Text style={styles.label}>Taluka *</Text>
          <View style={styles.inputContainer}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={talukaData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Taluka' : ' '}
              searchPlaceholder="Search..."
              value={taluka}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setTaluka(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <Text>{isFocus ? 'blue' : 'black'}</Text>
              // )}
            />
          </View>
        </View>
        <View style={{marginBottom: 5}}>
          <Text style={styles.label}>City/Village *</Text>
          <View style={styles.inputContainer}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={villageData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Village' : ' '}
              searchPlaceholder="Search..."
              value={village}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setVillage(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <Text>{isFocus ? 'blue' : 'black'}</Text>
              // )}
            />
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: 15}}>
        <TouchableOpacity style={styles.saveButton} onPress={saveLocation}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <SweetSuccessAlert modalShow={showModal} />
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

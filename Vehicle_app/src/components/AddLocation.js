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
import {useNavigation} from '@react-navigation/native';
const AddLocation = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState([]);
  const [districtResult, setDisrictResult] = useState([]);
  const [talukaResult, setTalukaResult] = useState([]);
  const [villageResult, setVillageresult] = useState([]);
  const [editData, setEditData] = useState(null);
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [message, setMessage] = useState('');
  const [village, setVillage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [manufacturer, setManufacturer] = useState(null);
  const [modal, setModal] = useState(null);
  const [variant, setVariant] = useState(null);

  const stateData = resultData.map(stateName => ({
    label: stateName.state_name,
    value: stateName.state_id,
  }));

  const districtData = districtResult.map(item => ({
    label: item.name,
    value: item.id,
  }));

  const talukaData = talukaResult.map(taluka => ({
    label: taluka.name,
    value: taluka.id,
  }));

  const villageData = villageResult.map(village => ({
    label: village.name,
    value: village.id,
  }));

  useEffect(() => {
    if (route) {
      console.log(route, 'editlocation');
      const {editData} = route.params;
      setEditData(editData);
    }
  }, [route]);

  useEffect(() => {
    if (editData) {
      console.log(editData, 'editLocationdd');
      setState(editData.state_id);
      setDistrict(editData.district_id);
      setTaluka(editData.taluka_id);
      setVillage(editData.village_id);
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
    const getStateList = async () => {
      const url = `${API_URL}/api/get-state-list`;
      console.log('get state', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.get(url, config).then(response => {
        if (response) {
          // console.log(response.data.result,'data');
          setResultData(response.data.result);
        }
      });
    };
    getStateList();
  }, []);

  useEffect(() => {
    if (state) {
      const getEnquiryDistrict = async () => {
        const url = `${API_URL}/api/get-district-list/${state}`;
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
            console.log(response.data.result, 'data');
            setDisrictResult(response.data.result);
          }
        });
      };
      getEnquiryDistrict();
    }
  }, [state]);

  useEffect(() => {
    if (district) {
      const getTaluka = async () => {
        const url = `${API_URL}/api/get-taluka-list/${district}`;
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
    }
  }, [district]);

  useEffect(() => {
    if (taluka) {
      const getVillage = async () => {
        const url = `${API_URL}/api/get-village-list/${taluka}`;
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
            console.log(response.data,'villllll');
            setVillageresult(response.data.result);
          }
        });
      };
      getVillage();
    }
  }, [taluka]);

  const saveLocation = () => {
    console.log(state, district, taluka, village);
    console.log(taluka, 'id');

    dispatch(
      saveLocationForm({
        state: state,
        district: district,
        taluka: taluka,
        village: village,
      }),
    );
    setMessage("Location Added");
    openModal();
    navigation.goBack();
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
              onChange={item => {
                setState(item.value);
              }}
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
              onChange={item => {
                setDistrict(item.value);
              }}
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
              onChange={item => {
                setTaluka(item.value);
              }}
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
              onChange={item => {
                setVillage(item.value);
              }}
            />
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: 15}}>
        <TouchableOpacity style={styles.saveButton} onPress={saveLocation}>
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

export default AddLocation;

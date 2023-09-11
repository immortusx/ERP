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
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';
import CustomRadioButton from './subCom/CustomRadioButton';
import {useDispatch, useSelector} from 'react-redux';
import {clearEnquiryState, setEnquiryDb} from '../redux/slice/addEnquirySlice';
import {saveEnquiryModalForm} from '../redux/slice/addEnquiryModal';
import {saveModalData} from '../redux/slice/modalDataSlice';
import SweetSuccessAlert from './subCom/SweetSuccessAlert';
import {getVillageData} from '../redux/slice/getAllVillageSlice';
import {
  clearFastEnquiryState,
  setFastEnquiryDb,
} from '../redux/slice/addFastEnquirySlice';
import {getEnquiryData} from '../redux/slice/getEnquirySlice';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

const FastEnquiry = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const enquiryState = useSelector(state => state.enquriySlice.enquiryState);
  const locationForm = useSelector(state => state.locationForm);
  const fastEnquiryState = useSelector(
    state => state.fastEnquirySlice.fastEnquiryState,
  );
  const getVillageState = useSelector(state => state.getVillageState);
  const {isFetching, isSuccess, isError, result} = getVillageState;
  const {maker, modalName, variantName, year, condition_of} = useSelector(
    state => state.modalData,
  );
  const {manufacturer, modal, variant} = useSelector(
    state => state.manufacturerDetails,
  );
  const profileData = useSelector(
    state => state.getUserProfileSlice.profile.currentUserData.result,
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openCurentDate, setOpenCurrentDate] = useState(false);
  const [expDeliveryDate, setExpDeliveryDate] = useState(new Date());
  const [openExpDeliveryDate, setOpenExpDeliveryDate] = useState(false);
  const [manuYearDate, setManuYearDate] = useState(new Date());
  const [openManuYearDate, setOPenManuYearDate] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [village, setVillage] = useState(null);
  const [taluka, setTaluka] = useState(null);
  const [message, setMessage] = useState('');
  const [salePerson, setSalePerson] = useState('');
  const [talukaResult, setTalukaResult] = useState([]);
  const [condition, setCondtion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('No');
  const options = ['Yes', 'No'];
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [salePersonData, setSalePersonData] = useState([]);
  const [branchTaluka, setBranchTaluka] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategoryData, setcurrentCategoryData] = useState({
    id: '',
    fields: [],
  });
  const [oldVehicleData, setOldVehicleData] = useState({
    maker: '',
    modalName: '',
    variantName: '',
  });
  const [enquiryData, setEnquiryData] = useState({
    customer: '',
    phone: '',
    whatsappno: '',
  });

  const talukaData = talukaResult.map(taluka => ({
    label: taluka.name,
    value: taluka.id,
  }));
  const villageData = resultData.map(village => ({
    label: village.name,
    value: village.id,
  }));
  const categoryList = categoryData.map(category => ({
    label: category.category_name,
    value: category.id,
  }));

  let newTractorId = 2;
  const conditionType = [
    {label: 'Good', value: '1'},
    {label: 'Below Average', value: '2'},
    {label: 'Average', value: '3'},
    {label: 'Vey Good', value: '4'},
  ];

  const getCurrentCategoriesField = async categoryId => {
    const url = `${API_URL}/api/enquiry/get-current-fields/${categoryId}`;
    console.log('get field', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    await axios.get(url, config).then(response => {
      if (response) {
        // console.log(response.data.result, 'category field');
        setcurrentCategoryData(categoryfieldData => ({
          ...categoryfieldData,
          fields: response.data.result,
        }));
      }
    });
  };

  useEffect(() => {
    if (category) {
      if (category != 0) {
        setcurrentCategoryData(currentCategoryField => ({
          ...currentCategoryField,
          id: category,
        }));
        getCurrentCategoriesField(category);
      }
    }
  }, [category]);

  const getSelectedFields = data => {
    switch (data.field) {
      case 'firstName': {
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter Customer Name"
              autoCapitalize="none"
              onChangeText={value => onChangeHandler(value, 'customer')}
            />
          </View>
        );
        break;
      }
      case 'mobileNumber': {
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter Phone Number"
              autoCapitalize="none"
              onChangeText={value => onChangeHandler(value, 'phone')}
            />
          </View>
        );
        break;
      }
      case 'whatsappNumber': {
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>WhatsApp Number *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter WhatsApp Number"
              autoCapitalize="none"
              onChangeText={value => onChangeHandler(value, 'whatsappno')}
            />
          </View>
        );
        break;
      }
      case 'taluko': {
        return (
          <View style={{marginBottom: 5}}>
            <Text style={styles.label}>Select Taluka *</Text>
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
                data={talukaData}
                search
                maxHeight={200}
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
        );
        break;
      }
      case 'village': {
        return (
          <>
            <View style={{marginBottom: 5}}>
              <Text style={styles.label}>Select Village *</Text>
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
                  data={villageData}
                  search
                  maxHeight={200}
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
              {loading ? (
                <ActivityIndicator
                  style={{alignItems: 'flex-start'}}
                  size={12}
                  color="#3498DB"
                />
              ) : (
                <Text style={{color: 'green', fontWeight: '400'}}>
                  {salePerson
                    ? 'Sales Person :-' + ' ' + salePerson.toUpperCase()
                    : ''}
                </Text>
              )}
            </View>
          </>
        );
        break;
      }
    }
  };
  useEffect(() => {
    if (village) {
      const getAssignedPerson = async () => {
        const url = `${API_URL}/api/retrieve-area-assigned-person/${category}/${village}`;
        console.log('get assigned person', url);
        const token = await AsyncStorage.getItem('rbacToken');
        const config = {
          headers: {
            token: token ? token : '',
          },
        };
        setLoading(true);
        console.log(config);
        await axios.get(url, config).then(response => {
          if (response) {
            console.log(response.data.result, 'assigned person');
            setSalePersonData(response.data.result);
          }
        });
        setLoading(false);
      };
      getAssignedPerson();
    }
  }, [village]);

  useEffect(() => {
    if (salePersonData.length > []) {
      setSalePerson(salePersonData[0].salesperson);
    }
  }, [salePersonData]);
  useEffect(() => {
    const getTaluka = async () => {
      const url = `${API_URL}/api/get-taluka-list`;
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
          // console.log(response.data.result, 'talukaid');
          setTalukaResult(response.data.result);
        }
      });
    };
    getTaluka();
  }, []);

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
            // console.log(response.data, 'villllll');
            setResultData(response.data.result);
          }
        });
      };
      getVillage();
    }
  }, [taluka]);

  const handleSelect = option => {
    const selectedValue = option === 'Yes' ? 'Yes' : 'No';
    setSelectedOption(selectedValue);
    handleReadValue(selectedValue);
    if (selectedValue === 'Yes') {
      setModalVisible(true);
    }
  };
  useEffect(() => {
    const getVillage = () => {
      dispatch(getVillageData());
    };
    getVillage();
  }, []);

  useEffect(() => {
    if (result) {
      const {talukaName, villageList} = result.result;
      setBranchTaluka(talukaName);
      setResultData(villageList);
    }
  }, [result]);

  useEffect(() => {
    if (branchTaluka) {
      branchTaluka.map(taluka => {
        setTaluka(taluka.id);
      });
    }
  }, [branchTaluka]);
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
    if (categoryData) {
      categoryData.map(item => {
        if (item.id === newTractorId) {
          setCategory(item.id);
        }
      });
    }
  }, [categoryData]);

  useEffect(() => {
    if (fastEnquiryState && fastEnquiryState.isSuccess === true) {
      dispatch(clearFastEnquiryState());
      setMessage('Enquiry Submitted');
      // console.log('Enquiry submitted');
      openModal();
      dispatch(getEnquiryData()).then(() => {
        navigation.navigate('AddMore');
      });
    }
  }, [fastEnquiryState]);

  const submitEnquiry = () => {
    const formData = {
      first_name: enquiryData.customer,
      phone_number: enquiryData.phone,
      whatsapp_number: enquiryData.whatsappno,
      village: village,
      taluka: taluka,
      category: category,
    };
    if (
      enquiryData.customer.length > 0 &&
      enquiryData.phone.length > 0 &&
      enquiryData.whatsappno.length > 0
    ) {
      dispatch(setFastEnquiryDb(formData)).then(() => {
        dispatch(clearFastEnquiryState());
      });
      setEnquiryData({
        customer: '',
        phone: '',
        whatsappno: '',
      });
      setVillage(null);
    } else {
      console.warn('Please first fill the field*');
    }
  };

  useEffect(() => {
    const getCategory = async () => {
      const url = `${API_URL}/api/enquiry/get-enquiry-categories`;
      console.log('get category', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.get(url, config).then(response => {
        if (response) {
          // console.log(response.data.result, 'category List');
          const filteredCategory = response.data.result.filter((item)=> item.id !== 1);
          setCategoryData(filteredCategory);
        }
      });
    };
    getCategory();
  }, []);
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
    console.log('____________');
    setShowModal(true);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.customerContainer}>
          <View style={styles.categoryBox}>
            <View>
              <Text
                style={{fontWeight: 'bold', color: '#2E86C1', marginBottom: 5}}>
                Category
              </Text>
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
                  data={categoryList}
                  search
                  maxHeight={200}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select Category' : ' '}
                  searchPlaceholder="Search..."
                  value={category}
                  onChange={item => {
                    setCategory(item.value);
                  }}
                />
              </View>
            </View>
          </View>
          {category != '' && currentCategoryData.id != '' && (
            <View>
              {currentCategoryData.fields.length > 0 ? (
                currentCategoryData.fields.map(item => {
                  return getSelectedFields(item);
                })
              ) : (
                <Text
                  style={{color: 'grey', fontSize: 16, textAlign: 'center'}}>
                  There are no selected fields
                </Text>
              )}
            </View>
          )}
        </View>
        <View style={{paddingHorizontal: 15, marginTop: 20}}>
          <TouchableOpacity style={styles.submitButton} onPress={submitEnquiry}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <SweetSuccessAlert message={message} modalShow={showModal} />
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
    height: 500,
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
  categoryBox: {
    backgroundColor: '#EAF2F8',
    padding: 5,
  },
  leftSide: {
    flex: 1,
    marginRight: 10,
  },
  rightSide: {
    flex: 1,
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  mainHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryContainer: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
export default FastEnquiry;

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
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import axios from 'axios';
import CustomRadioButton from './subCom/CustomRadioButton';
import { useDispatch, useSelector } from 'react-redux';
import { clearEnquiryState, setEnquiryDb } from '../redux/slice/addEnquirySlice';
import { saveEnquiryModalForm } from '../redux/slice/addEnquiryModal';
import { clearModalData, saveModalData } from '../redux/slice/modalDataSlice';
import SweetSuccessAlert from './subCom/SweetSuccessAlert';
import { useNavigation } from '@react-navigation/native';
import { getEnquiryData } from '../redux/slice/getEnquirySlice';
import { clearManufacturerDetails } from '../redux/slice/manufacturerDetailsSlice';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  clearEditEnquiryState,
  setEditEnquiryDb,
} from '../redux/slice/editEnquirySlice';
import Calendars from './subCom/Calendars';
import YearPicker from './subCom/YearPicker';
import MinDateCalendars from './subCom/MinDateCalendars';
import moment from 'moment';
const DetailEnquiry = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const enquiryState = useSelector(state => state.DetailEnquiry.enquiryState)
  const editEnquiryState = useSelector(
    state => state.editEnquirySlice.editEnquiryState,
  );
  const { maker, modalName, variantName, year, condition_of } = useSelector(
    state => state.modalData,
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
  const [primarySource, setPrimarySource] = useState(null);
  const [enquirySource, setEnquirySource] = useState(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [condition, setCondtion] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('No');
  const options = ['No', 'Yes'];
  const [category, setCategory] = useState(null);
  const [make, setMake] = useState(null);
  const [modal, setModal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [oldManufacturer, setOldManufacturer] = useState(null);
  const [oldModal, setOldModal] = useState(null);
  const [oldVariant, setOldVariant] = useState(null);
  const [showfield, setShowField] = useState(false);
  const [manufacturerData, setManufacurerData] = useState([]);
  const [salePerson, setSalePerson] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalList, setModalList] = useState([]);
  const [talukaResult, setTalukaResult] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [village, setVillage] = useState(null);
  const [taluka, setTaluka] = useState(null);
  const [enquiryId, setEnquiryId] = useState(null);
  const [oldProductData, setOldProductData] = useState([]);
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [whatsNumberError, setWhatNumberError] = useState('');
  const [currentCategoryData, setcurrentCategoryData] = useState({
    id: '',
    fields: [],
  });
  const [salePersonData, setSalePersonData] = useState({
    id: null,
    ssp: ''
  });
  const [primarySourceItem, setPrimarySourceItem] = useState([]);
  const [enquirySourceItem, setEnquirySourceItem] = useState([]);
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
    enquiry: '',
  });

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
  const categoryList = categoryData.map(category => ({
    label: category.category_name,
    value: category.id,
  }));
  const modalsList = modalList.map(item => ({
    label: item.modalName,
    value: item.id,
  }));
  const talukaData = talukaResult.map(taluka => ({
    label: taluka.name,
    value: taluka.id,
  }));
  const villageData = resultData.map(village => ({
    label: village.name,
    value: village.id,
  }));
  const primarySourceDataItem = primarySourceItem.map(item => ({
    label: item.name,
    value: item.id,
  }));
  const enquirySourceItems = enquirySourceItem.map(item => ({
    label: item.name,
    value: item.id,
  }));

  let newTractorId = 2;
  const conditionType = [
    { label: 'Good', value: 'Good' },
    { label: 'Below Average', value: 'Below Average' },
    { label: 'Average', value: 'Average' },
    { label: 'Vey Good', value: 'Vey Good' },
  ];
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
            response.data.result.map((item) => {
              setSalePersonData({
                id: item.id,
                ssp: item.salesperson
              });
            })

          }
        });
        setLoading(false);
      };
      getAssignedPerson();
    }
  }, [village]);
  const handleConfirm = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    console.log(formattedDate, 'formatteddat')
    setExpDeliveryDate(formattedDate);
    setOpenExpDeliveryDate(false);
  };
  useEffect(() => {
    if (salePersonData.length > []) {
      setSalePerson(salePersonData[0].salesperson);
    }
  }, [salePersonData]);
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
          const filteredCategory = response.data.result.filter(
            item => item.id !== 1,
          );
          setCategoryData(filteredCategory);
        }
      });
    };
    getCategory();
    getPrimarySource();
  }, []);

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
        console.log(response.data.result, 'category field');
        setcurrentCategoryData(categoryfieldData => ({
          ...categoryfieldData,
          fields: response.data.result,
        }));
      }
    });
  };
  const getSelectedFields = data => {
    switch (data.field) {
      case 'firstName': {
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter First Name"
              autoCapitalize="none"
              keyboardType="default"
              defaultValue={enquiryData.firstname || ''}
              onChangeText={value => onChangeHandler(value, 'firstname')}
            />
          </View>
        );
        break;
      }
      case 'lastName': {
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter Last Name"
              autoCapitalize="none"
              keyboardType="default"
              defaultValue={enquiryData.lastname || ''}
              onChangeText={value => onChangeHandler(value, 'lastname')}
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
              keyboardType="default"
              defaultValue={enquiryData.phone || ''}
              onChangeText={value => onChangeHandler(value, 'phone')}
              maxLength={10}
            />
            {mobileNumberError ? (
              <Text style={{ color: 'red' }}>{mobileNumberError}</Text>
            ) : null}
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
              keyboardType="default"
              defaultValue={enquiryData.whatsappno || ''}
              onChangeText={value => onChangeHandler(value, 'whatsappno')}
              maxLength={10}
            />
            {whatsNumberError ? (
              <Text style={{ color: 'red' }}>{whatsNumberError}</Text>
            ) : null}
          </View>
        );
        break;
      }
      case 'taluko': {
        return (
          <View style={{ marginBottom: 5 }}>
            <Text style={[styles.label, { marginBottom: 5 }]}>
              Select Taluka *
            </Text>
            <View style={styles.enquirySourceContainer}>
              {/* {renderLabel()} */}
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { borderColor: 'blue' },
                  { paddingHorizontal: 5 },
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
            <View style={{ marginBottom: 5 }}>
              <Text style={[styles.label, { marginBottom: 5 }]}>
                Select Village *
              </Text>
              <View style={styles.enquirySourceContainer}>
                {/* {renderLabel()} */}
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderColor: 'blue' },
                    { paddingHorizontal: 5 },
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
                    setSalePersonData({
                      id: '',
                      ssp: ''
                    })
                    setVillage(item.value);
                  }}
                />
              </View>
              {loading ? (
                <ActivityIndicator
                  style={{ alignItems: 'flex-start' }}
                  size={10}
                  color="#3498DB"
                />
              ) : (
                <Text style={{ color: 'green', fontWeight: '400' }}>
                  {salePersonData.ssp
                    ? 'Sales Person :-' + ' ' + salePersonData.ssp.toUpperCase()
                    : ''}
                </Text>
              )}
            </View>
          </>
        );
        break;
      }
      case 'make': {
        return (
          <View style={{ marginBottom: 5 }}>
            <Text style={[styles.label, { marginBottom: 5 }]}>Manufactur *</Text>
            <View style={styles.enquirySourceContainer}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { borderColor: 'blue' },
                  { paddingHorizontal: 5 },
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
                value={make}
                onChange={item => {
                  setMake(item.value);
                }}
              />
            </View>
          </View>
        );
        break;
      }
      case 'modal': {
        return (
          <View style={{ marginBottom: 5 }}>
            <Text style={[styles.label, { marginBottom: 5 }]}>Modal *</Text>
            <View style={styles.enquirySourceContainer}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { borderColor: 'blue' },
                  { paddingHorizontal: 5 },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={modalsList}
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
        );
        break;
      }
      case 'primarySource': {
        return (
          <View style={{ marginBottom: 5 }}>
            <Text style={[styles.label, { marginBottom: 5 }]}>
              Enquiry Primary Source *
            </Text>
            <View style={styles.enquirySourceContainer}>
              {/* {renderLabel()} */}
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { borderColor: 'blue' },
                  { paddingHorizontal: 5 },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={primarySourceDataItem}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Primary Source' : ' '}
                searchPlaceholder="Search..."
                value={primarySource}
                onChange={item => {
                  setPrimarySource(item.value);
                }}
              />
            </View>
          </View>
        );
        break;
      }
      case 'sourceOfEnquiry': {
        return (
          <View style={{ marginBottom: 5 }}>
            <Text style={[styles.label, { marginBottom: 5 }]}>
              Enquiry Source *
            </Text>
            <View style={styles.enquirySourceContainer}>
              {/* {renderLabel()} */}
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { borderColor: 'blue' },
                  { paddingHorizontal: 5 },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={enquirySourceItems}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Source' : ' '}
                searchPlaceholder="Search..."
                value={enquirySource}
                onChange={item => {
                  setEnquirySource(item.value);
                }}
              />
            </View>
          </View>
        );
        break;
      }
      case 'deliveryDate': {
        return (
          <View style={{ marginBottom: 5 }}>
            <Text style={[styles.label, { marginBottom: 5 }]}>
              Delivery Date *
            </Text>
            <View style={styles.deliveryDateContainer}>
              <TouchableOpacity   style={{ paddingHorizontal: 5 }} onPress={() => { setOpenExpDeliveryDate(true) }}>
                <Text style={{ paddingVertical: 7 }}>
                  Start Date {':- '}
                  {expDeliveryDate === ''
                    ? new Date().toISOString().slice(0, 10)
                    : expDeliveryDate}
                </Text></TouchableOpacity>
              <DateTimePickerModal
                isVisible={openExpDeliveryDate}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => { setOpenExpDeliveryDate(false) }}
              />
            </View>
          </View>
        );
        break;
      }
      case 'oldTractor': {
        return (
          <>
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
                  <Text style={styles.modalTitle}>Select Details *</Text>
                  <View style={styles.sourceContainer}>
                    <View style={styles.enquirySourceContainer}>
                      {/* {renderLabel()} */}
                      <Dropdown
                        style={[
                          styles.dropdown,
                          isFocus && { borderColor: 'blue' },
                          { paddingHorizontal: 5 },
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
                          isFocus && { borderColor: 'blue' },
                          { paddingHorizontal: 5 },
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
                  {1 !== 1 && (
                    <View style={styles.sourceContainer}>
                      <View style={styles.enquirySourceContainer}>
                        {/* {renderLabel()} */}
                        <Dropdown
                          style={[
                            styles.dropdown,
                            isFocus && { borderColor: 'blue' },
                            { paddingHorizontal: 5 },
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
                  )}

                  <View style={{ marginBottom: 5 }}>
                    <View
                      style={[
                        styles.deliveryDateContainer,
                        { paddingVertical: 7 },
                      ]}>
                      <View>
                        <View style={{ flex: 1 }}>
                          <TouchableOpacity
                            onPress={() => {
                              setIsPickerVisible(true);
                            }}>
                            <Text style={{ textAlign: 'left' }}>
                              Manufactur Year{' :-'}
                              {manuYearDate ? manuYearDate : 'Select Year'}
                            </Text>
                          </TouchableOpacity>
                          <YearPicker
                            visible={isPickerVisible}
                            onYearSelect={onYearSelect}
                            onClose={() => {
                              setIsPickerVisible(false);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.sourceContainer}>
                    <View style={styles.enquirySourceContainer}>
                      {/* {renderLabel()} */}
                      <Dropdown
                        style={[
                          styles.dropdown,
                          isFocus && { borderColor: 'blue' },
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
                </View>
              </View>
            )}
          </>
        );
        break;
      }
    }
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
  useEffect(() => {
    if (modalVisible) {
      getManufacturer();
    } else {
      getManufacturer();
    }
  }, [modalVisible]);
  useEffect(() => {
    if (make) {
      const getModal = async () => {
        const url = `${API_URL}/api/master/getmodal/${make}`;
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
            setModalList(response.data.result);
          }
        });
      };
      getModal();
    }
  }, [make]);
  useEffect(() => {
    if (oldManufacturer) {
      const getModal = async () => {
        console.log(oldManufacturer, 'id');
        const url = `${API_URL}/api/master/getmodal/${oldManufacturer}`;
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
  }, [oldManufacturer]);

  useEffect(() => {
    if (oldModal) {
      const getVariant = async () => {
        console.log(oldModal, 'id');
        const url = `${API_URL}/api/master/getvariant/${oldModal}`;
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
  }, [oldModal]);
  useEffect(() => {
    if (route) {
      // console.log(route, '>>>>>>>>>>>>');
      // console.log(route.params,"para");
      const { editData } = route.params;
      console.log(editData, 'edit');
      setEditData(editData);
    }
  }, [route]);
  useEffect(() => {
    if (editData) {
      setCategory(editData.enquiry_category_id);
      setEnquiryData({
        firstname: editData.first_name,
        lastname: editData.last_name,
        phone: editData.phone_number,
        whatsappno: editData.whatsapp_number,
      });
      setTaluka(editData.taluka_id);
      setVillage(editData.village_id);
      setMake(Number(editData.make));
      setModal(editData.modal_id);
      setPrimarySource(Number(editData.primary_source_id));
      setEnquirySource(Number(editData.enquiry_source_id));
      if (editData.delivery_date) {
        setExpDeliveryDate(editData.delivery_date.slice(0, 10));
      }
      if (editData.oldOwned === 'Yes') {
        setSelectedOption('Yes');
        setModalVisible(true);
        getOldProductDetails(editData.enquiry_id);
      } else {
        setSelectedOption('No');
        setModalVisible(false);
      }
    } else if (categoryData && newTractorId) {
      const matchingCategory = categoryData.find(
        item => item.id === newTractorId,
      );
      if (matchingCategory) {
        setCategory(matchingCategory.id);
      }
    }
  }, [editData, categoryData, newTractorId]);

  const getOldProductDetails = async enquiryId => {
    const url = `${API_URL}/api/enquiry/get-old-product-details/${enquiryId}`;
    console.log('get old product', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    await axios.get(url, config).then(response => {
      if (response) {
        console.log(response.data.result, 'oldproduct');
        // setOldProductData(response.data.result);
        const maker = response.data.result.map(item => item.maker);
        const modal = response.data.result.map(item => item.modalName);
        const year = response.data.result.map(item => item.year_of_manufactur);
        const condtionn = response.data.result.map(item => item.condition_of);
        console.log(maker[0], 'maker');
        setOldManufacturer(Number(maker[0]));
        setOldModal(Number(modal[0]));
        setManuYearDate(year[0]);
        setCondtion(condtionn[0]);
      }
    });
  };
  const getPrimarySource = async () => {
    const url = `${API_URL}/api/enquiry/get-primary-source`;
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
        console.log(response.data.result, 'primary sourcer');
        setPrimarySourceItem(response.data.result);
      }
    });
  };
  const getEnquirySource = async primarySourceId => {
    const url = `${API_URL}/api/enquiry/get-source-enquiry/${primarySourceId}`;
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
        console.log(response.data.result, 'enquiry source');
        setEnquirySourceItem(response.data.result);
      }
    });
  };

  useEffect(() => {
    if (primarySource) {
      getEnquirySource(primarySource);
    }
  }, [primarySource]);
  const handleReadValue = () => {
    console.log(selectedOption);
  };
  const closeModal = () => {
    setModalVisible(!modalVisible);
    setSelectedOption('No');
  };
  const onChangeHandler = (value, field) => {
    if (field === 'phone') {
      if (!/^\d{10}$/.test(value)) {
        setMobileNumberError('Invalid mobile number. It should be 10 digits.');
      } else {
        setMobileNumberError('');
      }
    }
    if (field === 'whatsappno') {
      if (!/^\d{10}$/.test(value)) {
        setWhatNumberError('Invalid WhatsApp number. It should be 10 digits.');
      } else {
        setWhatNumberError('');
      }
    }

    setEnquiryData(preData => ({
      ...preData,
      [field]: value,
    }));

  };

  useEffect(() => {
    console.log(editEnquiryState, 'detail');
    if (editEnquiryState && editEnquiryState.isSuccess === true) {
      dispatch(clearEditEnquiryState());
      dispatch(clearModalData());
      setMessage('Enquiry Updated');
      console.log('Enquiry Updated');
      // openModal();
      setShowMessageModal(true);
      dispatch(getEnquiryData()).then(() => {
        navigation.navigate('HOME');
      });
    }
  }, [editEnquiryState]);

  useEffect(() => {
    if (enquiryState && enquiryState.result.result === 'allready exists') {
      setMobileNumberError("*Already Exist!");
      console.log(enquiryState, "enquiryStatedirdtrif")
      dispatch(clearEnquiryState());
      dispatch(clearManufacturerDetails());
      dispatch(clearModalData());
    }
    else if (enquiryState && enquiryState.result.result === 'success') {
      dispatch(clearEnquiryState());
      dispatch(clearManufacturerDetails());
      dispatch(clearModalData());
      setMessage('Enquiry Submitted');
      openModal();
      setMobileNumberError('')
      setShowMessageModal(true);
      navigation.navigate('HOME');
    }

  }, [enquiryState]);

  const submitEnquiry = () => {
    const { firstname, lastname, phone, whatsappno } = enquiryData;
    const formData = {
      first_name: firstname,
      last_name: lastname,
      phone_number: phone,
      whatsapp_number: whatsappno,
      taluka: taluka,
      village: village,
      category: category,
      deliveryDate:
        expDeliveryDate !== ''
          ? new Date(expDeliveryDate)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')
          : new Date().toISOString().slice(0, 19).replace('T', ' '),
      make: make,
      modal: modal,
      maker: oldManufacturer,
      modalName: oldModal,
      variantName: oldVariant,
      year: manuYearDate,
      condition_of: condition,
      enquiryPrimarySource: primarySource,
      sourceOfEnquiry: enquirySource,
      old_tractor: selectedOption,
    };
    if (enquiryData.firstname.length > 0) {
      if (editData) {
        formData.customer_id = editData.id;
        formData.sales_person = salePersonData.id
        console.log(formData, 'Edit Enquirydkfkd');
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
  const onYearSelect = year => {
    console.log(year, 'year');
    setManuYearDate(year);
    setIsPickerVisible(false);
  };
  const formattedCurrentDate = currentDate.toLocaleDateString();

  const handleModalData = () => {
    console.log(oldManufacturer, oldModal, oldVariant, manuYearDate, condition);
    dispatch(
      saveModalData({
        maker: oldManufacturer,
        modalName: oldModal,
        variantName: oldVariant,
        year: manuYearDate,
        condition_of: condition,
      }),
    );
    setModalVisible(!modalVisible);
    setOldManufacturer(null);
    setOldModal(null);
    setOldVariant(null);
    setCondtion(null);
    setManuYearDate(new Date());
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
    navigation.navigate('Add Location', { editData: editData });
  };
  const openManufactureDetails = editData => {
    navigation.navigate('Add Manufacturer Details', { editData: editData });
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.customerContainer}>
          <View style={styles.categoryBox}>
            <View>
              <Text
                style={{ fontWeight: 'bold', color: '#2E86C1', marginBottom: 5 }}>
                Category
              </Text>
              <View style={styles.enquirySourceContainer}>
                {/* {renderLabel()} */}
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderColor: 'blue' },
                    { paddingHorizontal: 5 },
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
                  style={{ color: 'grey', fontSize: 16, textAlign: 'center' }}>
                  There are no selected fields
                </Text>
              )}
            </View>
          )}
        </View>
        <View style={{ paddingHorizontal: 15, top: 20 }}>
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
    // marginBottom: 5,
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
  dateImg: {
    width: 22,
    height: 22,
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
export default DetailEnquiry;

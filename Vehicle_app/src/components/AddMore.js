import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  RefreshControl,
  TextInput
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEnquiryData } from '../redux/slice/getEnquirySlice';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import { Linking } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import ToastMessage from './subCom/ToastMessage';
import TimeAgo from './subCom/TImeAgo';
import ConfirmationDialog from './subCom/ConfirmationDialog';
import ConfirmBox from './subCom/Confirm';
import NewEnquiry from './NewEnquiry';
import LastMonthEnquiry from './LastMonthEnquiry';
import TodayEnquiry from './TodayEnquiry';
import { setEnquiryType } from '../redux/slice/enquiryTypeSlice';
import FollowedEnquiry from './FollowedEnquiry';
import DueEnquiry from './DueEnquiry';
import HotEnquiry from './HotEnquiry';
import WarmEnquiry from './WarmEnquiry';
import CategorisedEnquiry from './CategorisedEnquiry';
import UserCreatedEnquiry from './UserCreatedEnquiry';
import ColdEnquiry from './ColdEnquiry';
import { Dropdown } from 'react-native-element-dropdown';
import SimpleAlert from './subCom/SimpleAlert';
import translations from '../../assets/locals/translations';
const AddMore = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todayEnquiryList, setTodayEnquiryList] = useState([]);
  const [newEnquiryList, setNewEnquiryList] = useState([]);
  const [lastMonthEnquiryList, setLastMonthEnquiryList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isConfirmation, setIsConfiromation] = useState(false);
  const enquiryType = useSelector(state => state.enquiryType.enquiryType);
  const [isFocus, setIsFocus] = useState(false);
  const [searchText, setSearchText] = useState(''); // State for the search input
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  useEffect(() => {
    dispatch(setEnquiryType('New'));
  }, []);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(2);
   const [totalnewenquirynumber, setTotalNewWenquiryNumber] = useState('');
   const [totalhotenquirynumber, setTotalHotWenquiryNumber] = useState('');
   const [totalcoldenquirynumber, setTotalColdWenquiryNumber] = useState('');
   const [totalwarmenquirynumber, setTotalWarmWenquiryNumber] = useState('');
   const [totalusercreatedenquirynumber, setTotalUserCreatedenquiryNumber] =
     useState('');
  const categoryList = categoryData.map(category => ({
    label: category.category_name,
    value: category.id,
  }));
  const currentLanguage = useSelector((state) => state.language.language);
 const enquiryFilters = [
   {
     type: translations[currentLanguage]?.new || "New",
     total_count: totalnewenquirynumber.total_count,
   },
   // {
   //   type: 'Today',
   // },
   // {
   //   type: 'Last Month',
   // },
   {
     type: translations[currentLanguage]?.hot || "Hot",
     total_count: totalhotenquirynumber.total_count,
   },
   {
     type: translations[currentLanguage]?.cold || "Cold",
     total_count: totalcoldenquirynumber.total_count,
   },
   {
     type: translations[currentLanguage]?.warm || "Warm",
     total_count: totalwarmenquirynumber.total_count,
   },
   {
     type: translations[currentLanguage]?.usercreated || "User Created",
     total_count: totalusercreatedenquirynumber.total_count,
   },
 ];
  const handleScreen = type => {
    console.log(type, 'screen');
    dispatch(setEnquiryType(type));
  };
  const handleSheduleCall = item => {
    navigation.navigate('Schedule Call', {item: item});
  };
  const makePhoneCall = mobileNumber => {
    console.log('Calling...', mobileNumber);
    Linking.openURL(`tel:${mobileNumber}`);
  };

  const openAdditonalEnquiry = item => {
    console.log(item, '>>>>>>>>>>>>>>>.');
    navigation.navigate('Additional Details', {item: item});
  };

  const handleConfirm = () => {
    //   dispatch(setEnquiryType('Followed Enquiry'));
    setIsConfiromation(false);
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    //   dispatch(setEnquiryType('Followed Enquiry'));
    dispatch(getEnquiryData());
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    const getCategoryies = async () => {
      const url = `${API_URL}/api/enquiry/get-enquiry-categories`;
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.get(url, config).then(response => {
        if (response) {
          const filteredCategory = response.data.result.filter(
            item => item.id !== 1,
          );
          filteredCategory.unshift({id: 1, category_name: 'All'});
          setCategoryData(filteredCategory);
          dispatch(setEnquiryType('New'));
        }
      });
    };
    getCategoryies();
  }, []);
  const handleCategoryChange = async categoryId => {
    dispatch(setEnquiryType('New'));
  };
  // useEffect(() => {
  //   countNewEnquiry();
  //   countHotEnquiry();
  //   countColdEnquiry();
  //   countWarmEnquiry();
  //   countUserCreatedEnquiry();
  // }, [selectedCategory]);

   useFocusEffect(
     React.useCallback(() => {
       countNewEnquiry();
       countHotEnquiry();
       countColdEnquiry();
       countWarmEnquiry();
       countUserCreatedEnquiry();
     }, [selectedCategory]),
   );

 const countNewEnquiry = async () => {
   console.log('New enquiries....', selectedCategory);
   const url = `${API_URL}/api/enquiry/get-total-new-enquiry-count/${selectedCategory}`;
   console.log('get new enqiry count', url);
   const token = await AsyncStorage.getItem('rbacToken');
   const config = {
     headers: {
       token: token ? token : '',
     },
   };
   setLoading(true);
   await axios.get(url, config).then(response => {
     console.log(response.data.result, 'count new enquiry');
     setTotalNewWenquiryNumber(response.data.result[0]);
   });
   setLoading(false);
 };
 const countHotEnquiry = async () => {
   console.log('New enquiries....', selectedCategory);
   const url = `${API_URL}/api/enquiry/get-total-hot-enquiry-count/${selectedCategory}`;
   console.log('get hot enqiry count', url);
   const token = await AsyncStorage.getItem('rbacToken');
   const config = {
     headers: {
       token: token ? token : '',
     },
   };
   setLoading(true);
   await axios.get(url, config).then(response => {
     console.log(response.data.result, 'count hot enquiry');
     setTotalHotWenquiryNumber(response.data.result[0]);
   });
   setLoading(false);
 };
 const countColdEnquiry = async () => {
   console.log('New enquiries....', selectedCategory);
   const url = `${API_URL}/api/enquiry/get-total-cold-enquiry-count/${selectedCategory}`;
   console.log('get hot enqiry count', url);
   const token = await AsyncStorage.getItem('rbacToken');
   const config = {
     headers: {
       token: token ? token : '',
     },
   };
   setLoading(true);
   await axios.get(url, config).then(response => {
     console.log(response.data.result, 'count cold enquiry');
     setTotalColdWenquiryNumber(response.data.result[0]);
   });
   setLoading(false);
 };
 const countWarmEnquiry = async () => {
   console.log('New enquiries....', selectedCategory);
   const url = `${API_URL}/api/enquiry/get-total-warm-enquiry-count/${selectedCategory}`;
   console.log('get hot enqiry count', url);
   const token = await AsyncStorage.getItem('rbacToken');
   const config = {
     headers: {
       token: token ? token : '',
     },
   };
   setLoading(true);
   await axios.get(url, config).then(response => {
     console.log(response.data.result, 'count warm enquiry');
     setTotalWarmWenquiryNumber(response.data.result[0]);
   });
   setLoading(false);
 };
 const countUserCreatedEnquiry = async () => {
   console.log('New enquiries....', selectedCategory);
   const url = `${API_URL}/api/enquiry/get-total-user-created-enquiry-count/${selectedCategory}`;
   console.log('get user created enqiry count', url);
   const token = await AsyncStorage.getItem('rbacToken');
   const config = {
     headers: {
       token: token ? token : '',
     },
   };
   setLoading(true);
   await axios.get(url, config).then(response => {
     console.log(response.data.result, ' user created enqiry count');
     setTotalUserCreatedenquiryNumber(response.data.result[0]);
   });
   setLoading(false);
 };



  const searchMobileNumber = async (mobileno, selectedCategory) => {
    const url = `${API_URL}/api/get-enquiries-by-mobileno/${mobileno}/${selectedCategory}`;
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    await axios.get(url, config).then(response => {
      if (response) {
        console.log(response.data.result, 'Serached Data');
        dispatch(setEnquiryType('Searched Enquiry'));
        setNewEnquiryList(response.data.result);
        setIsConfiromation(true);
      }
    });
  };

  useEffect(() => {
    if (searchText.length > 1) {
      searchMobileNumber(searchText, selectedCategory);
    }
  }, [searchText, selectedCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <View style={styles.dropDownContainer}>
          <View style={styles.categoryBox}>
            <View>
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
                  searchPlaceholder="Search..."
                  value={selectedCategory}
                  onChange={item => {
                    setSelectedCategory(item.value);
                    handleCategoryChange(item.value);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder={translations[currentLanguage]?.searchbymobile || "SEARCH BY MOBILE NUMBER..."}
            value={searchText}
            maxLength={10}
            onChangeText={text => {
              setSearchText(text);
            }}
          />
        </View>
      </View>
      <View style={styles.wrapper}>
        <FlatList
          data={enquiryFilters}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={[
                  styles.buttonStyle,
                  styles.newButton,
                  enquiryType === item.type && styles.newActive,
                ]}
                onPress={() => {
                  handleScreen(item.type);
                }}>
                <View style={styles.buttonContent}>
                  <Text
                    style={[
                      styles.buttonText,
                      enquiryType === item.type && styles.newActiveText,
                    ]}>
                    {item.type.toLocaleUpperCase()}
                  </Text>
                  
                    <Text style={styles.totalCountText}>
                       {item.total_count}
                    </Text>
               
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {enquiryType === 'New' && (
        <NewEnquiry selectedCategory={selectedCategory} />
      )}
      {/* {enquiryType === 'Today' && <TodayEnquiry />}
      {enquiryType === 'Last Month' && <LastMonthEnquiry />} */}
      {enquiryType === 'Due' && <DueEnquiry />}
      {enquiryType === 'Hot' && (
        <HotEnquiry selectedCategory={selectedCategory} />
      )}
      {enquiryType === 'Cold' && (
        <ColdEnquiry selectedCategory={selectedCategory} />
      )}
      {enquiryType === 'Warm' && (
        <WarmEnquiry selectedCategory={selectedCategory} />
      )}
      {enquiryType === 'User Created' && (
        <UserCreatedEnquiry selectedCategory={selectedCategory} />
      )}
      {/* {enquiryType === 'Followed Enquiry' && <FollowedEnquiry />} */}
      {enquiryType === 'All' && (
        <CategorisedEnquiry categoryId={selectedCategory} />
      )}
      <View>
        {enquiryType != 'All' && newEnquiryList && newEnquiryList.length > 0 ? (
          <FlatList
            data={newEnquiryList}
            keyExtractor={(item, index) => `enquiry_${index}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item, index}) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    openAdditonalEnquiry(item);
                  }}>
                  <View key={index} style={styles.enquiryBox}>
                    <View style={styles.dataStyle}>
                      <View style={styles.dataContainer}>
                        <View style={styles.iconContainer}>
                          <Image
                            style={styles.personImg}
                            source={require('../../assets/person.png')}
                          />
                          <Image
                            style={styles.personImg}
                            source={require('../../assets/phone.png')}
                          />
                          <Image
                            style={styles.personImg}
                            source={require('../../assets/product.png')}
                          />
                          <Image
                            style={styles.personImg}
                            source={require('../../assets/salesperson.png')}
                          />
                          <Image
                            style={styles.personImg}
                            source={require('../../assets/location.png')}
                          />
                        </View>
                        <View style={styles.detailContainer}>
                          <Text style={styles.label}>
                            {item.first_name +
                              (item.last_name ? ' ' + item.last_name : '')}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              makePhoneCall(item.phone_number);
                            }}>
                            <Text style={styles.label}>
                              {item.phone_number}
                            </Text>
                          </TouchableOpacity>
                          <Text style={styles.label}>
                            {item.product ? item.product : '-'}
                          </Text>
                          {item.sales_person && (
                            <Text style={styles.salesText}>
                              {item.sales_person}
                            </Text>
                          )}
                          <Text style={styles.label}>
                            {item.village ? item.village : '-'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.rightDataStyle}>
                      <View style={styles.daysContainer}>
                        <TouchableOpacity style={styles.dayBack}>
                          <Text style={styles.dateText}>
                            {item.last_follow_up_date
                              ? moment(item.last_follow_up_date).format('LL')
                              : 'Not Followed'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <TimeAgo date={item.date} />
                      <TouchableOpacity
                        onPress={() => {
                          handleSheduleCall(item);
                        }}
                        style={styles.discussionButton}>
                        <Text style={styles.discussionText}>Follow Up</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
          />
        ) : (
          <SimpleAlert
            isVisible={isConfirmation}
            text1={'Alert !'}
            text2={'Currently, There is Enquiry Not Available'}
            onConfirm={handleConfirm}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FB',
  },
  dropDownContainer: {
    marginHorizontal: 10,
  },
  categoryBox: {
    backgroundColor: '#EAF2F8',
    padding: 0,
    borderRadius: 5,
  },
  categoryContainer: {
    backgroundColor: '#2471A2',
  },
  enquirySourceContainer: {
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 5,
  },
  boxContainer: {
    marginVertical: 4,
  },
  wrapper: {
    backgroundColor: '#2471A2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  buttonStyle: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 0.2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMonthActive: {
    // borderBottomWidth: 4,
    // borderColor: 'white',
    backgroundColor: 'white',
  },
  newActive: {
    // borderBottomWidth: 4,
    // borderColor: 'white',
    backgroundColor: 'white',
  },
  todayActive: {
    // borderBottomWidth: 4,
    // borderColor: 'white',
    backgroundColor: 'white',
  },
  newActiveText: {
    color: '#2471A2',
  },
  todayActiveText: {
    color: '#2471A2',
  },
  lastActiveText: {
    color: '#2471A2',
  },
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  dataContainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    alignItems: 'flex-start',
  },
  detailContainer: {
    alignItems: 'flex-start',
  },
  daysContainer: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    borderColor: 'green',
  },
  personImg: {
    width: 21,
    height: 21,
    marginRight: 8,
    marginBottom: 5,
  },
  enquiryBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
    width: '95%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dataStyle: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  rightDataStyle: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 1,
    marginLeft: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dayBack: {
    // backgroundColor: '#2E86C1',
    borderRadius: 30,
    color: 'white',
    padding: 2,
  },
  dateText: {
    marginBottom: 4,
    color: '#21618C',
    fontSize: 10,
    fontWeight: 'bold',
  },
  discussionText: {
    color: 'gray',
  },
  dayText: {
    top: -9,
    right: -6,
    color: '#A93226',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discussionButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 20,
    borderColor: '#138D75',
    borderWidth: 0.1,
    paddingHorizontal: 5,
    right: -9,
  },
  discussionText: {
    color: 'white',
    textAlign: 'center',
  },

  searchBox: {
    height: 35,
    borderRadius: 4,
    backgroundColor: '#f1f3f6',
    display: 'flex',
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  searchInput: {
    height: 40,
    flex: 1,
    fontFamily: 'SourceSansProRegular',
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalCountText:{
    color:'black',
    padding:5,
    borderRadius:50,
    backgroundColor:'2471A2',
    marginBottom:15,
  }
});

export default AddMore;

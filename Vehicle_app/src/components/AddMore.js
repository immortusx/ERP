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
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getEnquiryData} from '../redux/slice/getEnquirySlice';
import {useNavigation} from '@react-navigation/native';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {Linking} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import ToastMessage from './subCom/ToastMessage';
import TimeAgo from './subCom/TImeAgo';
import ConfirmationDialog from './subCom/ConfirmationDialog';
import ConfirmBox from './subCom/Confirm';

const AddMore = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enquiryType, setEnquiryType] = useState('All');
  const [todayEnquiryList, setTodayEnquiryList] = useState([]);
  const [newEnquiryList, setNewEnquiryList] = useState([]);
  const [lastMonthEnquiryList, setLastMonthEnquiryList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isConfirmation, setIsConfiromation] = useState(false);
  const profileData = useSelector(
    state => state.getUserProfileSlice.profile.currentUserData.result,
  );
  const getEnquiryState = useSelector(state => state.getEnquiryState);
  const {isFetching, isSuccess, isError, result} = getEnquiryState;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setEnquiryType('All');
    dispatch(getEnquiryData());
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    const getEnquiry = () => {
      dispatch(getEnquiryData());
    };
    getEnquiry();
  }, []);

  useEffect(() => {
    if (result) {
      // console.log(result.result, 'tttttttttt');
      setResultData(result.result);
    }
  }, [result]);
  useEffect(() => {
    setEnquiryType('All');
  }, []);
  const handleSheduleCall = item => {
    navigation.navigate('Schedule Call', {item: item});
  };
  const getNewEnquiry = () => {
    console.log('New Enquiry');
  };
  const makePhoneCall = mobileNumber => {
    console.log('Calling...', mobileNumber);
    Linking.openURL(`tel:${mobileNumber}`);
  };

  const openAdditonalEnquiry = item => {
    console.log(item, '>>>>>>>>>>>>>>>.');
    navigation.navigate('Additional Details', {item: item});
  };

  if (loading) {
    return <CustomLoadingSpinner />;
  }
  if (isFetching) {
    return <CustomLoadingSpinner />;
  }

  const handleTodayEnquiry = async () => {
    console.log('today enquiries....');
    const url = `${API_URL}/api/enquiry/get-current-date-enquiries`;
    console.log('get today enqiry', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    setLoading(true);
    console.log(config);
    await axios.get(url, config).then(response => {
      console.log(response.data.result, 'enquiry today list');
      setTodayEnquiryList(response.data.result);
      setEnquiryType('Today');
    });
    setLoading(false);
  };

  const handleNewEnquiry = async () => {
    console.log('New enquiries....');
    const url = `${API_URL}/api/enquiry/get-new-enquiries-list`;
    console.log('get new enqiry', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    setLoading(true);
    console.log(config);
    await axios.get(url, config).then(response => {
      console.log(response.data.result, 'enquiry today list');
      setNewEnquiryList(response.data.result);
      setEnquiryType('New');
    });
    setLoading(false);
  };
  const handleLastMonthEnquiry = async () => {
    console.log('LastMonth enquiries....');
    const url = `${API_URL}/api/enquiry/get-last-month-enquiries`;
    console.log('get last enqiry', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    setLoading(true);
    console.log(config);
    await axios.get(url, config).then(response => {
      console.log(response.data.result, 'enquiry lastmonth list');
      setLastMonthEnquiryList(response.data.result);
      setEnquiryType('Last Month');
      // lastMonthEnquiryList(response.data.result);
    });
    setLoading(false);
  };
  const handleConfirm = () => {
    setEnquiryType('All');
    setIsConfiromation(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.historyText}>Enquiry Details</Text>
      </View>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={[
            styles.buttonStyle,
            styles.newButton,
            enquiryType === 'New' && styles.newActive,
          ]}
          onPress={() => {
            handleNewEnquiry();
          }}>
          <Text style={[styles.buttonText, {paddingHorizontal: 25}]}>New</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonStyle,
            styles.todayButton,
            enquiryType === 'Today' && styles.todayActive,
          ]}
          onPress={() => {
            handleTodayEnquiry();
          }}>
          <Text style={[styles.buttonText, {paddingHorizontal: 20}]}>
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonStyle,
            styles.monthButton,
            enquiryType === 'Last Month' && styles.lastMonthActive,
          ]}
          onPress={() => {
            handleLastMonthEnquiry();
          }}>
          <Text style={[styles.buttonText, {paddingHorizontal: 15}]}>
            Last Month
          </Text>
        </TouchableOpacity>
      </View>

      {enquiryType === 'All' && (
        <FlatList
          data={resultData}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item, index}) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  openAdditonalEnquiry(item);
                }}>
                {/* <View key={index} style={styles.box}>
                  <Text style={styles.label}>
                    <Image
                      style={styles.personImg}
                      source={require('../../assets/person.png')}
                    />
                    -{' '}
                    {item.first_name +
                      (item.last_name ? ' ' + item.last_name : '')}
                  </Text>
                  <Text style={styles.label}>
                    <Image
                      style={styles.personImg}
                      source={require('../../assets/phone.png')}
                    />
                    - {item.phone_number}
                  </Text>
                  <Text style={styles.label}>
                    <Image
                      style={styles.personImg}
                      source={require('../../assets/product.png')}
                    />
                    - {item.product}
                  </Text>
                </View> */}
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
                          source={require('../../assets/categories.png')}
                        />
                        <Image
                          style={styles.personImg}
                          source={require('../../assets/product.png')}
                        />
                        <Image
                          style={styles.personImg}
                          source={require('../../assets/link.png')}
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
                          <Text style={styles.label}>{item.phone_number}</Text>
                        </TouchableOpacity>
                        <Text style={styles.label}>
                          {item.product ? item.product : 'New Tractor Enquiry'}
                        </Text>
                        <Text style={styles.label}>
                          {item.product
                            ? item.product
                            : 'Sonalika Sikander DLX'}
                        </Text>
                        <Text style={styles.label}>
                          {item.enquiry_source
                            ? item.enquiry_source
                            : 'On-site'}
                        </Text>
                        <Text style={styles.label}>
                          {item.village ? item.village : 'Dhrangadhra'}
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
                    <Text style={styles.dayText}>
                      {Math.floor(
                        (new Date() - new Date(item.date)) /
                          (1000 * 60 * 60 * 24),
                      ) === 0
                        ? 'Today'
                        : Math.floor(
                            (new Date() - new Date(item.date)) /
                              (1000 * 60 * 60 * 24),
                          ) + ' Days'}
                    </Text>
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
      )}
      {enquiryType === 'Today' && (
        <View>
          {todayEnquiryList && todayEnquiryList.length > [] ? (
            <FlatList
              data={todayEnquiryList}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({item, index}) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      openAdditonalEnquiry(item);
                    }}>
                    {/* <View key={index} style={styles.box}>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/person.png')}
                      />
                      -{' '}
                      {item.first_name +
                        (item.last_name ? ' ' + item.last_name : '')}
                    </Text>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/phone.png')}
                      />
                      - {item.phone_number}
                    </Text>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/product.png')}
                      />
                      - {item.product}
                    </Text>
                  </View> */}
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
                              source={require('../../assets/categories.png')}
                            />
                            <Image
                              style={styles.personImg}
                              source={require('../../assets/product.png')}
                            />
                            <Image
                              style={styles.personImg}
                              source={require('../../assets/link.png')}
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
                              {item.product
                                ? item.product
                                : 'New Tractor Enquiry'}
                            </Text>
                            <Text style={styles.label}>
                              {item.product
                                ? item.product
                                : 'Sonalika Sikander DLX'}
                            </Text>
                            <Text style={styles.label}>
                              {item.enquiry_source
                                ? item.enquiry_source
                                : 'On-site'}
                            </Text>
                            <Text style={styles.label}>
                              {item.village ? item.village : 'Dhrangadhra'}
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
                        <Text style={styles.dayText}>
                          {Math.floor(
                            (new Date() - new Date(item.date)) /
                              (1000 * 60 * 60 * 24),
                          ) === 0
                            ? 'Today'
                            : Math.floor(
                                (new Date() - new Date(item.date)) /
                                  (1000 * 60 * 60 * 24),
                              ) + ' Days'}
                        </Text>
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
            <ConfirmBox
              visible={true}
              message={
                <>
                  <Text>No Enquiry Available For Today.</Text>
                  {'\n'}
                  <Text style={{fontWeight: 'bold', color: '#C0392B'}}>
                    Please Check Later
                  </Text>
                </>
              }
              onCancel={() => setIsConfiromation(false)}
              onConfirm={handleConfirm}
            />
          )}
        </View>
      )}
      {enquiryType === 'New' && (
        <View>
          {newEnquiryList && newEnquiryList.length > [] ? (
            <FlatList
              data={newEnquiryList}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({item, index}) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      openAdditonalEnquiry(item);
                    }}>
                    {/* <View key={index} style={styles.box}>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/person.png')}
                      />
                      -{' '}
                      {item.first_name +
                        (item.last_name ? ' ' + item.last_name : '')}
                    </Text>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/phone.png')}
                      />
                      - {item.phone_number}
                    </Text>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/product.png')}
                      />
                      - {item.product}
                    </Text>
                  </View> */}
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
                              source={require('../../assets/categories.png')}
                            />
                            <Image
                              style={styles.personImg}
                              source={require('../../assets/product.png')}
                            />
                            <Image
                              style={styles.personImg}
                              source={require('../../assets/link.png')}
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
                              {item.product
                                ? item.product
                                : 'New Tractor Enquiry'}
                            </Text>
                            <Text style={styles.label}>
                              {item.product
                                ? item.product
                                : 'Sonalika Sikander DLX'}
                            </Text>
                            <Text style={styles.label}>
                              {item.enquiry_source
                                ? item.enquiry_source
                                : 'On-site'}
                            </Text>
                            <Text style={styles.label}>
                              {item.village ? item.village : 'Dhrangadhra'}
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
            <ConfirmBox
              visible={true}
              message={
                <>
                  <Text>New Enquiry Not found.</Text>
                  {'\n'}
                  <Text style={{fontWeight: 'bold', color: '#C0392B'}}>
                    Please Check After Sometimes
                  </Text>
                </>
              }
              onCancel={() => setIsConfiromation(false)}
              onConfirm={handleConfirm}
            />
          )}
        </View>
      )}
      {enquiryType === 'Last Month' && (
        <View>
          {lastMonthEnquiryList && lastMonthEnquiryList.length > [] ? (
            <FlatList
              data={lastMonthEnquiryList}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({item, index}) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      openAdditonalEnquiry(item);
                    }}>
                    {/* <View key={index} style={styles.box}>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/person.png')}
                      />
                      -{' '}
                      {item.first_name +
                        (item.last_name ? ' ' + item.last_name : '')}
                    </Text>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/phone.png')}
                      />
                      - {item.phone_number}
                    </Text>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/product.png')}
                      />
                      - {item.product}
                    </Text>
                  </View> */}
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
                              source={require('../../assets/categories.png')}
                            />
                            <Image
                              style={styles.personImg}
                              source={require('../../assets/product.png')}
                            />
                            <Image
                              style={styles.personImg}
                              source={require('../../assets/link.png')}
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
                              {item.product
                                ? item.product
                                : 'New Tractor Enquiry'}
                            </Text>
                            <Text style={styles.label}>
                              {item.product
                                ? item.product
                                : 'Sonalika Sikander DLX'}
                            </Text>
                            <Text style={styles.label}>
                              {item.enquiry_source
                                ? item.enquiry_source
                                : 'On-site'}
                            </Text>
                            <Text style={styles.label}>
                              {item.village ? item.village : 'Dhrangadhra'}
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
                        <Text style={styles.dayText}>
                          {Math.floor(
                            (new Date() - new Date(item.date)) /
                              (1000 * 60 * 60 * 24),
                          ) === 0
                            ? 'Today'
                            : Math.floor(
                                (new Date() - new Date(item.date)) /
                                  (1000 * 60 * 60 * 24),
                              ) + ' Days'}
                        </Text>
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
            <ConfirmBox
              visible={true}
              message={
                <>
                  <Text>Last Month Enquiry Not Found.</Text>
                  {'\n'}
                  <Text style={{fontWeight: 'bold', color: '#C0392B'}}>
                    Please Check Later
                  </Text>
                </>
              }
              onCancel={() => setIsConfiromation(false)}
              onConfirm={handleConfirm}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  boxContainer: {
    marginVertical: 4,
  },
  historyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E86C1',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textDecorationLine: 'underline',
    borderRadius: 22,
  },
  box: {
    marginTop: 6,
    width: '95%',
    padding: 10,
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
    marginBottom: 7,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginVertical: 1,
    marginBottom: 4,
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  todayButton: {
    backgroundColor: '#E67E22',
  },
  newButton: {
    backgroundColor: '#CA6F1E',
  },
  monthButton: {
    backgroundColor: '#E67E22',
  },
  personImg: {
    width: 21,
    height: 21,
    marginRight: 8,
    marginBottom: 5,
  },
  newImg: {
    width: 30,
    height: 30,
  },
  newContainer: {
    alignItems: 'center',
    margin: 2,
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
  daysContainer: {
    position: 'absolute',
    // top: -30,
    // right: -10,
    bottom: 65,
    left: 10,
    borderColor: 'green',
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
  dayBack: {
    // backgroundColor: '#2E86C1',
    borderRadius: 30,
    color: 'white',
    padding: 2,
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
  notAvailableText: {
    fontSize: 18,
    color: 'red',
    fontStyle: 'italic',
  },
  noEnqiryBox: {
    backgroundColor: 'lightcoral',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  messagetext: {
    fontSize: 20,
    color: 'white',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  lastMonthActive: {
    backgroundColor: 'lightgreen',
    // borderColor: 'darkgreen',
    // borderWidth: 2,
    // borderRadius: 20,
  },
  newActive: {
    backgroundColor: 'lightgreen',
  },
  todayActive: {
    backgroundColor: 'lightgreen',
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
});

export default AddMore;

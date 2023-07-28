import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect} from 'react';
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

const AddMore = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enquiryType, setEnquiryType] = useState('All');
  const [todayEnquiryList, setTodayEnquiryList] = useState([]);
  const [newEnquiryList, setNewEnquiryList] = useState([]);
  const [lastMonthEnquiryList, setLastMonthEnquiryList] = useState([]);
  const profileData = useSelector(
    state => state.getUserProfileSlice.profile.currentUserData.result,
  );
  const getEnquiryState = useSelector(state => state.getEnquiryState);
  const {isFetching, isSuccess, isError, result} = getEnquiryState;

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
      // todayEnquiryList(response.data.result);
      setEnquiryType('Today');
    });
    setLoading(false);
  };

  const handleNewEnquiry = async () => {
    console.log('New enquiries....');
    const url = `${API_URL}/api/enquiry/get-current-date-enquiries`;
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
      // newEnquiryList(response.data.result);
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
      setEnquiryType('Last Month');
      // lastMonthEnquiryList(response.data.result);
    });
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.historyText}>Enquiry Details</Text>
      </View>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={[styles.buttonStyle, styles.newButton]}
          onPress={() => {
            handleNewEnquiry();
          }}>
          <Text style={[styles.buttonText, {paddingHorizontal: 25}]}>New</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonStyle, styles.todayButton]}
          onPress={() => {
            handleTodayEnquiry();
          }}>
          <Text style={[styles.buttonText, {paddingHorizontal: 20}]}>
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonStyle, styles.monthButton]}
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
          renderItem={({item, index}) => {
            return (
              <ScrollView>
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
                      <Text style={styles.label}>
                        <Image
                          style={styles.personImg}
                          source={require('../../assets/person.png')}
                        />
                        -{' '}
                        {item.first_name +
                          (item.last_name ? ' ' + item.last_name : '')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          makePhoneCall(item.phone_number);
                        }}>
                        <Text style={styles.label}>
                          <Image
                            style={styles.personImg}
                            source={require('../../assets/phone.png')}
                          />
                          - {item.phone_number}
                        </Text>
                      </TouchableOpacity>

                      <Text style={styles.label}>
                        <Image
                          style={styles.personImg}
                          source={require('../../assets/product.png')}
                        />
                        -{' '}
                        {item.product ? item.product : 'Sonalika Sikander DLX'}
                      </Text>
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
              </ScrollView>
            );
          }}
        />
      )}
      {enquiryType === 'Today' && (
        <View>
          {todayEnquiryList && todayEnquiryList.length > [] ? (
            <FlatList
              data={todayEnquiryList}
              renderItem={({item, index}) => {
                return (
                  <TouchableWithoutFeedback>
                    <View key={index} style={styles.enquiryBox}>
                      <View style={styles.dataStyle}>
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
                            source={require('../../assets/whatsapp.png')}
                          />
                          - {item.whatsapp_number}
                        </Text>
                        <Text style={styles.label}>
                          <Image
                            style={styles.personImg}
                            source={require('../../assets/email.png')}
                          />
                          - {item.email}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }}
            />
          ) : (
            <ToastMessage
              message="No Enquiry Found. Please Check After SomeTimes"
              visible={showToast}
              onClose={handleCloseToast}
            />
          )}
        </View>
      )}
      {enquiryType === 'New' && (
        <View>
          {newEnquiryList && newEnquiryList.length > [] ? (
            <FlatList
              data={newEnquiryList}
              renderItem={({item, index}) => {
                return (
                  <TouchableWithoutFeedback>
                    <View key={index} style={styles.enquiryBox}>
                      <View style={styles.dataStyle}>
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
                            source={require('../../assets/whatsapp.png')}
                          />
                          - {item.whatsapp_number}
                        </Text>
                        <Text style={styles.label}>
                          <Image
                            style={styles.personImg}
                            source={require('../../assets/email.png')}
                          />
                          - {item.email}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }}
            />
          ) : (
            <TouchableOpacity style={styles.noEnqiryBox}>
              <Text style={styles.messagetext}>
                New Enquiry not available rightnow. Please check after
                sometimes.
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {enquiryType === 'Last Month' && (
        <View>
          {lastMonthEnquiryList && lastMonthEnquiryList.length > [] ? (
            <FlatList
              data={lastMonthEnquiryList}
              renderItem={({item, index}) => {
                return (
                  <TouchableWithoutFeedback>
                    <View key={index} style={styles.enquiryBox}>
                      <View style={styles.dataStyle}>
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
                            source={require('../../assets/whatsapp.png')}
                          />
                          - {item.whatsapp_number}
                        </Text>
                        <Text style={styles.label}>
                          <Image
                            style={styles.personImg}
                            source={require('../../assets/email.png')}
                          />
                          - {item.email}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }}
            />
          ) : (
            <TouchableOpacity style={styles.noEnqiryBox}>
              <Text style={styles.messagetext}>
                Last Month Enquiry not available. Please check Later
              </Text>
            </TouchableOpacity>
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
    width: 20,
    height: 20,
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
    top: -30,
    right: -10,
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
});

export default AddMore;

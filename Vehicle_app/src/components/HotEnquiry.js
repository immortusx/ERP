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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
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
import SimpleAlert from './subCom/SimpleAlert';
import {setEnquiryType} from '../redux/slice/enquiryTypeSlice';
import DayAgo from './subCom/DayAgo';
const HotEnquiry = ({selectedCategory}) => {
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
  const profileData = useSelector(
    state => state.getUserProfileSlice.profile.currentUserData.result,
  );
  const getEnquiryState = useSelector(state => state.getEnquiryState);
  const {isFetching, isSuccess, isError, result} = getEnquiryState;

  useFocusEffect(
    React.useCallback(() => {
      getHotENquiry();
    }, [selectedCategory]),
  );

  const getHotENquiry = async () => {
    console.log('New enquiries....');
    const url = `${API_URL}/api/get-hot-enquiry/${selectedCategory}`;
    console.log('get user created', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    setLoading(true);
    console.log(config);
    await axios.get(url, config).then(response => {
      console.log(response.data.result, 'hot enquiry');
      setResultData(response.data.result);
      setIsConfiromation(true);
    });
    setLoading(false);
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    //   dispatch(setEnquiryType('Followed Enquiry'));
    // dispatch(getEnquiryData());
    getHotENquiry();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (result) {
      console.log(result.result, 'tttttttttt');
      setResultData(result.result);
    }
  }, [result]);
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

  if (loading) {
    return <CustomLoadingSpinner />;
  }
  // if (isFetching) {
  //   return <CustomLoadingSpinner />;
  // }
  const handleConfirm = () => {
    //   dispatch(setEnquiryType('Followed Enquiry'));
    setIsConfiromation(false);
  };
  return (
    <View style={styles.container}>
      <View>
        {resultData && resultData.length > 0 ? (
          <FlatList
            data={resultData}
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
                    <View style={styles.leftDataStyle}>
                      <View style={styles.dataContainer}>
                        <View style={styles.textContainer}>
                          <View style={styles.row}>
                            <Image
                              style={styles.personImg}
                              source={require('../../assets/person.png')}
                            />
                            <Text style={styles.value}>
                              {item.first_name +
                                (item.last_name ? ' ' + item.last_name : '')}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Image
                              style={styles.personImg}
                              source={require('../../assets/phone.png')}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                makePhoneCall(item.phone_number);
                              }}>
                              <Text style={styles.value}>
                                {item.phone_number}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.row}>
                            <Image
                              style={styles.personImg}
                              source={require('../../assets/product.png')}
                            />
                            <Text style={styles.value}>
                              {item.product ? item.product : '-'}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Image
                              style={styles.personImg}
                              source={require('../../assets/location.png')}
                            />
                            <Text style={styles.value}>
                              {item.village ? item.village : '-'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.rightDataStyle}>
                      <Text style={styles.dateText}>
                        {moment(item.next_followup_date).format(
                          'Do MMMM, YYYY',
                        )}
                      </Text>
                      {item.sales_person && (
                        <Text style={styles.salesText}>
                          {item.sales_person}
                        </Text>
                      )}
                      <TouchableOpacity style={styles.dayBack}>
                        <DayAgo
                          nextFollowUpDate={item.next_followup_date}
                          date={item.date}
                        />
                      </TouchableOpacity>
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
          // <SimpleAlert
          //   isVisible={isConfirmation}
          //   text1={'Alert !'}
          //   text2={'Curently, Hot Enquiry Not Available'}
          //   onConfirm={handleConfirm}
          // />

          <View style={styles.noEnquiryContainer}>
            <Text style={styles.NoTaskStyle}>
              Currently, There is Hot Enquiry Not Available
            </Text>
          </View>
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
  salesText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#21618C',
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  wrapper: {
    backgroundColor: '#2471A2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginVertical: 1,
    marginBottom: 4,
    paddingVertical: 5,
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  leftDataStyle: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  rightDataStyle: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginLeft: 5,
  },
  dateText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#3ab1d3',
    borderRadius: 20,
    borderColor: '#138D75',
    borderWidth: 0.1,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  salesText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#3ab1d3',
    borderRadius: 20,
    borderColor: '#138D75',
    borderWidth: 0.1,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  dayBack: {
    borderRadius: 30,
    color: 'white',
    padding: 2,
    marginBottom: 5,
  },
  discussionButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 20,
    borderColor: '#138D75',
    borderWidth: 0.1,
    paddingHorizontal: 5,
    marginBottom: 5,
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
    borderBottomWidth: 4,
    borderColor: 'white',
  },
  newActive: {
    borderBottomWidth: 4,
    borderColor: 'white',
  },
  todayActive: {
    borderBottomWidth: 4,
    borderColor: 'white',
  },
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  noEnquiryContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 10
  },
  NoTaskStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  personImg: {
    width: 21,
    height: 21,
    marginRight: 8,
  },
  label: {
    width: 80,
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HotEnquiry;

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Button,
  Linking,
  ScrollView,
  AppState,
  Alert,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {API_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SweetSuccessAlert from './subCom/SweetSuccessAlert';
const AdditonalDetails = ({route}) => {
  const navigation = useNavigation();
  const [callStartTime, setCallStartTime] = useState(null);
  const [callDuration, setCallDuration] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oldProductDetails, setOldProductDetails] = useState([]);
  const [scheduleDetails, setScheduleDetails] = useState([]);
  const [appState, setAppState] = useState(AppState.currentState);
  const {item} = route.params;

  const whatsAppWelcomeMessage = `Welcome to New Keshav Tractors!
    Hello ${item.first_name} ${item.last_name},
    Thank you for connecting with New Keshav Tractors on WhatsApp. We're thrilled to have you as part of our tractor community.

    About Us:
      At New Keshav Tractors, we're dedicated to delivering cutting-edge tractors designed to empower farmers and enhance agricultural productivity. Our range of tractors is built with precision engineering and advanced technology.

    Our Offerings:
      Explore our diverse range of tractors, from compact models for small farms to heavy-duty machines for large-scale operations.
      Enjoy superior performance, fuel efficiency, and durability with our state-of-the-art tractor designs.
      Benefit from our excellent after-sales service and support, ensuring your tractor runs smoothly throughout its lifetime.

    Stay Connected:
      Have questions or need assistance? Feel free to ask us anything about our tractors, features, or services.
      Stay tuned for the latest updates, tips, and offers that we'll be sharing exclusively with our WhatsApp community.

    We're here to support you on your farming journey. Let's grow together!

    Best regards,
    The New Keshav Tractors Team.
    `;
  const phoneMessage = `Hello ${item.first_name} ${item.last_name},

    Thank you for choosing Keshav tractors! We're delighted to have you as a valued customer. Our mission is to provide you with top-quality tractors and exceptional service.
    If you have any questions or need assistance, feel free to ask. Our team is here to help you make the most of your new tractor. Stay connected with us for updates, tips, and more.

    Best regards,
    The Keshav Tractor Team`;

  const handleSheduleCall = item => {
    navigation.navigate('Schedule Call', {item: item});
  };
  const openEditEnquiry = editData => {
    navigation.navigate('Edit Detail Enquiry', {editData: editData});
  };
  const makePhoneCall = mobileNumber => {
    setCallStartTime(new Date());
    Linking.openURL(`tel:${mobileNumber}`);
  };

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (
        appState.match(/inactive|background/) &&
        nextAppState === 'active' &&
        callStartTime
      ) {
        const callEndTime = new Date();
        const durationInMilliseconds = callEndTime - callStartTime;
        const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
        setCallDuration(durationInSeconds);
        setCallStartTime(null);

        console.log('Call Duration:', durationInSeconds, 'seconds');
        uploadcallLog(durationInSeconds);
      }
      setAppState(nextAppState);
    };

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [appState, callStartTime]);

  const getFollowUpDetils = async customerId => {
    const url = `${API_URL}/api/enquiry/get-follow-up/${customerId}`;
    console.log('get follow up', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    // setLoading(true);
    console.log(config);
    await axios.get(url, config).then(response => {
      if (response) {
        console.log(response.data, 'get.......');
        setScheduleDetails(response.data.result);
      }
    });
    // setLoading(false);
  };
  const getOldProductDetails = async enquiryId => {
    console.log('Old Product....');
    const url = `${API_URL}/api/get-old-product/${enquiryId}`;
    console.log('get new enqiry', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    // setLoading(true);
    console.log(config);
    await axios.get(url, config).then(response => {
      console.log(response.data.result, 'old product');
      setOldProductDetails(response.data.result);
    });
    // setLoading(false);
  };
  useEffect(() => {
    if (item) {
      getOldProductDetails(item.enquiry_id);
      getFollowUpDetils(item.id);
      if (item.oldOwned === 'Yes') {
        setIsShow(true);
      }
    }
  }, [item]);
  const uploadcallLog = async durationInSeconds => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    const formattedDuration = `${String(hours).padStart(2, '0')}:${String(
      minutes,
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    let workDescription = `Called customer ${item.first_name} ${item.last_name} regarding ${item.product} enquiry`;
    const url = `${API_URL}/api/enquiry/upload-work-log`;
    console.log('enquiry url', url);
    const data = {
      taskId: 1,
      spendTime: formattedDuration,
      workDescription: workDescription,
    };
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    await axios.post(url, data, config).then(response => {
      if (response) {
        if (response.data.result === 'success') {
          console.log(response.data, 'call log data');
          return (
            <SweetSuccessAlert message={'Work Log Uploaded'} modalShow={true} />
          );
        } else if (response.data.result === 'Task Not Assigned') {
          console.log('Task Not Assigned');
        }
      }
    });
  };

  const sendWhatsAppMessage = whatsAppNumber => {
    const encodedMessage = encodeURIComponent(whatsAppWelcomeMessage);
    Linking.openURL(
      `whatsapp://send?phone=${whatsAppNumber}&text=${encodedMessage}`,
    )
      .then(() => {
        console.log('WhatsApp Opening....');
      })
      .catch(error => {
        console.error('Whatsapp not Found. Please Install Whatsapp:', error);
      });
  };
  const sendMessage = mobileNumber => {
    Linking.openURL(`sms:${mobileNumber}?body=${phoneMessage}`);
  };
  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <View>
            <View style={styles.headerStyle}>
              <Text style={styles.labelStyle}>Details</Text>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.imageContainer}>
                <TouchableOpacity
                  onPress={() => {
                    openEditEnquiry(item);
                  }}>
                  <Image
                    style={styles.editImg}
                    source={require('../../assets/edit.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.dataStyle}>
                <View style={styles.subDataStyle}>
                  <Text style={styles.label}>Customer Name: </Text>
                  <Text style={styles.labelValue}>
                    {item.first_name}{' '}
                    {item.last_name ? ' ' + item.last_name : ''}
                  </Text>
                </View>
                <View style={styles.line} />
              </View>
              <View style={styles.dataStyle}>
                <View style={styles.subDataStyle}>
                  <Text style={styles.label}>Sales Person: </Text>
                  <Text style={styles.labelValue}>{item.sales_person}</Text>
                </View>
                <View style={styles.line} />
              </View>
              <View style={styles.dataStyle}>
                <View style={styles.subDataStyle}>
                  <Text style={styles.label}>Enquiry Category: </Text>
                  <Text style={styles.labelValue}>{item.category_name}</Text>
                </View>
                <View style={styles.line} />
              </View>
              <View style={styles.dataStyle}>
                <View style={styles.subDataStyle}>
                  <Text style={styles.label}>Phone Number: </Text>
                  <Text style={styles.labelValue}>{item.phone_number}</Text>
                </View>
                <View style={styles.line} />
              </View>
              <View style={styles.dataStyle}>
                <View style={styles.subDataStyle}>
                  <Text style={styles.label}>WhatsApp Number: </Text>
                  <Text style={styles.labelValue}>{item.whatsapp_number}</Text>
                </View>
                <View style={styles.line} />
              </View>
              <View style={styles.dataStyle}>
                <View style={styles.subDataStyle}>
                  <Text style={styles.label}>Delivery Date: </Text>
                  <Text style={styles.labelValue}>
                    {moment(item.delivery_date).format('Do MMMM, YYYY')}
                  </Text>
                </View>
                <View style={styles.line} />
              </View>
              <View style={styles.dataStyle}>
                <View style={styles.subDataStyle}>
                  <Text style={styles.label}>Taluka: </Text>
                  <Text style={styles.labelValue}>{item.taluka}</Text>
                </View>
                <View style={styles.line} />
              </View>
              <View style={styles.dataStyle}>
                <View style={styles.subDataStyle}>
                  <Text style={styles.label}>Village: </Text>
                  <Text style={styles.labelValue}>{item.village}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.labelStyle}>New Product</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.dataStyle}>
                <View style={styles.subDataStyle}>
                  <Text style={styles.label}>Manufacturer: </Text>
                  <Text style={styles.labelValue}>Sonalika</Text>
                </View>
                <View style={styles.line} />
              </View>
              <View style={styles.dataStyle}>
                <View style={styles.subDataStyle}>
                  <Text style={styles.label}>Modal: </Text>
                  <Text style={styles.labelValue}>{item.product}</Text>
                </View>
              </View>
            </View>
            {isShow && (
              <>
                <Text style={styles.labelStyle}>Old Product</Text>
                <View
                  style={styles.detailsContainer}
                  key={(item, index) => `old_${index + 1}`}>
                  {oldProductDetails &&
                    oldProductDetails.map((item, index) => {
                      return (
                        <>
                          <View style={styles.dataStyle}>
                            <View style={styles.subDataStyle}>
                              <Text style={styles.label}>Manufacturer: </Text>
                              <Text style={styles.labelValue}>
                                {item.company}
                              </Text>
                            </View>
                            <View style={styles.line} />
                          </View>
                          <View style={styles.dataStyle}>
                            <View style={styles.subDataStyle}>
                              <Text style={styles.label}>Modal: </Text>
                              <Text style={styles.labelValue}>
                                {item.modalName}
                              </Text>
                            </View>
                            <View style={styles.line} />
                          </View>
                          <View style={styles.dataStyle}>
                            <View style={styles.subDataStyle}>
                              <Text style={styles.label}>Year: </Text>
                              <Text style={styles.labelValue}>
                                {item.manufactur_year}
                              </Text>
                            </View>
                            <View style={styles.line} />
                          </View>
                          <View style={styles.dataStyle}>
                            <View style={styles.subDataStyle}>
                              <Text style={styles.label}>Dealer Price: </Text>
                              <Text style={styles.labelValue}>
                                {item.dealer_purcahse_price.toLocaleString(
                                  'en-IN',
                                  {
                                    style: 'currency',
                                    currency: 'INR',
                                  },
                                )}
                              </Text>
                            </View>
                          </View>
                        </>
                      );
                    })}
                </View>
              </>
            )}
            <Text style={styles.labelStyle}>Next Follow Up Details</Text>
            <View style={styles.detailsContainer}>
              {loading ? (
                <CustomLoadingSpinner />
              ) : scheduleDetails && scheduleDetails.length === 0 ? (
                <Text style={styles.noScheduleText}>No Call Schedule</Text>
              ) : (
                scheduleDetails &&
                scheduleDetails.map(item => {
                  return (
                    <View style={styles.callBox}>
                      <View style={styles.leftContainer}>
                        <Text style={{color: '#229954'}}>
                          {item.last_discussion}
                        </Text>
                        <Text style={{color: '#5DADE2'}}>
                          {moment(item.next_followup_date).format('LL')}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.staticContainer}>
        <Text style={styles.labelStyle}>Remark Notes</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.callIconStyle}>
            <TouchableOpacity
              style={styles.greenButton}
              onPress={() => {
                makePhoneCall(item.phone_number);
              }}>
              <Image
                style={styles.iconImg}
                source={require('../../assets/telephone.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.greenButton}
              onPress={() => {
                sendWhatsAppMessage(item.phone_number);
              }}>
              <Image
                style={styles.iconImg}
                source={require('../../assets/whatsapp.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.greenButton}
              onPress={() => {
                sendMessage(item.phone_number);
              }}>
              <Image
                style={styles.iconImg}
                source={require('../../assets/chat.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.greenButton}>
              <Image
                style={styles.iconImg}
                source={require('../../assets/credit.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.followUpButton}
            onPress={() => {
              handleSheduleCall(item);
            }}>
            <Text style={styles.followupButton}>FOLLOW UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f6f7f9',
  },
  contentContainer: {
    marginHorizontal: 15,
  },
  headerStyle: {
    marginTop: 5,
    marginVertical: 2,
  },
  labelStyle: {
    color: 'grey',
    fontSize: 18,
  },
  detailsContainer: {
    backgroundColor: 'white',
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 0.5,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  labelValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  line: {
    backgroundColor: '#f6f7f9',
    height: 2,
    alignSelf: 'stretch',
    marginVertical: 9,
  },
  imageContainer: {
    marginLeft: 'auto',
    marginHorizontal: 8,
    marginBottom: 5,
  },
  editImg: {
    width: 22,
    height: 22,
  },
  subDataStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  callIconStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconImg: {
    width: 40,
    height: 40,
  },
  greenButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 8,
  },
  followUpButton: {
    backgroundColor: '#3AA4F7',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  followupButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 15,
  },
  staticContainer: {
    marginHorizontal: 15,
  },
  noScheduleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  callBox: {
    width: '95%',
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: '#F39C12 ',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 0.2,
    borderColor: '#2471A2'
  },
  leftContainer: {
    maxWidth: '80%',
    marginRight: 16,
  },
  rightContainer: {
    marginLeft: 16,
  },
  personImg: {
    width: 40,
    height: 40,
  },
});
export default AdditonalDetails;

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
            <View style={styles.line} />
            <View style={styles.contentStyles}>
              <View style={styles.leftContainer}>
                <Text style={styles.contactInfo}>Name</Text>
                <Text style={styles.contactInfo}>Category</Text>
                <Text style={styles.contactInfo}>Phone</Text>
                <Text style={styles.contactInfo}>whatsApp</Text>
                <Text style={styles.contactInfo}>Email</Text>
                <Text style={styles.contactInfo}>Product</Text>
                <Text style={styles.contactInfo}>Enquiry Date</Text>
                <Text style={styles.contactInfo}>Delivery Date</Text>
                <Text style={styles.contactInfo}>Enquiry Source</Text>
                <Text style={styles.contactInfo}>Sales Person</Text>
                <Text style={styles.contactInfo}>District</Text>
                <Text style={styles.contactInfo}>Taluka</Text>
                <Text style={styles.contactInfo}>Village</Text>
              </View>
              <View style={styles.rightContainer}>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                {item.first_name} {item.last_name === 'null' ? '': item.last_name}
                </Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>-</Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                  {item.phone_number}
                </Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                  {item.whatsapp_number ? item.whatsapp_number : '-'}
                </Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                  {item.email ? item.email : '-'}
                </Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                  {item.product ? item.product : '-'}
                </Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                  {moment(item.date).format('LL')}
                </Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                  {moment(item.delivery_date).format('LL')}
                </Text>
                <Text
                  style={[
                    styles.contactInfo,
                    styles.contactStyle,
                    {fontSize: 15},
                  ]}>
                  {item.enquiry_source ? item.enquiry_source : '-'}
                </Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                  {item.sales_person}
                </Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                  {item.district ? item.district : '-'}
                </Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                  {item.taluka ? item.taluka : '-'}
                </Text>
                <Text style={[styles.contactInfo, styles.contactStyle]}>
                  {item.village ? item.village : '-'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.recentBox}>
            <Text style={styles.detailsText}>Recent Notes *</Text>
            <View style={styles.line} />
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
          <View>
            <TouchableOpacity
              style={styles.followUpButton}
              onPress={() => {
                handleSheduleCall(item);
              }}>
              <Text style={styles.followupButton}>FOLLOW UP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: '#A29BC5',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#2980B9',
  },
  contentStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 8,
  },
  contactInfo: {
    color: 'grey',
    fontWeight: '400',
  },
  detailsText: {
    color: 'black',
    marginBottom: 5,
  },
  leftContainer: {
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  contactStyle: {
    color: 'black',
  },
  iconImg: {
    width: 40,
    height: 40,
  },
  callIconStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    marginLeft: 'auto',
    marginBottom: 6,
  },
  editImg: {
    width: 22,
    height: 22,
  },
  greenButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 8,
    marginTop: 10,
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
  recentBox: {
    marginVertical: 110,
  },
});
export default AdditonalDetails;

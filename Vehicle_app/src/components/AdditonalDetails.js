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
      <View style={styles.contentContainer}>
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
                {item.first_name} {item.last_name ? ' ' + item.last_name : ''}
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
                {moment(item.delivery_date).format('LL')}
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
        <Text style={styles.labelStyle}>Old Product</Text>
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
            <View style={styles.line} />
          </View>
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
});
export default AdditonalDetails;

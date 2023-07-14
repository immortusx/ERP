import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearFollowUpState,
  setFollowUpDb,
} from '../redux/slice/addFollowUpSlice';
import SweetSuccessAlert from './subCom/SweetSuccessAlert';
import {Linking} from 'react-native';
import Calendars from './subCom/Calendars';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {CheckBox} from 'react-native-elements';
import CustomCheckbox from './subCom/CustomCheckBox';
import CustomRadioButton from './subCom/CustomRadioButton';
import RadioButtons from './subCom/RadioButtons';
import DeliveryScreen from './Delivery';
import FollowUpScreen from './FollowUp';
import AddBooking from './AddBooking';
import DropScreen from './DropScreen';
const ScheduleCall = ({route}) => {
  const {item} = route.params;
  const dispatch = useDispatch();
  const followUpState = useSelector(
    state => state.followUpSlice.followUpState.result,
  );
  const [discussion, setDiscussion] = useState('');
  const [folloUpStage, setFollowUpStage] = useState(false);
  const [bookingStage, setBookingStage] = useState(false);
  const [dropStage, setDropStage] = useState(false);
  const [invalidStage, setInvalidStage] = useState(false);
  const [openScheduleDate, setOpenScheduleDate] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleDetails, setScheduleDetails] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const enquiryStage = ['Follow Up', 'Booking', 'Drop', 'Invalid   '];
  const [selectedScreen, setSelectedScreen] = useState('Follow Up');

  useEffect(() => {
    if (followUpState.isSuccess && followUpState.result === 'success') {
      dispatch(clearFollowUpState());
      setIsShow(true);
      getFollowUpDetils();
      // console.warn('follow up saved');
    }
  }, [followUpState]);
  const getFollowUpDetils = async () => {
    const customer_id = item.id;
    const url = `${API_URL}/api/enquiry/get-follow-up/${customer_id}`;
    console.log('get follow up', url);
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
        console.log(response.data, 'get.......');
        setScheduleDetails(response.data.result);
      }
    });
    setLoading(false);
  };
  useEffect(() => {
    setCustomerId(item.id);
    getFollowUpDetils();
  }, []);
  const makePhoneCall = () => {
    console.log('Calling...');
    let mobileNumber = 9060779043;
    Linking.openURL(`tel:${item.phone_nmuber}`);
  };
  const handleSaveDetails = () => {
    if (discussion.length > 0) {
      const formData = {
        last_discussion: discussion,
        next_followup_date: scheduleDate,
        customer_id: item.id,
      };
      dispatch(setFollowUpDb(formData));
      setDiscussion('');
    }
  };
  const handleCalendarDate = selectedDate => {
    console.log(selectedDate.dateString);
    console.log(selectedDate);
    setScheduleDate(selectedDate.dateString);
    setOpenScheduleDate(false);
  };
  const handleBookingStage = () => {
    setBookingStage(!bookingStage);
  };
  const handleDropStage = () => {
    setDropStage(!dropStage);
  };
  const handleInvalidStage = () => {
    setInvalidStage(!invalidStage);
  };
  const handleFollowUpStage = () => {
    setFollowUpStage(!folloUpStage);
  };
  const handleSelectedEnquiryStage = option => {
    // const selectedValue = option === 'Yes' ? 'Yes' : 'No';
    console.log(option, 'stage Enquiry');
    setSelectedScreen(option);
    // handleReadValue(selectedValue);
    // if (selectedValue === 'Yes') {
    //   setModalVisible(true);
    // } else if (selectedValue === 'No') {
    //   setModalVisible(false);
    // }
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.enquiryStageContainer}>
          <Text
            style={{
              color: '#154360',
              fontWeight: 'bold',
              fontVariant: ['tabular-nums'],
              marginRight: 10,
              fontSize: 16
            }}>
            Set Enquiry Stage{'  '}
            <Image
              style={{width: 20, height: 20}}
              source={require('../../assets/set.png')}
            />
          </Text>
          {/* <View
            style={{
              marginHorizontal: 10,
              marginVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <CustomCheckbox
              label="Delivery"
              checked={bookingStage}
              onChange={handleBookingStage}
            />
            <CustomCheckbox
              label="Drop"
              checked={dropStage}
              onChange={handleDropStage}
            />
            <CustomCheckbox
              label="Invalid"
              checked={invalidStage}
              onChange={handleInvalidStage}
            />
          </View> */}
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 10,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <RadioButtons
                options={enquiryStage}
                selectedOption={selectedScreen}
                onSelect={handleSelectedEnquiryStage}
              />
            </View>
          </View>
        </View>
      </View>
      {selectedScreen === 'Follow Up' && <FollowUpScreen item={item}/>}
      {selectedScreen === 'Booking' && <AddBooking/>}
      {selectedScreen === 'Drop' && <DropScreen/>}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FBFCFC',
  },
  contentContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  enquiryStageContainer: {
    width: '96%',
    padding: 10,
    backgroundColor: '#EAF2F8',
    marginHorizontal: 8,
    marginVertical: 5,
    borderColor: '#A9CCE3',
    borderWidth: 0.2,
    borderRadius: 5,
  },
});

export default ScheduleCall;

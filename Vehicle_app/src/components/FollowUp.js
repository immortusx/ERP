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
const FollowUpScreen = ({item}) => {
  //   const {item} = route.params;
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
  const enquiryStage = ['Follow Up', 'Booking', 'Drop', 'Invalid   '];
  const [selectedOption, setSelectedOption] = useState('Follow Up');

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
    if (item) {
      getFollowUpDetils();
    }
  }, [item]);
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
        customer_id: customerId,
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
    setSelectedOption(option);
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
        {isShow && (
          <SweetSuccessAlert message={'Call Schedule'} modalShow={true} />
        )}
        <View style={styles.dateContainer}>
          <Text style={styles.selectDateText}>
            Select Next Follow Up Date *
          </Text>
          <View style={styles.dateStyle}>
            <TouchableOpacity
              onPress={() => {
                setOpenScheduleDate(true);
              }}>
              <Text style={styles.dateText}>
                {scheduleDate === ''
                  ? new Date().toISOString().slice(0, 10)
                  : scheduleDate}
              </Text>
            </TouchableOpacity>
            <Calendars
              showModal={openScheduleDate}
              selectedDate={scheduleDate}
              handleCalendarDate={handleCalendarDate}
            />
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Discussion:</Text>
          <TextInput
            style={styles.input}
            value={discussion}
            onChangeText={setDiscussion}
            multiline
            numberOfLines={4}
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveDetails}>
          <Text style={styles.buttonText}>Save Details</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.callBodyContainer}>
        <Text style={{fontWeight: 'bold', marginHorizontal: 10}}>
          Schedule Details
        </Text>
        <Text style={{marginHorizontal: 10}}>New</Text>
        {loading ? (
          <CustomLoadingSpinner />
        ) : scheduleDetails && scheduleDetails.length === 0 ? (
          <Text style={styles.noScheduleText}>No Call Schedule</Text>
        ) : (
          <FlatList
            data={scheduleDetails}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <View style={styles.callBox}>
                  <View style={styles.leftContainer}>
                    <Text style={{color: '#229954'}}>
                      {item.last_discussion}
                    </Text>
                    <Text style={{color: '#5DADE2'}}>
                      {moment(item.next_followup_date).format('LL')}
                    </Text>
                    <Text style={{color: '#1A5276', fontSize: 20}}>
                      987654567
                    </Text>
                  </View>
                  <View style={styles.rightContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        makePhoneCall();
                      }}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/telephone.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FBFCFC',
  },
  contentContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#28B463',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
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
    paddingHorizontal: 30,
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
    elevation: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
  callBodyContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  noScheduleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  selectDateText: {
    fontWeight: 'bold',
    // color: '#2980B9',
  },
  enquiryStageContainer: {
    width: '96%',
    padding: 10,
    backgroundColor: '#EAF2F8',
    marginHorizontal: 8,
    marginVertical: 10,
    borderColor: '#A9CCE3',
    borderWidth: 0.2,
    borderRadius: 5,
  },
});

export default FollowUpScreen;

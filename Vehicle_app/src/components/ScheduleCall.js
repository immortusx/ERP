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
const ScheduleCall = ({route}) => {
  const {item} = route.params;
  const dispatch = useDispatch();
  const followUpState = useSelector(
    state => state.followUpSlice.followUpState.result,
  );
  const [discussion, setDiscussion] = useState('');
  const [openScheduleDate, setOpenScheduleDate] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleDetails, setScheduleDetails] = useState([]);

  useEffect(() => {
    console.log(followUpState, 'ggg');
    if (followUpState.isSuccess && followUpState.result === 'success') {
      dispatch(clearFollowUpState());
      console.log(followUpState, 'bbbbbbbbbb');
      console.warn('follow up saved');
    }
  }, [followUpState]);
  const makePhoneCall = () => {
    console.log('Calling...');
    let mobileNumber = 9060779043;
    Linking.openURL(`tel:${item.phone_nmuber}`);
  };
  const handleSaveDetails = () => {
    if (discussion.length > 0) {
      const formData = {
        last_discussion: discussion,
        next_followup_date: formattedScheduleDate,
        customer_id: item.id,
      };
      dispatch(setFollowUpDb(formData));
      const newSchedule = {
        date: formattedScheduleDate,
        last_discussion: discussion,
      };
      setScheduleDetails(preScheduleDetails => [
        ...preScheduleDetails,
        newSchedule,
      ]);
      setDiscussion('');
      console.log(formattedScheduleDate, discussion);
    }
  };
  const handleCalendarDate = selectedDate => {
    console.log(selectedDate.dateString);
    console.log(selectedDate);
    setScheduleDate(selectedDate.dateString);
    setOpenScheduleDate(false);
  };
  // const formattedScheduleDate = scheduleDate.toISOString().split('T')[0];
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        {followUpState.isSuccess && (
          <SweetSuccessAlert message={followUpState.result} modalShow={true} />
        )}
        <View style={styles.dateContainer}>
          <Text>Select Call Date*</Text>
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
        <View style={{marginVertical: 10}}>
          <Text>Schedule Details:</Text>
          <View style={styles.callBox}>
            <View style={styles.leftContainer}>
              <Text>Let's have a call</Text>
              <Text>{scheduleDate === ''
                    ? new Date().toISOString().slice(0, 10)
                    : scheduleDate}</Text>
              <Text>987654567</Text>
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
          <FlatList
            data={scheduleDetails}
            renderItem={({item, index}) => {
              return (
                <View style={styles.callBox}>
                  <View style={styles.leftContainer}>
                    <Text>{item.discussion}</Text>
                    <Text>{item.date}</Text>
                    <Text>987654567</Text>
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
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
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

export default ScheduleCall;

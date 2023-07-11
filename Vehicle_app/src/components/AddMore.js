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
const AddMore = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState([]);
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
      console.log(result.result, 'tttttttttt');
      setResultData(result.result);
    }
  }, [result]);

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

  if (isFetching) {
    return <CustomLoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.historyText}>Enquiry Details</Text>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.newContainer}>
          <TouchableOpacity onPress={getNewEnquiry}>
            <Image
              style={styles.newImg}
              source={require('../../assets/new.png')}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.buttonStyle, styles.todayButton]}>
          <Text style={[styles.buttonText, {paddingHorizontal: 17}]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonStyle, styles.weekButton]}>
          <Text style={[styles.buttonText, {paddingHorizontal: 10}]}>
            Last Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonStyle, styles.monthButton]}>
          <Text style={[styles.buttonText, {paddingHorizontal: 10}]}>
            Last Month
          </Text>
        </TouchableOpacity>
      </View>
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
                      - {item.product ? item.product : 'Worldtrac/90 Rx 4WD'}
                    </Text>
                  </View>
                  <View style={styles.rightDataStyle}>
                    <View style={styles.daysContainer}>
                      <TouchableOpacity style={styles.dayBack}>
                      <Text style={styles.dayText}>20</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.dateText}>30 JULY 2023</Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleSheduleCall(item);
                      }}>
                      <Text style={styles.discussionText}>Last Discussion</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          );
        }}
      />
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
    fontSize: 24,
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
    paddingHorizontal: 10,
    marginVertical: 1,
    marginBottom: 6,
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
  weekButton: {
    backgroundColor: '#EB984E',
  },
  monthButton: {
    backgroundColor: '#F0B27A',
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
    top: -25,
    right: -10,
  },
  dateText: {
    marginBottom: 4,
    color: 'blue',
  },
  discussionText: {
    color: 'gray',
  },
  dayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  dayBack: {
    backgroundColor: '#3498DB',
    borderRadius: 30,
    color: 'white'
  }
});

export default AddMore;

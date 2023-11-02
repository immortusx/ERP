import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import moment from 'moment';
import LoadingSpinner from './subCom/LoadingSpinner';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {useNavigation} from '@react-navigation/native';
import TimeAgo from './subCom/TImeAgo';

const Enquiries = ({route}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [currentEnquiryIndex, setCurrentEnquiryIndex] = useState(1);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [categoryName, setCategoryName] = useState(null);
  const {item} = route.params;

  useEffect(() => {
    if (item) {
      console.log(item, 'itekem');
      getLockedEnquiries(item.id, item.task, currentEnquiryIndex);
    }
  }, [item]);
  const handleNextEnquiry = () => {
    console.log('Next');
    // setCurrentEnquiryIndex(currentEnquiryIndex + 1);
    navigation.navigate('Additional Details', {item: item});

  };
  const handleEnquirySkip = () => {
    console.log('Skip');
    setCurrentEnquiryIndex(currentEnquiryIndex + 1);
  };
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

  useEffect(() => {
    if (currentEnquiryIndex) {
      getLockedEnquiries(item.id, item.task, currentEnquiryIndex);
    }
  }, [currentEnquiryIndex]);
  const getLockedEnquiries = async (employeeId, taskId, indexNo) => {
    const url = `${API_URL}/api/enquiry/getworks/${employeeId}/${taskId}/${indexNo}`;
    console.log('get enquries', url);
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
        console.log(response.data.result, 'enquirie locked');
        setEnquiriesList(response.data.result);
      }
    });
    setLoading(false);
  };

  return (
    <View style={StyleSheet.mainContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.taskListStyle}>{item.employee}</Text>
          <Text style={styles.taskListStyle}>{item.task_name}</Text>
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.dataContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.taskLabel}>Task Assigned:</Text>
              <Text style={styles.taskLabel}>Task Type:</Text>
              <Text style={styles.taskLabel}>Tasks:</Text>
              <Text style={styles.taskLabel}>Task Performed: </Text>
              <Text style={styles.taskLabel}>Category: </Text>
              <Text style={styles.taskLabel}>Start Date: </Text>
              <Text style={styles.taskLabel}>End Date: </Text>
              <Text style={styles.taskLabel}>Task Time Period: </Text>
            </View>
            <View style={styles.mainRightContainer}>
              <View style={styles.rightContainer}>
                <Text style={styles.listStyle}>{item.employee}</Text>
                <Text style={styles.listStyle}>{item.tasktype_name}</Text>
                <Text style={styles.listStyle}>{item.task_name}</Text>
                <TouchableOpacity
                  style={styles.perfomedTaskBtn}
                  onPress={() => {
                    // openTaskDetails(item);
                  }}>
                  <Text style={[styles.listStyle, styles.taskPerformed]}>
                    {item.taskCompleted}/{item.taskcount}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.perfomedTaskBtn}>
                  <Text style={styles.listStyle}>{item.category_name}</Text>
                </TouchableOpacity>
                <Text style={styles.listStyle}>
                  {moment(item.startdate).format('Do MMMM, YYYY')}
                </Text>
                <Text style={styles.listStyle}>
                  {moment(item.enddate).format('Do MMMM, YYYY')}
                </Text>
                <Text style={styles.listStyle}>{item.period_name}</Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.enquiryLine}> Locked Enquiry</Text>
          <View style={styles.line} />
          {loading ? (
            <CustomLoadingSpinner />
          ) : enquiriesList && enquiriesList.length > 0 ? (
            <FlatList
              style={{marginBottom: 60}}
              data={enquiriesList}
              keyExtractor={(item, index) => `task_${index}`}
              renderItem={({item, index}) => {
                return (
                  <View key={index} style={styles.enquiryBox}>
                    <View style={styles.leftDataStyle}>
                      <View style={styles.eDataContainer}>
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
                      <Text style={styles.dateText}>Not Followed</Text>
                      {item.sales_person && (
                        <Text style={styles.salesText}>
                          {item.sales_person}
                        </Text>
                      )}
                      <TouchableOpacity style={styles.dayBack}>
                        <TimeAgo date={item.date} />
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
                );
              }}
            />
          ) : (
            <Text style={styles.NoTaskStyle}>Task Completed!</Text>
          )}
          <TouchableOpacity style={styles.buttonTouchableStyle}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleEnquirySkip}>
              <Text style={styles.skipStyle}>SKIP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleNextEnquiry}>
              <Text style={styles.nextStyle}>DONE & NEXT</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 0.9,
  },
  touchableOpacityStyle: {
    backgroundColor: '#2471A3',
    padding: 10,
    borderRadius: 33,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskListStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 3,
    borderRadius: 7,
    marginVertical: 10,
  },
  taskStyle: {
    backgroundColor: '#2471A2',
    padding: 10,
    borderRadius: 4,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dataContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    paddingRight: 100,
  },
  leftContainer: {
    alignItems: 'flex-start',
    marginRight: 10,
  },
  rightContainer: {
    alignItems: 'flex-start',
  },
  listStyle: {
    color: '#2C3E50',
    fontWeight: '500',
  },
  taskLabel: {
    fontWeight: '600',
  },
  taskPerformed: {
    color: 'green',
  },
  perfomedTaskBtn: {
    backgroundColor: 'lightblue',
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 2,
  },
  NoTaskStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  personImg: {
    width: 21,
    height: 21,
    marginRight: 8,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  startTaskButton: {
    backgroundColor: 'green',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  startTaskButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
  },
  startContainer: {
    alignSelf: 'flex-end',
    bottom: 5,
    marginHorizontal: 5,
    left: 100,
  },
  enquiryLine: {
    color: '#2471A3',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  line: {
    backgroundColor: '#3498DB',
    height: 1,
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  buttonTouchableStyle: {
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    // backgroundColor: '#2980B9',
    // borderRadius: 8,
    // paddingHorizontal: 20,
    // paddingVertical: 8,
  },
  skipStyle: {
    backgroundColor: '#5DADE2',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  nextStyle: {
    backgroundColor: '#F1C40F',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 7,
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
  eDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Enquiries;

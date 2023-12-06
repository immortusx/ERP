import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
  Linking,
  AppState,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import moment from 'moment';
import LoadingSpinner from './subCom/LoadingSpinner';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import { useNavigation } from '@react-navigation/native';
import TimeAgo from './subCom/TImeAgo';
import { useDispatch, useSelector } from 'react-redux';
import { PermissionsAndroid } from 'react-native';
import useCallLogs from './subCom/useCallLogs';
import { useFocusEffect } from '@react-navigation/native';
import { getUserTaskList, clearUserTaskListState } from '../redux/slice/getUserTaskListSlice';
const Enquiries = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [currentEnquiryIndex, setCurrentEnquiryIndex] = useState(1);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callDuration, setCallDuration] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [renderIconData, setRenderIconData] = useState({
    task_type: null,
    contact_type: null,
  });
  const [callLogData, setCallLogData] = useState({
    duration: "",
    phoneNumber: "",
    type: "",
  })
  const { loadCallLogs } = useCallLogs();

  useEffect(() => {
    loadCallLogs()
  }, []);

  const logs = useSelector(state => state.callLog.logs);

  useEffect(() => {
    if (logs.length > 0) {
      const recentCallLogs = logs[0];
      setCallLogData({
        duration: recentCallLogs.duration,
        phoneNumber: recentCallLogs.phoneNumber,
        type: recentCallLogs.type,
      });
    }
  }, [logs]);
  const dispatch = useDispatch();
  const userTaskList = useSelector((state) => state.getUserTaskListState.userTaskList);
  const isFetching = useSelector((state) => state.getUserTaskListState.isFetching);
  const isError = useSelector((state) => state.getUserTaskListState.isError);

  const [userTaskListData, setUserTaskListData] = useState({
    id: "",
    task: "",
    employee: "",
    tasktype_name: "",
    task_name: "",
    taskCompleted: "",
    taskcount: "",
    category_name: "",
    startdate: "",
    enddate: "",
    period_name: "",
  });
  useEffect(() => {
    if (userTaskList.length > 0) {
      const userTaskLists = userTaskList[0];
      setUserTaskListData({
        id: userTaskLists.id,
        task: userTaskLists.task,
        employee: userTaskLists.employee,
        tasktype_name: userTaskLists.tasktype_name,
        task_name: userTaskLists.task_name,
        taskCompleted: userTaskLists.taskCompleted,
        taskcount: userTaskLists.taskcount,
        category_name: userTaskLists.category_name,
        startdate: userTaskLists.startdate,
        enddate: userTaskLists.enddate,
        period_name: userTaskLists.period_name,
      });
    }
  }, [userTaskList]);
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      dispatch(getUserTaskList());
      return () => {
        dispatch(clearUserTaskListState());
      };
    }, [dispatch])
  );

  useEffect(() => {
    dispatch(getUserTaskList());
    return () => {
      dispatch(clearUserTaskListState());
    };
  }, [dispatch]);
  useEffect(() => {
    console.log(callLogData, "logssggggggggggg");
  }, [callLogData]);

  function formatPhoneNumber(phoneNumber) {
    if (typeof phoneNumber === 'string') {
      const formattedPhoneNumber = phoneNumber.replace(
        /(\d{2})(\d{5})(\d{3})/,
        '+91 $1 $2 $3',
      );
      return formattedPhoneNumber;
    } else {
      // Handle the case where phoneNumber is not a string
      return ''; // or any default value or throw an error
    }
  }
  useEffect(() => {
    if (userTaskListData) {
      console.log(userTaskListData, 'itekemmmmmmmmmm');
      setTaskId(userTaskListData.task);
      getLockedEnquiries(userTaskListData.id, userTaskListData.task, currentEnquiryIndex);
      const types = [{ type: 'call' }, { type: 'whatsapp' }, { type: 'sms' }];

      setRenderIconData({
        task_type: types,
        userTaskListData: userTaskListData,
      });
    }
  }, [userTaskListData]);
  const handleNextEnquiry = () => {
    if (enquiriesList && enquiriesList.length === 0) {
      console.log('Navigating to Task screen...');
      navigation.navigate('Task');
    } else {
      if (callLogData.duration < 5 && callLogData.type !== "OUTGOING" && callLogData.phoneNumber !== itemData.phone_number) {
        console.log('Button disabled: Duration < 5 or non-OUTGOING call or different phone number');
        return;
      }
      console.log('Next');
      let isRowIndex = true;
      let workDescription = `Called customer ${itemData.first_name} ${itemData.last_name} regarding ${itemData.product} enquiry`;
      let spendTime = callLogData.duration;
      itemData.isRowIndex = isRowIndex;
      itemData.spendTime = spendTime;
      itemData.workDescription = workDescription;
      itemData.taskId = taskId;
      navigation.navigate('Schedule Call', { item: itemData });
      setCurrentEnquiryIndex(currentEnquiryIndex + 1);
    }
  };

  const handleEnquirySkip = () => {
    console.log('Skip');
    if (enquiriesList && enquiriesList.length === 0) {
      navigation.navigate('Task');
    } else {
      setCurrentEnquiryIndex(currentEnquiryIndex + 1);
    }
  };

  const handleSheduleCall = item => {
    navigation.navigate('Schedule Call', { item: item });
  };
  const makePhoneCall = mobileNumber => {
    console.log('Calling...', mobileNumber);
    setCallStartTime(new Date());
    Linking.openURL(`tel:${mobileNumber}`);
  };
  useEffect(() => {
    if (callLogData && itemData && callLogData.phoneNumber === itemData.phone_number) {
      if (callLogData.duration >= 5 && callLogData.type === "OUTGOING" && callLogData.phoneNumber === itemData.phone_number) {
        console.log(callLogData.phoneNumber, itemData.phone_number, callLogData.duration, callLogData.type, "equal");
      }
    }
  }, [callLogData, itemData]);

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

  const renderIconAndData = item => {
    switch (item.phone_number) {
      case 'phone_number':
        return (
          <View style={styles.taskIconContainer}>
            <TouchableOpacity
              style={styles.greenButton}
              onPress={() => {
                makePhoneCall(item.phone_number);
              }}>
              <Text style={styles.taskDataText}>
                {formatPhoneNumber(item.phone_number)}
              </Text>
              <Image
                style={styles.iconImg}
                source={require('../../assets/telephone.png')}
              />
            </TouchableOpacity>
          </View>
        );

      case 'whatsapp_number':
        return (
          <View style={styles.taskIconContainer}>
            <TouchableOpacity
              style={styles.greenButton}
              onPress={() => {
                // Handle WhatsApp action here
              }}>
              <Text style={styles.taskDataText}>{item.whatsapp_number}</Text>
              <Image
                style={styles.iconImg}
                source={require('../../assets/whatsapp.png')}
              />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };
  const openAdditonalEnquiry = item => {
    console.log(item, '>>>>>>>>>>>>>>>.');
    navigation.navigate('Additional Details', { item: item });
  };

  useEffect(() => {
    if (currentEnquiryIndex) {
      getLockedEnquiries(userTaskListData.id, userTaskListData.task, currentEnquiryIndex);
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
        const [item] = response.data.result;
        setItemData(item);
      }
      setLoading(false);
    });

  };

  return (
    <View style={StyleSheet.mainContainer}>
      <View style={styles.container}>
        {loading ? (
          <CustomLoadingSpinner />
        ) : (
          <>
            <TouchableOpacity style={styles.touchableOpacityStyle}>
              <Text style={styles.taskListStyle}>{userTaskListData.employee}</Text>
              <Text style={styles.taskListStyle}>{userTaskListData.task_name}</Text>
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
                    <Text style={styles.listStyle}>{userTaskListData.employee}</Text>
                    <Text style={styles.listStyle}>{userTaskListData.tasktype_name}</Text>
                    <Text style={styles.listStyle}>{userTaskListData.task_name}</Text>
                    <TouchableOpacity
                      style={styles.perfomedTaskBtn}
                      onPress={() => {
                        // openTaskDetails(item);
                      }}>
                      <Text style={[styles.listStyle, styles.taskPerformed]}>
                        {userTaskListData.taskCompleted}/{userTaskListData.taskcount}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.perfomedTaskBtn}>
                      <Text style={styles.listStyle}>{userTaskListData.category_name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.listStyle}>
                      {moment(userTaskListData.startdate).format('Do MMMM, YYYY')}
                    </Text>
                    <Text style={styles.listStyle}>
                      {moment(userTaskListData.enddate).format('Do MMMM, YYYY')}
                    </Text>
                    <Text style={styles.listStyle}>{userTaskListData.period_name}</Text>
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
                  style={{ marginBottom: 60 }}
                  data={enquiriesList}
                  keyExtractor={(item, index) => `task_${index}`}
                  renderItem={({ item, index }) => {
                    return (
                      <>
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
                        <View style={styles.taskIconContainer}>
                          <TouchableOpacity style={styles.greenButton}
                            onPress={() => {
                              makePhoneCall(item.phone_number);
                            }}>
                            <TouchableOpacity>
                              <Text style={styles.taskDataText}>
                                {formatPhoneNumber(item.phone_number)}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            >
                              <Image
                                style={styles.iconImg}
                                source={require('../../assets/telephone.png')}
                              />
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </View>
                      </>
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
                  style={[
                    styles.buttonContainer,
                    { backgroundColor: callLogData.duration < 5 ? 'gray' : '#F1C40F', borderRadius: 8 },
                  ]}
                  onPress={handleNextEnquiry}
                  disabled={
                    callLogData.duration < 5 ||
                    (callLogData.type !== 'OUTGOING' && callLogData.phoneNumber !== itemData.phone_number)
                  }>
                  <Text style={styles.nextStyle}>DONE & NEXT</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
  taskIconContainer: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
  greenButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconImg: {
    width: 40,
    height: 40,
  },
  taskDataText: {
    color: 'white',
    fontSize: 20,
    marginRight: 10,
    fontWeight: 'bold',
  },
});

export default Enquiries;

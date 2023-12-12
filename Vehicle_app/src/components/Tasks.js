import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
  RefreshControl,
  AppState,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import moment from 'moment';
import LoadingSpinner from './subCom/LoadingSpinner';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getUserTaskList, clearUserTaskListState } from '../redux/slice/getUserTaskListSlice';
const Tasks = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const [appState, setAppState] = useState(AppState.currentState);
  const userTaskList = useSelector((state) => state.getUserTaskListState.userTaskList);
  const isFetching = useSelector((state) => state.getUserTaskListState.isFetching);
  const isError = useSelector((state) => state.getUserTaskListState.isError);
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      dispatch(getUserTaskList());
      return () => {
        dispatch(clearUserTaskListState());
      };
    }, [dispatch])
  );
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      dispatch(getUserTaskList());

      const handleAppStateChange = (nextAppState) => {
        if (appState === 'inactive' && nextAppState === 'active') {
          // Logic to execute when the app becomes active (e.g., when coming from another app)
          setLoading(true);
          dispatch(getUserTaskList());
        }
        setAppState(nextAppState);
      };

      // Subscribe to app state changes
      const appStateSubscription = AppState.addEventListener(
        'change',
        handleAppStateChange
      );

      return () => {
        dispatch(clearUserTaskListState());
        // Remove the app state change subscription when the component is unmounted
        appStateSubscription.remove();
      };
    }, [dispatch, appState])
  );


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getUserTaskList());
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const [userTaskListData, setUserTaskListData] = useState({
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
      setLoading(false);
    }
  }, [userTaskList]);
  useEffect(() => {
    console.log(userTaskListData, "usertakkkkkkkkkkkkgggggggg")
  }, [userTaskListData])

  const openTaskDetails = taskDetails => {
    console.log(taskDetails, 'taskDetials');
    navigation.navigate('Task Details', { taskDetails: taskDetails });
  };
  const redirectEnquiriesList = item => {
    navigation.navigate('Enquiries', { item: item });
  };
  return (
    <View style={StyleSheet.mainContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.taskListStyle}>Tasks List</Text>
        </TouchableOpacity>
        {loading ? (
          <CustomLoadingSpinner />
        ) : userTaskList && userTaskList.length > 0 ? (
          <FlatList
            data={userTaskList}
            keyExtractor={(item, index) => `userTask_${index}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.taskStyle}>
                  <Text style={styles.taskTitle}>{item.employee}</Text>
                  <Text style={styles.taskTitle}>{item.task_name}</Text>
                </TouchableOpacity>

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
                  <View style={styles.middleContainer}>
                  <Text style={styles.listStyle}>{item.employee}</Text>
                      <Text style={styles.listStyle}>
                        {item.tasktype_name}
                      </Text>
                      <Text style={styles.listStyle}>{item.task_name}</Text>
                      <TouchableOpacity
                        style={styles.perfomedTaskBtn}
                        onPress={() => {
                          openTaskDetails(item);
                        }}>
                        <Text
                          style={[styles.listStyle, styles.taskPerformed]}>
                          {item.taskCompleted}/{item.taskcount}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={styles.listStyle}>
                          {item.category_name}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.listStyle}>
                        {moment(item.startdate).format('Do MMMM, YYYY')}
                      </Text>
                      <Text style={styles.listStyle}>
                        {moment(item.enddate).format('Do MMMM, YYYY')}
                      </Text>
                      <Text style={styles.listStyle}>{item.period_name}</Text>
                  </View>
                  <View style={styles.startTaskContainer}>
                    <TouchableOpacity
                      style={styles.taskStartBtn}
                      onPress={() => {
                        redirectEnquiriesList(item);
                      }}>
                      <Text style={styles.startText}>START TASK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.NoTaskStyle}>Task Not Assigned</Text>
        )}
      </View>
    </View>
  );
}
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
    marginBottom: 50
  },
  touchableOpacityStyle: {
    backgroundColor: '#2471A3',
    padding: 10,
    borderRadius: 33,
  },
  taskListStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontVariant: ['small-caps'],
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
    // flexDirection: 'row',
    // position: 'relative',
    // justifyContent: 'space-between',
    // alignItems: 'flex-end',
    // marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    // alignItems: 'flex-start',
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
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  NoTaskStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  taskStartBtn: {
    backgroundColor: '#27AE60',
    padding: 5,
    borderRadius: 5,
    
    
  },
  middleContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // marginHorizontal: 2
  },
  startText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  startTaskContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 2,
    flex: 1,
    position: 'relative',
  },
});

export default Tasks;

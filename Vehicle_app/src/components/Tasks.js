import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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

  const dispatch = useDispatch();
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
  const redirectEnquiriesList = () => {
    navigation.navigate('Enquiries');
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

          <View style={styles.contentContainer}>
            <TouchableOpacity style={styles.taskStyle}>
              <Text style={styles.taskTitle}>
                {userTaskListData.employee}
              </Text>
              <Text style={styles.taskTitle}>{userTaskListData.task_name}</Text>
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
              <View style={styles.mainRightContainer}>
                <View style={styles.rightContainer}>
                  <Text style={styles.listStyle}>{userTaskListData.employee}</Text>
                  <Text style={styles.listStyle}>
                    {userTaskListData.tasktype_name}
                  </Text>
                  <Text style={styles.listStyle}>{userTaskListData.task_name}</Text>
                  <TouchableOpacity
                    style={styles.perfomedTaskBtn}
                    onPress={() => {
                      openTaskDetails(userTaskListData);
                    }}>
                    <Text
                      style={[styles.listStyle, styles.taskPerformed]}>
                      {userTaskListData.taskCompleted}/{userTaskListData.taskcount}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.perfomedTaskBtn}>
                    <Text style={styles.listStyle}>
                      {userTaskListData.category_name}
                    </Text>
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
              <View style={styles.startTaskContainer}>
                <TouchableOpacity
                  style={styles.taskStartBtn}
                  onPress={() => {
                    redirectEnquiriesList();
                  }}>
                  <Text style={styles.startText}>START TASK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.NoTaskStyle}>Task Not Assigned</Text>
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
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 5,
  },
  leftContainer: {
    alignItems: 'flex-start',
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
    marginVertical: 1.5,
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
  mainRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 2
  },
  startText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  startTaskContainer: {
    position: 'relative',
    padding: 2,
    marginHorizontal: 10,
  },
});

export default Tasks;

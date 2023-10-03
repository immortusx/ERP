import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import moment from 'moment';
import LoadingSpinner from './subCom/LoadingSpinner';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {useNavigation} from '@react-navigation/native';

const UserTaskDetails = ({route}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userTaskDetails, setUserTaskDetails] = useState([]);

  useEffect(() => {
    if (route) {
      const {taskDetails} = route.params;
      console.log(taskDetails, 'taskdetiald');
      const userId = taskDetails.id;
      const taskTypeId = taskDetails.tasktype;
      const taskId = taskDetails.task;

      getWorkReportDetails(userId, taskTypeId, taskId);
    }
  }, [route]);

  const getWorkReportDetails = async (userId, taskTypeId, taskId) => {
    const url = `${API_URL}/api/get-work-report-details/${userId}/${taskTypeId}/${taskId}`;
    console.log('get work report', url);
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
        console.log(response.data.result, 'work report');
        setUserTaskDetails(response.data.result);
      }
    });
    setLoading(false);
  };

  return (
    <View style={StyleSheet.mainContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.taskListStyle}>Performed Tasks Details</Text>
        </TouchableOpacity>
        {loading ? (
          <CustomLoadingSpinner />
        ) : userTaskDetails && userTaskDetails.length > 0 ? (
          <FlatList
            style={{marginBottom: 60}}
            data={userTaskDetails}
            keyExtractor={(item, index) => `task_${index}`}
            renderItem={({item, index}) => {
              return (
                <View style={styles.contentContainer}>
                  <TouchableOpacity style={styles.taskStyle}>
                    <Text style={styles.taskTitle}>
                      {index + 1}. {item.Employee}
                    </Text>
                    <Text style={styles.taskTitle}>{item.task_name}</Text>
                  </TouchableOpacity>
                  <View style={styles.dataContainer}>
                    <View style={styles.leftContainer}>
                      <Text style={styles.taskLabel}>Task Assigned:</Text>
                      <Text style={styles.taskLabel}>Task Type:</Text>
                      <Text style={styles.taskLabel}>Tasks:</Text>
                      <Text style={styles.taskLabel}>Date:</Text>
                      <Text style={styles.taskLabel}>Spend Time:</Text>
                      <Text style={styles.taskLabel}>Work Description:</Text>
                    </View>
                    <View style={styles.rightContainer}>
                      <Text style={styles.listStyle}>{item.Employee}</Text>
                      <Text style={styles.listStyle}>{item.tasktype_name}</Text>
                      <Text style={styles.listStyle}>{item.task_name}</Text>
                      <Text style={styles.listStyle}>
                        {moment(item.datetime).format('Do MMMM, YYYY')}
                      </Text>
                      <Text style={styles.listStyle}>{item.spendtime}</Text>
                      <Text style={styles.listStyle}>
                        {item.work_description}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <Text style={styles.NoTaskStyle}>Task Not Performed</Text>
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
  },
  NoTaskStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default UserTaskDetails;

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import moment from 'moment';
import LoadingSpinner from './subCom/LoadingSpinner';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const Tasks = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userTaskList, setUserTaskList] = useState([]);
  const getUserTaskLists = async () => {
    const url = `${API_URL}/api/get-user-task-list`;
    console.log('get user task list', url);
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
        console.log(response.data, 'userTask List');
        setUserTaskList(response.data.result);
      }
      setLoading(false);
    });
  };
  useFocusEffect(
    React.useCallback(() => {
      getUserTaskLists();
    }, []),
  );
  useEffect(() => {
    getUserTaskLists();
  }, []);
  const openTaskDetails = taskDetails => {
    console.log(taskDetails, 'taskDetials');
    navigation.navigate('Task Details', {taskDetails: taskDetails});
  };
  const redirectEnquiriesList = item => {
    console.log(item, 'item');
    navigation.navigate('Enquiries', {item: item});
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
            style={{marginBottom: 60}}
            data={userTaskList}
            keyExtractor={(item, index) => `task_${index}`}
            renderItem={({item, index}) => {
              return (
                <View style={styles.contentContainer}>
                  <TouchableOpacity style={styles.taskStyle}>
                    <Text style={styles.taskTitle}>
                      {index + 1}. {item.employee}
                    </Text>
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
                    <View style={styles.mainRightContainer}>
                      <View style={styles.rightContainer}>
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
                        <TouchableOpacity style={styles.perfomedTaskBtn}>
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
              );
            }}
          />
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

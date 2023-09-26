import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

const Tasks = () => {
  const [loading ,setLoading] = useState(false);
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
        // setSalePersonData(response.data.result);
      }
    });
    setLoading(false);
  };
  useEffect(() => {
    getUserTaskLists();
  }, []);
  return (
    <View style={StyleSheet.mainContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.taskListStyle}>Tasks List</Text>
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.taskStyle}>
            <Text style={styles.taskTitle}>1. Call</Text>
            <Text style={styles.taskTitle}>26 September</Text>
          </TouchableOpacity>
          <View style={styles.dataContainer}>
            <View style={styles.leftContainer}>
              <Text>Task Type:</Text>
              <Text>Tasks:</Text>
              <Text>Task Count: </Text>
              <Text>Start Date: </Text>
              <Text>End Date: </Text>
              <Text>Task Time Period: </Text>
            </View>
            <View style={styles.rightContainer}>
              <Text>Sales</Text>
              <Text>Call</Text>
              <Text>10</Text>
              <Text>18 September 2023</Text>
              <Text>26 September 2023</Text>
              <Text>Daily</Text>
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.taskStyle}>
            <Text style={styles.taskTitle}>2. SMS</Text>
            <Text style={styles.taskTitle}>26 September</Text>
          </TouchableOpacity>
          <View style={styles.dataContainer}>
            <View style={styles.leftContainer}>
              <Text>Task Type:</Text>
              <Text>Tasks:</Text>
              <Text>Task Count: </Text>
              <Text>Start Date: </Text>
              <Text>End Date: </Text>
              <Text>Task Time Period: </Text>
            </View>
            <View style={styles.rightContainer}>
              <Text>Sales</Text>
              <Text>SMS</Text>
              <Text>10</Text>
              <Text>18 September 2023</Text>
              <Text>26 September 2023</Text>
              <Text>Daily</Text>
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.taskStyle}>
            <Text style={styles.taskTitle}>3. WhatsApp</Text>
            <Text style={styles.taskTitle}>26 September</Text>
          </TouchableOpacity>
          <View style={styles.dataContainer}>
            <View style={styles.leftContainer}>
              <Text>Task Type:</Text>
              <Text>Tasks:</Text>
              <Text>Task Count: </Text>
              <Text>Start Date: </Text>
              <Text>End Date: </Text>
              <Text>Task Time Period: </Text>
            </View>
            <View style={styles.rightContainer}>
              <Text>Sales</Text>
              <Text>whatsApp</Text>
              <Text>10</Text>
              <Text>18 September 2023</Text>
              <Text>26 September 2023</Text>
              <Text>Daily</Text>
            </View>
          </View>
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
    elevation: 2,
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
  },
  leftContainer: {
    alignItems: 'flex-start',
    marginRight: 10,
  },
  rightContainer: {
    alignItems: 'flex-start',
  },
});

export default Tasks;

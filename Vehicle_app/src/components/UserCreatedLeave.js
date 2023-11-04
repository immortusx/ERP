import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import { API_URL } from '@env';
import axios from 'axios';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

const Manage = () => {
  const [userLeavelist, setUserLeaveList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route) {
      const {leaveList} = route.params;
      console.log(leaveList, 'taskdetiald');
      const userId = leaveList.id;
      getWorkReportDetails(userId);
    }
  }, [route]);
  useFocusEffect(
    React.useCallback(() => {
      fetchUserLeaveList();
    }, []),
  );

  const fetchUserLeaveList = async (userId) => {
    try {
      const url = `${API_URL}/api/leave/get-leave-details/${userId}`;
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token,
        },
      };
      setLoading(true);
      const response = await axios.get(url, config);

      if (response.data?.isSuccess) {
        console.log('Data successfully fetched:', response.data.result);
        setUserLeaveList(response.data.result);
        setLoading(false);
      } else {
        console.error(
          'API request was not successful. Response:',
          response.data,
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchuserLeaveList();
  }, []);
  if (loading) {
    return <CustomLoadingSpinner />;
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.taskListStyle}>My Leave</Text>
        </TouchableOpacity>
        {loading ? (
          <CustomLoadingSpinner />
        ) : userLeavelist && userLeavelist.length > 0 ? (
          <FlatList
            style={{ marginBottom: 60 }}
            data={userLeavelist}
            keyExtractor={(item, index) => `holiday_${index}`}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.contentContainer}>
                  <TouchableOpacity style={styles.taskStyle}>
                    <Text style={styles.taskTitle}>
                      {index + 1}. {item.Employee}
                    </Text>
                    <Text style={styles.taskTitle}>
                      {item.LeaveType}
                    </Text>

                  </TouchableOpacity>
                  <View style={styles.dataContainer}>
                    <View style={styles.leftContainer}>
                    <Text style={styles.taskLabel}>Email Id:</Text>
                      <Text style={styles.taskLabel}>Start Date:</Text>
                      <Text style={styles.taskLabel}>End Date:</Text>
                      <Text style={styles.taskLabel}>Reason:</Text>

                    </View>
                    <View style={styles.mainRightContainer}>
                      <View style={styles.rightContainer}>
                      <Text style={styles.listStyle}>{item.email}</Text>
                        <Text style={styles.listStyle}>{moment(item.startDate).format('Do MMMM, YYYY')}</Text>
                        <Text style={styles.listStyle}>{moment(item.endDate).format('Do MMMM, YYYY')}</Text>
                        <Text style={styles.listStyle}>{item.reason}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <Text> </Text>
        )}
      </View>
    </View>
  );
};

export default Manage;

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
    marginHorizontal: 12,
  },
  leftContainer: {
    alignItems: 'flex-start',
    marginRight: 10,
  },
  taskLabel: {
    fontWeight: '600',
  },
  listStyle: {
    color: '#2C3E50',
    fontWeight: '500',
  },
  mainRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  rightContainer: {
    alignItems: 'flex-start',
  },
});

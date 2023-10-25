import {StyleSheet, Text, View, TouchableOpacity,FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {API_URL} from '@env';
import axios from 'axios';
import moment from 'moment';

const Holiday = () => {
  const [holidaylist, setHolidayList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHolidayList = async () => {
      try {
        const url = `${API_URL}/api/get-holiday-list`;
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
          setHolidayList(response.data.result);
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

    fetchHolidayList();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.taskListStyle}>Holiday List</Text>
        </TouchableOpacity>
        {loading ? (
          <CustomLoadingSpinner />
        ) : holidaylist && holidaylist.length > 0 ? (
          <FlatList
            style={{marginBottom: 60}}
            data={holidaylist}
            keyExtractor={(item, index) => `holiday_${index}`}
            renderItem={({item, index}) => {
              return (
                <View style={styles.contentContainer}>
                  <TouchableOpacity style={styles.taskStyle}>
                    <Text style={styles.taskTitle}>
                      {index + 1}. {item.holidayname}
                    </Text>
                    <Text style={styles.taskTitle}>
                      {moment(item.holiday_date).format('Do MMMM, YYYY')}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.dataContainer}>
                    <View style={styles.leftContainer}>
                      <Text style={styles.taskLabel}>Description:</Text>
                      {/* Add the description here */}
                    </View>
                    <View style={styles.mainRightContainer}>
                    <View style={styles.rightContainer}>
                    <Text style={styles.listStyle}>{item.description}</Text>
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

export default Holiday;

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

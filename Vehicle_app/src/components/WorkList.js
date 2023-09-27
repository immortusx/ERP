import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';

const formatDate = datetime => {
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(datetime).toLocaleDateString(undefined, options);
};

const WorkList = () => {
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    const getWorkReport = async id => {
      try {
        const url = `${API_URL}/api/get-work-report-details/${id}`;
        const token = await AsyncStorage.getItem('rbacToken');
        const config = {
          headers: {
            token: token ? token : '',
          },
        };

        setLoading(true);

        const response = await axios.get(url, config);

        if (response.data && response.data.result) {
          setSelectedEmployeeId(response.data.result);
        }
      } catch (error) {
        console.error('Error fetching work report:', error);
      } finally {
        setLoading(false);
      }
    };

    

    getWorkReport();
  }, []);
  const data = () => {
    console.log(selectedEmployeeId, 'selectedEmployeeId');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={selectedEmployeeId}
        renderItem={({item, index}) => {
          return (
            <ScrollView>
              <TouchableWithoutFeedback>
                <View key={index} style={styles.enquiryBox}>
                  <View style={styles.dataStyle}>
                    <Text
                      style={[
                        styles.label,
                        {
                          backgroundColor: 'mediumturquoise',
                          paddingVertical: 5,
                          paddingHorizontal:5,
                          width: '100%',
                        },
                      ]}>
                      <Text>Date</Text>- {formatDate(item.datetime)}
                    </Text>

                    <Text style={styles.label}>
                      <Text>SpendTime</Text>- {item.spendtime}
                    </Text>
                    <Text style={styles.label}>
                      <Text>TaskName</Text>- {item.task_name}
                    </Text>
                    <Text style={styles.label}>
                      <Text>TaskType</Text>- {item.tasktype_name}
                    </Text>
                    <Text style={styles.label}>
                      <Text>Work-Discription</Text>- {item.work_description}
                    </Text>
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

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
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
    top: -30,
    right: -10,
  },
  dateText: {
    marginBottom: 4,
    color: '#21618C',
    fontSize: 10,
    fontWeight: 'bold',
  },

  dayText: {
    top: -9,
    right: -6,
    color: '#A93226',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayBack: {
    // backgroundColor: '#2E86C1',
    borderRadius: 30,
    color: 'white',
    padding: 2,
  },
  discussionButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 20,
    borderColor: '#138D75',
    borderWidth: 0.1,
    paddingHorizontal: 5,
    right: -9,
  },
  discussionText: {
    color: 'white',
    textAlign: 'center',
  },
});
export default WorkList;

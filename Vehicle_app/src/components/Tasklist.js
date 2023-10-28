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
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import Calendars from './subCom/Calendars';
import DatePicker from 'react-native-neat-date-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
const formatDate = datetime => {
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(datetime).toLocaleDateString(undefined, options);
};

const TaslList = ({route}) => {
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState([]);

  const [userTaskList, setUserTaskList] = useState([]);
  const [extractedData, setExtractedData] = useState([]);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [startDate, setstartDate] = useState('');
  const [EndDate, setEndDate] = useState('');

  const [filteredData, setFilteredData] = useState([]);

  const filterDataByDateRange = (start, end) => {
    if (!start && !end) {
      setFilteredData(selectedEmployeeId || []);
      return;
    }

    const filtered = selectedEmployeeId.filter(item => {
      const itemDate = new Date(item.datetime);
      return itemDate >= new Date(start) && itemDate <= new Date(end);
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterDataByDateRange(startDate, EndDate);
  }, [startDate, EndDate]);

  const getUserTaskLists = async () => {
    const url = `${API_URL}/api/get-user-task-list`;
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    setLoading(true);
    try {
      const response = await axios.get(url, config);
      if (response && response.data.result) {
        setUserTaskList(response.data.result);
        const data = response.data.result.map(item => ({
          id: item.id,
          employee: item.employee,
        }));
        setExtractedData(data);
        console.log(data, 'extractedDataextractedData');
      }
    } catch (error) {
      console.error('Error fetching user task list:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserTaskLists();
    console.log(extractedData, 'extractedDataextractedData');
  }, []);

  useEffect(() => {
    const fetchWorkReports = async () => {
      setLoading(true);
      for (const data of extractedData) {
        console.log(data, 'extractedDataextractedData');
        try {
          const url = `${API_URL}/api/get-task-completed-by-employee/${data.id}`;
          const token = await AsyncStorage.getItem('rbacToken');
          const config = {
            headers: {
              token: token ? token : '',
            },
          };

          const response = await axios.get(url, config);

          if (response.data && response.data.result) {
            console.log(
              response.data.result,
              'response.data.resultresponse.data.result',
            );
            setSelectedEmployeeId(response.data.result);
          }
        } catch (error) {
          console.error('Error fetching work report:', error);
        }
      }
      setLoading(false);
    };
    fetchWorkReports();
  }, [extractedData]);

  if (loading) {
    return <CustomLoadingSpinner />;
  }
  const handleCalendarDate = selectedDate => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    console.log(formattedDate, 'deliverydate');
    setstartDate(formattedDate);
    setOpenStartDate(false);
  };

  const handleEndDate = selectedDate => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    console.log(formattedDate, 'deliverydate');
    setEndDate(formattedDate);
    setOpenEndDate(false);
  };

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: 'white', padding: 10}}>
        <View style={styles.enquiryBox}>
          <TouchableOpacity
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onPress={() => {
              setOpenStartDate(true);
            }}>
            <Text style={styles.label}>
              Start Date {':- '}
              {startDate === ''
                ? new Date().toISOString().slice(0, 10)
                : startDate}
            </Text>
            <Image
              style={styles.dateImg}
              source={require('../../assets/date.png')}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={openStartDate}
            onConfirm={handleCalendarDate}
            mode="date"
            // handleCalendarDate={handleCalendarDate}
            onCancel={() => setOpenStartDate(false)}
          />
        </View>
        <View style={styles.enquiryBox}>
          <TouchableOpacity
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onPress={() => {
              setOpenEndDate(true);
            }}>
            <Text style={styles.label}>
              End Date {':- '}{' '}
              {EndDate === '' ? new Date().toISOString().slice(0, 10) : EndDate}
            </Text>
            <Image
              style={styles.dateImg}
              source={require('../../assets/date.png')}
            />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={openEndDate}
            onConfirm={handleEndDate}
            mode="date"
            onCancel={() => setOpenStartDate(false)}
          />
        </View>
      </View>
      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item, index}) => {
            return (
              <ScrollView>
                <TouchableWithoutFeedback>
                  <View key={index} style={styles.enquiryBox}>
                    <View style={styles.dataStyle}>
                      <View style={styles.lablecontent}>
                        <Text style={{fontSize: 18, color: 'white'}}>
                          {index + 1}. {item.Employee}
                        </Text>
                        <Text style={{fontSize: 18, color: 'white'}}>
                          {item.task_name}
                        </Text>
                      </View>
                      <Text style={styles.label}>
                        <Text style={{color: 'black'}}>TaskType</Text> -
                        {item.tasktype_name}
                      </Text>
                      <Text style={styles.label}>
                        <Text style={{color: 'black'}}>Date</Text> -
                        {formatDate(item.datetime)}
                      </Text>
                      <Text style={styles.label}>
                        <Text style={{color: 'black'}}>Work-Discription</Text> -
                        {item.work_description}
                      </Text>
                      <Text style={styles.label}>
                        <Text style={{color: 'black'}}>SpendTime</Text> -
                        {item.spendtime}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            );
          }}
        />
      ) : (
        <Text style={{fontSize: 18, margin: 20, color: 'red'}}>
          No data available for the selected date range !
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  dateImg: {
    width: 25,
    height: 25,
  },
  lablecontent: {
    backgroundColor: '#2471A2',
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
export default TaslList;

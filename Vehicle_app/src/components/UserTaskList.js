import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';


const TaslList = ({route}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState([]);

  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [startDate, setstartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [employeename, setEmployeeName] = useState('');
  const [data,setData] =useState([])

  useEffect(() => {
    if (route) {
      const {userParam} = route.params;
      console.log(userParam, 'uskedlf');
      setData(userParam);
      setstartDate(userParam.startDate);
      setEndDate(userParam.EndDate);
      getUserTaskList(userParam.userId, userParam.startDate, userParam.EndDate);
    }
  }, [route]);

  useEffect(() => {
    if (startDate && EndDate) {
      console.log(
        data.userId,
        startDate,
        EndDate,
        'tttttttttttttttttttttttttt',
      );
      getUserTaskList(data.userId, startDate, EndDate);
    }
  }, [startDate, EndDate]);


  const getUserTaskList = async (id, startDate, endDate) => {
    try {
      const url = `${API_URL}/api/get-user-task-by-UserId/${id}/${startDate}/${endDate}`;
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      setLoading(true);
      const response = await axios.get(url, config);
      if (response.data && response.data.result) {
        console.log(response.data.result, 'userTaskilsificier');
        const employeeName = response.data.result[0].employee;
        setEmployeeName(employeeName);
        setSelectedEmployeeId(response.data.result);
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching usedfkdf:', error);
    }
  };

  if (loading) {
    return <CustomLoadingSpinner />;
  }
  const handleCalendarDate = selectedDate => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    console.log(formattedDate, 'deliverydgkgr');
    setstartDate(formattedDate);
    setOpenStartDate(false);
  };

  const handleEndDate = selectedDate => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    console.log(formattedDate, 'deliverydate');
    setEndDate(formattedDate);
    setOpenEndDate(false);
  };

  const handletaskReport = data => {
    console.log(data, 'uesrdata');
    navigation.navigate('Detail Task Report List', {taskreport: data});
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.textStyle}>
        <View style={styles.touchableOpacityStyle}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
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
        <View style={styles.touchableOpacityStyle}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
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
      <View style={styles.modalContent}>
        <View style={styles.categoryItem}>
          <Text style={styles.categoryText}>{employeename}</Text>
        </View>
        <FlatList
          data={selectedEmployeeId}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item, index}) => {
            return (
              <ScrollView>
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handletaskReport(item)}>
                  <View style={styles.taskstyle}>
                    <Text style={styles.categoryText}>
                      {index + 1}. {item.task_name}
                    </Text>
                    <Text style={styles.categoryText}>{item.taskcount}</Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  textStyle: {
    backgroundColor: 'white',
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  dateImg: {
    width: 20,
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 0.9,
  },
  categoryItem: {
    backgroundColor: '#DFECFF',
    padding: 10,
    borderRadius: 3,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryText: {
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A5276',
  },
  taskstyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchableOpacityStyle: {
    backgroundColor: '#2471A3',
    padding: 10,
    borderRadius: 20,
    marginVertical: 8,
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
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
  NoTaskStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
export default TaslList;

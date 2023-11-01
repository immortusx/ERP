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
const formatDate = datetime => {
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(datetime).toLocaleDateString(undefined, options);
};

const TaslList = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [userTaskList, setUserTaskList] = useState([]);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [startDate, setstartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  useEffect(() => {
    setstartDate(moment().subtract(7, 'days').format('YYYY-MM-DD'));
    setEndDate(moment().format('YYYY-MM-DD'));
  }, []);

  const getEmployeeTaskLists = async (startDate, endDate) => {
    const url = `${API_URL}/api/get-task-assign-employee-list/${startDate}/${endDate}`;
    console.log('get employee list', url);
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
        console.log(response.data.result, 'resoulr');
        setUserTaskList(response.data.result);
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    if (startDate && EndDate) {
      getEmployeeTaskLists(startDate, EndDate);
    }
  }, [startDate, EndDate]);

  const openUserTaskList = id => {
    console.log(id, startDate, EndDate, 'krkefktivirgidi');
    const userParam = {
      userId: id,
      startDate: startDate,
      EndDate: EndDate,
    };
    navigation.navigate('User Task List', {userParam: userParam});
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
        {userTaskList.length > 0 ? (
          <FlatList
            data={userTaskList}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item, index}) => {
              return (
                <ScrollView>
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => openUserTaskList(item.id)}>
                    <Text style={styles.categoryText}>
                      {index + 1}. {item.employee}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              );
            }}
          />
        ) : (
          <Text style={styles.NoTaskStyle}>
            No task available for the selected date range !
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
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

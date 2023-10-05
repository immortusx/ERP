import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import moment from 'moment';
import LoadingSpinner from './subCom/LoadingSpinner';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {useNavigation} from '@react-navigation/native';

const Enquiries = ({route}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [categoryName, setCategoryName] = useState(null);

  useEffect(() => {
    if (route) {
      const {categoryDetails} = route.params;
      console.log(categoryDetails, 'categoe');
      setCategoryName(categoryDetails.category_name);
      getEnquiries(categoryDetails.category_id);
    }
  }, [route]);

  const getEnquiries = async categoryId => {
    const url = `${API_URL}/api/get-enquiries-by-category/${categoryId}`;
    console.log('get enquries', url);
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
        console.log(response.data.result, 'enquirie catrogrit');
        setEnquiriesList(response.data.result);
      }
    });
    setLoading(false);
  };

  return (
    <View style={StyleSheet.mainContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.taskListStyle}>{categoryName}</Text>
        </TouchableOpacity>
        {loading ? (
          <CustomLoadingSpinner />
        ) : enquiriesList && enquiriesList.length > 0 ? (
          <FlatList
            style={{marginBottom: 60}}
            data={enquiriesList}
            keyExtractor={(item, index) => `task_${index}`}
            renderItem={({item, index}) => {
              return (
                <View style={styles.contentContainer}>
                  <View style={styles.dataContainer}>
                    <View style={styles.leftContainer}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/person.png')}
                      />
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/phone.png')}
                      />
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/product.png')}
                      />
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/salesperson.png')}
                      />
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/location.png')}
                      />
                    </View>
                    <View style={styles.rightContainer}>
                      <View style={styles.subContainer}>
                        <View style={{alignItems: 'flex-start'}}>
                          <Text style={styles.label}>
                            {item.first_name +
                              (item.last_name ? ' ' + item.last_name : '')}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              // makePhoneCall(item.phone_number);
                            }}>
                            <Text style={styles.label}>
                              {item.phone_number}
                            </Text>
                          </TouchableOpacity>
                          <Text style={styles.label}>{item.product}</Text>
                          <Text style={styles.label}>
                            {item.sales_person ? item.sales_person : '-'}
                          </Text>
                          <Text style={styles.label}>{item.village}</Text>
                        </View>
                        <View style={styles.startContainer}>
                          <TouchableOpacity
                            style={styles.startTaskButton}
                            onPress={() => {}}>
                            <Text style={styles.startTaskButtonText}>
                              Start Task {'>>'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
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
  personImg: {
    width: 21,
    height: 21,
    marginRight: 8,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  startTaskButton: {
    backgroundColor: 'green',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  startTaskButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute'
  },
  startContainer: {
    alignSelf: 'flex-end',
    bottom: 5,
    marginHorizontal: 5,
    left: 100
  }
});

export default Enquiries;

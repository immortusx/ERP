import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getEnquiryData} from '../redux/slice/getEnquirySlice';
import {useNavigation} from '@react-navigation/native';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {Linking} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

const DeliveryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getEnquiryState = useSelector(state => state.getEnquiryState);
  const {isFetching, isSuccess, isError, result} = getEnquiryState;

  useEffect(() => {
    const getEnquiryData = async () => {
      const url = `${API_URL}/api/enquiry/get-delivery-list`;
      console.log('get delivery data', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      setLoading(true);
      console.log(config);
      await axios.get(url, config).then(response => {
        setResultData(response.data.result[0]);
        console.log(response.data.result[0], 'delivery data');
      });
      setLoading(false);
    };
    getEnquiryData();
  }, []);

  const makePhoneCall = mobileNumber => {
    console.log('Calling...', mobileNumber);
    Linking.openURL(`tel:${mobileNumber}`);
  };

  const openAdditonalEnquiry = item => {
    console.log(item, '>>>>>>>>>>>>>>>.');
  };

  if (loading) {
    return <CustomLoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={resultData}
        renderItem={({item, index}) => {
          return (
            <ScrollView>
              <TouchableWithoutFeedback
                onPress={() => {
                  openAdditonalEnquiry(item);
                }}>
                <View key={index} style={styles.enquiryBox}>
                  <View style={styles.dataStyle}>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/person.png')}
                      />
                      -{' '}
                      {item.CustomerName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        makePhoneCall(item.mobileNumber);
                      }}>
                      <Text style={styles.label}>
                        <Image
                          style={styles.personImg}
                          source={require('../../assets/phone.png')}
                        />
                        - {item.mobileNumber}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>
                    <Image
                        style={styles.personImg}
                        source={require('../../assets/delivery.png')}
                      />
                      - {moment(item.DeliveryDate).format('LL')}
                    </Text>
                    <Text style={styles.label}>
                    <Image
                        style={styles.personImg}
                        source={require('../../assets/date.png')}
                      />
                      - {moment(item.RetailDatey).format('LL')}
                    </Text>
                    <Text style={styles.label}>
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/product.png')}
                      />
                      - {item.Product}
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

export default DeliveryScreen;

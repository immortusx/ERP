import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
const VillageEnquiryLists = ({route}) => {
  const navigation = useNavigation();
  const {villageId, categoryId, villageName, totalEnquiry} = route.params;
  const [enquiryList, setEnquiryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (villageId) {
      console.log(villageId);
      const getEnquiry = async () => {
        const url = `${API_URL}/api/enquiry/get-enquiry-by-village`;
        const formData = {
          villageId: villageId,
          categoryId: categoryId,
        };
        console.log('get enquiries', url);
        const token = await AsyncStorage.getItem('rbacToken');
        const config = {
          headers: {
            token: token ? token : '',
          },
        };
        setLoading(true);
        console.log(config);
        await axios.post(url, formData, config).then(response => {
          console.log(response.data.result[0][0], 'enquiry List');
          setEnquiryList(response.data.result[0]);
        });
        setLoading(false);
      };
      getEnquiry();
    }
  }, [villageId]);
  const openAdditonalEnquiry = item => {
    console.log(item, '>>>>>>>>>>>>>>>.');
    navigation.navigate('Additional Details', {item: item});
  };
  const handleSheduleCall = item => {
    navigation.navigate('Schedule Call', {item: item});
  };
  if (loading) {
    return <CustomLoadingSpinner />;
  }
  return (
    <View style={styles.container}>
      <View style={{marginHorizontal: 15}}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.categoryTitle}>{villageName}</Text>
          <Text style={styles.categoryTitle}>
            {totalEnquiry ? totalEnquiry : '0'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={enquiryList}
        renderItem={({item, index}) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => {
                openAdditonalEnquiry(item);
              }}>
              {/* <View key={index} style={styles.box}>
                  <Text style={styles.label}>
                    <Image
                      style={styles.personImg}
                      source={require('../../assets/person.png')}
                    />
                    -{' '}
                    {item.first_name +
                      (item.last_name ? ' ' + item.last_name : '')}
                  </Text>
                  <Text style={styles.label}>
                    <Image
                      style={styles.personImg}
                      source={require('../../assets/phone.png')}
                    />
                    - {item.phone_number}
                  </Text>
                  <Text style={styles.label}>
                    <Image
                      style={styles.personImg}
                      source={require('../../assets/product.png')}
                    />
                    - {item.product}
                  </Text>
                </View> */}
              <View key={index} style={styles.enquiryBox}>
                <View style={styles.dataStyle}>
                  <View style={styles.dataContainer}>
                    <View style={styles.iconContainer}>
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
                        source={require('../../assets/categories.png')}
                      />
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/product.png')}
                      />
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/link.png')}
                      />
                      <Image
                        style={styles.personImg}
                        source={require('../../assets/location.png')}
                      />
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={styles.label}>
                        {item.first_name +
                          (item.last_name ? ' ' + item.last_name : '')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          makePhoneCall(item.phone_number);
                        }}>
                        <Text style={styles.label}>{item.phone_number}</Text>
                      </TouchableOpacity>
                      <Text style={styles.label}>
                        {item.product ? item.product : 'New Tractor Enquiry'}
                      </Text>
                      <Text style={styles.label}>
                        {item.product ? item.product : 'Sonalika Sikander DLX'}
                      </Text>
                      <Text style={styles.label}>
                        {item.enquiry_source ? item.enquiry_source : 'On-site'}
                      </Text>
                      <Text style={styles.label}>
                        {item.village ? item.village : 'Dhrangadhra'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.rightDataStyle}>
                  <View style={styles.daysContainer}>
                    <TouchableOpacity style={styles.dayBack}>
                      <Text style={styles.dateText}>
                        {item.last_follow_up_date
                          ? moment(item.last_follow_up_date).format('LL')
                          : 'Not Followed'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.dayText}>
                    {Math.floor(
                      (new Date() - new Date(item.date)) /
                        (1000 * 60 * 60 * 24),
                    ) === 0
                      ? 'Today'
                      : Math.floor(
                          (new Date() - new Date(item.date)) /
                            (1000 * 60 * 60 * 24),
                        ) + ' Days'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleSheduleCall(item);
                    }}
                    style={styles.discussionButton}>
                    <Text style={styles.discussionText}>Follow Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  personImg: {
    width: 21,
    height: 21,
    marginRight: 8,
    marginBottom: 5,
  },
  touchableOpacityStyle: {
    backgroundColor: '#2471A3',
    padding: 10,
    borderRadius: 20,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 16,
    marginHorizontal: 12,
  },
  dataContainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    alignItems: 'flex-start',
  },
  detailContainer: {
    alignItems: 'flex-start',
  },
  rightDataStyle: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 1,
    marginLeft: 16,
  },
  daysContainer: {
    position: 'absolute',
    // top: -30,
    // right: -10,
    bottom: 80,
    left: 10,
  },
  dateText: {
    marginBottom: 4,
    color: '#21618C',
    fontSize: 10,
    fontWeight: 'bold',
  },
  discussionText: {
    color: 'gray',
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
export default VillageEnquiryLists;

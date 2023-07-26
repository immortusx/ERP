import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';

const VillageEnquiryLists = ({route}) => {
  const {villageId, categoryId, villageName} = route.params;
  const [enquiryList, setEnquiryList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId && villageId) {
      const getEnquiry = async () => {
        const url = `${API_URL}/api/enquiry/get-enquiry-by-village`;
        console.log('get enquiries', url);
        const formdata = {
          categoryId: categoryId,
          villageId: villageId,
        };
        const token = await AsyncStorage.getItem('rbacToken');
        const config = {
          headers: {
            token: token ? token : '',
          },
        };
        setLoading(true);
        console.log(config);
        await axios.post(url, formdata, config).then(response => {
          console.log(response.data.result[0], 'enquiry List');
          setEnquiryList(response.data.result[0]);
        });
        setLoading(false);
      };
      getEnquiry();
    }
  }, [route]);
  if (loading) {
    return <CustomLoadingSpinner />;
  }
  return (
    <View style={styles.container}>
      <View style={{marginHorizontal: 15}}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.categoryTitle}>Village :- {villageName}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={enquiryList}
        renderItem={({item, index}) => {
          return (
            <TouchableWithoutFeedback>
              <View key={index} style={styles.enquiryBox}>
                <View style={styles.dataStyle}>
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
                      source={require('../../assets/whatsapp.png')}
                    />
                    - {item.whatsapp_number}
                  </Text>
                  <Text style={styles.label}>
                    <Image
                      style={styles.personImg}
                      source={require('../../assets/email.png')}
                    />
                    - {item.email}
                  </Text>
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
    width: 20,
    height: 20,
  },
  touchableOpacityStyle: {
    backgroundColor: '#2471A3',
    padding: 10,
    borderRadius: 20,
    marginVertical: 8,
  },
  categoryTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 16,
  },
});
export default VillageEnquiryLists;

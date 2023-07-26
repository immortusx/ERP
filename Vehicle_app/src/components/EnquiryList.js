import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';

const EnquiryList = ({route}) => {
  const {categoryId} = route?.params;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (categoryId) {
      const getNewTractorEnquiry = async () => {
        const url = `${API_URL}/api/enquiry/get-enquiries-by-enquiry-category/${categoryId}`;
        console.log('get cateogries', url);
        const token = await AsyncStorage.getItem('rbacToken');
        const config = {
          headers: {
            token: token ? token : '',
          },
        };
        setLoading(true);
        console.log(config);
        await axios.get(url, config).then(response => {
          console.log(response.data, 'category list');
          // setCategoryList(response.data.result);
        });
        setLoading(false);
      };
      getNewTractorEnquiry();
    }
  }, [categoryId]);

  const openEnquiryByVillage = categoryId => {
    navigation.navigate('Village List', {categoryId: categoryId});
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.categoryTitle}>Enquiry By</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Text style={styles.categoryText}>General List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Text style={styles.categoryText}>Today List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Text style={styles.categoryText}>Weekly List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Text style={styles.categoryText}>Monthly List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            openEnquiryByVillage(categoryId);
          }}
          style={styles.categoryItem}>
          <Text style={styles.categoryText}>Village List</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A5276',
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
export default EnquiryList;

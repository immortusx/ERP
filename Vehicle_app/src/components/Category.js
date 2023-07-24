import React, {useState, useEffect} from 'react';
import {View, Text, Modal, StyleSheet, FlatList} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const Category = () => {
  const navigation = useNavigation();
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCategoryList = async () => {
      const url = `${API_URL}/api/master/get-category-list`;
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
        setCategoryList(response.data.result);
      });
      setLoading(false);
    };
    getCategoryList();
  }, []);

  const openEnquiryList = categoryId => {
    navigation.navigate('Enquiry List', {categoryId: categoryId});
  };

  if (loading) {
    return <CustomLoadingSpinner />;
  }
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.categoryTitle}>Category</Text>
        <FlatList
          data={categoryList}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  openEnquiryList(item.id);
                }}
                key={index}
                style={styles.categoryItem}>
                <Text style={styles.categoryText}>{item.category_name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    paddingVertical: 20,
    paddingHorizontal: 15,
    height: '100%',
  },
  categoryItem: {
    backgroundColor: '#0398A6',
    padding: 10,
    borderRadius: 3,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryTitle: {
    marginBottom: 10,
  },
});

export default Category;

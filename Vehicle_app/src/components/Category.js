import React, {useState, useEffect} from 'react';
import {View, Text, Modal, StyleSheet, FlatList} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const Category = ({route}) => {
  const {item} = route.params;
  const navigation = useNavigation();
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [villageId, setVillageId] = useState(null);
  const [totalEnquiry, setTotalEnquriy] = useState(null);
  useEffect(() => {
    if (item) {
      setVillageId(item.id);
    }
  }, [item]);
  useEffect(() => {
    if (villageId) {
      const getCategoryList = async () => {
        const url = `${API_URL}/api/master/get-category-list-with-total-enquiry/${villageId}`;
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
          console.log(response.data.result[0][0].total_enquiries, 'category list');
          setCategoryList(response.data.result[0]);
        });
        setLoading(false);
      };
      getCategoryList();
    }
  }, [villageId]);

  const openAvailableEnquiry = categoryData => {
    const villageName = item.name;
    const categoryId = categoryData.id;
    const totalEnquiry = categoryData.total_enquiries;
    navigation.navigate('Available Enquiry', {
      categoryId,
      villageId,
      villageName,
      totalEnquiry
    });
  };

  if (loading) {
    return <CustomLoadingSpinner />;
  }
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.categoryTitle}>Category</Text>
        </TouchableOpacity>
        {categoryList && categoryList.length > [] ? (
          <FlatList
            data={categoryList}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    openAvailableEnquiry(item);
                  }}
                  key={index}
                  style={styles.categoryItem}>
                  <Text style={styles.categoryText}>{item.category_name}</Text>
                  <Text style={styles.totalText}>
                    {item.total_enquiries ? item.total_enquiries : '0'}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <Text style={styles.notAvailableText}>Not Available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  modalContent: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A5276',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
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
  notAvailableText: {
    fontSize: 18,
    color: 'red',
    fontStyle: 'italic',
    alignSelf: 'center'
  },
});

export default Category;

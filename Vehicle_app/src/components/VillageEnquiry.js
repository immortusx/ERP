import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {useNavigation} from '@react-navigation/native';

const VillageEnquiry = ({route}) => {
  const {categoryId, villageId} = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [villageList, setVillageList] = useState([]);

  useEffect(() => {
    if (categoryId) {
      const getVillageList = async () => {
        const url = `${API_URL}/api/master/get-allVillage-by-total-enquiry/${categoryId}`;
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
          console.log(response.data.result[0], 'village list');
          setVillageList(response.data.result[0]);
        });
        setLoading(false);
      };
      getVillageList();
    }
  }, [categoryId]);

  const openAvailableEnquiry = villageName => {
    navigation.navigate('Available Enquiry', {
      villageId,
      categoryId,
      villageName,
    });
  };

  if (loading) {
    return <CustomLoadingSpinner />;
  }
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.touchableOpacityStyle}>
          <Text style={styles.categoryTitle}>Village</Text>
        </TouchableOpacity>
        <View style={{marginBottom: 100}}>
          <FlatList
            data={villageList}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    openAvailableEnquiry(item.name);
                  }}
                  key={index}
                  style={styles.categoryItem}>
                  <Text style={styles.categoryText}>{item.name}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      item.total_enquiries === 0
                        ? styles.notAvailable
                        : styles.availableStyle,
                    ]}>
                    {item.total_enquiries === 0
                      ? 'Not Available'
                      : item.total_enquiries}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
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
  notAvailable: {
    color: '#943126',
    fontSize: 12,
  },
  availableStyle: {
    color: 'green',
  },
});
export default VillageEnquiry;

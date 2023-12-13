import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import {setEnquiryType} from '../redux/slice/enquiryTypeSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setEnquiryList } from '../redux/slice/searchTextEnquirySlice';
import {API_URL} from '@env';

const SearchEnquiryFieldList = ({selectedCategory}) => {
    const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isFocus, setIsFocus] = useState(false);
  const [isConfirmation, setIsConfiromation] = useState(false);
  const listdata = useSelector(state => state.listdata.listdata);
  console.log(listdata, '**********************');

  const itemsToDisplay =
    Array.isArray(listdata) && listdata.length > 0 ? listdata[0] : [];

  const searchtext = async (text) => {
    console.log(text, selectedCategory, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    const url = `${API_URL}/api/get-enquiries-by-text/${text}/${selectedCategory}`;
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    await axios.get(url, config).then(response => {
      if (response) {
        console.log(
          response.data.result,
          '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        );
        dispatch(setEnquiryType('Search'));
        dispatch(setEnquiryList(response.data.result));
        setIsConfiromation(true);
      }
    });
  };

  //   useFocusEffect(
  //     React.useCallback(() => {
  //       if (text) {
  //         searchtext(text, selectedCategory);
  //       }
  //     }, [text, selectedCategory]),
  //   );

  return (
    <View style={styles.container}>
      {itemsToDisplay.length > 0 && (
        <FlatList
          data={itemsToDisplay}
          style={[
            styles.dropdown,
            isFocus && {borderColor: 'blue'},
            {paddingHorizontal: 5},
          ]}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => searchtext(item.name)}
              key={index}
              style={styles.categoryItem}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default SearchEnquiryFieldList;

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    height: 100,
    backgroundColor: 'white',
  },

  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

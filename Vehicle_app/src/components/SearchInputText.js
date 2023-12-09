import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import translations from '../../assets/locals/translations';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setEnquiryType} from '../redux/slice/enquiryTypeSlice';
import {
  setEnquiryList,
  clearEnquiryList,
} from '../redux/slice/searchTextEnquirySlice';

import {API_URL} from '@env';

const SearchInputText = ({selectedCategory}) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [isConfirmation, setIsConfiromation] = useState(false);
  
  const currentLanguage = useSelector(state => state.language.language);
  const enquiryType = useSelector(state => state.enquiryType.enquiryType);

  const searchtext = async (text, selectedCategory) => {
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
        console.log(response.data.result, 'Serached Data');
        dispatch(setEnquiryType('Search'));
        dispatch(setEnquiryList(response.data.result)); 
        setIsConfiromation(true);
      }
    });
  };


  useEffect(() => {
    if (enquiryType !== 'Search') {
      setSearchText('');
    }
  }, [enquiryType]);
 

  useFocusEffect(
    React.useCallback(() => {
      if (searchText.length > 1) {
        searchtext(searchText, selectedCategory);
      }
    }, [searchText, selectedCategory]),
  );

  
  return (
    <View style={styles.searchBox}>
      <TextInput
        style={styles.searchInput}
        placeholder={
          translations[currentLanguage]?.searchbymobile ||
          'SEARCH ENQUIRY...'
        }
        value={searchText}
        maxLength={10}
        onChangeText={text => {
          setSearchText(text);
        }}
      />
    </View>
  );
};

export default SearchInputText;

const styles = StyleSheet.create({
  searchBox: {
    height: 35,
    borderRadius: 4,
    backgroundColor: '#f1f3f6',
    display: 'flex',
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  searchInput: {
    height: 40,
    flex: 1,
    fontFamily: 'SourceSansProRegular',
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 10,
  },
});

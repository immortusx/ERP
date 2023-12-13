import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import translations from '../../assets/locals/translations';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setEnquiryType} from '../redux/slice/enquiryTypeSlice';
import {Dropdown} from 'react-native-element-dropdown';
import {
  setEnquiryList,
  clearEnquiryList,
} from '../redux/slice/searchTextEnquirySlice';
import { setEnquirySearchList } from '../redux/slice/searchEnquiryFiledDataSlice';
import SearchEnquiryFieldList from './SearchEnquiryFieldList';

import {API_URL} from '@env';

const SearchInputText = ({selectedCategory}) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [isConfirmation, setIsConfiromation] = useState(false);
  const [searchFieldData, setSearchFieldData] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const currentLanguage = useSelector(state => state.language.language);
  const enquiryType = useSelector(state => state.enquiryType.enquiryType);

  const getfieldData = async id => {
    const url = `${API_URL}/api/enquiry/getenquiry_search_filed_list/${id}`;
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    await axios.get(url, config).then(response => {
      if (response) {
        console.log(response.data.result, 'Searched Data');
       dispatch(setEnquirySearchList(response.data.result));
      }
    });
  };

  useEffect(() => {
    const getsearchField = async () => {
      const url = `${API_URL}/api/enquiry/getenquiry_search_filed`;
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.get(url, config).then(response => {
        if (response) {
          console.log(response.data.result, '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
          setSearchFieldData(response.data.result);
        }
      });
    };
    getsearchField();
  }, []);

  const fieldList = searchFieldData.map(field => ({
    label: field.name,
    value: field.id,
  }));

  const handleFieldChange = async fieldID => {
    getfieldData(fieldID);
  };

  return (
    <>
      <View style={styles.dropDownContainer}>
        <View style={styles.categoryBox}>
          <View style={styles.enquirySourceContainer}>
            <Dropdown
              style={[
                styles.dropdown,
                isFocus && {borderColor: 'blue'},
                {paddingHorizontal: 5},
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={fieldList}
              search
              maxHeight={200}
              labelField="label"
              valueField="value"
              searchPlaceholder="Search..."
              value={selectedField}
              onChange={item => {
                setSelectedField(item.value);
                handleFieldChange(item.value);
              }}
            />
          </View>
        </View>
        {selectedField && (
          <SearchEnquiryFieldList selectedCategory={selectedCategory} />
        )}
      </View>
    </>
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
  enquirySourceContainer: {
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 5,
  },
  categoryBox: {
    backgroundColor: '#EAF2F8',
    padding: 0,
    borderRadius: 5,
  },
  dropDownContainer: {
    marginHorizontal: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalCountText: {
    borderRadius: 150,
    marginBottom: 15,
    padding: 1.8,
    color: 'black',
  },
});

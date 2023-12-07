import {Dropdown} from 'react-native-element-dropdown';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Platform, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
const People = () => {
  const [recipients, setRecipients] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [chatID, setChatID] = useState(null);
  const [peopleList, setPeopleList] = useState([]);

  useEffect(()=> {
    setRecipients(1);
    getPeopleList(1);
  },[])
  const RecipientData = [
    {
      label: 'CUSTOMERS',
      value: 1,
    },
    {
      label: 'SSP',
      value: 2,
    },
    {
      label: 'EMPLOYEES',
      value: 3,
    },
  ];
  const recipientList = RecipientData.map(val => ({
    label: val.label,
    value: val.value,
  }));

  const getPeopleList = async (types) => {
    const url = `${API_URL}/api/get-people-list/${types}`;
    console.log('get manufacturer', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    await axios.get(url, config).then(response => {
      if (response.data) {
        console.log(response.data.result, 'people lists');
        setPeopleList(response.data.result);
      }
    });
  };
  const handleSelectedRecipient = value => {
    console.log(value, 'people type');
    getPeopleList(value);
    setRecipients(value);
  };
  const handleDownloadCSV = ()=> {
    
  }
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.selectRecipientsText}>Select People</Text>
        <View style={styles.dropContainer}>
          <Dropdown
            style={[
              styles.dropdown,
              isFocus && {borderColor: '#3498db', borderWidth: 2},
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={recipientList}
            search
            maxHeight={200}
            labelField="label"
            valueField="value"
            searchPlaceholder="SELECT..."
            value={recipients}
            onChange={item => {
              handleSelectedRecipient(item.value);
            }}
          />
        </View>
      </View>
      <FlatList 
      data={peopleList}
      keyExtractor={(item, index) => `people_${index}`}
      renderItem={({item, index})=> {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              // Handle onPress event if needed
            }}
            style={styles.itemContainer}
          >
            <Text style={styles.personName}>{index+1}   {item.personName}</Text>
          </TouchableOpacity>
        );
      }}/>
      <TouchableOpacity style={styles.downloadButton} onPress={() => {
        handleDownloadCSV
      }}>
        <Text style={styles.downloadButtonText}>Download CSV</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    margin: 10,
  },
  dropContainer: {
    borderColor: '#3498db',
    borderWidth: 1.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  dropdown: {
    paddingHorizontal: 16,
    backgroundColor: '#2471A2',
    borderRadius: 1,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
          width: 0,
          height: 1,
        },
      },
    }),
  },
  placeholderStyle: {
    color: '#777',
  },
  selectedTextStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputSearchStyle: {
    borderBottomColor: '#95a5a6',
  },
  iconStyle: {
    color: '#3498db',
  },
  selectRecipientsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2471A2',
    marginBottom: 7,
  },
  itemContainer: {
    margin: 5,
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  personName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
  },
  downloadButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default People;

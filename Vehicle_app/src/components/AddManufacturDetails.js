import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Picker,
  Button,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {Dropdown} from 'react-native-element-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AddManufacturDetails = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [manufacturer, setManufacturer] = useState(null);
  const [modal, setModal] = useState(null);
  const [variant, setVariant] = useState(null);
  const manufacturItem = [
    {label: 'Sonalika', value: '1'},
    {label: 'Mahindra', value: '2'},
  ];
  const modalItem = [
    {label: 'Sonalika A2R', value: '1'},
    {label: 'Mahindra WCR', value: '2'},
  ];
  const variantItem = [
    {label: 'Sonalika var 3', value: '1'},
    {label: 'Mahindra var SA', value: '2'},
  ];

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          Select Manufacturer :
        </Text>
      );
    }
    return null;
  };
  const getData = async () => {
    const name = await AsyncStorage.setItem('hell', 'therer');
    if (name) {
      console.warn(name);
    } else {
      console.warn(typeof AsyncStorage);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.customerContainer}>
        <Text style={styles.mainHeader}>Customer Details</Text>
        <View style={{marginBottom: 5}}>
          <Text style={styles.label}>Manufacturer :</Text>
          <View style={styles.inputContainer}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={manufacturItem}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Manufacturer' : ' '}
              searchPlaceholder="Search..."
              value={manufacturer}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setManufacturer(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <Text>{isFocus ? 'blue' : 'black'}</Text>
              // )}
            />
          </View>
        </View>
        <View style={{marginBottom: 5}}>
          <Text style={styles.label}>Modal :</Text>
          <View style={styles.inputContainer}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={modalItem}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Modal' : ' '}
              searchPlaceholder="Search..."
              value={modal}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setModal(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <Text>{isFocus ? 'blue' : 'black'}</Text>
              // )}
            />
          </View>
        </View>
        <View style={{marginBottom: 5}}>
          <Text style={styles.label}>Modal :</Text>
          <View style={styles.inputContainer}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={variantItem}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Variant' : ' '}
              searchPlaceholder="Search..."
              value={variant}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setVariant(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <Text>{isFocus ? 'blue' : 'black'}</Text>
              // )}
            />
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: 15}}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderTopColor: 'grey',
  },
  customerContainer: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  inputContainer: {
    marginBottom: 10,
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    color: 'grey',
    marginBottom: 2,
  },
  inputStyle: {
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#0984DF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: '#0984DF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainHeader: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  dropdownContainer: {
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#0984DF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownText: {
    color: 'red',
  },
  dropBoxStyle: {
    backgroundColor: '#fafafa',
    borderColor: '#0984DF',
    borderWidth: 1,
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
    borderColor: '#0984DF',
    borderWidth: 1,
  },
});

export default AddManufacturDetails;

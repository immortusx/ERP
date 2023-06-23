import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Picker,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {Dropdown} from 'react-native-element-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
const AddManufacturDetails = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
  const [openModal, setOpenModal] = useState(false);
  const [openVariant, setOpenVaraint] = useState(false);
  const [openManufactur, setOpenManufactur] = useState(false);
  const [value, setValue] = useState(null);
  const [selectedManufacture, setSelectedManufactureName] = useState(null);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [manufacturItem, setManufacturItem] = useState([
    {label: 'Sonalika', value: '1'},
    {label: 'Mahindra', value: '2'},
  ]);
  const [modalItem, setModalItem] = useState([
    {label: 'Sonalika ver', value: '1'},
    {label: 'Mahindra ver1', value: '2'},
  ]);
  const [variantItem, setVariantItem] = useState([
    {label: 'Sonalika varaint', value: '1'},
    {label: 'Mahindra varaint', value: '2'},
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.customerContainer}>
        <Text style={styles.mainHeader}>Customer Details</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Manufacturer :</Text>
          <DropDownPicker
            open={openManufactur}
            value={selectedManufacture}
            items={manufacturItem}
            setOpen={setOpenManufactur}
            setValue={setSelectedManufactureName}
            setItems={setManufacturItem}
            containerStyle={{marginTop: 5}}
            style={styles.dropBoxStyle}
            dropDownStyle={styles.dropDownStyle}
            placeholder="Select Manufacturer"
            onChangeItem={item => setSelectedManufactureName(item.value)}
            autoScroll
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Modal :</Text>
          <DropDownPicker
            open={openModal}
            value={selectedModal}
            items={modalItem}
            setOpen={setOpenModal}
            setValue={setSelectedModal}
            setItems={setModalItem}
            containerStyle={{marginTop: 5}}
            style={styles.dropBoxStyle}
            dropDownStyle={styles.dropDownStyle}
            placeholder="Select Modal"
            onChangeItem={item => setSelectedModal(item.value)}
            autoScroll
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Variant :</Text>
          <DropDownPicker
            open={openVariant}
            value={selectedVariant}
            items={variantItem}
            setOpen={setOpenVaraint}
            setValue={setSelectedVariant}
            setItems={setVariantItem}
            containerStyle={{marginTop: 5}}
            style={styles.dropBoxStyle}
            dropDownStyle={styles.dropDownStyle}
            placeholder="Select Variant"
            onChangeItem={item => setSelectedVariant(item.value)}
            autoScroll
          />
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
    zIndex: 1000
  },
  label: {
    color: 'grey',
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

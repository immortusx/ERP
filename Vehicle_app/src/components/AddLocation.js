import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { saveLocationForm } from '../redux/slice/locationFormSlice';

const AddLocation = () => {
  const dispatch = useDispatch();
  const [locationForm, setLocationForm] = useState({
    state: '',
    district: '',
    taluka: '',
    native: ''
  });
  const onChangeHandler =(value, field)=> {
    setLocationForm(preLocation => ({
      ...preLocation,
      [field]:value
    }))
  }
  const saveLocation = ()=> {
    if(locationForm.state.length > 0 && locationForm.district.length > 0 && locationForm.taluka.length > 0 && locationForm.native.length > 0){
      console.warn(locationForm);
      dispatch(saveLocationForm(locationForm));
    }else{
      console.warn("please fill the field");
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.customerContainer}>
        <Text style={styles.mainHeader}>Customer Details</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>State:</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter State"
            autoCapitalize="none"
            keyboardType="state"
            textContentType="state"
            onChangeText={value => onChangeHandler(value, 'state')}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>District:</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter District"
            autoCapitalize="none"
            keyboardType="district"
            textContentType="district"
            onChangeText={value => onChangeHandler(value, 'district')}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Taluka:</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter Taluka"
            autoCapitalize="none"
            keyboardType="taluka"
            textContentType="taluka"
            onChangeText={value => onChangeHandler(value, 'taluka')}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City/Village:</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter City/Village"
            autoCapitalize="none"
            keyboardType="native"
            textContentType="native"
            onChangeText={value => onChangeHandler(value, 'native')}
          />
        </View>
      </View>
      <View style={{paddingHorizontal: 15}}>
        <TouchableOpacity style={styles.saveButton} onPress={saveLocation}>
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
  },
  customerContainer: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
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
  },
  mainHeader: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default AddLocation;

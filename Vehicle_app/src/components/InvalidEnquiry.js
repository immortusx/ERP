import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SweetSuccessAlert from './subCom/SweetSuccessAlert';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import ConfirmationDialog from './subCom/ConfirmationDialog';
import {useNavigation} from '@react-navigation/native';

const InvalidEnquiry = ({item}) => {
  //   const {item} = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const followUpState = useSelector(
    state => state.followUpSlice.followUpState.result,
  );
  const [reason, setReason] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [enquiryData, setEnquiryData] = useState({});
  const [isConfirmation, setIsConfiromation] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    if (item) {
      setEnquiryData(item);
      setCustomerId(item.id);
    }
  }, [item]);

  const handleCloseEnquiry = () => {
    if (reason.length > 0) {
      setIsConfiromation(true);
    }
  };
  const handleDelete = async () => {
    if (customerId) {
      console.log('Deleting....');
      console.log(enquiryData.id);
      const customer_id = customerId;
      const formData = {
        reason: reason,
        enquiry_stage: 'Invalid',
      };
      const url = `${API_URL}/api/enquiry/close-enquiry/${customer_id}`;
      console.log('closing enqury', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      console.log(config);
      await axios.post(url, formData, config).then(response => {
        console.log(response.data, 'closing');
        if (response.data) {
          setIsShow(true);
          navigation.navigate('AddMore');
        }
        return response.data;
      });
    }
    setReason('');
    setIsConfiromation(false);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.fieldContainer}>
          <TouchableOpacity style={styles.deliveryName}>
            <Text style={styles.header}>
              Enquiry :- {enquiryData.first_name} {enquiryData.last_name} ,{' '}
              {moment(enquiryData.date).format('Do MMMM YYYY')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.label}>Reason *</Text>
          <TextInput
            style={styles.input}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={styles.buttonContainer}>
          {isShow && (
            <SweetSuccessAlert message={'Enquiry Closed'} modalShow={true} />
          )}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleCloseEnquiry}>
            <Text style={styles.buttonText}>Close Enquiry</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmationDialog
        visible={isConfirmation}
        message={
          <Text>
            Are you sure you want to close this{' '}
            <Text style={{fontWeight: 'bold', color: '#C0392B'}}>
              {enquiryData.first_name + ' ' + enquiryData.last_name}
            </Text>{' '}
            enquiry ?
          </Text>
        }
        onCancel={() => setIsConfiromation(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    marginTop: 7,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 10,
    flex: 1
  },
  fieldContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginBottom: 8,
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#CD5C5C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  dateStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginBottom: 10,
    borderColor: '#0984DF',
    borderWidth: 1,
    borderRadius: 22,
    padding: 5,
    paddingHorizontal: 30,
  },
  deliveryName: {
    backgroundColor: '#2980B9',
    padding: 5,
    marginVertical: 10,
  },
  header: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    top: 302,
  },
});

export default InvalidEnquiry;

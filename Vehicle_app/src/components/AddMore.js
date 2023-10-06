import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getEnquiryData} from '../redux/slice/getEnquirySlice';
import {useNavigation} from '@react-navigation/native';
import CustomLoadingSpinner from './subCom/CustomLoadingSpinner';
import {Linking} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import ToastMessage from './subCom/ToastMessage';
import TimeAgo from './subCom/TImeAgo';
import ConfirmationDialog from './subCom/ConfirmationDialog';
import ConfirmBox from './subCom/Confirm';
import EnquiryContainer from './EnquiryContainer';
import NewEnquiry from './NewEnquiry';
import LastMonthEnquiry from './LastMonthEnquiry';
import TodayEnquiry from './TodayEnquiry';

const AddMore = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enquiryType, setEnquiryType] = useState('All');
  const [todayEnquiryList, setTodayEnquiryList] = useState([]);
  const [newEnquiryList, setNewEnquiryList] = useState([]);
  const [lastMonthEnquiryList, setLastMonthEnquiryList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isConfirmation, setIsConfiromation] = useState(false);

  useEffect(() => {
    // dispatch(getEnquiryData());
    setEnquiryType('New');
  }, []);

  // if (loading) {
  //   return <CustomLoadingSpinner />;
  // }
  // if (isFetching) {
  //   return <CustomLoadingSpinner />;
  // }

  const handleTodayEnquiry = () => {
    setEnquiryType('Today');
  };
  const handleNewEnquiry = () => {
    setEnquiryType('New');
  };
  const handleLastMonthEnquiry = () => {
    setEnquiryType('Last Month');
  };
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={[
            styles.buttonStyle,
            styles.newButton,
            enquiryType === 'New' && styles.newActive,
          ]}
          onPress={() => {
            handleNewEnquiry();
          }}>
          <Text style={[styles.buttonText, {paddingHorizontal: 25}]}>NEW</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonStyle,
            styles.todayButton,
            enquiryType === 'Today' && styles.todayActive,
          ]}
          onPress={() => {
            handleTodayEnquiry();
          }}>
          <Text style={[styles.buttonText, {paddingHorizontal: 15}]}>
            TODAY
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonStyle,
            styles.monthButton,
            enquiryType === 'Last Month' && styles.lastMonthActive,
          ]}
          onPress={() => {
            handleLastMonthEnquiry();
          }}>
          <Text style={[styles.buttonText]}>LAST MONTH</Text>
        </TouchableOpacity>
      </View>
      {enquiryType === 'New' && <NewEnquiry />}
      {enquiryType === 'Today' && <TodayEnquiry />}
      {enquiryType === 'Last Month' && < LastMonthEnquiry/>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FB',
  },
  wrapper: {
    backgroundColor: '#2471A2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 4,
    paddingBottom: 0.6,
  },
  buttonStyle: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMonthActive: {
    borderBottomWidth: 4,
    borderColor: 'white',
  },
  newActive: {
    borderBottomWidth: 4,
    borderColor: 'white',
  },
  todayActive: {
    borderBottomWidth: 4,
    borderColor: 'white',
  },
});

export default AddMore;

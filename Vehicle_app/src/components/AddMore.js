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
import {setEnquiryFilter, setEnquiryType} from '../redux/slice/enquiryTypeSlice';
import FollowedEnquiry from './FollowedEnquiry';
import DueEnquiry from './DueEnquiry';

const AddMore = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todayEnquiryList, setTodayEnquiryList] = useState([]);
  const [newEnquiryList, setNewEnquiryList] = useState([]);
  const [lastMonthEnquiryList, setLastMonthEnquiryList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isConfirmation, setIsConfiromation] = useState(false);
  const enquiryType = useSelector(state => state.enquiryType.enquiryType);
  const enquiryFilter = useSelector(state => state.enquiryType.enquiryFilter);

  const handleTemporalEnquiry = () => {
    dispatch(setEnquiryFilter('Temporal'));
  };
  const handlePriorityEnquiry = () => {
    dispatch(setEnquiryFilter('Priority'));
  };
  const handleTodayEnquiry = () => {
    dispatch(setEnquiryType('Today'));
  };
  const handleNewEnquiry = () => {
    dispatch(setEnquiryType('New'));
  };
  const handleLastMonthEnquiry = () => {
    dispatch(setEnquiryType('Last Month'));
  };
  const handleDueEnquiry = () => {
    console.log(enquiryFilter, 'enquiryFIlte');
    dispatch(setEnquiryType('Due'));
  };
  return (
    <View style={styles.container}>
      <View style={styles.enquiryCategorrized}>
        <TouchableOpacity
          style={[
            styles.buttonStyle,
            styles.monthButton,
            enquiryFilter === 'Temporal' && styles.lastMonthActive,
          ]}
          onPress={() => {
            handleTemporalEnquiry();
          }}>
          <Text
            style={[
              styles.buttonText,
              enquiryFilter === 'Temporal' && styles.lastActiveText,
            ]}>
            TEMPORAL ENQUIRY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonStyle,
            styles.monthButton,
            enquiryType === 'Due' && styles.lastMonthActive,
          ]}
          onPress={() => {
            handlePriorityEnquiry();
          }}>
          <Text
            style={[
              styles.buttonText,
              enquiryType === 'Due' && styles.lastActiveText,
            ]}>
            PRIORITY ENQUIRY
          </Text>
        </TouchableOpacity>
      </View>
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
          <Text
            style={[
              styles.buttonText,
              enquiryType === 'New' && styles.newActiveText,
            ]}>
            NEW
          </Text>
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
          <Text
            style={[
              styles.buttonText,
              enquiryType === 'Today' && styles.todayActiveText,
            ]}>
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
          <Text
            style={[
              styles.buttonText,
              enquiryType === 'Last Month' && styles.lastActiveText,
            ]}>
            LAST MONTH
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonStyle,
            styles.monthButton,
            enquiryType === 'Due' && styles.lastMonthActive,
          ]}
          onPress={() => {
            handleDueEnquiry();
          }}>
          <Text
            style={[
              styles.buttonText,
              enquiryType === 'Due' && styles.lastActiveText,
            ]}>
            DUE
          </Text>
        </TouchableOpacity>
      </View>
      {enquiryFilter === 'Temporal' && enquiryType === 'New' && <NewEnquiry />}
      {enquiryFilter === 'Temporal' && enquiryType === 'Today' && <TodayEnquiry />}
      {enquiryFilter === 'Temporal' && enquiryType === 'Last Month' && <LastMonthEnquiry />}
      {enquiryFilter === 'Temporal' && enquiryType === 'Followed Enquiry' && <FollowedEnquiry />}
      {enquiryFilter === 'Temporal' && enquiryType === 'Due' && <DueEnquiry />}
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
    marginBottom: 4,
  },
  buttonStyle: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 0.2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMonthActive: {
    // borderBottomWidth: 4,
    // borderColor: 'white',
    backgroundColor: 'white',
  },
  newActive: {
    // borderBottomWidth: 4,
    // borderColor: 'white',
    backgroundColor: 'white',
  },
  todayActive: {
    // borderBottomWidth: 4,
    // borderColor: 'white',
    backgroundColor: 'white',
  },
  newActiveText: {
    color: '#2471A2',
  },
  todayActiveText: {
    color: '#2471A2',
  },
  lastActiveText: {
    color: '#2471A2',
  },
  enquiryCategorrized: {
    backgroundColor: '#2471A2',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default AddMore;

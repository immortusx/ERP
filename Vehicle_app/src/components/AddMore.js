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
import {setEnquiryType} from '../redux/slice/enquiryTypeSlice';
import FollowedEnquiry from './FollowedEnquiry';
import DueEnquiry from './DueEnquiry';
import HotEnquiry from './HotEnquiry';
import WarmEnquiry from './WarmEnquiry';
import CategorisedEnquiry from './CategorisedEnquiry';
import UserCreatedEnquiry from './UserCreatedEnquiry';
import ColdEnquiry from './ColdEnquiry';

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
  useEffect(() => {
    dispatch(setEnquiryType('New'));
  }, []);
  const enquiryFilters = [
    {
      type: 'New',
    },
    {
      type: 'Today',
    },
    {
      type: 'Last Month',
    },
    {
      type: 'Hot',
    },
    {
      type: 'Cold',
    },
    {
      type: 'Warm',
    },
    {
      type: 'Categorised',
    },
    {
      type: 'User Created',
    },
  ];
  const handleScreen = type => {
    console.log(type, 'screen');
    dispatch(setEnquiryType(type));
  };
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <FlatList
          data={enquiryFilters}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={[
                  styles.buttonStyle,
                  styles.newButton,
                  enquiryType === item.type && styles.newActive,
                ]}
                onPress={() => {
                  handleScreen(item.type);
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    enquiryType === item.type && styles.newActiveText,
                  ]}>
                  {item.type.toLocaleUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {enquiryType === 'New' && <NewEnquiry />}
      {enquiryType === 'Today' && <TodayEnquiry />}
      {enquiryType === 'Last Month' && <LastMonthEnquiry />}
      {enquiryType === 'Due' && <DueEnquiry />}
      {enquiryType === 'Hot' && <HotEnquiry />}
      {enquiryType === 'Cold' && <ColdEnquiry />}
      {enquiryType === 'Warm' && <WarmEnquiry />}
      {enquiryType === 'Categorised' && <CategorisedEnquiry />}
      {enquiryType === 'User Created' && <UserCreatedEnquiry />}
      {enquiryType === 'Followed Enquiry' && <FollowedEnquiry />}
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
});

export default AddMore;

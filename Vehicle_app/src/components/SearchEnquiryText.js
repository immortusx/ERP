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
import { clearEnquiryList,setEnquiryList } from '../redux/slice/searchTextEnquirySlice';

const SearchEnquiryText = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const enquiryType = useSelector(state => state.enquiryType.enquiryType);
  const enquireis = useSelector(state => state.setEnquiryList.enquireis);
 

  console.log(enquireis,"&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
  const handleSheduleCall = item => {
    navigation.navigate('Schedule Call', {item: item});
  };
  const makePhoneCall = mobileNumber => {
    console.log('Calling...', mobileNumber);
    Linking.openURL(`tel:${mobileNumber}`);
  };

  const openAdditonalEnquiry = item => {
    console.log(item, '>>>>>>>>>>>>>>>.');
    navigation.navigate('Additional Details', {item: item});
  };

  if (loading) {
    return <CustomLoadingSpinner />;
  }

  
  return (
    <View style={styles.container}>
     <Text>HGGHGYH</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FB',
  },
  boxContainer: {
    marginVertical: 4,
  },
  historyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E86C1',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textDecorationLine: 'underline',
    borderRadius: 22,
  },
  box: {
    marginTop: 6,
    width: '95%',
    padding: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 7,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  wrapper: {
    backgroundColor: '#2471A2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginVertical: 1,
    marginBottom: 4,
    paddingVertical: 5,
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newImg: {
    width: 30,
    height: 30,
  },
  newContainer: {
    alignItems: 'center',
    margin: 2,
  },
  enquiryBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
    width: '95%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  leftDataStyle: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  rightDataStyle: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginLeft: 5,
  },
  dateText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#3ab1d3',
    borderRadius: 20,
    borderColor: '#138D75',
    borderWidth: 0.1,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  salesText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#3ab1d3',
    borderRadius: 20,
    borderColor: '#138D75',
    borderWidth: 0.1,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  dayBack: {
    borderRadius: 30,
    color: 'white',
    padding: 2,
    marginBottom: 5,
  },
  discussionButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 20,
    borderColor: '#138D75',
    borderWidth: 0.1,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  discussionText: {
    color: 'white',
    textAlign: 'center',
  },
  notAvailableText: {
    fontSize: 18,
    color: 'red',
    fontStyle: 'italic',
  },
  noEnqiryBox: {
    backgroundColor: 'lightcoral',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  messagetext: {
    fontSize: 20,
    color: 'white',
    fontStyle: 'italic',
    alignSelf: 'center',
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
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  personImg: {
    width: 21,
    height: 21,
    marginRight: 8,
  },
  label: {
    width: 80,
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  noEnquiryContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 10,
  },
  NoTaskStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SearchEnquiryText;

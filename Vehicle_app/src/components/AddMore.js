import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getEnquiryData} from '../redux/slice/getEnquirySlice';
import {useNavigation} from '@react-navigation/native';

const AddMore = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState([]);
  const getEnquiryState = useSelector(state => state.getEnquiryState);
  const {isFetching, isSuccess, isError, result} = getEnquiryState;

  useEffect(() => {
    const getEnquiry = () => {
      dispatch(getEnquiryData());
    };
    getEnquiry();
  }, []);

  useEffect(() => {
    if (result) {
      console.log(result.result);
      setResultData(result.result);
    }
  }, [result]);

  const openAdditonalEnquiry = (item) => {
    navigation.navigate('Additonal Details', {item: item});
  };
  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.historyText}>Enquiry Details</Text>
      </View>
      <View style={styles.wrapper}>
        <TouchableOpacity style={[styles.buttonStyle, styles.todayButton]}>
          <Text style={[styles.buttonText, {paddingHorizontal: 17}]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonStyle, styles.weekButton]}>
          <Text style={[styles.buttonText, {paddingHorizontal: 10}]}>Last Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonStyle, styles.monthButton]}>
          <Text style={[styles.buttonText, {paddingHorizontal: 10}]}>Last Month</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={resultData}
        renderItem={({item, index}) => {
          return (
            <ScrollView>
              <TouchableWithoutFeedback
                onPress={() => {
                  openAdditonalEnquiry(item);
                }}>
                <View key={index} style={styles.box}>
                  <Text style={styles.label}>
                    <Image
                      style={styles.personImg}
                      source={require('../../assets/person.png')}
                    />
                    - {item.first_name + ' ' + item.last_name}
                  </Text>

                  <Text style={styles.label}>
                    <Image
                      style={styles.personImg}
                      source={require('../../assets/phone.png')}
                    />
                    - {item.phone_number}
                  </Text>

                  <Text style={styles.label}>
                    <Image
                      style={styles.personImg}
                      source={require('../../assets/product.png')}
                    />
                    - {item.product}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEF8'
  },
  boxContainer: {
    marginVertical: 4
  },
  historyText: {
    fontSize: 24,
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
    marginBottom: 7
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 1,
    marginBottom: 7
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  todayButton: {
    backgroundColor: '#E67E22',
  },
  weekButton: {
    backgroundColor: '#EB984E',
  },
  monthButton: {
    backgroundColor: '#F0B27A',
  },
  personImg: {
    width: 20,
    height: 20,
  },
});

export default AddMore;

import {View, StyleSheet, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getEnquiryData} from '../redux/slice/getEnquirySlice';

const AddMore = () => {
  const dispatch = useDispatch();
  const getEnquiryState = useSelector(state => state.getEnquirySlice);

  useEffect(() => {
    const getEnquiry = () => {
      dispatch(getEnquiryData());
    };
    getEnquiry();
  }, []);
  useEffect(() => {
    if (getEnquiryState) {
      console.log('********', getEnquiryState);
    }
    console.log(getEnquiryState, 'getEnquiryState');
  }, [getEnquiryState]);
  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.historyText}>Enquiry Details</Text>
        <View style={styles.box}>
          <Text style={styles.label}>Enquiry No:</Text>
          <Text style={styles.content}>123456789</Text>
          <Text style={styles.label}>Customer Name:</Text>
          <Text style={styles.content}>John Doe</Text>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.content}>123-456-7890</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Enquiry No:</Text>
          <Text style={styles.content}>123456789</Text>
          <Text style={styles.label}>Customer Name:</Text>
          <Text style={styles.content}>John Doe</Text>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.content}>123-456-7890</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Enquiry No:</Text>
          <Text style={styles.content}>123456789</Text>
          <Text style={styles.label}>Customer Name:</Text>
          <Text style={styles.content}>John Doe</Text>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.content}>123-456-7890</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxContainer: {},
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
    marginTop: 5,
    width: '95%',
    padding: 10,
    backgroundColor: '#7FBCF3',
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
});

export default AddMore;

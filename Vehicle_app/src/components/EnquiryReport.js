import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const EnquiryReport = () => {
  const navigation = useNavigation();
  const openEnquiryReport = () => {
    navigation.navigate('Enquiry List');
  };

  const openWorkreport = () => {
    navigation.navigate('WorkReport List');
  };
  const openTaskreport = () => {
    navigation.navigate('Task Report List');
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={{alignItems: 'center', marginTop: 10}}>
          <TouchableOpacity style={styles.reportStyle}>
            <Text style={styles.reportTitle}>REPORT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.enquiryStyle}
              onPress={openEnquiryReport}>
              <Image
                style={styles.enquiryIcon}
                source={require('../../assets/clipboard.png')}
              />
              <Text style={styles.enquiryText}>Enquiry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.enquiryStyle}
              onPress={openWorkreport}>
              <Image
                style={styles.deliveryIcon}
                source={require('../../assets/work.png')}
              />
              <Text style={styles.deliveryText}>Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.enquiryStyle}
              onPress={openTaskreport}>
              <Image
                style={styles.deliveryIcon}
                source={require('../../assets/tasks.png')}
              />
              <Text style={styles.deliveryText}>Task Report</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.categoryContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.enquiryStyle}
              onPress={openEnquiryReport}>
              <Image
                style={styles.enquiryIcon}
                source={require('../../assets/booking.png')}
              />
              <Text style={styles.enquiryText}>Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deliveryStyle}
              onPress={openDlieveryreport}>
              <Image
                style={styles.lostIcon}
                source={require('../../assets/lost.png')}
              />
              <Text style={styles.lostText}>Lost</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  reportStyle: {
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 50,
  },
  reportTitle: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
  enquiryStyle: {
    width: 160,
    height: 100,
    backgroundColor: '#DFECFF',
    marginBottom:20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 4,
    borderColor: 'grey',
    borderEndWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // deliveryStyle: {
  //   width: 160,
  //   height: 100,
  //   backgroundColor: '#DFECFF',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 2,
  //   elevation: 2,
  //   borderRadius: 4,
  //   borderColor: 'grey',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  buttonContainer: {
    marginVertical: 12,
    flexDirection: 'row',
    flexWrap:"wrap",
    justifyContent: 'space-around',
    borderEndWidth: 0.5,
  },
  deliveryIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  enquiryIcon: {
    width: 45,
    height: 45,
    justifyContent: 'center',
  },
  lostIcon: {
    width: 45,
    height: 45,
    justifyContent: 'center',
  },
  deliveryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A5276',
    marginBottom: 10,
  },
  enquiryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A5276',
    marginTop: 10,
  },
  lostText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A5276',
    marginTop: 10,
  },
  categoryContainer: {},
});
export default EnquiryReport;

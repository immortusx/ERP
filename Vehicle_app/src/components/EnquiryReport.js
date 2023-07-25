import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import Category from './Category';

const EnquiryReport = () => {
  const [openCategory, setOpenCategory] = useState(false);

  const openEnquiryReport = () => {
    setOpenCategory(true);
  };

  const openDlieveryreport = () => {
    setOpenCategory(false);
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
              style={styles.deliveryStyle}
              onPress={openDlieveryreport}>
              <Image
                style={styles.deliveryIcon}
                source={require('../../assets/delivery.png')}
              />
              <Text style={styles.deliveryText}>Delivery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {openCategory && <Category />}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0398A6',
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
    width: 150,
    height: 100,
    backgroundColor: 'white',
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
  deliveryStyle: {
    width: 150,
    height: 100,
    backgroundColor: 'white',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderEndWidth: 0.5,
  },
  deliveryIcon: {
    width: 70,
    height: 70,
    justifyContent: 'center',
  },
  enquiryIcon: {
    width: 45,
    height: 45,
    justifyContent: 'center',
  },
  deliveryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  enquiryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  categoryContainer: {},
});
export default EnquiryReport;

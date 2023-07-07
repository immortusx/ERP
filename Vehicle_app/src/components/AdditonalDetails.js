import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const AdditonalDetails = ({route}) => {
  const navigation = useNavigation();
  const {item} = route.params;

  const handleSheduleCall = item => {
    navigation.navigate('Schedule Call', {item: item});
  };
  const openEditEnquiry = (editData)=> {
    navigation.navigate("Edit Detail Enquiry", {editData: editData});
  }
  return (
    <View style={styles.userCard}>
      <View style={styles.dataContainer}>
        <View style={styles.boxContainer}>
          <Text style={styles.historyText}>Customer Details</Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity
            onPress={()=> {openEditEnquiry(item)}}>
              <Image
                style={styles.editImg}
                source={require('../../assets/edit.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mainContent}>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/person.png')}
            />
            - {item.first_name + (item.last_name ? ' ' + item.last_name : '')}
          </Text>

          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/phone.png')}
            />
            - {item.phone_number}
          </Text>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/whatsapp.png')}
            />
            - {item.whatsapp_number}
          </Text>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/email.png')}
            />
            - {item.email}
          </Text>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/product.png')}
            />
            - {item.product}
          </Text>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/source.png')}
            />
            - {item.enquiry_source}
          </Text>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/date.png')}
            />
            - {item.date}
          </Text>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/delivery.png')}
            />
            - {item.delivery_date}
          </Text>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/salesperson.png')}
            />
            - {item.sales_person}
          </Text>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/district.png')}
            />
            - {item.district}
          </Text>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/location.png')}
            />
            - {item.taluka}
          </Text>
          <Text style={styles.myName}>
            <Image
              style={styles.personImg}
              source={require('../../assets/location.png')}
            />
            - {item.village}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleSheduleCall(item);
          }}
          style={styles.followButtonContainer}>
          <Text style={styles.followButtonText}>Follow Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userCard: {
    flex: 1,
    backgroundColor: '#F5EEF8',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    textAlign: 'center',
    shadowColor: 'grey',
    borderRadius: 10,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    marginVertical: 30,
  },
  imageContainer: {
    marginVertical: 0.2,
  },
  imageView: {
    width: 100,
    height: 100,
  },
  bioDataContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'space-evenly',
  },
  bioHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  idNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  mainContent: {
    lineHeight: 0.5,
    textAlign: 'left',
    backgroundColor: 'white',
    marginVertical: 20,
  },
  myName: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '500',
    color: 'black',
    marginBottom: 10,
  },
  historyText: {
    fontWeight: 'bold',
    color: '#2E86C1',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textDecorationLine: 'underline',
    borderRadius: 22,
  },
  personImg: {
    width: 20,
    height: 20,
  },
  editImg: {
    width: 22,
    height: 22,
  },
  followButtonContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginLeft: 'auto',
  },
});
export default AdditonalDetails;

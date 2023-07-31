import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
const AdditonalDetails = ({route}) => {
  const navigation = useNavigation();
  const {item} = route.params;

  const handleSheduleCall = item => {
    navigation.navigate('Schedule Call', {item: item});
  };
  const openEditEnquiry = editData => {
    navigation.navigate('Edit Detail Enquiry', {editData: editData});
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.borderStyle}>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => {
                openEditEnquiry(item);
              }}>
              <Image
                style={styles.editImg}
                source={require('../../assets/edit.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameStyle}>
              {item.first_name + (item.last_name ? ' ' + item.last_name : '')}
            </Text>
            <Text style={styles.enquiryDate}>
              {moment(item.date).format('LL')}
            </Text>
          </View>
          <View style={styles.contactContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.contactInfo}>Phone</Text>
              <Text style={styles.contactInfo}>whatsApp</Text>
              <Text style={styles.contactInfo}>Email</Text>
              <Text style={styles.contactInfo}>Product</Text>
              <Text style={styles.contactInfo}>Enquiry Date</Text>
              <Text style={styles.contactInfo}>Delivery Date</Text>
              <Text style={styles.contactInfo}>Enquiry Source</Text>
              <Text style={styles.contactInfo}>Sales Person</Text>
              <Text style={styles.contactInfo}>District</Text>
              <Text style={styles.contactInfo}>Taluka/Tehsil</Text>
              <Text style={styles.contactInfo}>Village</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {item.phone_number}
              </Text>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {item.whatsapp_number ? item.whatsapp_number : '98765432'}
              </Text>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {item.email ? item.email : 'john@email.com'}
              </Text>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {item.product ? item.product : 'Sonalika Tiger 2WD'}
              </Text>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {moment(item.date).format('LL')}
              </Text>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {moment(item.delivery_date).format('LL')}
              </Text>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {item.enquiry_source ? item.enquiry_source : 'N/A'}
              </Text>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {item.sales_person}
              </Text>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {item.district ? item.district : 'N/A'}
              </Text>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {item.taluka ? item.taluka : 'N/A'}
              </Text>
              <Text style={[styles.contactInfo, styles.contactStyle]}>
                {item.village ? item.village : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={styles.userCard}>
          <View style={styles.leftContainer}>
            <Image
              source={require('../../assets/person.png')}
              style={styles.profilePic}
              resizeMode="cover"
            />
            <Text style={styles.username}>
              {item.first_name + (item.last_name ? ' ' + item.last_name : '')}
            </Text>
          </View>

          <View style={styles.rightContainer}>
            <View style={styles.contactInfoContainer}>
              <Image
                style={styles.icon}
                source={require('../../assets/phone.png')}
                resizeMode="contain"
              />
              <Text style={styles.contactInfo}>{item.phone_number}</Text>
            </View>

            <View style={styles.contactInfoContainer}>
              <Image
                style={styles.icon}
                source={require('../../assets/email.png')}
                resizeMode="contain"
              />
              <Text style={styles.contactInfo}>john.doe@example.com</Text>
            </View>

            <View style={styles.contactInfoContainer}>
              <Image
                style={styles.icon}
                source={require('../../assets/whatsapp.png')}
                resizeMode="contain"
              />
              <Text style={styles.contactInfo}>+1 (123) 456-7890</Text>
            </View>

            <Text style={styles.additionalDetails}>Enquiry details</Text>
          </View>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: '#A29BC5',
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 15,
    marginHorizontal: 10,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 5,
    flex: 1,
  },
  imageContainer: {
    marginLeft: 'auto',
  },
  editImg: {
    width: 22,
    height: 22,
  },
  userCard: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 20,
    borderColor: 'green',
    borderWidth: 0.4,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 15,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 15,
    alignItems: 'flex-start',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 16,
    marginBottom: 10,
    padding: 2,
  },
  contactStyle: {
    fontWeight: 'bold',
    color: 'black',
  },
  additionalDetails: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  personImg: {
    width: 20,
    height: 20,
  },
  contactInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  nameStyle: {
    fontSize: 30,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  enquiryDate: {
    textAlign: 'center',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
});
export default AdditonalDetails;

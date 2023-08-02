import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Button,
  Linking,
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
  const makePhoneCall = (mobileNumber)=> {
    Linking.openURL(`tel:${mobileNumber}`);
  }
  const makeWhatsAppCall = (whatsAppNumber)=> {
    Linking.openURL(`whatsapp://send?phone=${whatsAppNumber}`);
  }
  const sendMessage = (mobileNumber)=> {
    let message = 'Hello sir, this is Test Message, ignore it';
    Linking.openURL(`sms:${mobileNumber}?body=${message}`);
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
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
            <Text style={styles.contactInfo}>Category</Text>
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
            <Text style={[styles.contactInfo, styles.contactStyle]}>N/A</Text>
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
            <Text
              style={[styles.contactInfo, styles.contactStyle, {fontSize: 15}]}>
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
        <View style={styles.lastActivity}>
          <Text style={styles.dayText}>Added : 5 Days</Text>
          <Text style={styles.dayText}>Last Activity : Call</Text>
        </View>
        <View style={styles.followContainer}>
          <View style={styles.stageDetail}>
            <Text style={styles.followLabel}>Current Stage</Text>
            <Text style={styles.followDetail}>Next Activity Plan</Text>
            <Text style={styles.followLabel}>Follow Up Type</Text>
            <Text style={styles.followDetail}>Call</Text>
          </View>
          <View style={styles.nextReminder}>
            <Text style={styles.followLabel}>Followup Person</Text>
            <Text style={styles.followDetail}> {item.sales_person}</Text>
            <Text style={styles.followLabel}>Next Reminders</Text>
            <Text style={styles.followDetail}>
              {item.last_follow_up_date ? item.last_follow_up_date : 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.recentStyle}>
          <Text style={styles.followLabel}>Recent Notes:</Text>
          <View style={styles.callIconStyle}>
            <TouchableOpacity style={styles.greenButton} onPress={()=> {makePhoneCall(item.phone_number)}}>
              <Image
                style={styles.iconImg}
                source={require('../../assets/telephone.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.greenButton} onPress={()=> {makeWhatsAppCall(item.phone_number)}}>
              <Image
                style={styles.iconImg}
                source={require('../../assets/whatsapp.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.greenButton} onPress={()=> {sendMessage(item.phone_number)}}>
              <Image
                style={styles.iconImg}
                source={require('../../assets/chat.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.greenButton}>
              <Image
                style={styles.iconImg}
                source={require('../../assets/credit.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.followUpButton} onPress={()=> {handleSheduleCall(item)}}>
            <Text style={styles.followupButton}>FOLLOW UP</Text>
          </TouchableOpacity>
        </View>
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
    marginVertical: 10,
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
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 8,
    marginVertical: 5,
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
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
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
    padding: 2,
    color: 'black',
  },
  contactStyle: {
    fontWeight: 'bold',
    color: '#2E86C1',
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
    fontSize: 22,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'capitalize'
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
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  stageDetail: {
    flex: 1,
    alignItems: 'flex-start',
  },
  nextReminder: {
    flex: 1,
    alignItems: 'flex-start',
  },
  followLabel: {
    color: '#5DADE2',
    marginTop: 5,
  },
  followDetail: {
    color: 'black',
  },
  lastActivity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayText: {
    color: 'red',
  },
  iconImg: {
    width: 40,
    height: 40,
  },
  callIconStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  recentStyle: {
    marginVertical: 15,
  },
  greenButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 8,
    marginTop: 10,
  },
  followUpButton: {
    backgroundColor: '#3AA4F7',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center'
  },
  followupButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
export default AdditonalDetails;

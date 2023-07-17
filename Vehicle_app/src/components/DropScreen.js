import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const DropScreen = ({ navigation }) => {
  const trashEnquiryData = [
    { id: '1', title: 'Trash Enquiry Item 1' },
    { id: '2', title: 'Trash Enquiry Item 2' },
    { id: '3', title: 'Trash Enquiry Item 3' },
  ];

  const handleRestoreEnquiry = (enquiryId) => {
    console.log('dropenquiry', enquiryId)
    navigation.navigate('ConfirmationScreen');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.enquiryItem}
      onPress={() => handleRestoreEnquiry(item.id)}
    >
      <Text style={styles.enquiryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drop Enquiry Screen</Text>
      <Text style={styles.description}>
        Restore the enquiry from trash.
      </Text>
      <FlatList
        data={trashEnquiryData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.enquiryList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5EEF8'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  enquiryList: {
    width: '100%',
  },
  enquiryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  enquiryTitle: {
    fontSize: 16,
  },
});

export default DropScreen;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const DeliveryScreen = ({ navigation }) => {
  const deliveryData = [
    { id: '1', title: 'Delivery Item 1' },
    { id: '2', title: 'Delivery Item 2' },
    { id: '3', title: 'Delivery Item 3' },
  ];

  const handleConfirmDelivery = (deliveryId) => {
    console.log("Delivery")
    navigation.navigate('ConfirmationScreen');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.deliveryItem}
      onPress={() => handleConfirmDelivery(item.id)}
    >
      <Text style={styles.deliveryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Screen</Text>
      <Text style={styles.description}>
        Confirm the delivery of the package.
      </Text>
      <FlatList
        data={deliveryData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.deliveryList}
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
  deliveryList: {
    width: '100%',
  },
  deliveryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  deliveryTitle: {
    fontSize: 16,
  },
});

export default DeliveryScreen;

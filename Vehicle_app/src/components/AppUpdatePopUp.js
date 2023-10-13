import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const UpdatePopUp = ({ isVisible, onDismiss, onUpdate, updateDetails }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.title}>App Update Available</Text>
          <Text style={styles.subtitle}>What's New:</Text>
          <View style={styles.featuresContainer}>
            {updateDetails.features.map((feature, index) => (
              <Text key={index} style={styles.featureText}>
                 • {feature}
              </Text> 
            ))}
          </View>
          <TouchableOpacity style={styles.updateButton} onPress={onUpdate}>
            <Text style={styles.updateButtonText}>Update Now</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.laterButton} onPress={onDismiss}>
            <Text style={styles.laterButtonText}>Later</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black'
  },
  featuresContainer: {
    marginTop: 10,
    backgroundColor: '#81ec85',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10
  },
  featureText: {
    fontSize: 16,
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: 'green', // Green background for the "Update Now" button
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase', // Capitalize the text
  },
  laterButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  laterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdatePopUp;

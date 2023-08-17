import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const CustomLoadingSpinner = ({ visible }) => {
  return (
    <Modal visible={visible} transparent={true} animationType='fade'>
      <View style={styles.background}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#2E86C1" />
          <Text style={styles.text}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomLoadingSpinner;

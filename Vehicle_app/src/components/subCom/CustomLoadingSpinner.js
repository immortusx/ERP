import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Modal} from 'react-native';

const CustomLoadingSpinner = () => {
  return (
    <Modal visible={true} transparent={true} animationType='fade'>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E86C1" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomLoadingSpinner;

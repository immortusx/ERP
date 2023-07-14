import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

const LoadingSpinner = ({isLoading, messageText}) => {
  if (isLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.spinnerText}>{messageText}</Text>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  spinnerText: {
    fontSize: 12,
    marginTop: 2,
    color: 'white',
  },
});

export default LoadingSpinner;

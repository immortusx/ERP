import React from 'react';
import { View, StyleSheet } from 'react-native';

const HorizontalLine = () => {
  return <View style={styles.horizontalLine} />;
};

const styles = StyleSheet.create({
  horizontalLine: {
    borderBottomColor: 'blue',
    borderBottomWidth: 2,
    marginVertical: 10,
  },
});

export default HorizontalLine;

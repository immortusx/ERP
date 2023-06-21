import { View, StyleSheet, Text } from 'react-native';
import React from 'react';

const AddMore = () => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 55, paddingHorizontal: 20}}>HomeScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#40c965',
  },
});

export default AddMore;

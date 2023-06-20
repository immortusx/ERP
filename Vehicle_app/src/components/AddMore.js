import { View, StyleSheet, Text } from 'react-native';
import React from 'react';

const AddMore = () => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 55, paddingVertical: 20, marginHorizontal: 20}}>App Home</Text>
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

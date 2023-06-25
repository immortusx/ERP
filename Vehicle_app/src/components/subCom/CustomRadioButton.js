import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomRadioButton = ({ options, selectedOption, onSelect }) => {
  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.radioButton}
          onPress={() => onSelect(option)}
        >
          <View style={styles.radioButtonIcon}>
            {option === selectedOption && <View style={styles.radioButtonIconSelected} />}
          </View>
          <Text style={styles.radioButtonLabel}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0984DF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonIconSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0984DF',
  },
  radioButtonLabel: {
    fontSize: 16,
  },
});

export default CustomRadioButton;

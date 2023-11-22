import React from 'react';
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
          <View style={styles.radioButtonRow}>
            <Text style={[styles.radioButtonLabel, option === selectedOption && styles.selectedLabel]}>
              {option}
            </Text>
            <View style={styles.radioButtonIcon}>
              {option === selectedOption && <View style={styles.radioButtonIconSelected} />}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    marginBottom: 10,
  },
  radioButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Added justifyContent to create space between label and icon
  },
  radioButtonIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0984DF',
    justifyContent: 'center',
    alignItems: 'center',
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
  selectedLabel: {
    fontWeight: 'bold',
    color: '#0984DF',
  },
});

export default CustomRadioButton;

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const data = [
  {label: 'All', value: '1'},
  {label: 'New Tractor', value: '2'},
  {label: 'Old Tractor', value: '3'},
  {label: 'Utility Tractor ', value: '4'},
  {label: 'Industrial Tractor', value: '5'},
];

const CustomDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = item => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownHeader}>
        <Text style={styles.selectedText}>
          {selectedItem ? selectedItem.label : 'SELECT CATEGORY'}
        </Text>
        <Text style={styles.icon}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownList}>
          {data.map(item => (
            <TouchableOpacity
              key={item.value}
              style={styles.dropdownItem}
              onPress={() => handleSelectItem(item)}>
              <Text style={styles.dropLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    backgroundColor: '#2980B9',
  },
  dropdownHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3498DB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#48A6E5',
    borderWidth: 1,
    borderColor: 'white',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  dropLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default CustomDropdown;

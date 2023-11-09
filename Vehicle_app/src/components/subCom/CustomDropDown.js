import {Dropdown} from 'react-native-element-dropdown';
import React, {useState} from 'react';
import {View, StyleSheet, Platform, Text} from 'react-native';

const CustomDropdown = () => {
  const [recipients, setRecipients] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const RecipientData = [
    {
      label: 'CUSTOMERS',
      value: 1,
    },
    {
      label: 'SSP',
      value: 2,
    },
    {
      label: 'EMPLOYEES',
      value: 3,
    },
  ];
  const recipientList = RecipientData.map(val => ({
    label: val.label,
    value: val.value,
  }));

  const handleSelectedRecipient = value => {
    console.log(value, 'vlals');
    // Handle selected recipient
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectRecipientsText}>Select Recipients</Text>
      <View style={styles.dropContainer}>
        <Dropdown
          style={[
            styles.dropdown,
            isFocus && {borderColor: '#3498db', borderWidth: 2},
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={recipientList}
          search
          maxHeight={200}
          labelField="label"
          valueField="value"
          searchPlaceholder="SELECT..."
          value={recipients}
          onChange={item => {
            handleSelectedRecipient(item.value);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  dropContainer: {
    borderColor: '#3498db',
    borderWidth: 1.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  dropdown: {
    paddingHorizontal: 16,
    backgroundColor: '#ecf0f1',
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
          width: 0,
          height: 1,
        },
      },
    }),
  },
  placeholderStyle: {
    color: '#777',
  },
  selectedTextStyle: {
    color: '#333',
    fontWeight: 'bold',
  },
  inputSearchStyle: {
    borderBottomColor: '#95a5a6',
  },
  iconStyle: {
    color: '#3498db',
  },
  selectRecipientsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 7,
  },
});

export default CustomDropdown;

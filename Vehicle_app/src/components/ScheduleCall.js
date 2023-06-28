import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

const ScheduleCall = ({route}) => {
  const {item} = route.params;
  const [currentDate, setCurrentDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSaveDetails = () => {
  };
  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Current Date:</Text>
        <TextInput
          style={styles.input}
          value={currentDate}
          onChangeText={setCurrentDate}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveDetails}>
        <Text style={styles.buttonText}>Save Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4, 
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
    },
    fieldContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 8,
    },
    saveButton: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default ScheduleCall;

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

const ScheduleCall = ({route}) => {
  const {item} = route.params;
  const [currentDate, setCurrentDate] = useState('');
  const [discussion, setDiscussion] = useState('');

  const handleSaveDetails = () => {};
  const onPress = () => {
    console.warn('Hello');
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Discussion:</Text>
          <TextInput
            style={styles.input}
            value={discussion}
            onChangeText={setDiscussion}
            multiline
            numberOfLines={4}
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveDetails}>
          <Text style={styles.buttonText}>Save Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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

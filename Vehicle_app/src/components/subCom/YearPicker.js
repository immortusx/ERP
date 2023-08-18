import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const YearPicker = ({visible, onClose, onYearSelect}) => {
  const [selectedYear, setSelectedYear] = useState(null);

  const years = [];
  for (let year = 1980; year <= 2023; year++) {
    years.push(year);
  }

  const handleYearSelect = year => {
    setSelectedYear(year);
    onYearSelect(year);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select a Year</Text>
          <ScrollView>
            {years.map(year => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearItem,
                  selectedYear === year && styles.selectedYear,
                ]}
                onPress={() => handleYearSelect(year)}>
                <Text style={[styles.yearText, selectedYear === year && styles.yearTextColor]}>{year}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  yearItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#3AA4F7',
    borderWidth: 1,
  },
  selectedYear: {
    backgroundColor: '#2471A3',
  },
  yearText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#3AA4F7',
    fontSize: 16,
    fontWeight: 'bold'
  },
  yearTextColor: {
    color: 'white'
  }
});
export default YearPicker;

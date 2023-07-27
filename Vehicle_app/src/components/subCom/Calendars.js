import React from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';

const Calendars = ({ showModal, selectedDate, handleCalendarDate, onClose }) => {
  return (
    <Modal visible={showModal} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Calendar
            style={styles.calendarStyle}
            onDayPress={handleCalendarDate}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#6EBFF6' },
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 10,
    padding: 10,
  },
  calendarStyle: {
    borderRadius: 10,
    elevation: 4,
    margin: 5,
    marginBottom: 110
  },
});

export default Calendars;

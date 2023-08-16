import React from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';

const MinDateCalendars = ({ showModal, selectedDate, handleCalendarDate, onClose }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal visible={showModal} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Calendar
            style={styles.calendarStyle}
            onDayPress={(day) => {
              if (day.dateString >= today) {
                handleCalendarDate(day);
              }
            }}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#6EBFF6' },
            }}
            minDate={today}
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
    marginBottom: 110,
  },
});

export default MinDateCalendars;

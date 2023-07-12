import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';

const Calendars = ({showModal, selectedDate, handleCalendarDate}) => {
  return (
    <Modal visible={showModal} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Calendar
            style={styles.calendarStyle}
            onDayPress={handleCalendarDate}
            markedDates={{
              [selectedDate]: {selected: true, selectedColor: '#6EBFF6'},
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 10,
  },
  calendarStyle: {
    borderRadius: 10,
    elevation: 4,
    margin: 5,
  },
});

export default Calendars;

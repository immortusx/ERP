import React from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';

const ConfirmBox = ({visible, message, onCancel, onConfirm}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.dialog}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 15,
  },
  message: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#555',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmBox;

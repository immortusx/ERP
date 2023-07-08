import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, Image} from 'react-native';

const SweetSuccessAlert = ({message, modalShow}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const hideModal = () => {
    console.log(modalShow);
    setModalVisible(false);
  };
  useEffect(() => {
    if (modalShow) {
      setModalVisible(modalShow);
      const timeout = setTimeout(() => {
        hideModal();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [modalShow]);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
            //   style={[styles.button, styles.buttonClose]}
              onPress={hideModal}>
              <Image
                  style={styles.successImg}
                  source={require('../../../assets/success.png')}
                />
            </Pressable>
            <Text style={styles.modalText}>{message}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
    margin: 10
  },
  successImg: {
    width: 50,
    height: 50
  }
});

export default SweetSuccessAlert;

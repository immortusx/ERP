import React, { useState } from 'react';
import { Modal, StyleSheet, View, Pressable, Image, Text } from 'react-native';
import CustomRadioButton from './subCom/CustomRadioButton';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/slice/LanguageSlice';

const LanguageOptions = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state) => state.language.language);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(currentLanguage);

  const options = ['English', 'Gujarati'];

  const handleSelect = (option) => {
    dispatch(setLanguage(option));
    setSelectedOption(option);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setModalVisible(true)}>
        <Image source={require('../../assets/languagess.png')} style={styles.languageImage} />
      </Pressable>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Select Languages</Text>
            </Pressable>
            <CustomRadioButton
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    languageImage: {
      width: 25,
      height: 25,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end', // Adjust as needed
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      backgroundColor: 'white',
      padding: 25,
      alignItems: 'center',
      borderRadius: 20,
      width: '100%', // Adjust the width as needed
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeText: {
      textAlign: 'center',
      marginBottom: 10,
      color: 'black', 
      fontWeight: 'bold',
    },
  });
  

export default LanguageOptions;

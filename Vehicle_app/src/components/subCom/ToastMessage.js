import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

const ToastMessage = ({message, visible, duration = 3000, onClose}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          hideToast();
        }, duration);
      });
    }
  }, [visible]);

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (onClose) {
        onClose();
      }
    });
  };

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10
  },
  message: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ToastMessage;

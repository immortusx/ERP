import {StyleSheet, View, Image} from 'react-native'; // Import Image from react-native
import React, {useState, useCallback, useEffect} from 'react';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';

const WhatsappChat = () => {
  const route = useRoute();
  const {data} = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: data.enquiry_id,
        text: 'Hello',
        createdAt: new Date(),
        user: {
          _id: 2,
        },
      },
    ]);
  }, []);

  const onSend = async (messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const whatsappMessage = messages[0].text;
    const customerPhoneNumber = data.phone_number;
    console.log(customerPhoneNumber, 'customerPhoneNumber');

    try {
      const url = `${API_URL}/api/whatsapp-messages/send-message-customer`;
      console.log('Sending WhatsApp message to:', url);
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token ? token : '',
        },
      };
      const data = {
        whatsapp_message: whatsappMessage,
        customerPhoneNumber: customerPhoneNumber,
      }
      await axios.post(url, data, config).then((response)=> {
        if(response.data){
          console.log(response.data.result, 'message send response')
        }
      })
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  };

  const renderAvatar = props => {
    return (
      <View>
        <View style={styles.avatar}>
          <Image
            source={require('../../assets/salesperson.png')}
            style={{width: 50, height: 50, borderRadius: 25}}
          />
        </View>
      </View>
    );
  };
  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'lightgray',
          },
          right: {
            backgroundColor: 'lightgray',
          },
        }}
        textStyle={{
          left: {
            color: 'black',
          },
          right: {
            color: 'black',
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: data.enquiry_id,
        }}
        renderAvatar={props => renderAvatar(props)}
        renderBubble={renderBubble}
        ren
        alwaysShowSend
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  avatar: {
    backgroundColor: 'lightblue',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default WhatsappChat;

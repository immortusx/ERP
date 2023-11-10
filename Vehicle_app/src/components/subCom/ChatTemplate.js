import { StyleSheet, View, Image } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import axios from 'axios';

const ChatTemplate = ({chatID}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const sendMessage = async(message) => {
    // Use the 'message' parameter for the most recent message
    const recentMessage = message[0];
    console.log('Sending message:', recentMessage.text);
    const url = `${API_URL}/api/whatsapp-messages/send-message`;
        console.log('get assigned person', url);
        const token = await AsyncStorage.getItem('rbacToken');
        const config = {
          headers: {
            token: token ? token : '',
          },
        };
        const data = {
            chatID: chatID,
            newMessage: recentMessage.text,
        }
        setLoading(true);
        console.log(config);
        await axios.post(url, data, config).then(response => {
          if (response) {
            console.log(response.data.result, 'message sent');
          }
        });
        setLoading(false);
  };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello',
        createdAt: new Date(),
        user: {
          _id: 2,
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    sendMessage(newMessages);
  }, []);

  const renderAvatar = (props) => {
    return (
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../../assets/salesperson.png')}
          style={styles.avatar}
        />
      </View>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
          right: {
            backgroundColor: '#3498db',
          },
        }}
        textStyle={{
          left: {
            color: '#333',
          },
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 2,
        }}
        renderAvatar={(props) => renderAvatar(props)}
        renderBubble={renderBubble}
        alwaysShowSend
        placeholder="Type your message..."
        isTyping={false}
        renderUsernameOnMessage
        scrollToBottom
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAFAF1',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default ChatTemplate;

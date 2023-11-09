import {StyleSheet, View, Image} from 'react-native'; // Import Image from react-native
import React, {useState, useCallback, useEffect} from 'react';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';

const WhatsappChat = () => {
  const route = useRoute();
  const {data} = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log(data, 'sdhskfjdijhttlifjucvmjn');
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

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const renderAvatar = props => {
    return (
      <View >
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
      <Bubble {...props}
      wrapperStyle={{
        left:{
            backgroundColor: 'lightgray',
        },
        right:{
            backgroundColor: 'lightgray',
        }
      }}
      textStyle={{
        left:{
            color:"black"
        },
        right:{
            color:"black"
        }
      }}
      />

    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
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
    width:50,
    height:50,
    borderRadius:25
  },
});

export default WhatsappChat;

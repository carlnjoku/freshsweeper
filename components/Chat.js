import React, { useContext, useEffect, useState, useRef } from 'react';
import GiftedChat from 'react-native-gifted-chat';

export const Chat = () => {
  const [messages, setMessages] = useState([]);

  const onSend = (messages) => {
    firebase.database().ref('messages').push(messages);
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
    />
  );
};

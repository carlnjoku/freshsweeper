// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   View,
// } from 'react-native';
// import { GiftedChat, Bubble } from 'react-native-gifted-chat';
// import { getDatabase, ref, get, update, onValue, off } from 'firebase/database';
// import COLORS from '../constants/colors';
// import { AuthContext } from '../context/AuthContext';
// import userService from '../services/userService';



// export default function ChatConversation1({ navigation, route }) {
//   const PAGE_SIZE = 20; // Number of messages to load per page
//   const { currentUser } = useContext(AuthContext);
//   const { fbaseUser, selectedUser, friendIndex } = route.params;

//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
//   const [selectedUserExpoToken, setSelectedUserExpoToken] = useState('');
//   const [lastLoadedMessageKey, setLastLoadedMessageKey] = useState(null);

//   const database = getDatabase();

//   // Fetch the selected user's notification token
//   const fetchUserExpoToken = async () => {
//     try {
//       const response = await userService.getUser(selectedUser.userId);
//       setSelectedUserExpoToken(response.data.expo_push_token);
//     } catch (error) {
//       console.error('Error fetching user token:', error);
//     }
//   };

//   // Fetch messages with pagination
//   const fetchMessages = useCallback(
//     async (loadEarlier = false) => {
//       if (loading) return;
//       setLoading(true);

//       const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}/messages`);
//       const snapshot = await get(chatroomRef);

//       if (snapshot.exists()) {
//         const messagesData = snapshot.val();
//         const messagesArray = Object.entries(messagesData || {}).map(([key, value]) => ({
//           ...value,
//           _id: key,
//         }));

//         const sortedMessages = messagesArray.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );

//         const newMessages = loadEarlier
//           ? sortedMessages.slice(lastLoadedMessageKey, lastLoadedMessageKey + PAGE_SIZE)
//           : sortedMessages.slice(0, PAGE_SIZE);

//         setMessages((prevMessages) =>
//           loadEarlier ? GiftedChat.prepend(prevMessages, newMessages) : newMessages
//         );

//         setLastLoadedMessageKey(lastLoadedMessageKey + PAGE_SIZE);
//       }

//       setLoading(false);
//     },
//     [database, lastLoadedMessageKey, selectedUser.chatroomId, loading]
//   );

//   useEffect(() => {
//     fetchMessages();
//     fetchUserExpoToken();

//     const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}`);
//     const unsubscribe = onValue(chatroomRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         if (data.messages) {
//           const sortedMessages = Object.entries(data.messages)
//             .map(([key, value]) => ({
//               ...value,
//               _id: key,
//             }))
//             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//           setMessages(sortedMessages.slice(0, PAGE_SIZE));
//         }
//       }
//     });

//     return () => off(chatroomRef);
//   }, [database, selectedUser.chatroomId]);

//   // Custom renderBubble function
//   const renderBubble = (props) => {
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           left: {
//             backgroundColor: '#f0f0f0', // Color for receiver's message
//             alignItems: 'flex-start',  // Align messages on the left
//           },
//           right: {
//             backgroundColor: '#0078fe', // Color for sender's message
//             alignItems: 'flex-end',    // Align messages on the right
//           },
//         }}
//         textStyle={{
//           left: {
//             color: '#000', // Text color for receiver
//           },
//           right: {
//             color: '#fff', // Text color for sender
//           },
//         }}
//       />
//     );
//   };


//   const onSend = (newMessages = []) => {
//     setMessages((previousMessages) =>
//       GiftedChat.append(previousMessages, newMessages)
//     );
//   };


// //   const onSend = async (newMessages = []) => {
// //     const message = newMessages[0];
// //     const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}`);
// //     const snapshot = await get(chatroomRef);

// //     const messagesData = snapshot.val()?.messages || [];
// //     const updatedMessages = [
// //       ...messagesData,
// //       {
// //         text: message.text,
// //         sender: fbaseUser.userId,
// //         createdAt: new Date(),
// //       },
// //     ];

// //     await update(chatroomRef, { messages: updatedMessages });

// //     setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
// //   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* <GiftedChat
//         messages={messages}
//         onSend={(messages) => onSend(messages)}
//         user={{
//           _id: fbaseUser.userId,
//           name: fbaseUser.firstname,
//           avatar: fbaseUser.avatar,
//         }}
//         loadEarlier={true}
//         onLoadEarlier={() => fetchMessages(true)}
//         isLoadingEarlier={isLoadingEarlier}
//       /> */}

//         <GiftedChat
//         messages={messages}
//         onSend={(messages) => onSend(messages)}
//         user={{
//             _id: 1, // ID of the current user
//         }}
//         renderBubble={renderBubble} // Apply the custom bubble styling
//         />
//       {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
// });



import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { getDatabase, ref, get, update, onValue, off } from 'firebase/database';
import COLORS from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';

export default function ChatConversation1({ navigation, route }) {
  const PAGE_SIZE = 20; // Number of messages to load per page
  const { currentUser } = useContext(AuthContext);
  const { fbaseUser, selectedUser } = route.params;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserExpoToken, setSelectedUserExpoToken] = useState('');
  const [lastLoadedMessageKey, setLastLoadedMessageKey] = useState(null);

  const database = getDatabase();

  // Fetch the selected user's notification token
  const fetchUserExpoToken = async () => {
    try {
      const response = await userService.getUser(selectedUser.userId);
      setSelectedUserExpoToken(response.data.expo_push_token);
    } catch (error) {
      console.error('Error fetching user token:', error);
    }
  };

  // Fetch messages with pagination
  const fetchMessages = useCallback(
    async (loadEarlier = false) => {
      if (loading) return;
      setLoading(true);

      const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}/messages`);
      const snapshot = await get(chatroomRef);

      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const messagesArray = Object.entries(messagesData || {}).map(([key, value]) => ({
          ...value,
          _id: key,
        }));

        const sortedMessages = messagesArray.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const newMessages = loadEarlier
          ? sortedMessages.slice(lastLoadedMessageKey, lastLoadedMessageKey + PAGE_SIZE)
          : sortedMessages.slice(0, PAGE_SIZE);

        setMessages((prevMessages) =>
          loadEarlier ? GiftedChat.prepend(prevMessages, newMessages) : newMessages
        );

        setLastLoadedMessageKey(loadEarlier ? lastLoadedMessageKey + PAGE_SIZE : PAGE_SIZE);
      }

      setLoading(false);
    },
    [database, lastLoadedMessageKey, selectedUser.chatroomId, loading]
  );

  useEffect(() => {
    fetchMessages();
    fetchUserExpoToken();

    const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}`);
    const unsubscribe = onValue(chatroomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.messages) {
          const sortedMessages = Object.entries(data.messages)
            .map(([key, value]) => ({
              ...value,
              _id: key,
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setMessages(sortedMessages.slice(0, PAGE_SIZE));
        }
      }
    });

    return () => off(chatroomRef);
  }, [database, selectedUser.chatroomId]);

  // Custom bubble styling for sender and receiver
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#f0f0f0', // Receiver's bubble color
        },
        right: {
          backgroundColor: '#0078fe', // Sender's bubble color
        },
      }}
      textStyle={{
        left: {
          color: '#000', // Receiver's text color
        },
        right: {
          color: '#fff', // Sender's text color
        },
      }}
    />
  );

  // Handle sending a message
  const onSend = async (newMessages = []) => {
    const message = newMessages[0];
    const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}/messages`);
    const newMessageKey = ref(database).push().key;

    const newMessage = {
      text: message.text,
      sender: fbaseUser.userId,
      createdAt: new Date().toISOString(),
    };

    const updates = {};
    updates[newMessageKey] = newMessage;

    await update(chatroomRef, updates);

    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  };

  return (
    <SafeAreaView style={styles.container}> 
      {/* <StatusBar translucent backgroundColor="transparent" /> */}
      <StatusBar
        barStyle="light-content" // Use "light-content" for light text
        backgroundColor={COLORS.primary} // Replace with your preferred background color
        translucent={false} // Prevent transparency
      />
        
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: fbaseUser.userId,
          name: fbaseUser.firstname,
          avatar: fbaseUser.avatar,
        }}
        loadEarlier={true}
        onLoadEarlier={() => fetchMessages(true)}
        isLoadingEarlier={loading}
        renderBubble={renderBubble} // Apply the custom bubble styling
      />
      {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
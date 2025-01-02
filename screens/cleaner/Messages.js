import { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '../../components/Text';

import {
  get,
  ref,
  set,
  onValue,
  off,
  push,
  update,
  onChildAdded
} from 'firebase/database';
import { db } from '../../firebase/config';
import COLORS from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import ROUTES from '../../constants/routes';
import { MaterialCommunityIcons,Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

const Messages = ({navigation}) => {

  const listRef = useRef(null);
  const{currentUserId} = useContext(AuthContext)
  const{
    fbaseUser,
    setTotalUnreadCount
  } = useContext(AuthContext)

  const[friendsWithLastMessagesUnread, setFriendsWithLastMessagesUnreadCount] = useState([]);
  

  console.log("Greatness..........")
  // console.log(JSON.stringify(friendsWithLastMessagesUnread, null, 2))
  console.log("Greatness2..........")

 
  
  
  

  useEffect(() => {
    const friendsRef = ref(db, `users/${currentUserId}/friends`);
  
    // Function to handle real-time updates
    const handleFriendsUpdate = async (snapshot) => {
      if (snapshot.exists()) {
        const friendsData = snapshot.val();
        const friendsArray = Object.values(friendsData) || [];
        const updatedFriendsWithMessages = [];
  
        for (const friend of friendsArray) {
          const chatroomId = friend.chatroomId;
          const chatroomRef = ref(db, `chatrooms/${chatroomId}`);
          const chatroomSnapshot = await get(chatroomRef);
          const chatroomData = chatroomSnapshot.val();
  
          if (chatroomData && chatroomData.messages) {
            const lastMsg = chatroomData.messages[chatroomData.messages.length - 1];
            const lastmessage = {
              text: lastMsg ? lastMsg.text : null,
              sender: lastMsg ? lastMsg.sender : null,
              createdAt: lastMsg ? lastMsg.createdAt : null,
            };
  
            const updatedFriend = { ...friend, lastmessage };
  
            // Fetch unread message count
            const unreadRef = ref(db, `unreadMessages/${chatroomId}/${currentUserId}/${friend.userId}`);
            const unreadSnapshot = await get(unreadRef);
            const unreadCount = unreadSnapshot.val() || 0;
            updatedFriend.unreadCount = unreadCount;
  
            updatedFriendsWithMessages.push(updatedFriend);
          }
        }
  
        // Sort the friends based on the createdAt timestamp of the last message
        updatedFriendsWithMessages.sort((a, b) => {
          if (!a.lastmessage || !a.lastmessage.createdAt) return 1; // Put friend without last message at the bottom
          if (!b.lastmessage || !b.lastmessage.createdAt) return -1; // Put friend without last message at the bottom
          return new Date(b.lastmessage.createdAt) - new Date(a.lastmessage.createdAt);
        });
  
        // Update state with sorted and processed datas
        setFriendsWithLastMessagesUnreadCount(updatedFriendsWithMessages);
  
        // Calculate the total sum of unread message counts from all friends
        const totalUnreadCount = updatedFriendsWithMessages.reduce((total, friend) => {
          return total + friend.unreadCount;
        }, 0);
  
        setTotalUnreadCount(totalUnreadCount);
      }
    };
  
    // Set up the listener
    const unsubscribe = onValue(friendsRef, handleFriendsUpdate);
  
    // Cleanup the listener
    return () => {
      off(friendsRef);
      unsubscribe(); // Ensure listener is removed
    };
  }, [currentUserId, setFriendsWithLastMessagesUnreadCount, setTotalUnreadCount]);
  


  const truncateString = (str) => {
    // Define the maximum length allowed for the string
    const maxLength = 40;

    // Check if the string length is greater than the maximum length
    if (str.length > maxLength) {
        // Truncate the string to 47 characters and append an ellipsis
        return str.slice(0, maxLength - 3) + '...';
    }

    // If the string length is within the maximum length, return the string as is
    return str;
};


  const singleItem = (item, index) => (
        
    <TouchableOpacity style={styles.categoryBtn} 
      onPress={() => navigation.navigate(ROUTES.cleaner_chat_conversation, {
        selectedUser:item,
        fbaseUser: fbaseUser,
        schedule: item.schedule,
        friendIndex: index
      })}
    >


    <View style={{flexDirection: 'row', paddingVertical:10, paddingHorizontal:10}}>
        <View style={{flex: 0.15}}>
            {/* <Image source={{uri:item.avata}} style={styles.icon_url_style} /> */}
                {item.avatar ? 
                    <Image 
                        source={{uri:item.avatar}}
                        style={{height:50, width:50, borderRadius:25, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
                    />
                    :

                    <Image
                        size={50}
                        source={require('../../assets/default_avatar.png')}
                        style={{height:50, width:50, borderRadius:25, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
                    />
                }
        
        </View>
        <View style={{flex: 0.8}}>
            <Text bold style={{marginLeft:10, fontSize:15, color:COLORS.secondary}}>{item.firstname} {item.lastname}</Text>
            <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.schedule?.apartment_name}</Text>
            <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}><MaterialCommunityIcons name="calendar" size={14} color={COLORS.gray} /> {moment(item.schedule?.cleaning_date).format('ddd MMM D')}   {moment(item.schedule?.cleaning_time, 'h:mm:ss A').format('h:mm A')}</Text>
            

            {item.lastmessage?.text && (
              <Text style={{ marginLeft: 10, fontSize: 13, color: COLORS.gray, fontStyle:'italic' }}>
                {item.lastmessage?.sender !== currentUserId ? "" : 
                  <>
                  {item.unreadCount < 1 && item.lastmessage?.sender === currentUserId ? <Ionicons name="checkmark-done" size={16} color= {COLORS.primary} />: <Ionicons name="checkmark-done" size={16} color= {COLORS.gray} /> } 
                  </>
                }

                {truncateString(item.lastmessage.text)}
        
              </Text>
            )}
        </View>
    
        {/* {item.label==="Notifications" ? <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}></Text></View> : <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}>  {item.value}</Text></View>} */}
        <View style={{flex: 0.19, alignItems: 'flex-end'}}>
          <Text style={{fontSize:11}}>{moment(item.lastmessage?.createdAt).format('h:mm A')} </Text>
          {item.unreadCount > 0 && 
          <View style={styles.circle}>
            <Text style={styles.number}>{item.unreadCount}</Text>
          </View>
          }
        </View>
    </View>
      
    </TouchableOpacity>
  )


  const itemSeparator = () => (
    
    <View style={styles.item_separator}></View>
  )
  const emptyListing = () => (
    <View style={styles.empty_listing}><Text>No sub category found</Text></View>
  )

  return (
    
    <SafeAreaView>
      <StatusBar translucent backgroundColor="transparent" />
    
    <FlatList 
        data = {friendsWithLastMessagesUnread}
        // renderItem={({ item, index }) => singleItem(item, index)}
        renderItem={({ item, index }) => singleItem(item, index)} 
        // renderItem={singleItem}
        ListEmptyComponent= {emptyListing}
        ItemSeparatorComponent={itemSeparator}
        keyExtractor={recommended_cleaners=> recommended_cleaners._id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
    /> 
    </SafeAreaView>
  );
};

export default Messages;


const styles = StyleSheet.create({
  container:{
      margin:15
  },
  item_separator : {
      marginTop:5,
      marginBottom:5,
      height:1,
      width:"100%",
      backgroundColor:"#E4E4E4",
      },
    empty_listing: {
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      marginTop:'50%'
    },
    circle: {
      minWidth: 20,
      minHeight: 20,
      borderRadius: 10,
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    number: {
      fontSize: 11,
      color: 'white',
    },
})




// import { useEffect, useState, useContext, useRef } from 'react';
// import { SafeAreaView, StyleSheet, FlatList, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
// import Text from '../../components/Text';
// import { get, ref } from 'firebase/database';
// import { db } from '../../firebase/config';
// import COLORS from '../../constants/colors';
// import { AuthContext } from '../../context/AuthContext';
// import ROUTES from '../../constants/routes';
// import { Ionicons } from '@expo/vector-icons';
// import moment from 'moment';
// import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused

// const Messages = ({ navigation }) => {
//   const listRef = useRef(null);
//   const { currentUserId } = useContext(AuthContext);
//   const [friendsWithLastMessagesUnread, setFriendsWithLastMessagesUnreadCount] = useState([]);
//   const [totalUnreadCount, setTotalUnreadCount] = useState(0);
//   const isFocused = useIsFocused(); // Track screen focus

//   const truncateString = (str) => {
//     const maxLength = 40;
//     return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
//   };

//   async function updateFriendsListWithLastMessagesAndUnreadCounts(userId) {
//     try {
//       const friendsRef = ref(db, `users/${userId}/friends`);
//       const friendsSnapshot = await get(friendsRef);
//       const friendsData = friendsSnapshot.val() || {};
//       const userFriends = Object.values(friendsData) || [];

//       const updatedFriendsWithMessages = [];

//       for (const friend of userFriends) {
//         const chatroomId = friend.chatroomId;
//         const chatroomRef = ref(db, `chatrooms/${chatroomId}`);
//         const chatroomSnapshot = await get(chatroomRef);
//         const chatroomData = chatroomSnapshot.val();

//         if (chatroomData && chatroomData.messages) {
//           const lastMsg = chatroomData.messages[chatroomData.messages.length - 1];
//           const lastmessage = {
//             text: lastMsg ? lastMsg.text : null,
//             sender: lastMsg ? lastMsg.sender : null,
//             createdAt: lastMsg ? lastMsg.createdAt : null,
//           };

//           const updatedFriend = { ...friend, lastmessage };

//           const unreadRef = ref(db, `unreadMessages/${chatroomId}/${userId}/${friend.userId}`);
//           const unreadSnapshot = await get(unreadRef);
//           const unreadCount = unreadSnapshot.val() || 0;
//           updatedFriend.unreadCount = unreadCount;

//           updatedFriendsWithMessages.push(updatedFriend);
//         }
//       }

//       updatedFriendsWithMessages.sort((a, b) => {
//         if (!a.lastmessage || !a.lastmessage.createdAt) return 1;
//         if (!b.lastmessage || !b.lastmessage.createdAt) return -1;
//         return new Date(b.lastmessage.createdAt) - new Date(a.lastmessage.createdAt);
//       });

//       setFriendsWithLastMessagesUnreadCount(updatedFriendsWithMessages);

//       const totalUnreadCount = updatedFriendsWithMessages.reduce((total, friend) => total + friend.unreadCount, 0);
//       setTotalUnreadCount(totalUnreadCount);
//     } catch (error) {
//       console.error('Error updating friends list:', error);
//     }
//   }

//   useEffect(() => {
//     if (isFocused) {
//       updateFriendsListWithLastMessagesAndUnreadCounts(currentUserId); // Reload function on screen focus
//     }
//   }, [isFocused]);

//   const singleItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.categoryBtn}
//       onPress={() =>
//         navigation.navigate(ROUTES.cleaner_chat_conversation, {
//           selectedUser: item,
//           schedule: item.schedule,
//         })
//       }
//     >
//       <View style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10 }}>
//         <View style={{ flex: 0.15 }}>
//           {item.avatar ? (
//             <Image
//               source={{ uri: item.avatar }}
//               style={{ height: 50, width: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.light_gray_1 }}
//             />
//           ) : (
//             <Image
//               source={require('../../assets/default_avatar.png')}
//               style={{ height: 50, width: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.light_gray_1 }}
//             />
//           )}
//         </View>
//         <View style={{ flex: 0.8 }}>
//           <Text bold style={{ marginLeft: 10, fontSize: 15, color: COLORS.secondary }}>
//             {item.firstname} {item.lastname}
//           </Text>
//           <Text style={{ marginLeft: 10, fontSize: 13, color: COLORS.gray }}>{item.schedule.apartment_name}</Text>
//           {item.lastmessage.text && (
//             <Text style={{ marginLeft: 10, fontSize: 13, color: COLORS.gray, fontStyle: 'italic' }}>
//               {item.lastmessage.sender !== currentUserId ? null : (
//                 <>
//                   {item.unreadCount < 1 && item.lastmessage.sender === currentUserId ? (
//                     <Ionicons name="checkmark-done" size={16} color={COLORS.primary} />
//                   ) : (
//                     <Ionicons name="checkmark-done" size={16} color={COLORS.gray} />
//                   )}
//                 </>
//               )}
//               {truncateString(item.lastmessage.text)}
//             </Text>
//           )}
//         </View>
//         <View style={{ flex: 0.19, alignItems: 'flex-end' }}>
//           <Text>{moment(item.lastmessage.createdAt).format('h:mm A')} </Text>
//           {item.unreadCount > 0 && (
//             <View style={styles.circle}>
//               <Text style={styles.number}>{item.unreadCount}</Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const itemSeparator = () => <View style={styles.item_separator}></View>;
//   const emptyListing = () => (
//     <View style={styles.empty_listing}>
//       <Text>No sub category found</Text>
//     </View>
//   );

//   return (
//     <View>
//       <FlatList
//         data={friendsWithLastMessagesUnread}
//         renderItem={singleItem}
//         ListEmptyComponent={emptyListing}
//         ItemSeparatorComponent={itemSeparator}
//         keyExtractor={(item) => item._id}
//         numColumns={1}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// export default Messages;

// const styles = StyleSheet.create({
//     container:{
//       margin:15
//   },
//   item_separator : {
//       marginTop:5,
//       marginBottom:5,
//       height:1,
//       width:"100%",
//       backgroundColor:"#E4E4E4",
//       },
//     empty_listing: {
//       display:'flex',
//       justifyContent:'center',
//       alignItems:'center',
//       marginTop:'50%'
//     },
//     circle: {
//       minWidth: 20,
//       minHeight: 20,
//       borderRadius: 10,
//       backgroundColor: COLORS.primary,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     number: {
//       fontSize: 11,
//       color: 'white',
//     },
// });









// import React, { useState, useCallback, useContext } from 'react';
// import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { db } from '../../firebase/config';
// import { ref, onValue, onChildAdded, off, get } from 'firebase/database'; // Firebase Database functions
// import COLORS from '../../constants/colors';
// import moment from 'moment';
// import { Ionicons } from '@expo/vector-icons';
// import { AuthContext } from '../../context/AuthContext';
// import ROUTES from '../../constants/routes';

// const Messages = ({ navigation }) => {
//   const {totalUnreadCount} = useContext(AuthContext)
//   const { currentUserId } = useContext(AuthContext);
//   const { fbaseUser } = useContext(AuthContext);
//   const [friendsWithLastMessagesUnread, setFriendsWithLastMessagesUnread] = useState([]);
//   // const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  
  
//   const truncateString = (str) => {
//     // Define the maximum length allowed for the string
//     const maxLength = 40;

//     // Check if the string length is greater than the maximum length
//     if (str.length > maxLength) {
//         // Truncate the string to 47 characters and append an ellipsis
//         return str.slice(0, maxLength - 3) + '...';
//     }

//     // If the string length is within the maximum length, return the string as is
//     return str;
// };
//   const listenForNewMessages = (userId) => {
//     try {
//       // Reference to the user's friends list
//       const friendsRef = ref(db, `users/${userId}/friends`);

//       // Fetch all friends
//       onValue(friendsRef, async (friendsSnapshot) => {
//         const friendsData = friendsSnapshot.val() || {};
//         const userFriends = Object.values(friendsData);

//         const updatedFriendsWithMessages = [];

//         for (const friend of userFriends) {
//           const chatroomId = friend.chatroomId;
//           const messagesRef = ref(db, `chatrooms/${chatroomId}/messages`);

//           // Listen for new messages in the chatroom
//           onChildAdded(messagesRef, (snapshot) => {
//             const newMessage = snapshot.val();
           
//             if (newMessage) {
//               const lastmessage = {
//                 text: newMessage.text,
//                 sender: newMessage.sender,
//                 createdAt: newMessage.createdAt,
//               };

//               const updatedFriend = { ...friend, lastmessage };

//               // Optional: Fetch unread count
//               const unreadRef = ref(db, `unreadMessages/${chatroomId}/${userId}/${friend.userId}`);
//               get(unreadRef).then((unreadSnapshot) => {
//                 const unreadCount = unreadSnapshot.val() || 0;
//                 updatedFriend.unreadCount = unreadCount;

//                 // Update state
//                 updatedFriendsWithMessages.push(updatedFriend);

//                 // Sort the friends list and update state
//                 updatedFriendsWithMessages.sort((a, b) => {
//                   if (!a.lastmessage || !a.lastmessage.createdAt) return 1;
//                   if (!b.lastmessage || !b.lastmessage.createdAt) return -1;
//                   return new Date(b.lastmessage.createdAt) - new Date(a.lastmessage.createdAt);
//                 });

//                 setFriendsWithLastMessagesUnread([...updatedFriendsWithMessages]);

//                 // Calculate the total sum of unread message counts from all friends
//                 const totalUnreadCount = updatedFriendsWithMessages.reduce((total, friend) => {
//                   return total + friend.unreadCount;
//                 }, 0);

//                 // setTotalUnreadCount(totalUnreadCount)
      
      
//               });
//             }
//           });
//         }
//       });
//     } catch (error) {
//       console.error("Error listening for new messages:", error);
//     }
//   };

//   // Start listening when the screen is focused
//   useFocusEffect(
//     useCallback(() => {
//       listenForNewMessages(currentUserId);

//       // Cleanup listener on unmount
//       return () => {
//         off(ref(db, `users/${currentUserId}/friends`));
//       };
//     }, [currentUserId])
//   );

//   // Single list item for FlatList
//   const singleItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.categoryBtn}
//       onPress={() =>
//         navigation.navigate(ROUTES.cleaner_chat_conversation, {
//           selectedUser: item,
//           fbaseUser: fbaseUser,
//           schedule: item.schedule,
//         })
//       }
//     >
//       <View style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10 }}>
//         <View style={{ flex: 0.15 }}>
//           {item.avatar ? (
//             <Image
//               source={{ uri: item.avatar }}
//               style={{ height: 50, width: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.light_gray_1 }}
//             />
//           ) : (
//             <Image
//               source={require('../../assets/default_avatar.png')}
//               style={{ height: 50, width: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.light_gray_1 }}
//             />
//           )}
//         </View>
//         <View style={{ flex: 0.8 }}>
//           <Text bold style={{ marginLeft: 10, fontSize: 15, color: COLORS.secondary }}>
//             {item.firstname} {item.lastname}
//           </Text>
//           <Text style={{ marginLeft: 10, fontSize: 13, color: COLORS.gray }}>{item.schedule.apartment_name}</Text>
//           {item.lastmessage.text && (
//             <Text style={{ marginLeft: 10, fontSize: 13, color: COLORS.gray, fontStyle: 'italic' }}>
//               {item.lastmessage.sender !== currentUserId ? null : (
//                 <>
//                   {item.unreadCount < 1 && item.lastmessage.sender === currentUserId ? (
//                     <Ionicons name="checkmark-done" size={16} color={COLORS.primary} />
//                   ) : (
//                     <Ionicons name="checkmark-done" size={16} color={COLORS.gray} />
//                   )}
//                 </>
//               )}
//               {truncateString(item.lastmessage.text)}
//             </Text>
//           )}
//         </View>
//         <View style={{ flex: 0.19, alignItems: 'flex-end' }}>
//           <Text>{moment(item.lastmessage.createdAt).format('h:mm A')} </Text>
//           {item.unreadCount > 0 && (
//             <View style={styles.circle}>
//               <Text style={styles.number}>{item.unreadCount}</Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   // Empty list component
//   const emptyListing = () => (
//     <View style={styles.emptyContainer}>
//       <Text style={styles.emptyText}>No messages available</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={friendsWithLastMessagesUnread}
//         renderItem={singleItem}
//         ListEmptyComponent={emptyListing}
//         keyExtractor={(item) => item._id || item.chatroomId}
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//         numColumns={1}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// export default Messages;

// // Styles
// const styles = StyleSheet.create({
//       container:{
//       margin:15
//   },
//   item_separator : {
//       marginTop:5,
//       marginBottom:5,
//       height:1,
//       width:"100%",
//       backgroundColor:"#E4E4E4",
//       },
//     empty_listing: {
//       display:'flex',
//       justifyContent:'center',
//       alignItems:'center',
//       marginTop:'50%'
//     },
//     circle: {
//       minWidth: 20,
//       minHeight: 20,
//       borderRadius: 10,
//       backgroundColor: COLORS.primary,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     number: {
//       fontSize: 11,
//       color: 'white',
//     },
// });










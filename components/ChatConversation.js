import {getDatabase, get, set, push, ref, onValue, off,orderByKey, update} from 'firebase/database';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { SafeAreaView,StyleSheet, Pressable, StatusBar, Linking, FlatList, ScrollView, Modal, Image, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import COLORS from '../constants/colors';
import { GiftedChat, SystemMessage, Send, Bubble, Avatar, MessageText, InputToolbar } from 'react-native-gifted-chat';
// import CustomSystemMessage from './CustomSystemMessage';
import moment from 'moment';
import ROUTES from '../constants/routes';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Ionicons for the check icon
import { IosAlertStyle } from 'expo-notifications';
import { AuthContext } from '../context/AuthContext';
// import * as ImagePicker from 'expo-image-picker';
import ImagePicker from 'react-native-image-picker';
import { sendPushNotification } from '../utils/sendPushNotification';
// import { renderInputToolbar } from './RenderInputToolbar';
import userService from '../services/userService';

export default function ChatConversation({navigation,route}) {

    const PAGE_SIZE = 20; // Define your desired page size
    const {updateMessageList} = useContext(AuthContext)
    const {currentUser, currentUserId} = useContext(AuthContext)

    const{fbaseUser, selectedUser, schedule, friendIndex} = route.params
    
    const[messages, setMessages] = useState([])
    const[loading, setLoading] = useState(false);
    const[page, setPage] = useState(1); // State variable to track page number
    const[isLoadingEarlier, setIsLoadingEarlier] = useState(false);
    const[currentPage, setCurrentPage] = useState(1);
    const[selectedUserExpoToken, setSelectedUserExpoToken] = useState("");
 
    console.log("_____loggggggggg_____")
    // console.log(selectedUser)
    // console.log(JSON.stringify(selectedUser, null, 2))

    console.log("Received params in chat_conversation:", route.params);
    console.log("_____1188___")

    const pickImage = () => {
      const options = {
          title: 'Select Image',
          storageOptions: {
              skipBackup: true,
              path: 'images',
          },
      };
  
      ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
              console.log('User cancelled image picker');
          } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
          } else {
              // If an image is selected, send it as a message
              const imageMessage = {
                  _id: Math.random().toString(),
                  createdAt: new Date(),
                  user: {
                      _id: fbaseUser.userId,
                      name: fbaseUser.firstname,
                      avatar: fbaseUser.avatar,
                  },
                  image: response.uri, // URI of the selected image
                  // You can add other properties such as text, etc. if needed
              };
  
              // Call the onSend function with the image message
              onSend([imageMessage]);
          }
      });
    };
  

    // useEffect(() => {
    //   const loadData = async () => {
    //     const myChatroom = await fetchMessages();
  
    //     setMessages(renderMessages(myChatroom.messages));

    //     console.log(selectedUser.chatroomId, fbaseUser.userId,  selectedUser.userId)
    //     resetUnreadCount(chatroomId = selectedUser.chatroomId, userId = fbaseUser.userId, friendId = selectedUser.userId)
    //   };
  
    //   loadData();
  
    //   // set chatroom change listener
    //   const database = getDatabase();
    //   const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}`);
    //   onValue(chatroomRef, snapshot => {
    //     const data = snapshot.val();
    //     console.log(data)
    //     setMessages(renderMessages(data.messages));
    //   });
  
    //   return () => {
    //     //remove chatroom listener
    //     off(chatroomRef);
    //   };
    // }, [fetchMessages, renderMessages, selectedUser.chatroomId]);
  

    
  

    useEffect(() => {
      const loadData = async () => {
        const myChatroom = await fetchMessages();
    
        setMessages(renderMessages(myChatroom.messages));
    
        console.log(selectedUser.chatroomId, fbaseUser.userId, selectedUser.userId);
    
        // Reset unread count when the chatroom is loaded
        resetUnreadCount({
          chatroomId: selectedUser.chatroomId,
          userId: fbaseUser.userId,
          friendId: selectedUser.userId,
        });
      };
    
      loadData();
    
      // Set chatroom change listener
      const database = getDatabase();
      const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}`);
    
      const unsubscribe = onValue(chatroomRef, (snapshot) => {
        const data = snapshot.val();
        
          if (data && data.messages) {
            const messages = Object.values(data.messages); // Convert messages object to an array
            const sortedMessages = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt
            const lastMessage = sortedMessages[0]; // Get the most recent message
      
            setMessages(renderMessages(data.messages));
            console.log("Last Message:", lastMessage);
          

          }

          fetchUser()
        });
    
      return () => {
        // Remove chatroom listener
        off(chatroomRef);
      };
    }, [fetchMessages, renderMessages, selectedUser.chatroomId, fbaseUser.userId, selectedUser.userId]);
    
    const incrementUnreadCount = (chatroomId, userId, friendId) => {
        const database = getDatabase();
        const unreadRef = ref(database, `unreadMessages/${chatroomId}/${friendId}/${userId}`);
    
        // Fetch the current unread count
        get(unreadRef)
            .then((snapshot) => {
                const currentCount = snapshot.val() || 0; // Default to 0 if no value exists
                const newCount = currentCount + 1; // Increment the current count
    
                // Update the unread count in the database
                return set(unreadRef, newCount);
            })
            .then(() => {
                console.log("Unread count incremented successfully!");
            })
            .catch((error) => {
                console.error("Error incrementing unread count:", error);
            });
    };
    
    const resetUnreadCount = (chatroomId, userId, friendId) => {
      const database = getDatabase();
      const unreadRef = ref(database, `unreadMessages/${chatroomId}/${userId}/${friendId}`);
      
      // Set the unread count to zero in the database
      set(unreadRef, 0)
          .then(() => {
              console.log("Unread count reset to zero successfully!");
          })
          .catch((error) => {
              console.error("Error resetting unread count:", error);
          });
  };

  // Fetch selected user Expo notification toke 
  const fetchUser = async () => {
    try {
      await userService.getUser(selectedUser.userId).then((response) => {
        const res = response.data;
        alert(res.expo_push_token)
        setSelectedUserExpoToken(res.expo_push_token)
        
      });
    } catch (e) {
      console.log(e);
      
    }
  };
    
    // Custom input toolbar with image attachment button
    // const renderInputToolbar = (props) => {
    //   return (
    //     <InputToolbar {...props}>
    //       <View style={{ flexDirection: 'row', alignItems: 'center', height:60, backgroundColor:'blue' }}>
    //         {/* Add the image attachment icon */}
    //         <TouchableOpacity onPress={() => pickImage(props.onSend)}>
    //           <Text>Button</Text>
    //           <Ionicons name="camera" size={24} color="black" style={{ marginRight: 8 }} />
    //         </TouchableOpacity>
    //         {/* Render the input toolbar */}
    //         {props.children}
    //       </View>
    //     </InputToolbar>
    //   );
    // };

    
    

    const renderMessages = useCallback(
        msgs => {
            return msgs
              ? msgs.reverse().map((msg, index) => {
                  console.log("Current User Emails:", fbaseUser.email);
                  console.log("Current Userid:", fbaseUser.userId);
                  console.log("Message Sender:", msg.sender);
        
                  return {
                    ...msg,
                    _id: index,
                    user: {
                      _id: msg.sender === fbaseUser.userId ? fbaseUser.firstname : selectedUser.firstname,
                      avatar: msg.sender === fbaseUser.userId ? fbaseUser.avatar : selectedUser.avatar,
                      name: msg.sender === fbaseUser.userId ? fbaseUser.userId : selectedUser.userId,
                    },
                    sent: msg.sender === fbaseUser.userId,
                  };
                })
              : [];
          },
    [fbaseUser?.avatar, fbaseUser.userId, selectedUser.avatar, selectedUser.userId]
  );
  
    const fetchMessages = useCallback(async () => {
      const database = getDatabase();
  
      const snapshot = await get(
        ref(database, `chatrooms/${selectedUser.chatroomId}`),
      );
  
      return snapshot.val();
    }, [selectedUser.chatroomId]);



    // const fetchMessages = useCallback(async () => {
    //   const database = getDatabase();
    
    //   // Calculate the start index for pagination
    //   const startIndex = (currentPage - 1) * PAGE_SIZE;
    
    //   // Fetch messages for the current page
    //   const snapshot = await get(
    //     ref(database, `chatrooms/${selectedUser.chatroomId}`)
    //     .orderByChild('createdAt') // Assuming 'createdAt' is the field representing message timestamp
    //     // .limitToLast(PAGE_SIZE), // Fetch the last N messages
    //   );
    
    //   return snapshot.val();
    // }, [currentPage, selectedUser.chatroomId]);
  
    
    // const onLoadEarlier = useCallback(async () => {
    //   setIsLoadingEarlier(true);
    
    //   // Increment the current page number
    //   setCurrentPage(prevPage => prevPage + 1);
    // }, []);


//     const fetchMessages = async () => {
//       setLoading(true);
//       const database = getDatabase();

      
        
//       // const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}`);
//       // const snapshot = await get(orderByKey(chatroomRef));

//       const snapshot = await get(orderByKey(ref(database, `chatrooms/${selectedUser.chatroomId}/messages`)));  
//       const messagesData = snapshot.val();
//       console.log("snappppppppppppppppppp")
//       console.log(messagesData)
//       console.log("snappppppppppppppppppp")
//       const messagesArray = Object.values(messagesData).reverse(); // Reverse messages array
//       setMessages(prevMessages => [...messagesArray, ...prevMessages]); // Append new messages to existing messages
//       setLoading(false);
//   };
    
//   const loadMoreMessages = () => {
//     setPage(prevPage => prevPage + 1); // Increment page number
// };

    const onSend = useCallback(
      async (msg = []) => {
        //send the msg[0] to the other user
        const database = getDatabase();

        //fetch fresh messages from server
        const currentChatroom = await fetchMessages();
  
        const lastMessages = currentChatroom.messages || [];
  
        update(ref(database, `chatrooms/${selectedUser.chatroomId}`), {
          messages: [
            ...lastMessages,
            {
              text: msg[0].text,
              sender: fbaseUser.userId,
              createdAt: new Date(),
            },
          ],
        });

    
          // Update the friend's entry
          
          const friendRef = ref(database, `users/${selectedUser.userId}/friends/${friendIndex}`);
          update(friendRef, {
            lastmessage: {
              text:msg[0].text,
              createdAt: new Date()
            },
            unreadCount: 0, // Reset unread count if this user is active in chat
          })
        .then(() => console.log("Last message updated successfully"))
        .catch((error) => console.error("Error updating last message:", error));
          
        // Update current user friend's entry
        const friendRefCurrentUser = ref(database, `users/${fbaseUser.userId}/friends/${friendIndex}`);
          update(friendRefCurrentUser, {
            lastmessage: {
              text:msg[0].text,
              createdAt: new Date()
            },
            unreadCount: 0, // Reset unread count if this user is active in chat
          })
        .then(() => console.log("Last message updated successfully"))
        .catch((error) => console.error("Error updating last message:", error));

        

        incrementUnreadCount(selectedUser.chatroomId, fbaseUser.userId, selectedUser.userId)
        updateMessageList(selectedUser.userId)
        setMessages(prevMessages => GiftedChat.append(prevMessages, msg));
        
        console.log("Schedules", schedule.cleaning_date)

        alert(selectedUserExpoToken)
          // Prepare notification data
        //   const notificationData = {
        //     to: selectedUserExpoToken,
        //     title: msg[0].text,
        //     body: `${currentUser.firstname} ${currentUser.lastname}`,
        //     data: {
        //       screen: ROUTES.chat_conversation,
        //       params: {
        //         senderId: currentUserId,
        //         receiverId: selectedUser.userId,
        //         // selected_scheduleId:schedule._id,
        //         senderFirstName: currentUser.firstname,
        //         senderLastName: currentUser.lastname,
        //         chatroomId: selectedUser.chatroomId,
                
        //         // sender_expo_push_token: selectedUserExpoToken,
        //       },
        //     },
        //   };
        //   // alert("banta")
        // console.log(notificationData)
        //   // Send push notification
        // await sendPushNotification(
        //   // userService, // Pass user service instance
        //   currentUser.expo_push_token, // For testing, or use item.expo_push_token for the cleaner
        //   notificationData
        // );
          
        const sendExpoPushNotification = async (expoPushToken, title, body, data = {}) => {
          try {
            const response = await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: expoPushToken,  // Receiver's Expo Push Token
                title,              // Notification title
                body,               // Notification body
                data,               // Additional data
              }),
            });
        
            const result = await response.json();
            console.log("Push notification response:", result);
          } catch (error) {
            console.error("Error sending push notification:", error);
          }
        };
        
        // Example usage:
        sendExpoPushNotification(
          selectedUserExpoToken, // Replace with a valid Expo Push Token
          currentUser.firstname+" "+currentUser.lastname,
          msg[0].text,
          {
            screen: ROUTES.host_messages,
            params: {
              selectedUser:selectedUser,
              fbaseUser: fbaseUser,
              schedule: schedule,
              friendIndex: friendIndex
            },
          }

        );

      },
      [fetchMessages, fbaseUser.email, selectedUser.chatroomId],
    );

    // Schedules {"address": "290 Ferry Street, Newark, NJ, USA", "apartment_latitude": 40.7290123, "apartment_longitude": -74.15108649999999, "apartment_name": "Cozy &Beautiful Apartment", "aptId": "676243f08e5acab7ecc540f5", "bathroom": "0", "bedroom": "0", "cleaning_date": "2024-12-19", "cleaning_time": "00:00:00", "regular_cleaning_fee": 65, "regular_cleaning_time": 120, "selected_apt_room_type_and_size": [{"number": 3, "size": 200, "size_range": "Medium", "type": "Bedroom"}, {"number": 1, "size": 190, "size_range": "Medium", "type": "Bathroom"}, {"number": 1, "size": 210, "size_range": "Medium", "type": "Livingroom"}], "totalPrice": "0", "total_cleaning_fee": 65, "total_cleaning_time": 120}
    
    
    const CustomBubble = (props) => {
      const { position, currentMessage } = props;
      console.log("Position:", position); // Check the position prop
      // Check if the message is sent
      const isSent = position === 'right';
    
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', width:'100%' }}>
        <Bubble
            {...props}
            wrapperStyle={{
            right: {
                backgroundColor: '#DCF8C6', // Background color for sent messages
                flexDirection: 'row', // Set flexDirection to row to align icon and bubble
            },
            left: {
                backgroundColor: '#FFFFFF', // Background color for received messages
                flexDirection: 'row', // Set flexDirection to row to align icon and bubble
            },
            }}
        >
        {/* {isSent && currentMessage.sent && ( */}
          <View style={{ marginLeft: 5, alignSelf: 'flex-end' }}> {/* Align icon to bottom-right corner */}
            <Ionicons name="checkmark-done" size={20} color="green" />
          </View>
        {/* )} */}
      </Bubble>
    </View>
      );
    };
    


const renderCustomMessage = ({ currentMessage }) => {
  console.log("cureent.........")
  // console.log(JSON.stringify(currentMessage, null, 2))
  console.log("cureent.........")
    if (currentMessage.system) {
      // Render system message with avatar or logo
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          {/* Render avatar or logo here */}
          <Image
            source={{ uri: currentMessage.user.avatar }}
            size={26} // Adjust size as needed
            style={styles.avatar}
          />
          <View style={styles.automated}>
            <Text bold style={{fontSize:16, fontWeight:'500'}}>Fresh Sweeper</Text>
            <Text style={{ fontStyle: 'italic', color: '#777', marginLeft: 0 }}>
                
                {currentMessage.details.hostFname} {currentMessage.details.hostLname} 
                  sent you {}
                 {currentMessage.text}
                
                
            </Text>
            {currentMessage.status === 'pending' &&
            <View>
                <View style={styles.details}>
                    <Text style={{fontSize:14, fontWeight:'600'}}>{currentMessage.details.selected_schedule.apartment_name}</Text>
                    <Text>{currentMessage.details.selected_schedule.address}</Text>
                    <Text style={{fontSize:12, color:COLORS.gray}}>{currentMessage.details.selected_schedule.cleaning_date} @ {currentMessage.details.selected_schedule.cleaning_time}</Text>
                    <Text style={{fontSize:16}}>$ {currentMessage.price}</Text>
                </View>
                <TouchableOpacity
                style={styles.button}
                onPress = {()=> navigation.navigate(ROUTES.cleaner_schedule_review,{
                    item:currentMessage.details,
                    chatroomId:selectedUser.chatroomId,
                    
                })}
                >
                    <Text style={styles.button_text}>View Details</Text>
                </TouchableOpacity>
                <Text style={{fontSize:10, color:COLORS.light_gray}}>{moment(currentMessage.createdAt).format('h:mm A')}</Text>
            </View>
            }
            {currentMessage.status === 'Accepted' &&
            <View>
                <View style={styles.details}>
                    <Text style={{fontSize:14, fontWeight:'600'}}>{currentMessage.details.selected_schedule.apartment_name}</Text>
                    <Text>{currentMessage.details.selected_schedule.address}</Text>
                    <Text style={{fontSize:12, color:COLORS.gray}}>{currentMessage.details.selected_schedule.cleaning_date} @ {currentMessage.details.selected_schedule.cleaning_time}</Text>
                    <Text style={{fontSize:16}}>$ {currentMessage.details.selected_schedule.total_cleaning_fee}</Text>
                </View>
                <TouchableOpacity
                style={styles.button}
                onPress = {()=> navigation.navigate(ROUTES.host_confirm,{
                    item:currentMessage.details,
                    chatroomId:selectedUser.chatroomId,
                    selectedUser:selectedUser,
                    selectedSchedule:currentMessage.details.selected_schedule,
                    totalPrice:currentMessage.details.selected_schedule.totalPrice,
                    selected_scheduleId:currentMessage.details.selected_scheduleId,
                    assigned_to:currentMessage.details.assigned_to
                })}
                >
                    <Text style={styles.button_text}>Confirm</Text>
                </TouchableOpacity>
                <Text style={{fontSize:10, color:COLORS.light_gray}}>{moment(currentMessage.createdAt).format('h:mm A')}</Text>
            </View>
            }
            </View>
        </View>
      );
    } else {
      // Render regular messages
      return (
        <GiftedChat.Message
          {...currentMessage}
          // Render regular message as default
        />
      );
    }
  };

  const renderSend = (props) => {
    return (
        <Send {...props}>
            <View style={{ marginRight: 10, marginBottom: 10 }}>
                <Ionicons name="send" size={24} color="blue" />
            </View>
        </Send>
    );
};
  
// Custom function to render the input toolbar
const renderInputToolbar = (props) => {
  return (
      <InputToolbar {...props}>
          {/* Add attachment icon or other custom components here if needed */}
          <View style={{ marginRight: 10, marginBottom: 10 }}>
          <TouchableOpacity>
              <Ionicons name="attach" size={24} color="black" style={{ marginRight: 20 }} />
          </TouchableOpacity>
          </View>
          {props.children}
      </InputToolbar>
  );
};
    return (
   
        
         <>
         <StatusBar
            barStyle="light-content" // Use "light-content" for light text
            backgroundColor={COLORS.primary} // Replace with your preferred background color
            translucent={false} // Prevent transparency
          />
        <GiftedChat
          messages={messages}
          onSend={newMessage => onSend(newMessage)}
          // onEndReached={loadMoreMessages} // Load more messages when reaching the end
          // loadEarlier={loading} // Display loading indicator at bottom
        
          user={{
            _id: fbaseUser.userId,
          }}
           renderSend={renderSend}
          // renderInputToolbar={renderInputToolbar}
          renderSystemMessage={renderCustomMessage}
          renderBubble={props => <CustomBubble {...props} />} // Integration of 
          
        />  

      
</>
       
        
    )
  }

  const styles = StyleSheet.create({
    actionBar: {
      backgroundColor: '#cacaca',
      height: 41,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
        width: 36, // Adjust size as needed
        height: 36, // Adjust size as needed
        borderRadius: 20, // Make it circular,
        marginLeft:6
      },
    automated:{
        width:'80%',
        padding:10,
        backgroundColor:COLORS.white,
        marginLeft:10,
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        borderBottomLeftRadius:3,
        borderTopLeftRadius:3,
        marginBottom:2
    },
    button:{
        borderRadius:50,
        paddingVertical:10,
        backgroundColor:COLORS.primary,
        paddingHorizontal:10,
        marginVertical:20
    },
    button_text:{
        color:COLORS.white,
        fontSize:16,
        textAlign:'center'
    },
    details:{
        marginVertical:10,
        backgroundColor:COLORS.primary_light_1,
        padding:20,
        borderRadius:5
    }
  });






  // {
  //   "avatar": "https://firebasestorage.googleapis.com/v0/b/fresh-sweeper.appspot.com/o/profile%2Favatar_663500e61626dbb251d2ed7f.jpeg?alt=media&token=3151fe34-21f8-4f2b-93a9-9b75d79a5090",
  //   "chatroomId": "-O5I1cpQPp8UcUDAoNz7",
  //   "email": "tommy@yahoo.com",
  //   "firstname": "Timmy",
  //   "lastname": "Marqez",
  //   "schedule": "66c5671b68bcc21f304d6656",
  //   "userId": "663500e61626dbb251d2ed7f",
  //   "lastmessage": {
  //     "text": "cleaning resquest!",
  //     "createdAt": 1724748827722
  //   },
  //   "unreadCount": 0
  // }
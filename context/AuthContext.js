import React, {useEffect, useState, createContext} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { updateUserWithExpoPushToken } from 'expo-notifications';
import fetchIPGeolocation from '../googlemap/geolocation';
import {
  get,
  ref,
  set,
  onValue,
  push,
  update,
} from 'firebase/database';
import { db } from '../firebase/config';



export const AuthContext =  createContext();

export const AuthProvider = ({children}) => {

    const[isLoading, setIsLoading] = useState(false)
    const[userToken, setUserToken] = useState(null)
    const[userType, setUserType] = useState(null)
    const[userId, setUserId] = useState(null)
    const[currentUser, setCurrentUser] = useState("")
    const[currentUserId, setCurrentUserId] = useState("")
    const[geolocationData, setGeolocationData] = useState(null);
    const[avatar, setAvatar] = useState("")
    const[currency, setCurrency] = useState("")
    const[fbaseUser, setFbaseUser] = useState("")
    const[totalUnreadCount, setTotalUnreadCount] = useState(0);
    const[friendsWithLastMessagesUnread, setFriendsWithLastMessagesUnreadCount] = useState([]);
    const[applicationCounts, setApplicationCounts] = useState(10);

    // const storeData = async (data) => {

    //     try {
    //       const jsonData = JSON.stringify(data)
    //       await AsyncStorage.setItem('@storage_Key', jsonData)
    //       console.log('Object stored successfully!');
    //       console.log(jsonData);
          
    //     } catch (e) {
    //       // saving error
    //     }
    //   }

    // const login = (loginResp) => {
    //   console.log("Weeeeeeeeeeeepppppppppiiiiiiiing")
    //   console.log(loginResp)
    //   console.log("Weeeeeeeeeeeepppppppppiiiiiiiing")
    //   storeData(loginResp.resp)
      
    //   setCurrentUser(loginResp.resp)
    //   console.log(loginResp.resp._id)
    //   console.log(loginResp.resp)
    //   setUserType("cleaner")

    //   const notification_token = loginResp.expo_push_token
    //   const uid = loginResp.resp._id
      
    //   setUserToken(loginResp.resp.token)
    //   // updateUserWithExpoPushToken(notification_token,uid)
    //   setIsLoading(false)
    // }

    const storeData = async (data) => {

      try {
        const jsonData = JSON.stringify(data)
        await AsyncStorage.setItem('@storage_Key', jsonData)
        console.log('Object stored successfully!');
        // console.log(jsonData);
        
      } catch (e) {
        // saving error
      }
    }

  const login = (loginResp) => {
    storeData(loginResp)
    console.log("__________________________________777")
    setCurrentUser(loginResp.resp)
    setCurrentUserId(loginResp.resp._id)
    setFbaseUser(loginResp.fbUser)
    console.log("___________________________________777")
    // console.log(loginResp.resp._id)
    // console.log(loginResp.resp)

    // const notification_token = loginResp.expo_push_token
    // const uid = loginResp.resp._id
    setUserId(loginResp.resp._id)
    setUserToken(loginResp.resp.token)
    setUserType(loginResp.resp.userType)
    // updateUserWithExpoPushToken(notification_token,uid)
    setIsLoading(false)
    updateFriendsListWithLastMessagesAndUnreadCounts(loginResp.resp._id)
  }


  const updateMessageList = (userId) => {
    updateFriendsListWithLastMessagesAndUnreadCounts(userId)
  }

  
    const logout = async() => {
        setUserToken(null)
        try {
            await AsyncStorage.removeItem('@storage_Key')
          }catch(e){
            console.log(e)
          }
        setIsLoading(false)
    }

    const update_avatar = (new_avatar) => {
      setAvatar(new_avatar)
    }

    const isLoggedIn = async () => {
      try {
          const jsonValue = await AsyncStorage.getItem('@storage_Key');
          if (jsonValue) {
              const object = JSON.parse(jsonValue);
          
              setUserToken(object.resp.token);
              setCurrentUserId(object.resp._id);
              setUserType(object.resp.userType);
              setCurrency(object.resp.location.currency.symbol);
              setCurrentUser(object.resp)
              // alert("support", object.resp.white)
              console.log("loooooooooogin")
              // console.log(JSON.stringify(object.resp, null, 2))
              console.log("loooooooooogin")
              setFbaseUser(object.fbUser)
              // setCurrentUser({
              //     userId: object.resp._id,
              //     email: object.resp.email,
              //     avatar: object.resp.avatar,
              //     userType: object.resp.userType,
              //     fbUser: object.fbUser
              // });
              // console.log("Loaded user data from storage:", object);
          } else {
              console.log("No user data found in storage.");
          }
      } catch (error) {
          console.error("Error loading user data from storage:", error);
      }
  };
  
  
    const fetchGeolocation = async () => {
      const data = await fetchIPGeolocation()
      setGeolocationData(data);
    };

    async function updateFriendsListWithLastMessagesAndUnreadCounts(userId) {
      
      try {
        const friendsRef = ref(db, `users/${userId}/friends`);
        const friendsSnapshot = await get(friendsRef);
        const friendsData = friendsSnapshot.val() || {};
        const userFriends = Object.values(friendsData) || [];

        console.log("friends................")
        // console.log(JSON.stringify(userFriends, null, 2))
        console.log("friends................1")
      
        const updatedFriendsWithMessages = [];
    
        for (const friend of userFriends) {
          const chatroomId = friend.chatroomId;
          const chatroomRef = ref(db, `chatrooms/${chatroomId}`);
          const chatroomSnapshot = await get(chatroomRef);
          const chatroomData = chatroomSnapshot.val();
      
          if (chatroomData && chatroomData.messages) {
            const lastMsg = chatroomData.messages[chatroomData.messages.length - 1];
            const lastmessage = {
              text: lastMsg ? lastMsg.text : null,
              sender: lastMsg ? lastMsg.sender : null,
              createdAt: lastMsg ? lastMsg.createdAt : null
            };
    
            const updatedFriend = { ...friend, lastmessage };
    
            // Fetch unread message count
            const unreadRef = ref(db, `unreadMessages/${chatroomId}/${userId}/${friend.userId}`);
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
    
        setFriendsWithLastMessagesUnreadCount(updatedFriendsWithMessages);
        // console.log("Updated Friends List with unread counts:", updatedFriendsWithMessages);
        

        // Calculate the total sum of unread message counts from all friends
        const totalUnreadCount = updatedFriendsWithMessages.reduce((total, friend) => {
          return total + friend.unreadCount;
        }, 0);

        setTotalUnreadCount(totalUnreadCount)
        
        

      } catch (error) {
        console.error('Error updating friendss list with last messages and unread counts:', error);
      }
    }
  
    

    useEffect(()=> {
      isLoggedIn()
      fetchGeolocation();
      updateFriendsListWithLastMessagesAndUnreadCounts(currentUserId)
    },[currentUserId])

    useEffect(() => {
      // Any logic you want to run when friendsWithLastMessagesUnreadCount updates
    }, [friendsWithLastMessagesUnread]);
    return (
    <AuthContext.Provider value={{
      userId,
      fbaseUser,
      userToken,
      userType,
      currency,
      totalUnreadCount,
      updateMessageList,
      setTotalUnreadCount,
      setFriendsWithLastMessagesUnreadCount,
      friendsWithLastMessagesUnread, applicationCounts, isLoading,currentUser,avatar,currentUserId,geolocationData,login,logout,update_avatar,isLoggedIn}}>
        
        
        {children}
    </AuthContext.Provider>
    )
}


import { useEffect, useState, useCallback, useContext, useRef } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import {
  get,
  ref,
  set,
  off,
  onValue,
  push,
  update,
  onChildAdded
} from 'firebase/database';
import { db } from '../../firebase/config';
import COLORS from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import ROUTES from '../../constants/routes';
import moment from 'moment';
import { MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';

const Messages = ({navigation}) => {

  
  
  const listRef = useRef()
  const{currentUserId} = useContext(AuthContext)
  const{
    fbaseUser,
    setTotalUnreadCount
  } = useContext(AuthContext)
  // friendsWithLastMessagesUnread, 
  // setFriendsWithLastMessagesUnreadCount,
  // setTotalUnreadCount

  // const[totalUnreadCount, setTotalUnreadCount] = useState(0);
  const[friendsWithLastMessagesUnread, setFriendsWithLastMessagesUnreadCount] = useState([]);
  

  console.log("Greatness..........host")
  // console.log(JSON.stringify(friendsWithLastMessagesUnread, null, 2))
  console.log("Greatness2..........host2")

  
  

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
  
        // Update state with sorted and processed data
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
        onPress={() => navigation.navigate(ROUTES.chat_conversation, {
        selectedUser:item,
        fbaseUser: fbaseUser,
        schedule: item,
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
        <View style={{flex: 0.76}}>
            <Text bold style={{marginLeft:10, fontSize:15, color:COLORS.secondary}}>{item.firstname} {item.lastname}</Text>
            <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}><AntDesign name="home" size={14} color={COLORS.gray}/> {item.schedule?.apartment_name}</Text>
            <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}><MaterialCommunityIcons name="calendar" size={14} color={COLORS.gray} /> {moment(item.schedule?.cleaning_date).format('ddd MMM D')}  {moment(item.schedule?.cleaning_time, 'h:mm:ss A').format('h:mm A')}</Text>
            {item.lastmessage?.text && (
              <Text style={{ marginLeft: 10, fontSize: 13, color: COLORS.gray, fontStyle:'italic' }}>
                {item.lastmessage.sender !== currentUserId ? "" : 
                  <>
                  {item.unreadCount < 1 && item.lastmessage.sender === currentUserId ? <Ionicons name="checkmark-done" size={16} color= {COLORS.primary} />: <Ionicons name="checkmark-done" size={16} color= {COLORS.gray} /> } 
                  </>
                }

                {truncateString(item.lastmessage?.text)}
                
              </Text>
            )}

          {/* <Text>{item.lastmessage.sender} {currentUserId}</Text> */}
            
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
    <View style={styles.empty_listing}><Text>You have nothing here</Text></View>
  )

  return (
    <View>
    <StatusBar translucent backgroundColor="transparent" />
    <FlatList 
        data = {friendsWithLastMessagesUnread}
        renderItem={({ item, index }) => singleItem(item, index)} 
        ListEmptyComponent= {emptyListing}
        ItemSeparatorComponent={itemSeparator}
        keyExtractor={recommended_cleaners=> recommended_cleaners._id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
    /> 
    </View>
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





// {
//   "avatar": "https://firebasestorage.googleapis.com/v0/b/fresh-sweeper.appspot.com/o/profile%2Favatar_663500e61626dbb251d2ed7f.jpeg?alt=media&token=3151fe34-21f8-4f2b-93a9-9b75d79a5090",
//   "chatroomId": "-O4kJJxkmZABV5ywc7Tl",
//   "email": "tommy@yahoo.com",
//   "firstname": "Timmy",
//   "lastname": "Marqez",
//   "schedule": {
//     "_id": "6677f30691f51b8fc7d70182",
//     "cleaner_applications": [
//       "663500e61626dbb251d2ed7f"
//     ],
//     "hostInfo": {
//       "_id": "6621daedea1ad279d24a0ad0",
//       "account_verification": false,
//       "avatar": "",
//       "created_at": "19-04-2024 02:46:05",
//       "email": "carl@yahoo.com",
//       "expo_push_token": "ExponentPushToken[d-_o55FS6u0pkKF5Mnra7H]",
//       "firstname": "Carl",
//       "lastname": "Njoku",
//       "location": {
//         "asn": {
//           "asn": "AS6128",
//           "name": "Cablevision Systems Corp",
//           "route": "67.80.0.0/14",
//           "type": "business"
//         },
//         "calling_code": "1",
//         "city": "Newark",
//         "continent_code": "NA",
//         "continent_name": "North America",
//         "count": "0",
//         "country_code": "US",
//         "country_name": "United States",
//         "currency": {
//           "code": "USD",
//           "name": "US Dollar",
//           "native": "$",
//           "plural": "US dollars",
//           "symbol": "$"
//         },
//         "emoji_flag": "🇺🇸",
//         "emoji_unicode": "U+1F1FA U+1F1F8",
//         "flag": "https://ipdata.co/flags/us.png",
//         "ip": "67.80.225.60",
//         "is_eu": false,
//         "languages": [
//           {
//             "code": "en",
//             "name": "English",
//             "native": "English"
//           }
//         ],
//         "latitude": 40.72420120239258,
//         "longitude": -74.19770050048828,
//         "postal": "07108",
//         "region": "New Jersey",
//         "region_code": "NJ",
//         "region_type": "state",
//         "threat": {
//           "is_anonymous": false,
//           "is_bogon": false,
//           "is_datacenter": false,
//           "is_icloud_relay": false,
//           "is_known_abuser": false,
//           "is_known_attacker": false,
//           "is_proxy": false,
//           "is_threat": false,
//           "is_tor": false
//         },
//         "time_zone": {
//           "abbr": "EDT",
//           "current_time": "2024-04-19T02:37:37-04:00",
//           "is_dst": true,
//           "name": "America/New_York",
//           "offset": "-0400"
//         }
//       },
//       "loggedIn": true,
//       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYXJsQHlhaG9vLmNvbSIsImV4cCI6MTcxNzgwNDg4MX0.LQiKprikYFTRvxaU4fa7HM4HQNPQYVEDsSxNXxFnrp8",
//       "userType": "host"
//     },
//     "schedule": {
//       "address": "171 Scheerer Avenue, Newark, NJ, USA",
//       "apartment_latitude": 40.7119653,
//       "apartment_longitude": -74.2087581,
//       "apartment_name": "Luxury Apartment ",
//       "bathroom": "1",
//       "bedroom": "3",
//       "cleaning_date": "Wed Jun 26 2024",
//       "cleaning_time": "10:00:00 PM",
//       "extra": [
//         {
//           "icon": "apps",
//           "label": "Tile & Grout Cleaning",
//           "price": 20,
//           "value": "Tile & Grout Cleaning"
//         },
//         {
//           "icon": "rug",
//           "label": "Carpet",
//           "price": 20,
//           "value": "Carpet Cleaning"
//         },
//         {
//           "icon": "sofa",
//           "label": "Upholstery Cleaning",
//           "price": 15,
//           "value": "Upholstery Cleaning"
//         },
//         {
//           "icon": "window-closed-variant",
//           "label": "Window",
//           "price": 20,
//           "value": "Window Washing"
//         },
//         {
//           "icon": "toaster-oven",
//           "label": "Inside Oven",
//           "price": 20,
//           "value": "Inside Oven"
//         }
//       ],
//       "regular_cleaning": [
//         {
//           "label": "Sweeping and Mopping",
//           "value": "Sweeping and Mopping"
//         },
//         {
//           "label": "Vacuuming",
//           "value": "Vacuuming"
//         },
//         {
//           "label": "Kitchen",
//           "value": "Kitchen"
//         },
//         {
//           "label": "Bathroom",
//           "value": "Bathroom "
//         },
//         {
//           "label": "Dishwashing",
//           "value": "Dishwashing"
//         },
//         {
//           "label": "Trash Removal",
//           "value": "Trash Removal"
//         },
//         {
//           "label": "Room Cleaning",
//           "value": "Room Cleaning"
//         },
//         {
//           "label": "Livingroom",
//           "value": "Livingroom"
//         },
//         {
//           "label": "Window Cleaning",
//           "value": "Window Cleaning"
//         },
//         {
//           "label": "Air Freshening",
//           "value": "Air Freshening"
//         },
//         {
//           "label": "Appliance Cleaning",
//           "value": "Appliance Cleaning"
//         },
//         {
//           "label": "Final Inspection",
//           "value": "Final Inspection"
//         },
//         {
//           "label": "Dusting",
//           "value": "Dusting"
//         }
//       ],
//       "totalPrice": 95
//     },
//     "status": "upcoming"
//   },
//   "userId": "663500e61626dbb251d2ed7f",
//   "lastmessage": {
//     "text": "How are you doing today. Are you available tomorrow at Aldine",
//     "sender": "6621daedea1ad279d24a0ad0",
//     "createdAt": "2024-08-20T15:05:22.628Z"
//   },
//   "unreadCount": 0
// },
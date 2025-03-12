

// import React, { useContext } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useCleaningTimer } from "../context/CleaningTimerContext";
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import COLORS from '../constants/colors';
// import { PanGestureHandler } from 'react-native-gesture-handler';
// import Animated, {
//   useAnimatedGestureHandler,
//   useSharedValue,
//   withSpring
// } from 'react-native-reanimated';

// const FloatingCleaningTimer = ({ apartmentName, onRequestMoreTime }) => {
// //   const { timeLeft } = useContext(CleaningTimerContext);
//   const { timeLeft, isActive } = useCleaningTimer();

//   // Shared values for x and y position
//   const translateX = useSharedValue(10);
//   const translateY = useSharedValue(50);

//   // Gesture handler for dragging
//   const gestureHandler = useAnimatedGestureHandler({
//     onStart: (_, ctx) => {
//       ctx.startX = translateX.value;
//       ctx.startY = translateY.value;
//     },
//     onActive: (event, ctx) => {
//       translateX.value = ctx.startX + event.translationX;
//       translateY.value = ctx.startY + event.translationY;
//     },
//     onEnd: () => {
//       // Add smooth return effect
//       translateX.value = withSpring(translateX.value);
//       translateY.value = withSpring(translateY.value);
//     },
//   });

//   return (
//     <PanGestureHandler onGestureEvent={gestureHandler}>
//       <Animated.View style={[
//         styles.container,
//         { transform: [{ translateX }, { translateY }] }
//       ]}>
//         {/* Timer Icon and Apartment Name */}
//         <View style={styles.header}>
//           <MaterialCommunityIcons name="timer-outline" size={20} color={COLORS.white} />
//           <Text style={styles.apartmentName}>{apartmentName}</Text>
//         </View>

//         {/* Timer Display */}
//         <Text style={styles.timerText}>Time Left: {timeLeft} mins</Text>
        
//         {/* Request More Time Button */}
//         {/* <TouchableOpacity style={styles.button} onPress={onRequestMoreTime}> */}
//         <TouchableOpacity style={styles.button} >
//           <Text style={styles.buttonText}>Request More Time</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </PanGestureHandler>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   apartmentName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.white,
//     marginLeft: 5, // Space between icon and text
//   },
//   timerText: {
//     fontSize: 14,
//     color: COLORS.white,
//     marginBottom: 10,
//   },
//   button: {
//     marginTop: 8,
//     backgroundColor: COLORS.primary, // Use your primary color
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

// export default FloatingCleaningTimer;




// import React, { useState, useEffect } from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
// import { PanGestureHandler, State } from 'react-native-gesture-handler';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useCleaningTimer } from "../context/CleaningTimerContext";
// import RequestMoreTimeModal from './cleaner/RequestMoreTimeModal';
// import userService from '../services/userService';
// import { sendPushNotifications } from '../utils/sendPushNotification';
// import ROUTES from '../constants/routes';
// import TimeCalculator from './cleaner/TimeCalculator';

// const FloatingCleaningTimer = ({ schedule }) => {

//   const { timeLeft, isActive, startTimer } = useCleaningTimer();

//   const [modalVisible, setModalVisible] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   const [hostToken, setHostPushToken] = useState(null);
  
//   useEffect(()=> {
//     fetchHostPushTokens()
//   },[])



//   const fetchHostPushTokens = async() => {
//     await userService.getUserPushTokens(schedule.hostInfo._id)
//     .then(response => {
//         const res = response.data.tokens
        
//         setHostPushToken(res)
//         console.log("User tokens", res)
//     })
//   }



//   const handleConfirmTime = async(extraTime) => {
//     console.log(`Requesting ${extraTime} minutes more`);

//     const data ={
//         scheduleId:schedule._id,
//         hostId:schedule.hostInfo._id,
//         cleanerFirstname:schedule.assignedTo.firstname,
//         cleanerLastname: schedule.assignedTo.lastname,
//         cleanerId: schedule.assignedTo.cleanerId,
//         cleaning_date:schedule.schedule.cleaning_date,
//         cleaning_time:schedule.schedule.cleaning_time,
//         cleaning_end_time:schedule.schedule.cleaning_end_time,
//         extraTime:extraTime
//     }

//     await userService.sendExtraTimeRequest(data)
//     .then(response => {
//         console.log("Request sent successfully")
//     })
//     sendPushNotifications(
//         hostToken,
//         'Additional time request!',
//         `The cleaner has requested for extra ${extraTime} minutes to finish up`,
//         {
//           screen: ROUTES.host_task_progress,
//           params: { scheduleId: schedule._id },
//         }
//       );
      
//     setModalVisible(false);
//   };
 
//   const handleGestureEvent = (event) => {
//     setPosition({
//       x: event.nativeEvent.translationX,
//       y: event.nativeEvent.translationY,
//     });
//   };

//   const handleStateChange = (event) => {
//     if (event.nativeEvent.state === State.END) {
//       setPosition({ x: 0, y: 0 }); // Reset position when released
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Draggable Timer */}
//       <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleStateChange}>
//         <View style={[styles.timerContainer, { transform: [{ translateX: position.x }, { translateY: position.y }] }]}>
//           <MaterialCommunityIcons name="timer-outline" size={24} color="white" />
//           {/* <Text style={styles.text}>Time Remaining: {timeLeft}</Text> */}
//           <TimeCalculator />
//           <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.requestButton}>
//             <Text style={styles.requestButtonText}>Request More Time</Text>
//           </TouchableOpacity>
//         </View>
//       </PanGestureHandler>

//       {/* Request More Time Modal */}
//       <RequestMoreTimeModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onConfirm={handleConfirmTime}
//         schedule={schedule}
//       />
      
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 50,
//     left: 20,
//     right: 20,
//     alignItems: 'center',
//   },
//   timerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)', // Opacity added
//     padding: 15,
//     borderRadius: 5,
//     top: 20, // Added top margin
//   },
//   text: {
//     color: 'white',
//     fontSize: 16,
//     marginLeft: 10,
//   },
//   requestButton: {
//     marginLeft: 15,
//     backgroundColor: 'white',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   requestButtonText: {
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContainer: {
//     backgroundColor: 'white',
//     width: '80%',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   cancelButton: {
//     backgroundColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginRight: 10,
//     alignItems: 'center',
//   },
//   cancelText: {
//     color: 'black',
//   },
//   submitButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginLeft: 10,
//     alignItems: 'center',
//   },
//   submitText: {
//     color: 'white',
//   },
// });

// export default FloatingCleaningTimer;





import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import COLORS from '../constants/colors';
import TimeCalculator from './cleaner/TimeCalculator';
import Timer from './Timer';
import RequestMoreTimeModal from './cleaner/RequestMoreTimeModal';
import userService from '../services/userService';
import { useCleaningTimer } from "../context/CleaningTimerContext";
import { sendPushNotifications } from '../utils/sendPushNotification';
import ROUTES from '../constants/routes';


const FloatingCleaningTimer = ({ onRequestMoreTime, schedule }) => {

    const { timeLeft, isActive, startTimer } = useCleaningTimer();

    const [modalVisible, setModalVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const animatedWidth = new Animated.Value(expanded ? 250 : 60);

    // Toggle Expand/Collapse
    const toggleExpand = () => {
        Animated.timing(animatedWidth, {
            toValue: expanded ? 60 : 250, // Expand or Collapse width
            duration: 300,
            useNativeDriver: false,
        }).start();
        setExpanded(!expanded);
    };

    const [hostToken, setHostPushToken] = useState(null);
  
  useEffect(()=> {
    fetchHostPushTokens()
  },[])



  const fetchHostPushTokens = async() => {
    await userService.getUserPushTokens(schedule.hostInfo._id)
    .then(response => {
        const res = response.data.tokens
        
        setHostPushToken(res)
        console.log("User tokens", res)
    })
  }



  const handleConfirmTime = async(extraTime) => {
    console.log(`Requesting ${extraTime} minutes more`);

    const data ={
        scheduleId:schedule._id,
        hostId:schedule.hostInfo._id,
        apartmentName:schedule.schedule.apartment_name,
        cleanerFirstname:schedule.assignedTo.firstname,
        cleanerLastname: schedule.assignedTo.lastname,
        cleanerId: schedule.assignedTo.cleanerId,
        cleaning_date:schedule.schedule.cleaning_date,
        cleaning_time:schedule.schedule.cleaning_time,
        cleaning_end_time:schedule.schedule.cleaning_end_time,
        extraTime:extraTime
    }

    await userService.sendExtraTimeRequest(data)
    .then(response => {
        if(response.status==200){
            Alert.alert(
                'Success',
                'Extra cleaning time request sent successfully',
                [{ text: 'OK', onPress: () => ("") }]
              );
        }
        console.log("Request sent successfully")
    })
    sendPushNotifications(
        hostToken,
        'Additional time request!',
        `The cleaner has requested for extra ${extraTime} minutes to finish up`,
        {
          screen: ROUTES.host_task_progress,
          params: { scheduleId: schedule._id },
        }
      );
      
    setModalVisible(false);
  };

    return (
        <Animated.View style={[styles.container, { width: animatedWidth }]}>
            {/* Toggle Button */}
            <TouchableOpacity onPress={toggleExpand} style={styles.iconContainer}>
                {expanded ? "" : <><Timer /> 
                <TouchableOpacity style={styles.requestButton1} onPress={() => setModalVisible(true)}>
                    {/* <MaterialIcons name="send" size={20} color={COLORS.gray} />  */}
                    <Text style={{fontSize:10, alignSelf:'center', color:COLORS.gray, fontWeight:'500' }}>Get</Text>
                    <Text style={{fontSize:10, alignSelf:'center', color:COLORS.gray, fontWeight:'500'  }}>Time</Text>
                </TouchableOpacity>
                </>}
                <MaterialIcons name={expanded ? 'chevron-right' : 'chevron-left'} size={24} color="white" />
            </TouchableOpacity>

            {/* Expanded View */}
            {expanded && (
                <View style={styles.content}>
                    <Text style={styles.timerText}>Active Task</Text>
                    <TimeCalculator />
                    <TouchableOpacity style={styles.requestButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.buttonText}>Request More Time</Text>
                    </TouchableOpacity>
                </View>
            )}

        <RequestMoreTimeModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onConfirm={handleConfirmTime}
            schedule={schedule}
        />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '50%',
        right: -5,
        height: 150,
        // backgroundColor: COLORS.primary,
        backgroundColor: 'rgba(0,0,0,0.7)', // Opacity added
        borderRadius:5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        elevation: 0, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    iconContainer: {
        padding: 5,  
        alignItems:"center"  
    },
    content: {
        marginLeft: 10,
    },
    timerText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    requestButton: {
        marginTop: 5,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
    },
    requestButton1: {
        marginTop: 10,
        marginBottom:10,
        backgroundColor: '#f5f5f5',
        padding: 5,
        borderRadius: 20,
        width:40,
        height:40,
        alignItems:'center'
    },
    buttonText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default FloatingCleaningTimer;
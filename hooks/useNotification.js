// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import { Platform } from 'react-native';
// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigation } from '@react-navigation/native'; // Import useNavigation

// export const useNotification = () => {
//     const [expoPushToken, setExpoPushToken] = useState("");
//     const navigation = useNavigation(); // Initialize navigation

//     const registerForPushNotificationsAsync = async () => {
//         if (Device.isDevice) {
//             const { status: existingStatus } = await Notifications.getPermissionsAsync();
//             let finalStatus = existingStatus;

//             if (existingStatus !== 'granted') {
//                 const { status } = await Notifications.requestPermissionsAsync();
//                 finalStatus = status;
//             }

//             if (finalStatus !== 'granted') {
//                 alert('Failed to get push token for push notification!');
//                 return;
//             }

//             const token = (await Notifications.getExpoPushTokenAsync()).data;
//             console.log('Token', token);
//             setExpoPushToken(token);

//             // Set up the notification channel for Android
//             if (Platform.OS === 'android') {
//                 Notifications.setNotificationChannelAsync('default', {
//                     name: 'default',
//                     importance: Notifications.AndroidImportance.MAX,
//                     vibrationPattern: [0, 250, 250, 250],
//                     lightColor: '#FF231F7C',
//                 });
//             }
//         } else {
//             alert('Must use physical device for Push Notifications');
//         }
//     };

//     const handleNotification = notification => {
//         // Handle incoming notification while the app is in the foreground
//     };

//     const handleNotificationResponse = response => {
//         // Handle notification response when the app is opened from the notification
//         const data = response.notification.request.content.data;

//         // Check the data to determine where to navigate
//         if (data.screen) {
//             // Navigate to the specified screen with any provided parameters
//             navigation.navigate(data.screen, data.params);
//         }
//     };

//     useEffect(() => {
//         // Add notification listeners
//         const subscriptionReceived = Notifications.addNotificationReceivedListener(handleNotification);
//         const subscriptionResponse = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

//         // Cleanup listeners on unmount
//         return () => {
//             subscriptionReceived.remove();
//             subscriptionResponse.remove();
//         };
//     }, []);

//     return { expoPushToken, registerForPushNotificationsAsync, handleNotification, handleNotificationResponse };
// };







import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useState, useEffect } from 'react';
import { navigate } from './navigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from '../services/userService';


export function useNotification() {
    
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    const registerForPushNotificationsAsync = async (userId) => {
        if (!userId) {
            console.error('User ID is required for registering push notifications.');
            setError('User ID is required.');
            return;
        }
        try {
            // Step 1: Retrieve token from AsyncStorage
            let token = await AsyncStorage.getItem('expoPushToken');
            
            // Step 2: Validate the token with the backend
            const tdata = {
                userId:userId,
                token:token
            }

            console.log("Nweeeewn toks", tdata)
            const isValid = token && (await validateTokenWithBackend(tdata));
    
            if (!isValid) {
                console.warn('Token is invalid or missing. Generating a new one...');
                
                // Step 3: Generate a new push token
                token = await generateNewPushToken();
    
                if (token) {
                    // Step 4: Save the new token locally
                    await AsyncStorage.setItem('expoPushToken', token);
    
                    // Step 5: Send the new token to the backend
                    await sendTokenToBackend(token, userId);
                } else {
                    console.warn('Failed to generate a new push token.');
                }
            } else {
                console.log('Token is valid and already exists:', token);
            }
    
            // Step 6: Update the state
            setExpoPushToken(token);
        } catch (error) {
            console.error('Error registering for push notifications:', error.message || error);
        }
    };

    const generateNewPushToken = async () => {
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus === 'granted') {
                return (await Notifications.getExpoPushTokenAsync()).data;
            } else {
                console.warn('Permission for notifications not granted.');
            }
        } else {
            console.warn('Must use a physical device for Push Notifications');
        }

        return null;
    };

    const validateTokenWithBackend = async (tdata) => {
        console.log("token",tdata)
        try {
            const response = await userService.validateToken(tdata);
            console.log(response.data.isValid)
            return response.data.isValid; // Backend should return { isValid: true/false }
            
        } catch (error) {
            console.error('Error validating push token:', error);
            return false;
        }
    };

    const sendTokenToBackend = async (token, userId) => {
        try {
            const deviceInfo = {
                deviceName: Device.deviceName || 'Unknown Device',
                osType: Device.osName || 'Unknown OS',
                osVersion: Device.osVersion || 'Unknown Version',
                token,
                userId:userId,
            };
            console.log("My device", deviceInfo)
    
            const response = await userService.storeToken(deviceInfo);
            console.log('Token successfully sent to backend:', response.data);
        } catch (error) {
            console.error('Error sending token to backend:', error.message || error);
        }
    };


    const handleNotificationResponse = (response) => {
        console.log("Notification response:", response);

        // Extract notification data
        const { screen, params } = response?.notification?.request?.content?.data || {};
        console.log(screen)
        console.log(params)
        if (screen) {
            // Navigate to the specified screen with params
            navigate(screen, params);
        } else {
            console.log("No screen specified in notification data.");
        }
    };

    


    // Handle notification when received in the foreground
    const handleNotification = (notification) => {
        console.log("Notification received in foreground:", notification);
        // You can process notifications here if needed
    };

    

    useEffect(() => {
        registerForPushNotificationsAsync();

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        // Listeners for notification events
        const notificationListener = Notifications.addNotificationReceivedListener(handleNotification);
        const responseListener = Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
        );

        // Clean up listeners on unmount
        return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
        };

    }, []);

    return {
        expoPushToken,
        registerForPushNotificationsAsync,
        handleNotificationResponse,
    };
}



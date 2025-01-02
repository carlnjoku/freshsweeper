import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import AppNav from './navigationpublic/AppNav';
import { AuthProvider } from './context/AuthContext';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StripeProvider } from '@stripe/stripe-react-native';
import COLORS from './constants/colors';
import * as Font from 'expo-font';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { STRIPE_PUPLIC_SECRET_KEY } from './secret';
import { useNotification } from './hooks/useNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';


// import { navigationRef } from './hooks/navigationService';

import * as RNLogs from 'react-native-logs'; // Import as a namespace


const logger = RNLogs.logger.createLogger({ // Correctly access createLogger
  transport: async (msg) => {
    console.log("logger.........")
    // console.log(msg); // Change this to your desired transport method
    console.log("logger.........")
  },
});
// // Then create the logger
// const logger = RNLogs.createLogger({
//   transport: async (msg) => {
//     console.log(msg); // Log to console for now
//   },
// });


export default function App() {

  // const fetchData = async () => {
  //   console.log('Making API call...');
  //   try {
  //     const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
  //     console.log("........................................................")
  //     // console.log('Data received:', response.data);
  //     console.log("........................................................")
  //   } catch (error) {
  //     console.error('Axios error:', error);
  //   }
  // };


  const { registerForPushNotificationsAsync, handleNotificationResponse } = useNotification();

  useEffect(() => {
    // fetchData();
    logger.info("App component mounted"); // Test logging

    const jsonValue = AsyncStorage.getItem('@storage_Key');
    console.log(jsonValue)
    // if (jsonValue) {
    //     const object = JSON.parse(jsonValue);
    //     const userid = object.resp._id
    //     registerForPushNotificationsAsync(userid);
    // }

    // Load the Open Sans font asynchronously
    const loadFont = async () => {
      await Font.loadAsync({
        'Roboto-Regular': require('./Roboto-Regular.ttf'),
        'Roboto-Medium': require('./Roboto-Medium.ttf'),
        'Roboto-Bold': require('./Roboto-Bold.ttf'),
        'OpenSans-Bold': require('./OpenSans-Bold.ttf'),
        'OpenSans-Regular': require('./OpenSans-Regular.ttf'),
        // You can load other font weights/styles if needed
      });
      setFontLoaded(true);
    };

    loadFont();



    // return () => {
    //     Notifications.removeNotificationSubscription(responseListener);
    // };

    


  }, []);


  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
    );

    return () => {
        Notifications.removeNotificationSubscription(responseListener);
    };
}, [handleNotificationResponse]);

  
  

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      // text: COLORS.gray, // Change this to your desired text colors
    },
  };


  
  return (
    <AuthProvider>
      <PaperProvider>
      <StripeProvider publishableKey={STRIPE_PUPLIC_SECRET_KEY}>
        <AppNav />
      </StripeProvider>
      </PaperProvider>
    </AuthProvider>
  
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});




import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import MainCleanerStack from '../navigationcleaner/MainCleanerStack';
import MainHostStack from '../navigationhost/MainHostStack';

import COLORS from '../constants/colors';
import AuthStack from './AuthStack';

import { navigationRef } from '../hooks/navigationService';
// import DeepLinking from '../screens/DeepLinking';
import FloatingCleaningTimer from '../components/FloatingCleaningTimer';
import { useCleaningTimer } from '../context/CleaningTimerContext';
import linking from '../screens/DeepLinking';
import * as Notifications from 'expo-notifications';



export default function AppNav({ref}) {

  const {userToken,userType, isLoading} = useContext(AuthContext)
  const { isActive , schedule} = useCleaningTimer();

  useEffect(() => {
    // Listen for push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('Push Notification Data:', data);

      if (data.screen) {
        navigationRef.current?.navigate(data.screen, data.params || {});
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
 
  if(isLoading) {
    return (
        <View style={{flex:1, justifyContent:'cente', alignItems:'center'}}>
            <ActivityIndicator size="large" />
        </View>
    ) 
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
        
        {
          userToken !== null && userType === 'host' ? (
            
            <MainHostStack/>
          ) : userToken !== null &&  userType === 'cleaner' ? (
            <MainCleanerStack />
          ) : (
            <AuthStack />
          )
        } 
         {isActive && schedule && <FloatingCleaningTimer schedule={schedule} onRequestMoreTime={() => console.log("Request More Time")} />}
    </NavigationContainer>
  )
}


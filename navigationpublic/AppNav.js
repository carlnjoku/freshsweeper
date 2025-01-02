import React, { useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import MainCleanerStack from '../navigationcleaner/MainCleanerStack';
import MainHostStack from '../navigationhost/MainHostStack';

import COLORS from '../constants/colors';
import AuthStack from './AuthStack';

import { navigationRef } from '../hooks/navigationService';
import DeepLinking from '../screens/DeepLinking';



export default function AppNav({ref}) {

  const {userToken,userType, isLoading} = useContext(AuthContext)
 
  if(isLoading) {
    return (
        <View style={{flex:1, justifyContent:'cente', alignItems:'center'}}>
            <ActivityIndicator size="large" />
        </View>
    ) 
  }

  return (
    <NavigationContainer ref={navigationRef} Linking={DeepLinking}>
        
        {
          userToken !== null && userType === 'host' ? (
            <MainHostStack/>
          ) : userToken !== null &&  userType === 'cleaner' ? (
            <MainCleanerStack />
          ) : (
            <AuthStack />
          )
        }
    </NavigationContainer>
  )
}


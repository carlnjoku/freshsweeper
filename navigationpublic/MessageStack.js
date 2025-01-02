import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from '../constants/routes';
import ChatConversation from '../components/ChatConversation';


export default function MessageStack(){
const Stack = createStackNavigator()

return (
    <BookingProvider>
      <Stack.Navigator 
          screenOptions={{
              // headerTintColor:COLORS.white,
              // headerBackTitleVisible:false,
              // headerStyle:{
              //     backgroundColor:COLORS.primary
              // }
          }} 
          
      >
          
        <Stack.Screen 
          name={ROUTES.chat_conversation}
          component={ChatConversation} 
          
          options={({route}) => ({
              headerShown:false,
              headerTintColor: COLORS.white,
              headerBackTitleVisible: false,
              headerStyle: {
                backgroundColor: COLORS.primary,
              },
            //   title: "Conversation",
              headerTintColor:COLORS.white,
              headerBackTitleVisible:false,
              headerStyle:{
                  backgroundColor:COLORS.primary
              }
          })}
        />
      </Stack.Navigator>
    </BookingProvider>
    )
}
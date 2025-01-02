import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
// import { Onboarding, Signin, Signup, ForgotPassword, Verification } from '../screens/auth/Onboarding';
import Onboarding from '../screens/auth/Onboarding';
import Signin from '../screens/auth/Signin';
import Signup from '../screens/auth/Signup';
// import ForgotPassword from '../screens/auth/ForgotPassword';
// import Verification from '../screens/auth/Verification';
import ROUTES from '../constants/routes';
import COLORS from '../constants/colors';
import GetStarted from '../screens/auth/GetStarted';



const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator 
        screenOptions={{
            // headerTintColor:COLORS.white,
            // headerBackTitleVisible:false,
            // headerStyle:{
            //     backgroundColor:COLORS.primary
            // }
            headerShown:false
        }} 
        initialRouteName={ROUTES.onboarding}
        
    >
      
      <Stack.Screen 
        name={ROUTES.onboarding} 
        component={Onboarding} 
        options={({route}) => ({
          headerShown:false,
          headerTintColor: COLORS.white,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          title: route.params?.userId,
          headerTintColor:COLORS.white,
          headerBackTitleVisible:false,
          headerStyle:{
              backgroundColor:COLORS.primary
          }
        })}
      />

      <Stack.Screen 
        name={ROUTES.getting_started} 
        component={GetStarted} 
        options={({route}) => ({
          headerShown:false,
          headerTintColor: COLORS.white,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          title: route.params?.userId,
          headerTintColor:COLORS.white,
          headerBackTitleVisible:false,
          headerStyle:{
              backgroundColor:COLORS.primary
          }
        })}
      />

      <Stack.Screen 
        name={ROUTES.signin}
        component={Signin} 
        
        options={({route}) => ({
            headerShown:false,
            headerTintColor: COLORS.white,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            title: route.params?.userId,
            headerTintColor:COLORS.white,
            headerBackTitleVisible:false,
            headerStyle:{
                backgroundColor:COLORS.primary
            }
          })}
      />
      
      <Stack.Screen 
        name={ROUTES.signup} 
        component={Signup} 
        options={({route}) => ({
            headerShown:false,
            headerTintColor: COLORS.white,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            title: route.params?.userId,
            headerTintColor:COLORS.white,
            headerBackTitleVisible:false,
            headerStyle:{
                backgroundColor:COLORS.primary
            }
          })}
      />

      
      {/* <Stack.Screen 
        name={ROUTES.forgot_password}
        component={ForgotPassword} 
        options={({route}) => ({
            headerShown:false,
          })}
      />
      <Stack.Screen 
        name={ROUTES.verification}
        component={Verification} 
      /> */}
    </Stack.Navigator>
  )
}

export default AuthStack

const styles = StyleSheet.create({})
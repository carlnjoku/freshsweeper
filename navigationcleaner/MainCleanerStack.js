import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, StatusBar, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from '../constants/routes';
import DrawerNavigator from './DrawerNavigator';
import Profile from '../screens/cleaner/Profile';
import ScheduleDetails from '../screens/cleaner/ScheduleDetails';
import COLORS from '../constants/colors';
import AttachTaskPhotos from '../screens/cleaner/AttachTaskPhotos';
import TopTab from './TopTab';
import ChatConversation from '../components/ChatConversation';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SchedulePreview from '../screens/cleaner/SchedulePreview';
import AllRequests from '../screens/cleaner/AllRequests';
// import JobDetails from '../screens/cleaner/JobDetails';
import JobDetails from '../screens/cleaner/JobDetails';
import Payment from '../screens/cleaner/Payment';
import VerificationList from '../screens/cleaner/AccountVerification/VerificationList';
import TaxInformation from '../screens/cleaner/AccountVerification/TaxInformation';
import IDVerification from '../screens/cleaner/AccountVerification/IDVerification';
import PaymentOnboarding from '../screens/cleaner/AccountVerification/PaymentOnboarding';
import ChatConversation1 from '../components/ChatConversation1';
import ScheduleDetailsView from '../screens/cleaner/ScheduleDetailsView';
import ClockIn from '../screens/cleaner/ScheduleTabs/ClockIn';
import moment from 'moment';


export default function MainCleanerStack() {

    const Stack = createStackNavigator()

    const navigation = useNavigation()

  const CustomChatHeader = ({schedule}) => (
    
    <View>
     
      <View style={{ flexDirection: 'row', backgroundColor: COLORS.primary, paddingTop: 20, paddingBottom:10, paddingLeft:10}}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight:15,  marginTop:10 }}>
          <AntDesign name="arrowleft" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={{ marginTop:10 }}>
          <Text style={{ color: COLORS.white, fontSize: 20, fontWeight:'500' }}>{schedule.apartment_name}</Text>
          <Text style={{ color: COLORS.white, fontSize: 14 }}>{schedule.address} </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems:'center', paddingVertical:6, borderBottomWidth:0.5, borderBottomColor:COLORS.light_gray}}>
        <MaterialCommunityIcons name="calendar" style={{marginLeft:5}} size={20} color={COLORS.gray} />
        <Text style={{ fontSize: 14, marginTop:0, color:COLORS.gray }}> Schedule  {moment(schedule.cleaning_date).format('ddd MMM D')},  {moment(schedule.cleaning_time, 'h:mm:ss A').format('h:mm A')}</Text>
      </View>
    </View>
  );
    return (
        <Stack.Navigator 
            screenOptions={{
              headerTintColor:COLORS.white,
              headerBackTitleVisible:false,
              headerStyle:{
                backgroundColor:COLORS.primary
              }
            }} 
            
        >
            <Stack.Screen 
                name={ROUTES.cleaner_dashboard}
                component={DrawerNavigator}
                options = {{
                    headerShown:false
                }}
            />
    
    
          <Stack.Screen 
            name={ROUTES.cleaner_schedule_details}
            component={ScheduleDetails} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                
                title: "Schedule Details",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
              })}
          />
          <Stack.Screen 
            name={ROUTES.cleaner_schedule_details_view}
            component={ScheduleDetailsView} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                
                title: "Schedule Details",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
              })}
          />
          <Stack.Screen 
            name={ROUTES.cleaner_payment_onboarding} 
            component={PaymentOnboarding} 
            options={{
                title:"Onboarding",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                },
                
                headerTitleStyle: {
                  fontWeight: '600',
                  fontSize:16,
                  color:COLORS.white,
                },
                
            }}
          />
          <Stack.Screen 
            name={ROUTES.cleaner_verification} 
            component={VerificationList} 
            options={{
                title:"Account Verification",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                },
                
                headerTitleStyle: {
                  fontWeight: '600',
                  fontSize:16,
                  color:COLORS.white,
                },
                
            }}
          />

          <Stack.Screen 
            name={ROUTES.cleaner_id_verification} 
            component={IDVerification} 
            options={{
                title:"ID Verification",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                },
                
                headerTitleStyle: {
                  fontWeight: '600',
                  fontSize:16,
                  color:COLORS.white,
                },
                
            }}
          />
          <Stack.Screen 
            name={ROUTES.cleaner_tax_information} 
            component={TaxInformation} 
            options={{
                title:"Update Tax Information",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                },
                
                headerTitleStyle: {
                  fontWeight: '600',
                  fontSize:16,
                  color:COLORS.white,
                },
                
            }}
          />

          <Stack.Screen 
            name={ROUTES.cleaner_attach_task_photos}
            component={AttachTaskPhotos} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Upload Photos",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:true,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
              })}
          />

          <Stack.Screen 
            name={ROUTES.cleaner_chat_conversation}
            component={ChatConversation} 
            // component={ChatConversation1}
            
            options={({route}) => ({
              headerShown:true,
              header: ()=> <CustomChatHeader 
                schedule = {route.params.schedule}      
              />,
              headerTintColor:COLORS.white,
              headerBackTitleVisible:false,
              headerStyle:{
                  backgroundColor:COLORS.primary
              }
          })}
          />
          <Stack.Screen 
            name={ROUTES.cleaner_schedule_review}
            component={SchedulePreview} 
            
            options={({route}) => ({
              headerShown:true,
              headerTintColor:COLORS.white,
              headerBackTitleVisible:false,
              headerStyle:{
                  backgroundColor:COLORS.primary
              }
          })}
          />

        <Stack.Screen 
          name={ROUTES.cleaner_job_details}
          component={JobDetails} 
          
          options={({route}) => ({
            headerShown:true,
            title: "Job Details",
            headerTintColor:COLORS.white,
            headerBackTitleVisible:false,
            headerStyle:{
                backgroundColor:COLORS.primary
            },
            
          })}
        />
          

        <Stack.Screen 
          name={ROUTES.cleaner_all_requests}
          component={AllRequests} 
          
          options={({route}) => ({
              
            //   title: route.params?.title,
              title: "All Requests",
              headerShown:true,
              
              headerTintColor:COLORS.white,
              headerBackTitleVisible:false,
              headerStyle:{
                  backgroundColor:COLORS.primary,
              }
            })}
        />

        <Stack.Screen 
          name={ROUTES.cleaner_clock_in}
          component={ClockIn} 
          
          options={({route}) => ({
              
            //   title: route.params?.title,
              title: "All Requests",
              headerShown:true,
              
              headerTintColor:COLORS.white,
              headerBackTitleVisible:false,
              headerStyle:{
                  backgroundColor:COLORS.primary,
              }
            })}
        />
          
        </Stack.Navigator>
      )
}

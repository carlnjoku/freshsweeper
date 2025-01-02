import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from '../constants/routes';
import DrawerNavigator from '../navigationhost/DrawerNavigator';
import Profile from '../screens/host/Profile';
import AddApartment from '../screens/host/AddApartment';
import ApartmentDashboard from '../screens/host/ApartmentDashboard';
import COLORS from '../constants/colors';
import NewBooking from '../screens/host/NewBooking';
import { BookingProvider } from '../context/BookingContext';
import RecommendedCleaners from '../screens/host/RecommendedCleaners';
import CleanerProfile from '../screens/host/CleanerProfile';
import ChatConversation from '../components/ChatConversation';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Confirmation from '../screens/host/Confirmation';
import ScheduleDetails from '../screens/host/ScheduleDetails';
import AttachTaskPhotos from '../screens/cleaner/AttachTaskPhotos';
import TaskProgress from '../screens/host/TaskProgress';
import Checkout from '../screens/host/CreateBookingContents.js/Checkout';
import ParentScreen from '../screens/host/CleanerProfileTest';
import PaymentCheckout from '../screens/host/Payment/PaymentCheckout';
import PaymentSingleCheckout from '../screens/host/Payment/PaymentSingleCheckout';
import ChatConversation1 from '../components/ChatConversation1';
import CleanerProfileHost from '../screens/host/CleanerProfileHost';
import SchedulePreview from '../screens/cleaner/SchedulePreview';
import moment from 'moment';
// import ScheduleApproval from '../screens/host/ScheduleApproval';



export default function MainHostStack() {

  const navigation = useNavigation()
  const CustomChatHeader = ({schedule}) => (
    
    <View>
      <View style={{ flexDirection: 'row', backgroundColor: COLORS.primary, paddingTop: 20, paddingBottom:10, paddingLeft:10}}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight:15,  marginTop:10 }}>
          <AntDesign name="arrowleft" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={{ marginTop:10 }}>
          <Text style={{ color: COLORS.white, fontSize: 20, fontWeight:'500' }}>{schedule.schedule.apartment_name}</Text>
          <Text style={{ color: COLORS.white, fontSize: 14 }}>{schedule.schedule.address} </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems:'center', backgroundColor:COLORS.primary_light_1, paddingVertical:6, borderBottomWidth:0.5, borderBottomColor:COLORS.light_gray}}>
        <MaterialCommunityIcons name="calendar" style={{marginLeft:5}} size={20} color={COLORS.gray} />
        <Text style={{ fontSize: 14, marginTop:0, color:COLORS.gray }}> Schedule {moment(schedule.schedule.cleaning_date).format('ddd MMM D')},  {moment(schedule.schedule.cleaning_time, 'h:mm:ss A').format('h:mm A')}</Text>
      </View>
    </View>
  );

  

    const Stack = createStackNavigator()
    return (
      <BookingProvider>
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
                name={ROUTES.host_dashboard}
                component={DrawerNavigator}
                options = {{
                    headerShown:false
                }}
          />
    
          <Stack.Screen 
            name={ROUTES.host_profile}
            component={Profile} 
            
            options={({route}) => ({
                headerShown:false,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Profile",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
            })}
          />
          <Stack.Screen 
            name={ROUTES.host_schedule_details}
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
            name={ROUTES.host_add_apt}
            component={AddApartment} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Add Property",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
            })}
          />
          <Stack.Screen 
            name={ROUTES.host_apt_dashboard}
            component={ApartmentDashboard} 
            
            options={({route}) => ({
                
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Apartment Dashboard",
              })}
          />

          <Stack.Screen 
            name={ROUTES.host_new_booking}
            component={NewBooking} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Add Property",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
            })}
          />
          <Stack.Screen 
            name={ROUTES.host_recommended_cleaners}
            component={RecommendedCleaners} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Recommended Cleaners",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
            })}
          />
          {/* <Stack.Screen 
            name={ROUTES.host_schedule_approval}
            component={ScheduleApproval} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Recommended Cleaners",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
            })}
          /> */}
          <Stack.Screen 
            name={ROUTES.cleaner_profile_info}
            // component={CleanerProfile} 
            component={CleanerProfileHost}
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "About Cleaner",
                headerRight: () => (
                  <View style={{ flexDirection:'row', paddingRight: 10 }}>
                    <MaterialCommunityIcons name="bookmark" style={{marginLeft:5}} size={20} color={COLORS.white} />
                    <MaterialCommunityIcons name="share" style={{marginLeft:5}} size={20} color={COLORS.white} />
                  </View>
                ),
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
            })}
          />
          <Stack.Screen 
            name={ROUTES.host_confirm}
            component={Confirmation} 
            
            options={({route}) => ({
                headerShown:false,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Confirm Request",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
              })}
          />
          <Stack.Screen 
            name={ROUTES.chat_conversation}
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
            name={ROUTES.host_task_progress}
            component={TaskProgress} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Task Progress",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:true,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
              })}
          />
          {/* <Stack.Screen 
            name={ROUTES.host_checkout}
            component={Checkout} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Checkout",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:true,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
              })}
          /> */}

          <Stack.Screen 
            name={ROUTES.host_checkout}
            component={PaymentCheckout} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Checkout",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:true,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
              })}
          />
          <Stack.Screen 
            name={ROUTES.host_single_checkout}
            component={PaymentSingleCheckout} 
            
            options={({route}) => ({
                headerShown:true,
                headerTintColor: COLORS.white,
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                title: "Checkout",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:true,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
              })}
          />
          
          {/* <Stack.Screen 
            name={ROUTES.reviews}
            component={AllReviews} 
    
            options={({route})=>({
              title:route.params?.title,
              headerTintColor: COLORS.white,
              headerStyle: {
                backgroundColor:COLORS.primary,
              },
              
              headerTitleStyle: {
                fontWeight: '600',
                fontSize:16,
                color:COLORS.white
              },
              
          })} 
            
            
          /> */}
        </Stack.Navigator>
      </BookingProvider>
      )
}

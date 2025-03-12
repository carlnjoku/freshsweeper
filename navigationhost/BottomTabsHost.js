import React, {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute, DrawerActions } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import IconWithBadge from '../components/IconWithBadge';
import ROUTES from '../constants/routes';
import Dashboard from '../screens/host/Dashboard';
import JobDetails from '../screens/cleaner/JobDetails';
import Jobs from '../screens/cleaner/Jobs';
import COLORS from '../constants/colors';
import Messages from '../screens/host/Messages';
import Conversations from '../screens/host/Conversations';
import Profile from '../screens/host/Profile';
import More from '../screens/host/more/More';
import Bookings from '../screens/host/Bookings';
import FindCleaners from '../screens/host/FindCleaners';
import { TransitionPresets } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



const MessageStack = () => {
    return (
      <Stack.Navigator 
        screenOptions={{
          ...TransitionPresets.FadeFromBottomAndroid, // Zoom-In Effect
          headerTintColor:COLORS.white,
          headerBackTitleVisible:false,
          headerStyle:{
            backgroundColor:COLORS.primary
          }
        }} 
        initialRouteName={ROUTES.cleaner_messages}   
      >
        <Stack.Screen 
          name={ROUTES.cleaner_messages}
          component={Messages} 
          
          options={({route}) => ({
            headerShown:false,
            title: "Chat Messages",
            headerTintColor:COLORS.white,
            headerBackTitleVisible:false,
            headerStyle:{
                backgroundColor:COLORS.primary
            }
        })}
        />
        

        <Stack.Screen 
          name={ROUTES.host_conversations}
          component={Conversations} 
          
          options={({route}) => ({
              
            //   title: route.params?.title,
              title: "Job Details",
              headerShown:false
            })}
        />
      </Stack.Navigator>
    )
  }

const JobStack = () => {
    <Stack.Navigator 
        screenOptions={{
          headerTintColor:COLORS.white,
          headerBackTitleVisible:false,
          headerStyle:{
            backgroundColor:COLORS.primary
          }
        }} 
        initialRouteName={ROUTES.cleaner_jobs}   
      >
        <Stack.Screen 
            component={Bookings}
            name={ROUTES.cleaner_jobs}
            options={({route})=>({
          
              title:"Jobs",
              headerStyle: {
                backgroundColor:COLORS.primary,
              },
              headerTitleStyle: {
                fontWeight: '600',
                fontSize:16,
                color:COLORS.white,
              },
              
            //   cardStyleInterpolator:
            //   CardStyleInterpolators.forFadeFromBottomAndroid,
            })}
            
          />

      </Stack.Navigator>

      

    
}


function BottomTabsHost() {

  const { totalUnreadCount } = useContext(AuthContext);
  
  return (
    <Tab.Navigator 
    
      screenOptions={({ route }) => ({
        ...TransitionPresets.FadeFromBottomAndroid, // Zoom-In Effect
        headerShown:true,
        headerStyle: {
          backgroundColor: '#fff', // Background color of the header
          elevation: 5, // Adds elevation for Android
          shadowColor: '#000', // Shadow color for iOS
          shadowOpacity: 0.3, // Shadow opacity for iOS
          shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
          shadowRadius: 3, // Shadow radius for iOS
        },
        tabBarActiveTintColor:COLORS.primary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === ROUTES.host_home_tab) {
            iconName = focused ? 'home-outline' : 'home-outline';
          } else if (route.name === ROUTES.host_dashboard) {
            iconName = focused ? 'search' : 'search';
          } else if (route.name === ROUTES.host_bookings) {
            iconName = focused ? 'calendar-outline' : 'calendar-outline';
          } else if (route.name === ROUTES.host_messages) {
            iconName = focused ? 'chatbox-ellipses-outline' : 'chatbox-ellipses-outline';
            return <IconWithBadge icon={iconName} badgeCount={totalUnreadCount} size={22} color={color} />;
          } else if (route.name === ROUTES.host_find_cleaners) {
            iconName = focused ? 'search' : 'search';
          } else if (route.name === ROUTES.host_more) {
            iconName = focused ? 'menu-outline' : 'menu-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          let label;

          if (route.name === ROUTES.host_home_tab) {
            label = 'Home';
          } else if (route.name === ROUTES.host_bookings) {
            label = 'Schedule';
          } else if (route.name === ROUTES.host_messages) {
            label = 'Chats';
          } else if (route.name === ROUTES.host_find_cleaners) {
            label = 'Find Cleaners';
          } else if (route.name === ROUTES.host_more) {
            label = 'More';
          }

          return (
            <Text style={{ color, fontSize:12, marginTop: -8, marginBottom: focused ? 4 : 4 }}>
              {label}
            </Text>
          );
        },
      })}
    >



      <Tab.Screen name={ROUTES.host_home_tab} 
        component={Dashboard}
        options={({route}) => ({
          headerShown:true,
          title: "Dashboard",
        })}
      />
      <Tab.Screen 
        name={ROUTES.host_bookings} 
        component = {Bookings} 
        options={({route}) => ({
          headerShown:false,
          headerTintColor: COLORS.white,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          title: "Schedules",
          // headerTintColor:COLORS.white,
          // headerBackTitleVisible:false,
          // headerStyle:{
          //     backgroundColor:COLORS.primary
          // }
      })}
      />
      
      {/* <Tab.Screen name={ROUTES.host_profile} component={Profile} /> */}
      <Tab.Screen 
        name={ROUTES.host_find_cleaners} 
        component={FindCleaners} 
        options={({route}) => ({
          headerShown:false,
          headerTintColor: COLORS.primary,
          headerBackTitleVisible: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          title: "Find Cleaners",
          headerStyle:{
              backgroundColor:COLORS.primary
          }
      })}
      />

      
      <Tab.Screen name={ROUTES.host_messages} component={MessageStack} />
      <Tab.Screen 
        name={ROUTES.cleaner_more} 
        component={More} 
        listeners={({ navigation }) => ({
            tabPress: e => {
              navigation.dispatch(DrawerActions.openDrawer())
              e.preventDefault()
            }
        })}
      />
    </Tab.Navigator>
  );
}

export default BottomTabsHost

const styles = StyleSheet.create({})
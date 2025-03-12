import React, {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute, DrawerActions } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import IconWithBadge from '../components/IconWithBadge';
import ROUTES from '../constants/routes';
import Dashboard from '../screens/cleaner/Dashboard';
import JobDetails from '../screens/cleaner/JobDetails';
import Jobs from '../screens/cleaner/Jobs';
import COLORS from '../constants/colors';
import Messages from '../screens/cleaner/Messages';
import Conversations from '../screens/cleaner/Conversations';
import Profile from '../screens/cleaner/Profile';
import More from '../screens/cleaner/more/More';
import { useNavigation, useRoute } from '@react-navigation/native';
import Schedules from '../screens/cleaner/Schedules';
import SchedulePreview from '../screens/cleaner/SchedulePreview';
import DashboardMock from '../screens/cleaner/DashboardMock';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const MessageStack = () => {
  
  const route = useRoute();
  
  // console.log(route)
    return (
      <Stack.Navigator 
        screenOptions={{
          headerTintColor:COLORS.white,
          headerBackTitleVisible:false,
          headerStyle:{
            backgroundColor:COLORS.primary
          },
          headerStyle: {
            backgroundColor: '#fff', // Background color of the header
            elevation: 5, // Adds elevation for Android
            shadowColor: '#000', // Shadow color for iOS
            shadowOpacity: 0.3, // Shadow opacity for iOS
            shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
            shadowRadius: 3, // Shadow radius for iOS
          },
        }} 
        
        initialRouteName={ROUTES.cleaner_messages}  
       
      >
        <Stack.Screen 
          name={ROUTES.cleaner_messages}
          component={Messages} 
          
          options={({route}) => ({
            headerShown:true,
            title: "Chat Messages",
            headerTintColor:COLORS.gray,
            headerBackTitleVisible:false,
            headerStyle: {
              backgroundColor: '#fff', // Background color of the header
              elevation: 5, // Adds elevation for Android
              shadowColor: '#000', // Shadow color for iOS
              shadowOpacity: 0.3, // Shadow opacity for iOS
              shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
              shadowRadius: 3, // Shadow radius for iOS
            },
        })}
        />

        <Stack.Screen 
          name={ROUTES.cleaner_conversations}
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

const ScheduleStack = () => {
  
  const route = useRoute();
  
  // console.log(route)
    return (
      <Stack.Navigator 
        screenOptions={{
          headerTintColor:COLORS.white,
          headerBackTitleVisible:false,
          headerStyle:{
            backgroundColor:COLORS.primary
          }
        }} 
        initialRouteName={ROUTES.cleaner_schedules}  
       
      >
        <Stack.Screen 
          name={ROUTES.cleaner_schedules}
          component={Schedules} 
          
          options={({route}) => ({
            headerShown:false,
            title: "My Schedules",
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
              
            //   title: route.params?.title,
              title: "Schedule Details",
              headerShown:false
            })}
        />

        
      </Stack.Navigator>
    )
  }

const JobStack = () => {

  return (
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
            component={Jobs}
            name={ROUTES.cleaner_jobs}
            options={({route})=>({
          
                headerShown:true,
                title: "Explore Schedules",
                headerTintColor:COLORS.white,
                headerBackTitleVisible:false,
                headerStyle:{
                    backgroundColor:COLORS.primary
                }
            
            //   cardStyleInterpolator:
            //   CardStyleInterpolators.forFadeFromBottomAndroid,
            })}
            
          />

        {/* <Stack.Screen 
          name={ROUTES.cleaner_job_details}
          component={JobDetails}
          
          options={({route}) => ({
            headerShown:true,
            title: "Jobss Details",
            headerTintColor:COLORS.white,
            headerBackTitleVisible:false,
            headerStyle:{
                backgroundColor:COLORS.primary
            },
            
          })}
        /> */}

        


      </Stack.Navigator>
  )

      

    
}


function BottomTabs() {
  const { totalUnreadCount } = useContext(AuthContext);
  
  return (
    <Tab.Navigator 
    
      screenOptions={({ route }) => ({
        
        headerShown:false,
        tabBarActiveTintColor:COLORS.primary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === ROUTES.cleaner_home_tab) {
            iconName = focused ? 'home-outline' : 'home-outline';
          // } else if (route.name === ROUTES.cleaner_dashboard) {
          //   iconName = focused ? 'search' : 'search';
          } else if (route.name === ROUTES.cleaner_jobs) {
            iconName = focused ? 'search' : 'search';
          } else if (route.name === ROUTES.cleaner_schedules) {
            iconName = focused ? 'calendar-outline' : 'calendar-outline';
          } else if (route.name === ROUTES.cleaner_messages) {
            iconName = focused ? 'chatbox-ellipses-outline' : 'chatbox-ellipses-outline';
            return <IconWithBadge icon={iconName} badgeCount={totalUnreadCount} size={22} color={color} />;
          } else if (route.name === ROUTES.cleaner_profile) {
            iconName = focused ? 'person-outline' : 'person-outline';
          } else if (route.name === ROUTES.cleaner_more) {
            iconName = focused ? 'menu-outline' : 'menu-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          let label;

          if (route.name === ROUTES.cleaner_home_tab) {
            label = 'Home';
          } else if (route.name === ROUTES.cleaner_jobs) {
            label = 'Explore';
          } else if (route.name === ROUTES.cleaner_schedules) {
            label = 'Schedules';
          } else if (route.name === ROUTES.cleaner_messages) {
            label = 'Chat';
          } else if (route.name === ROUTES.cleaner_profile) {
            label = 'Profile';
          } else if (route.name === ROUTES.cleaner_more) {
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



      <Tab.Screen 
        name={ROUTES.cleaner_home_tab} 
        component={Dashboard} 
        options={({route})=>({
          
          headerShown:true,
          title: "",
          headerTintColor:COLORS.white,
          // headerBackTitleVisible:true,
          headerStyle:{
              backgroundColor:COLORS.primary
          }
      
      //   cardStyleInterpolator:
      //   CardStyleInterpolators.forFadeFromBottomAndroid,
      })}
        />
      
      <Tab.Screen 
        name={ROUTES.cleaner_jobs} 
        component={JobStack} 
      />
      <Tab.Screen 
        name={ROUTES.cleaner_schedules} 
        component={ScheduleStack} />
      <Tab.Screen 
        name={ROUTES.cleaner_messages} 
        component={MessageStack} />
      
      {/* <Tab.Screen name={ROUTES.cleaner_profile} component={Profile} /> */}
      {/* <Tab.Screen name={ROUTES.cleaner_more} component={More} /> */}
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

export default BottomTabs

const styles = StyleSheet.create({})
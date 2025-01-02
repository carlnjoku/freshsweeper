import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
// import { BusinessProfile, MyListings, Profile, SavedListings, StoreProfile, SubCategoriesList } from '../screens';
import ROUTES from '../constants/routes';
import COLORS from '../constants/colors';
import BottomTabs from './BottomTabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomDrawer from '../components/CustomDrawer';
import Dashboard from '../screens/cleaner/Dashboard';
import Support from '../screens/cleaner/Support';
import Settings from '../screens/cleaner/Settings';
import Applications from '../screens/cleaner/Applications';
import Profile from '../screens/cleaner/Profile';
import JobDetails from '../screens/cleaner/JobDetails';
import ApplicationDetails from '../screens/cleaner/ApplicationDetails';
import Payment from '../screens/cleaner/Payment';






const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    drawerContent={props=><CustomDrawer {...props} />}
    screenOptions={{
        // headerShown:false,
        drawerActiveBackgroundColor:COLORS.primary_light_1,
        drawerActiveTintColor:COLORS.primary,
        drawerLabelStyle: {
            marginLeft:-20
        }
    }} 
    >
      <Drawer.Screen 
        name={ROUTES.cleaner_home_drawer} 
        component={BottomTabs} 
        options={{
            title:"Home",
            headerShown:false,
            drawerIcon:({focus, color, size}) => (
                <Ionicons name="home-outline" size={20} color={color} />
            )
        }}
      />
      
      <Drawer.Screen 
        name={ROUTES.cleaner_personal_profile_drawer} component={Dashboard}
        options={{
            title:"More",
            headerTintColor:COLORS.white,
            headerBackTitleVisible:true,
            headerStyle:{
                backgroundColor:COLORS.primary
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.white,
            },
            drawerIcon:({focus, color, size}) => (
                <Ionicons name="person-outline" size={20} color={color} />
            )
        }} 
      />
      <Drawer.Screen 
        name={ROUTES.cleaner_profile} 
        component={Profile} 
        options={{
            title:"Edit Profile",
            headerTintColor:COLORS.white,
            headerBackTitleVisible:true,
            headerStyle:{
                backgroundColor:COLORS.primary
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.white,
            },
            drawerIcon:({focus, color, size}) => (
                <MaterialCommunityIcons name="storefront-outline" size={20} color={color} />
            )
        }}
      />
      
      <Drawer.Screen 
        name={ROUTES.cleaner_support} 
        component={Support} 
        options={{
            title:"Support",
            headerTintColor:COLORS.white,
            headerBackTitleVisible:true,
            headerStyle:{
                backgroundColor:COLORS.primary
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.white,
            },
            drawerIcon:({focus, color, size}) => (
                <MaterialCommunityIcons name="storefront-outline" size={20} color={color} />
            )
        }}
      />
      
      <Drawer.Screen 
        name={ROUTES.cleaner_application} component={Applications} 
        options={{
            title:"Applications",
            headerTintColor:COLORS.white,
            headerBackTitleVisible:true,
            headerStyle:{
                backgroundColor:COLORS.primary
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.white,
            },
            drawerIcon:({focus, color, size}) => (
                <Ionicons name="list-sharp" size={20} color={color} />
            )
        }}
      />

      <Drawer.Screen 
          name={ROUTES.cleaner_job_application_details}
          component={ApplicationDetails} 
          
          options={({route}) => ({
            headerShown:true,
            title: "Job Application Details",
            headerTintColor:COLORS.white,
            headerBackTitleVisible:false,
            headerStyle:{
                backgroundColor:COLORS.primary
            },
            
          })}
        />
      {/* <Drawer.Screen 
        name={ROUTES.my_rating_reviews} 
        component={MyReviews} 
        options={{
            title:ROUTES.my_rating_reviews,
            headerTintColor:COLORS.white,
            headerBackTitleVisible:true,
            headerStyle:{
                backgroundColor:COLORS.primary
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.white,
            },
            drawerIcon:({focus, color, size}) => (
                <Ionicons name="star-outline" size={20} color={color} />
            )
        }}
      /> */}
      {/* <Drawer.Screen 
        name={ROUTES.saved_listings_drawer} component={SavedListings} 
        options={{
            title:"Saved Listings",
            drawerIcon:({focus, color, size}) => (
                <Ionicons name="save-outline" size={20} color={color} />
            )
        }}
      /> */}
      <Drawer.Screen 
        name={ROUTES.cleaner_settings} 
        component={Settings} 
        options={{
            title:"Settings",
            headerTintColor:COLORS.white,
            headerBackTitleVisible:true,
            headerStyle:{
                backgroundColor:COLORS.primary
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.white,
            },
            drawerIcon:({focus, color, size}) => (
                <Ionicons name="settings-outline" size={20} color={color} />
            )
        }}
        
      />
      
      
    </Drawer.Navigator>
    
  )
}

export default DrawerNavigator

const styles = StyleSheet.create({})
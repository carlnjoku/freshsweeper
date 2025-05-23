import { StyleSheet, Text, View, useContext } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
// import { BusinessProfile, MyListings, Profile, SavedListings, StoreProfile, SubCategoriesList } from '../screens';
import ROUTES from '../constants/routes';
import COLORS from '../constants/colors';
import BottomTabsHost from './BottomTabsHost';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomDrawer from '../components/CustomDrawer';
import Dashboard from '../screens/host/Dashboard';
import Support from '../screens/host/Support';
import Settings from '../screens/host/Settings';
import Profile from '../screens/host/Profile';
import Applications from '../screens/cleaner/Applications';
import Application from '../screens/host/Application';
import { AuthContext } from '../context/AuthContext';
import PaymentHistory from '../screens/host/Payment/PaymentHistory';
import Apartments from '../screens/host/Apartments';
import PaymentScreen from '../screens/host/Payment';
import OutstandingPayments from '../screens/host/Payment/OutstandingPayments';
import EditApartment from '../screens/host/EditApartment';






const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const applicationCounts = 6


const ApartmentStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerTintColor:COLORS.white,
        headerBackTitleVisible:false,
        headerStyle:{
          backgroundColor:COLORS.primary
        }
      }} 
      initialRouteName={ROUTES.host_apartments}   
    >
      <Stack.Screen 
        name={ROUTES.cleaner_messages}
        component={Apartments} 
        
        options={({route}) => ({
          headerShown:false,
          title: "Apartments",
          headerTintColor:COLORS.white,
          headerBackTitleVisible:false,
          headerStyle:{
              backgroundColor:COLORS.primary
          }
      })}
      />
      
      

      
      

    </Stack.Navigator>
  )
}

const DrawerNavigator = () => {
  // const {applicationCounts} = useContext(AuthContext)
  return (
    <Drawer.Navigator
    drawerContent={props=><CustomDrawer {...props} />}
    screenOptions={{
        // headerShown:false,
        drawerActiveBackgroundColor:COLORS.primary_light_1,
        drawerActiveTintColor:COLORS.primary,
        drawerLabelStyle: {
            marginLeft:-20
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
    >
      <Drawer.Screen 
        name={ROUTES.host_home_drawer} 
        component={BottomTabsHost} 
        options={{
            title:"Home",
            headerShown:false,
            drawerIcon:({focus, color, size}) => (
                <Ionicons name="home-outline" size={20} color={color} />
            )
        }}
      />
      
      {/* <Drawer.Screen 
        name={ROUTES.cleaner_personal_profile_drawer} component={Dashboard}
        options={{
            title:"Notifications",
            headerTintColor:COLORS.gray,
            headerBackTitleVisible:true,
            headerStyle: {
              backgroundColor: '#fff', // Background color of the header
              elevation: 5, // Adds elevation for Android
              shadowColor: '#000', // Shadow color for iOS
              shadowOpacity: 0.3, // Shadow opacity for iOS
              shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
              shadowRadius: 3, // Shadow radius for iOS
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.white,
            },
            // drawerIcon:({focus, color, size}) => (
            //     <MaterialCommunityIcons name="bell-outline" size={20} color={color} />
            // )

            drawerLabel: ({ focused,color }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons name="bell-outline" size={20} color={color} />
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width:'100%' }}>
                <Text style={{ color, fontSize: 16, marginLeft: 10 }}>Notifications</Text>
                {applicationCounts > 0 && (
                  <View
                    style={{
                      backgroundColor: 'red',
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 8,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 12 }}>{applicationCounts}</Text>
                  </View>
                )}
                </View>
                
                
              </View>
            ),
        }} 
      /> */}
      {/* <Drawer.Screen 
        name={ROUTES.host_application} 
        component={Application} 
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
            

            drawerLabel: ({ focused,color }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons name="storefront-outline" size={20} color={color} />
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width:'100%' }}>
                <Text style={{ color, fontSize: 16, marginLeft: 10 }}>Applications</Text>
                {applicationCounts > 0 && (
                  <View
                    style={{
                      backgroundColor: 'red',
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 8,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 12 }}>{applicationCounts}</Text>
                  </View>
                )}
                </View>
                
                
              </View>
            ),
        }}
      /> */}
      <Drawer.Screen 
        name={ROUTES.host_profile} 
        component={Profile} 
        options={{
            title:"My Profile",
            headerTintColor:COLORS.gray,
            headerBackTitleVisible:true,
            headerStyle: {
              backgroundColor: '#fff', // Background color of the header
              elevation: 5, // Adds elevation for Android
              shadowColor: '#000', // Shadow color for iOS
              shadowOpacity: 0.3, // Shadow opacity for iOS
              shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
              shadowRadius: 3, // Shadow radius for iOS
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.gray,
            },
            drawerIcon:({focus, color, size}) => (
                <MaterialCommunityIcons name="account-outline" size={20} color={color} />
            )
        }}
      />
      
      <Drawer.Screen 
        name={ROUTES.host_my_apartment} 
        component={ApartmentStack} 
        
        options={{
            title:"My Apartments",
            headerTintColor:COLORS.gray,
            headerBackTitleVisible:true,
            headerStyle: {
              backgroundColor: '#fff', // Background color of the header
              elevation: 5, // Adds elevation for Android
              shadowColor: '#000', // Shadow color for iOS
              shadowOpacity: 0.3, // Shadow opacity for iOS
              shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
              shadowRadius: 3, // Shadow radius for iOS
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.gray,
            },
            drawerIcon:({focus, color, size}) => (
                <AntDesign name="home" size={19} color={color} />
            )
        }}
      />

      <Drawer.Screen 
        name={ROUTES.host_payment_history} 
        // component={PaymentHistory} 
        // component={PaymentScreen} 
        component={PaymentHistory}
        options={{
            title:"Payment History",
            headerTintColor:COLORS.gray,
            headerBackTitleVisible:true,
            headerStyle: {
              backgroundColor: '#fff', // Background color of the header
              elevation: 5, // Adds elevation for Android
              shadowColor: '#000', // Shadow color for iOS
              shadowOpacity: 0.3, // Shadow opacity for iOS
              shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
              shadowRadius: 3, // Shadow radius for iOS
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.gray,
            },
            
            drawerIcon:({focus, color, size}) => (
                <MaterialCommunityIcons name="credit-card-outline" size={20} color={color} />
            )
        }}
        
      />

      <Drawer.Screen 
        name={ROUTES.cleaner_support} 
        component={Support} 
        options={{
            title:"Support",
            headerTintColor:COLORS.gray,
            headerBackTitleVisible:true,
            headerStyle: {
              backgroundColor: '#fff', // Background color of the header
              elevation: 5, // Adds elevation for Android
              shadowColor: '#000', // Shadow color for iOS
              shadowOpacity: 0.3, // Shadow opacity for iOS
              shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
              shadowRadius: 3, // Shadow radius for iOS
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.gray,
            },
            drawerIcon:({focus, color, size}) => (
                <MaterialCommunityIcons name="lifebuoy" size={20} color={color} />
            )
        }}
      />
      
      {/* <Drawer.Screen 
        name={ROUTES.my_listings_drawer} component={MyListings} 
        options={{
            title:"My Listings",
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
      /> */}
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
            headerTintColor:COLORS.gray,
            headerBackTitleVisible:true,
            headerStyle: {
              backgroundColor: '#fff', // Background color of the header
              elevation: 5, // Adds elevation for Android
              shadowColor: '#000', // Shadow color for iOS
              shadowOpacity: 0.3, // Shadow opacity for iOS
              shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
              shadowRadius: 3, // Shadow radius for iOS
            },
            
            headerTitleStyle: {
              fontWeight: '600',
              fontSize:16,
              color:COLORS.gray,
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
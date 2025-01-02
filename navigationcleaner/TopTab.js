import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { StyleSheet, Text, View } from 'react-native';
import TaskChecklist from '../screens/cleaner/TaskChecklist';
import COLORS from '../constants/colors';
import AfterPhoto from '../screens/cleaner/AfterPhoto';
import BeforePhoto from '../screens/cleaner/BeforePhoto';


export default function TopTab() {

const TopTabNav = createMaterialTopTabNavigator()
  return (
    <TopTabNav.Navigator
        tabBarOptions={{
            style: styles.tabBar,
            activeTintColor: COLORS.primary, // Color of the active tab
            inactiveTintColor: COLORS.gray, // Color of the inactive tabs
            indicatorStyle: {
                backgroundColor: COLORS.primary, // Color of the bottom border of the active tab
                height: 2, // Height of the bottom border
            },
            
        }}
    >
        <TopTabNav.Screen 
            name="before photos" component={BeforePhoto} 
            options={{
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="camera" color={color} size={24} />
                ),
                tabBarLabelStyle: {
                    fontSize: 15, // Font size of the tab bar labels
                    fontWeight:"bold",
                    textTransform: 'capitalize', // Transformation of the tab bar labels
                },
              }}
        />
        <TopTabNav.Screen 
            name="after photos" 
            component={AfterPhoto}
            options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="camera-flip" color={color} size={24} />
                ),
                tabBarLabelStyle: {
                    fontSize: 15, // Font size of the tab bar labels
                    fontWeight:"bold",
                    textTransform: 'capitalize', // Transformation of the tab bar labels
                },
              }} 
        />
        <TopTabNav.Screen 
            name="checklist" 
            component={TaskCheckList}
            options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="format-list-checks" color={color} size={24} />
                ),
                tabBarLabelStyle: {
                    fontSize: 15, // Font size of the tab bar labels
                    fontWeight:"bold",
                    textTransform: 'capitalize', // Transformation of the tab bar labels
                },
              }}
        />
    </TopTabNav.Navigator>
    
  )
}


const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabBar: {
      backgroundColor: 'white', // Background color of the tab bar
    },
  });
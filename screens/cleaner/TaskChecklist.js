import React, { useContext, useEffect,useState } from 'react';
// import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar,CheckBox, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import Text2 from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TaskImages from '../../components/TaskImages';
import GoogleMapAndUsers from '../../components/GoogleMapAndUsers';
import * as Animatable from 'react-native-animatable';
import { task_checklist } from '../../data';
import Checklist from '../../components/Checklist';
import { Text } from 'react-native-paper';

export default function TaskChecklist() {
    
  return (
    <SafeAreaView
          style={{
            flex:1,
            backgroundColor:COLORS.white,
            marginBottom:0,

          }}
        >
        <Animatable.View animation="slideInRight" duration={550}>
          <ScrollView>
            <View style={styles.container}>
            <Text style={{fontSize:18, marginBottom:5, fontWeight:'bold' }}>Update Checklist</Text>
                <Text style={{fontSize:14, marginBottom:15, color:COLORS.gray}}>
                  Update your checklis list to ensure all tasks have been one before you clock-out
                </Text>
                <Checklist checklist={task_checklist} />
            </View>
          </ScrollView>
        </Animatable.View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    container:{
        marginHorizontal:10,
        marginVertical:20
      },
})

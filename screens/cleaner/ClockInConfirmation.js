import React, { useContext, useEffect,useState } from 'react';
import Text from '../../components/Text';
import { SafeAreaView, StyleSheet, Dimensions, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import ROUTES from '../../constants/routes';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import userService from '../../services/userService';
import TimeConversion from '../../utils/TimeConversion1';


export default function ClockInConfirmation({
  cleaning_date, 
  cleaning_time, 
  close_modal,
  scheduleId,
  total_cleaning_time,
  cleanerId
}) {
    
    const navigation = useNavigation()
    
    const goToUploadPhotos = async(schId) => {
    
        const data = {
          scheduleId:schId,
          cleanerId:cleanerId
        }
        console.log(data)
        await userService.clockIn(data)
        .then(response => {
          const res = response.data
          console.log(res)
        })
       
        navigation.navigate(ROUTES.cleaner_attach_task_photos,{scheduleId:schId})
        // close_modal(false)
    }

    const onClose = () => {
      close_modal(false)
  }

    
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
            
        <View style={styles.close_button}><MaterialCommunityIcons name="close" color={COLORS.gray} size={24} onPress={onClose} />
        
        <View>
          <Text style={styles.heading}>Confirmation</Text>

          <View style={styles.detailsContainer}>
              <Text style={styles.label}>Task Details:</Text>
              <Text style={styles.details}>Regular Cleaning</Text>
              <Text style={styles.details}>Date: {cleaning_date}</Text>
              <Text style={styles.details}>Time: {cleaning_time}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Estimated Time of Arrival (ETA):</Text>
            <TimeConversion minutes={total_cleaning_time} />
            {/* <Text style={styles.details}>20mins</Text> */}
          </View>

            <TouchableOpacity 
              onPress={() => goToUploadPhotos(scheduleId)} style={styles.button} 
            >
              
              <Text bold style={styles.button_text}> Confirm</Text>
            </TouchableOpacity>
          
        </View>
        </View>

     
        </View>
    </View>
 
    
  )
}

const windowHeight = Dimensions.get('window').height;
const modalHeight = windowHeight * 0.65;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
  },
  button: {
    flexDirection:'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical:20,
    justifyContent:'center',
    backgroundColor: COLORS.primary,
    borderRadius:50
  },
  button_text:{
    color:COLORS.white
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    // borderRadius: 10,
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    elevation: 5,
    height: modalHeight, // Set the height of the modal
    width: '100%',
  },
  close_button:{
   
    alignItems:'flex-end'
  }
});


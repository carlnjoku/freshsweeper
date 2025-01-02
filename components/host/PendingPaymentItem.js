import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, FlatList, Keyboard,KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import moment from 'moment';
import { Button } from 'react-native-paper';
import ROUTES from '../../constants/routes';
import { useNavigation } from '@react-navigation/native';


export default function PendingPaymentItem({item}) {

//  console.log("Payment", JSON.stringify(item, null, 2))
  const navigation = useNavigation();

  const pending_payment = item.item
  // console.log("Payments", JSON.stringify(pending_payment, null, 2))
  // alert(pending_payment.cleaner.expo_push_token)
   // Handle proceed to checkout

//  pending_payment.schedule.schedule?.total_cleaning_fee, 
//   pending_payment._id,
//   pending_payment.cleaner.expo_push_token,
// pending_payment.sender_expo_push_token,
// console.log("item", pending_payment.cleaner._id)



   const handleProceedToCheckout = () => {
    // console.log(selectedPayments)
    navigation.navigate(ROUTES.host_single_checkout, { 
      cleaning_fee:pending_payment.schedule.schedule?.total_cleaning_fee, 
      scheduleId: pending_payment.scheduleId,
      cleaner_expo_token: pending_payment.cleaner.expo_push_token,
      cleanerId: pending_payment.cleaner._id,
      cleaner_avatar: pending_payment.cleaner.avatar,
      cleaner_firstname: pending_payment.cleaner.firstname,
      cleaner_lastname: pending_payment.cleaner.lastname,
      host_expo_token: pending_payment.sender_expo_push_token,
      schedule:pending_payment.schedule.schedule
  
    });
    // if (pending_payment < 0) {
    //   navigation.navigate(ROUTES.host_checkout, { payment:pending_payment.schedule?.total_cleaning_fee });
    // } else {
    //   alert("Please select at least one payment to proceed.");
    // }
  };
  return (
    <View style={styles.scheduleCard}>
      <View style={styles.details}>
        <View style={{flex: 0.7}}>
          <Text style={styles.apart_name}>Cleaning @ {pending_payment.schedule.schedule.apartment_name}</Text>
          <Text style={styles.apartment}>{pending_payment.schedule?.address} </Text>
        </View>
                  
        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
          <Text style={styles.date}>{moment(pending_payment.schedule.schedule?.cleaning_date, 'ddd MMM DD YYYY').format('ddd MMM DD')}</Text>
          <Text style={styles.time}>{moment(pending_payment.schedule.schedule?.cleaning_time, 'h:mm:ss A').format('h:mm A')}</Text>
          {/* <Ionicons name="chevron-forward-outline" color={COLORS.secondary} size={16}></Ionicons> */}
        </View>
      </View>
      <View style={styles.action}>
        <Text style={styles.fee}>${pending_payment.schedule?.schedule.total_cleaning_fee}</Text>
        <Button
          mode="contained"
          // onPress={() => handleClaim(item.id)}
          onPress={handleProceedToCheckout}
          style={styles.claimButton}
        >
          Pay Now 
        </Button>
      </View>
      
    </View>
    
  )
}

const styles = StyleSheet.create({
  scheduleCard:{
    padding: 15, 
    borderRadius: 12, 
    backgroundColor: '#e9f5ff', 
    marginVertical: 0,
   
  },
  details: { 
    flexDirection:'row',
  },
  date_time:{
    flex: 0.25,
    alignItems:'flex-end',
    marginRight:5
  },
  apart_name: {
    fontWeight:'500'
  },
  apartment:{
    color:COLORS.gray,
    fontSize:13,
  },
  date:{
    marginTop:-4,
    fontSize:12,
    fontWeight:'500'
    // color:COLORS.gray
  },
  time:{
    marginTop:4,
    fontSize:12,
    // color:COLORS.gray
  },
  claimButton:{
    backgroundColor:COLORS.primary,
    // marginRight:10
  },
  action:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  fee:{
    fontSize:20,
    fontWeight:'600'
  }
})

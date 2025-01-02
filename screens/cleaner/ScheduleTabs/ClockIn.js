import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import COLORS from '../../../constants/colors';
import moment from 'moment';
import ROUTES from '../../../constants/routes';
import { sendExpoPushNotification } from '../../../utils/sendPushNotification';
import { useNavigation } from '@react-navigation/native';
import userService from '../../../services/userService';

const ClockIn = ({ route }) => {

  const {schedule} = route.params

  const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [distance_0, setDistance] = useState(null);
  const [status, setStatus] = useState("Not Clocked In");

//   console.log("Current Schedule", (JSON.stringify(schedule, null,2)))
  
  const handleClockIn = async () => {
    const userLocation = await Location.getCurrentPositionAsync({});
    const distance = calculateDistance(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      schedule.schedule.apartment_latitude,
      schedule.schedule.apartment_longitude
    );
    setDistance(distance)
    if (distance <= 0.05) { // e.g., within 100 meters
      setStatus("Clocked In");
      
      alert(schedule.hostInfo.expo_push_token)
      // Send notification to host

      sendExpoPushNotification(
        schedule.hostInfo.expo_push_token,
        "Cleaner Clocked In!",
        "The cleaner has successfully clocked in and started cleaning for Schedule. We'll notify you once the cleaning is completed. Sit back and relax!",
            {
            screen: ROUTES.host_task_progress,
            params: {
                scheduleId: schedule._id, 
            },
            }

        );
        
    //   }).catch((err)=> {
    //     console.log(err)
    //   })

    //   alert("Clocked In Successfully!");

    const data = {
        cleanerId:schedule.assignedTo?.cleanerId,
        scheduleId:schedule._id
    }
        console.log("my data", data)
      userService.clockIn(data)
      .then(response => {

        const res = response.data
        console.log(res)
        //
        console.log("Message sent")
        navigation.navigate(ROUTES.cleaner_attach_task_photos,{
            scheduleId:schedule._id
        })
      })
       
    } else {
      alert("You are not at the scheduled location.");
    }
  };

  const startTime = schedule.schedule.cleaning_time

  const calculateEndTime = (startTime, durationInMinutes) => {
    const endTime = moment(startTime, 'hh:mm A').add(durationInMinutes, 'minutes');
    return endTime.format('hh:mm A');
  };
  
  // Example usage:
  const durationInMinutes = schedule?.schedule?.total_cleaning_time;
  
  const endTime = calculateEndTime(startTime, durationInMinutes);
  console.log('End time:', endTime);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distance in km
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission is required to clock in.");
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
    })();
  }, []);



return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Clock In</Text>
      </View>

      {/* User Info */}
      <Card style={styles.card}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: schedule.assignedTo?.avatar}} // Replace with actual avatar URL
            style={styles.avatar}
          />
          <View style={styles.details}>
            <Text style={styles.name}>{schedule.assignedTo?.firstname} {schedule.assignedTo?.lastname}</Text>
            <Text style={styles.jobTitle}>Cleaner</Text>
          </View>
        </View>
      </Card>

      <View style={styles.locationContainer}>
        <Text style={styles.date}>Location</Text>
      </View>
      <Card style={styles.card}>
        <View style={styles.address}>
          <Text>{schedule.schedule.address}</Text>
        </View>
      </Card>


      {/* Current Time */}
      <View style={styles.timeContainer}>
        <Text style={styles.date}>{moment(schedule.schedule.cleaning_date).format('dddd, MMM D')}</Text>
      </View>
      <Card style={styles.card}>
        <View style={styles.duration}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text >Start</Text>
            <Text>End</Text>
            
          </View>

          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
            <Text style={styles.time}>{moment(schedule.schedule.cleaning_time, 'h:mm:ss A').format('h:mm A')}</Text>
            <Text style={styles.time}>{endTime}</Text>
          </View>
        </View>
      </Card>

      

      {/* Clock In Button */}
      <TouchableOpacity style={styles.clockInButton} onPress={handleClockIn}>
        <MaterialIcons name="login" size={24} color="#fff" />
        <Text style={styles.clockInText}>Clock In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f8f9fa',
    },
    header: {
      marginBottom: 20,
      alignItems: 'center',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    card: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    address: {
      flexDirection: 'row',
      alignItems: 'center',
      height:50
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    details: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
    },
    jobTitle: {
      fontSize: 14,
      color: '#666',
    },
    timeContainer: {
      alignItems: 'center',
      marginBottom: 15,
    },
    locationContainer: {
      alignItems: 'center',
      marginBottom: 15,
    },
    time: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#333',
    },
    date: {
      fontSize: 18,
      color: '#888',
    },
    clockInButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      backgroundColor: COLORS.darkBlue,
      borderRadius: 8,
      shadowColor: COLORS.darkBlue,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    clockInText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: '600',
      marginLeft: 8,
    },
    clock:{
      flexDirection:'row',
      justifyContent:'space-between'
    },
    duration:{
      height:100
    }
  });

export default ClockIn;



import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState('');

  const calculateTimeLeft = () => {
    // Get current time
    const now = new Date();
    
    // Parse cleaning times (using today's date)
    const [startHours, startMinutes] = "08:00:00".split(':').map(Number);
    const [endHours, endMinutes] = "19:25:00".split(':').map(Number);
    
    // Create Date objects for start and end times
    const startTime = new Date();
    startTime.setHours(startHours, startMinutes, 0);
    
    const endTime = new Date();
    endTime.setHours(endHours, endMinutes, 0);

    // Calculate time difference in milliseconds
    let difference = endTime - now;

    // If cleaning hasn't started yet
    if (now < startTime) {
      difference = endTime - startTime;
    }
    // If cleaning time has ended
    else if (now > endTime) {
      difference = 0;
    }

    // Convert milliseconds to time components
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Format time left
    const format = (num) => num.toString().padStart(2, '0');
    setTimeLeft(`${format(hours)}:${format(minutes)}:${format(seconds)}`);
  };

  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={{ padding: 0, alignItems:'center' }}>
        
      <MaterialCommunityIcons name="timer-outline" size={24} color="white" />
      {/* <Text style={{ fontSize: 11, color:"#fff" }}>Time Left</Text> */}
      <Text style={{ fontSize: 12, color:"#fff" }}>
        {timeLeft || '......' }
      </Text>
    </View>
  );
};

export default Timer;
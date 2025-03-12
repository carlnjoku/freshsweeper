// import React, { useState, useEffect } from 'react';
// import { View, Text } from 'react-native';

// const TimeCalculator = () => {
//   const [timeLeft, setTimeLeft] = useState('');

//   const calculateTimeLeft = () => {
//     // Get current time
//     const now = new Date();
    
//     // Parse cleaning times (using today's date)
//     const [startHours, startMinutes] = "11:00:00".split(':').map(Number);
//     const [endHours, endMinutes] = "19:25:00".split(':').map(Number);
    
//     // Create Date objects for start and end times
//     const startTime = new Date();
//     startTime.setHours(startHours, startMinutes, 0);
    
//     const endTime = new Date();
//     endTime.setHours(endHours, endMinutes, 0);

//     // Calculate time difference in milliseconds
//     let difference = endTime - now;

//     // If cleaning hasn't started yet
//     if (now < startTime) {
//       difference = endTime - startTime;
//     }
//     // If cleaning time has ended
//     else if (now > endTime) {
//       difference = 0;
//     }

//     // Convert milliseconds to time components
//     const hours = Math.floor(difference / (1000 * 60 * 60));
//     const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((difference % (1000 * 60)) / 1000);

//     // Format time left
//     const format = (num) => num.toString().padStart(2, '0');
//     setTimeLeft(`${format(hours)}:${format(minutes)}:${format(seconds)}`);
//   };

//   useEffect(() => {
//     const timer = setInterval(calculateTimeLeft, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <View style={{ padding: 0 }}>
//       <Text style={{ fontSize: 15, color:"#fff" }}>
//         Time Left: {timeLeft || 'Calculating...'}
//       </Text>
//     </View>
//   );
// };

// export default TimeCalculator;



import React, { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { View, Text } from 'react-native';

const TimeCalculator = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const [status, setStatus] = useState('');

  // Helper to convert time string to Date object with TODAY'S date
  const parseTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date;
  };

  // Calculate time difference every second
  useEffect(() => {
    const computeTime = () => {
      const now = new Date();
      const start = parseTime("11:00:00");
      const end = parseTime("22:25:00");

      if (now < start) {
        setStatus("Cleaning not started yet");
        setTimeLeft("");
      } else if (now > end) {
        setStatus("Cleaning completed");
        setTimeLeft("");
      } else {
        const diffMs = end.getTime() - now.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        
        setStatus("Cleaning in progress... 🧹");
        setTimeLeft(`${hours}h ${minutes}m remaining`);
      }
    };

    // Update immediately and set interval
    computeTime();
    const interval = setInterval(computeTime, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ padding: 0 }}>
      <Text style={{ fontSize: 14, fontWeight: 'bold', color:"white" }}>{status}</Text>
      {timeLeft ? <Text style={{ fontSize: 14, color:"white", marginTop: 10 }}>{timeLeft}</Text> : null}
    </View>
  );
};

export default TimeCalculator;
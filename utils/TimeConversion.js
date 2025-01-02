import React from 'react';
import moment from 'moment';
import { Text, View } from 'react-native';

const TimeConversion = ({minutes}) => {
  // const minutes = 415;
  
  const duration = moment.duration(minutes, 'minutes');
  const hours = Math.floor(duration.asHours());
  const remainingMinutes = duration.minutes();

  

  return (
    <View>
      <Text style={{fontSize:11}}>Est. Time {`${hours} hr  ${remainingMinutes} min.`}</Text>
    </View>
  );
};

export default TimeConversion;





import React from 'react';
import moment from 'moment';
import { Text, View } from 'react-native';
import COLORS from '../constants/colors';

const TimeConversion = ({minutes}) => {
  // const minutes = 415;
  
  const duration = moment.duration(minutes, 'minutes');
  const hours = Math.floor(duration.asHours());
  const remainingMinutes = duration.minutes();

  

  return (
    <View>
      <Text style={{fontSize:12, color:COLORS.gray}}>Estimated Time: {`${hours} hr  ${remainingMinutes} min.`}</Text>
    </View>
  );
};

export default TimeConversion;





import React, { useState } from 'react';
import { View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimePickerExample = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  return (
    <View>
      <Button onPress={showDatepicker} title="Show date picker!" />
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DateTimePickerExample;

import React, { useState } from 'react';
import { View, TextInput, Button, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimePickerField = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const handleDateTimeChange = (event, selected) => {
    if (selected) {
      setSelectedDate(selected.toLocaleDateString());
      setSelectedTime(selected.toLocaleTimeString());
      setShowDateTimePicker(false);
    }
  };

  const handleClearDateTime = () => {
    setSelectedDate('');
    setSelectedTime('');
  };

  const showPicker = () => {
    setShowDateTimePicker(true);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Select Date"
        value={selectedDate}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Select Time"
        value={selectedTime}
        editable={false}
      />
      <Button title="Select Date and Time" onPress={showPicker} />
      {showDateTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateTimeChange}
        />
      )}
      <Button title="Clear" onPress={handleClearDateTime} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default DateTimePickerField;

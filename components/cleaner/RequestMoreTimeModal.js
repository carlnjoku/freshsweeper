import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Button, Chip, Text } from 'react-native-paper';
import COLORS from '../../constants/colors';



const RequestMoreTimeModal = ({ visible, onClose, onConfirm }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  

  // Generate time options (15 min to 2 hrs)
  const timeOptions = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hr', value: 60 },
    { label: '1 hr 15 min', value: 75 },
    { label: '1 hr 30 min', value: 90 },
    { label: '1 hr 45 min', value: 105 },
    { label: '2 hrs', value: 120 },
  ];
  
  

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>Request More Time</Text>

        <View style={styles.chipContainer}>
          {timeOptions.map((time) => (
            <Chip
              key={time.value}
              mode="outlined"
              style={[styles.chip, selectedTime === time.value && styles.selectedChip]}
              onPress={() => setSelectedTime(time.value)}
              selected={selectedTime === time.value}
            >
              {time.label}
            </Chip>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={() => onConfirm(selectedTime)}
          disabled={!selectedTime}
          style={styles.confirmButton}
        >
          Confirm
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  chip: {
    margin: 5,
    backgroundColor: COLORS.light_gray_1,
    borderWidth:0,
    borderRadius:50
  },
  selectedChip: {
    backgroundColor: COLORS.primary_light_1,
    borderWidth:0,
    borderRadius:50
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor:COLORS.primary,
    
  },
});

export default RequestMoreTimeModal;
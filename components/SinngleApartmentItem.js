import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Chip } from 'react-native-paper';
import COLORS from '../constants/colors'; // Replace with your app's color constants

const SingleApartmentItem = ({
  apartment, // Apartment object
  onSelectApartment, // Function to handle apartment selection
}) => {
  return (
    <Pressable
      style={styles.container}
    //   onPress={() => {
    //     onSelectApartment(apartment); // Pass the selected apartment to the parent
    //   }}
    >
      <View style={styles.itemContent}>
        <View style={{ marginRight: 10 }}>
          <AntDesign name="home" size={40} color={COLORS.gray} />
        </View>
        <View>
          <Text style={styles.itemText}>{apartment.apt_name}</Text>
          <Text style={styles.address}>{apartment.address}</Text>
        </View>
      </View>

      <View style={styles.roomTypeContainer}>
        {apartment.roomDetails.map((room, index) => (
          <Chip
            key={index}
            mode="flat"
            style={styles.chip}
            textStyle={styles.chipText}
          >
            {room.number} {room.type}
          </Chip>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    
  },
  address: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  roomTypeContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center', 
    paddingRight: 10,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  chip: {
    backgroundColor: COLORS.primary_light_1,
    marginRight: 8,
    borderRadius:50,
    marginTop:5
  },
  chipText: {
    color: COLORS.gray,
    fontSize: 12,
  },


  
});

export default SingleApartmentItem;
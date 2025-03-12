// GoogleAutocomplete.js
import React, { useState, useEffect } from 'react';
import { TextInput, IconButton, Checkbox, RadioButton, Avatar } from 'react-native-paper';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import COLORS from '../constants/colors';

const GoogleAutocomplete = ({label, apiKey, selected_address, handleError,initialValue }) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
 
  useEffect(() => {
    setQuery(initialValue || ""); // Update query when initialValue changes
  }, [initialValue]);


  const handlePlaceSelected = async (input) => {
    setQuery(input);
    console.log(input)

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`
      );

      setPredictions(response.data.predictions);
      console.log(response.data.predictions)
    } catch (error) {
      console.error('Autocomplete API error:', error);
    }
  };

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.text}</Text>
    </View>
  );

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  }; 
  const handleClear = () => {
    setQuery("")
  }
  const renderPrediction = ({ item }) => (
    <TouchableOpacity  onPress={() => selectPrediction(item.description)}>
      <Text style={styles.item}>{item.description}</Text>
    </TouchableOpacity>
  );

  const selectPrediction = (address) => {
    // Handle the selected place (e.g., fetch details)
    console.log('Selected place ID:', address);
    setQuery(address)
    selected_address(address)
    setPredictions([])
  };

  return (
    <View>
      <TextInput
        placeholder={label}
        label={label}
        placeholderTextColor={COLORS.gray}
        outlineColor="#D8D8D8"
        mode="outlined"
        multiline
        activeOutlineColor={COLORS.primary}
        textColor={COLORS.secondary}
        style={{marginBottom:0, marginTop:10, color:COLORS.gray, fontSize:14, backgroundColor:"#fff"}}
        value={query}
        onChangeText={handlePlaceSelected}
        // onFocus={handleFocus}
        onFocus={() => handleError(null, 'location')}
        // onBlur={handleBlur}
        right={isFocused ? <TextInput.Icon icon="close" onPress={handleClear} style={{opacity:0.4}} fontSize="small" /> : null }
        
      />
      
      <FlatList
        data={predictions}
        renderItem={renderPrediction}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};

export default GoogleAutocomplete;


const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#f1f1f1', // Line color
  },
  item: {
    padding: 6,
  },
});
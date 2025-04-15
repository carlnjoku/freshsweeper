// GoogleAutocomplete.js
// import React, { useState, useEffect } from 'react';
// import { TextInput, IconButton, Checkbox, RadioButton, Avatar } from 'react-native-paper';
// import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import axios from 'axios';
// import COLORS from '../constants/colors';

// const GoogleAutocomplete = ({label, apiKey, selected_address, handleError,initialValue }) => {
//   const [query, setQuery] = useState("");
//   const [predictions, setPredictions] = useState([]);
//   const [isFocused, setIsFocused] = useState(false);
 
//   useEffect(() => {
//     setQuery(initialValue || ""); // Update query when initialValue changes
//   }, [initialValue]);


//   const handlePlaceSelected = async (input) => {
//     setQuery(input);
//     console.log(input)

//     try {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`
//       );

//       setPredictions(response.data.predictions);
//       console.log(response.data.predictions)
//     } catch (error) {
//       console.error('Autocomplete API error:', error);
//     }
//   };

//   const renderSeparator = () => (
//     <View style={styles.separator} />
//   );

//   const renderItem = ({ item }) => (
//     <View style={styles.item}>
//       <Text>{item.text}</Text>
//     </View>
//   );

//   const handleFocus = () => {
//     setIsFocused(true);
//   };

//   const handleBlur = () => {
//     setIsFocused(false);
//   }; 
//   const handleClear = () => {
//     setQuery("")
//   }
//   const renderPrediction = ({ item }) => (
//     <TouchableOpacity  onPress={() => selectPrediction(item.description)}>
//       <Text style={styles.item}>{item.description}</Text>
//     </TouchableOpacity>
//   );

//   const selectPrediction = (address) => {
//     // Handle the selected place (e.g., fetch details)
//     console.log('Selected place ID:', address);
//     setQuery(address)
//     selected_address(address)
//     setPredictions([])
//   };

//   return (
//     <View>
//       <TextInput
//         placeholder={label}
//         label={label}
//         placeholderTextColor={COLORS.gray}
//         outlineColor="#D8D8D8"
//         mode="outlined"
//         multiline
//         activeOutlineColor={COLORS.primary}
//         textColor={COLORS.secondary}
//         style={{marginBottom:0, marginTop:10, color:COLORS.gray, fontSize:14, backgroundColor:"#fff"}}
//         value={query}
//         onChangeText={handlePlaceSelected}
//         // onFocus={handleFocus}
//         onFocus={() => handleError(null, 'location')}
//         // onBlur={handleBlur}
//         right={isFocused ? <TextInput.Icon icon="close" onPress={handleClear} style={{opacity:0.4}} fontSize="small" /> : null }
        
//       />
      
//       <FlatList
//         data={predictions}
//         renderItem={renderPrediction}
//         keyExtractor={(item) => item.id}
//         ItemSeparatorComponent={renderSeparator}
//       />
//     </View>
//   );
// };

// export default GoogleAutocomplete;


// const styles = StyleSheet.create({
//   separator: {
//     height: 1,
//     width: '100%',
//     backgroundColor: '#f1f1f1', // Line color
//   },
//   item: {
//     padding: 6,
//   },
// });











// import React, { useState, useEffect } from 'react';
// import { TextInput, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import COLORS from '../constants/colors';
// import axios from 'axios';

// const GoogleAutocomplete = ({ label, apiKey, selected_address, handleError, initialValue }) => {
//   const [query, setQuery] = useState(initialValue || "");
//   const [predictions, setPredictions] = useState([]);
//   const [showManualEntry, setShowManualEntry] = useState(false);

//   const handlePlaceSelected = async (input) => {
//     setQuery(input);
    
//     try {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`
//       );

//       if (response.data.status === 'ZERO_RESULTS') {
//         setPredictions([]);
//         handleError('ZERO_RESULTS');
//         setShowManualEntry(true);
//       } else {
//         setPredictions(response.data.predictions);
//         setShowManualEntry(false);
//       }
//     } catch (error) {
//       console.error('Autocomplete API error:', error);
//       handleError(error.message);
//     }
//   };

//   const selectPrediction = (address) => {
//     setQuery(address);
//     selected_address(address);
//     setPredictions([]);
//     setShowManualEntry(false);
//     handleError(null);
//   };

//   const handleManualAddressChange = (text) => {
//     setQuery(text);
//     selected_address(text);
//   };

//   return (
//     <View>
//       <TextInput
//         placeholder={label}
//         value={query}
//         onChangeText={handlePlaceSelected}
//         style={styles.input}
//       />

//       {predictions.length > 0 ? (
//         <FlatList
//           data={predictions}
//           renderItem={({ item }) => (
//             <TouchableOpacity onPress={() => selectPrediction(item.description)}>
//               <Text style={styles.predictionItem}>{item.description}</Text>
//             </TouchableOpacity>
//           )}
//           keyExtractor={(item) => item.place_id}
//         />
//       ) : showManualEntry && (
//         <View style={styles.manualEntryContainer}>
//           <TextInput
//             placeholder="Enter address manually"
//             value={query}
//             onChangeText={handleManualAddressChange}
//             style={styles.manualInput}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   predictionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   manualEntryContainer: {
//     marginTop: 10,
//   },
//   manualInput: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//   },
// });

// export default GoogleAutocomplete;




import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { TextInput, IconButton, Checkbox, RadioButton, Avatar } from 'react-native-paper';
import COLORS from '../constants/colors';

const GoogleAutocomplete = ({ label, apiKey, selected_address, handleError, initialValue }) => {
  const [query, setQuery] = useState(initialValue || "");
  const [predictions, setPredictions] = useState([]);
  const [apiState, setApiState] = useState({
    loading: false,
    error: null,
    showManual: false
  });
  const [isFocused, setIsFocused] = useState(false);

  const handlePlaceSelected = async (input) => {
    setQuery(input);
    
    if (input.length < 2) {
      setPredictions([]);
      return;
    }

    setApiState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: input,
            key: apiKey,
            types: 'address',
            language: 'en',
          }
        }
      );

      // Handle API response statuses
      switch (response.data.status) {
        case 'ZERO_RESULTS':
          setApiState({ loading: false, error: 'NO_RESULTS', showManual: true });
          setPredictions([]);
          handleError('NO_RESULTS');
          break;
          
        case 'OK':
          if (response.data.predictions?.length > 0) {
            setPredictions(response.data.predictions);
            setApiState({ loading: false, error: null, showManual: false });
          } else {
            setApiState({ loading: false, error: 'NO_RESULTS', showManual: true });
          }
          break;

        case 'OVER_QUERY_LIMIT':
        case 'REQUEST_DENIED':
        case 'INVALID_REQUEST':
          setApiState({ loading: false, error: response.data.status, showManual: true });
          handleError(response.data.status);
          break;

        default:
          setApiState({ loading: false, error: 'API_ERROR', showManual: true });
          handleError('API_ERROR');
      }
    } catch (error) {
      // Handle network errors
      const errorType = axios.isCancel(error) ? 'REQUEST_CANCELED' : 'NETWORK_ERROR';
      setApiState({ loading: false, error: errorType, showManual: true });
      handleError(errorType);
    }
  };

  const selectPrediction = (address) => {
    setQuery(address);
    selected_address(address);
    setPredictions([]);
    setApiState({ loading: false, error: null, showManual: false });
  };

  const handleManualChange = (text) => {
    setQuery(text);
    selected_address(text);
    if (text.length > 0) {
      handleError(null);
    }
  };

  const getErrorMessage = () => {
    const messages = {
      NO_RESULTS: "Address not found - please enter manually",
      NETWORK_ERROR: "Network issue - check your connection",
      OVER_QUERY_LIMIT: "Service limit reached - try again later",
      INVALID_REQUEST: "Invalid request - please check input",
      API_ERROR: "Service unavailable - enter manually",
    };
    return messages[apiState.error] || "Address lookup failed - enter manually";
  };

  return (
    <View>
      {/* <TextInput
        placeholder={label}
        value={query}
        onChangeText={handlePlaceSelected}
        style={styles.input}
      /> */}
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

      {apiState.loading && <ActivityIndicator size="small" color="#0000ff" />}

      {!apiState.loading && predictions.length > 0 && (
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => selectPrediction(item.description)}
              style={styles.predictionItem}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {apiState.showManual && (
        <View style={styles.manualContainer}>
          {/* <TextInput
            placeholder="Enter address manually"
            value={query}
            onChangeText={handleManualChange}
            style={styles.manualInput}
          /> */}
          <TextInput
            placeholder="Enter address manually"
            label={label}
            placeholderTextColor={COLORS.gray}
            outlineColor="#D8D8D8"
            mode="outlined"
            multiline
            activeOutlineColor={COLORS.primary}
            textColor={COLORS.secondary}
            style={{marginBottom:0, marginTop:10, color:COLORS.gray, fontSize:14, backgroundColor:"#fff"}}
            value={query}
            onChangeText={handleManualChange}
            onFocus={() => handleError(null, 'location')}
            right={isFocused ? <TextInput.Icon icon="close" onPress={handleClear} style={{opacity:0.4}} fontSize="small" /> : null }
            
          />
          {apiState.error && (
            <Text style={styles.errorText}>{getErrorMessage()}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: { 
    /* ... existing input styles ... */ 
  },
  predictionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  manualContainer: {
    marginTop: 10,
  },
  manualInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
});

export default GoogleAutocomplete;
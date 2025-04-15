// import React, { useState } from 'react';
// import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
// import GoogleAutocomplete from './GooglePlacesAutocomplete'; // Make sure to import your component
// import COLORS from '../constants/colors'; // Ensure this path is correct
// import { GOOGLE_MAPS_API_KEY } from '../secret';


// const AddressInput = ({ 
//   label, 
//   value, 
//   setFieldValue, // For Formik users
//   onChange,      // For non-Formik users
//   error 
// }) => {
//   const [showManualInput, setShowManualInput] = useState(false);
//   const [retryVisible, setRetryVisible] = useState(false);

//   const handleAddressChange = (address) => {
//     // Prefer Formik's setFieldValue if available
//     if (setFieldValue) {
//       setFieldValue('address', address);
//     } else if (onChange) {
//       onChange(address);
//     }
//   };

//   const handleAddressLookupFailure = () => {
//     setShowManualInput(true);
//     setRetryVisible(true);
//     handleAddressChange(value); // Preserve any partial input
//   };

//   return (
//     <View style={styles.container}>
//       {!showManualInput ? (
//         <GoogleAutocomplete
//           label={label}
//           apiKey={GOOGLE_MAPS_API_KEY} // Ensure this is defined in your environment
//           selected_address={(address) => {
//             handleAddressChange(address);
//             setShowManualInput(false);
//           }}
//           handleError={(errorType) => {
//             if (errorType) handleAddressLookupFailure();
//           }}
//           initialValue={value}
//         />
//       ) : (
//         <View style={styles.manualContainer}>
//           <TextInput
//             placeholder="Enter Address Manually"
//             value={value}
//             onChangeText={handleAddressChange}
//             style={styles.input}
//           />
//           {retryVisible && (
//             <TouchableOpacity
//               style={styles.retryButton}
//               onPress={() => setShowManualInput(false)}
//             >
//               <Text style={styles.retryText}>Try Address Lookup Again</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       )}

//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// // Keep your existing styles
// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//   },
//   manualContainer: {
//     marginTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   retryButton: {
//     alignSelf: 'flex-start',
//     paddingVertical: 5,
//   },
//   retryText: {
//     color: COLORS.primary,
//     fontSize: 12,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 5,
//   },
// });

// export default AddressInput;





// import React, { useState } from 'react';
// import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import GoogleAutocomplete from './GooglePlacesAutocomplete'; // Make sure to import your component
// import COLORS from '../constants/colors'; // Ensure this path is correct
// import { GOOGLE_MAPS_API_KEY } from '../secret';
// const AddressInput = ({ 
//   label,
//   value,
//   onChange,
//   onAutocompleteSelect,  // Only fired when using autocomplete
//   error 
// }) => {
//   const [showManualInput, setShowManualInput] = useState(false);

//   return (
//     <View style={styles.container}>
//       {!showManualInput ? (
//         <GoogleAutocomplete
//           label={label}
//           selected_address={(address) => {
//             // Only trigger geocoding for autocomplete selections
//             onAutocompleteSelect(address);
//             onChange(address);
//           }}
//           handleError={(errorType) => {
//             if (errorType) setShowManualInput(true);
//           }}
//           initialValue={value}
//         />
//       ) : (
//         <View style={styles.manualContainer}>
//           <TextInput
//             placeholder="Enter Address Manually"
//             value={value}
//             onChangeText={onChange}  // Just update the text, no geocoding
//             style={styles.input}
//             multiline
//             numberOfLines={3}
//           />
//           <TouchableOpacity
//             style={styles.retryButton}
//             onPress={() => setShowManualInput(false)}
//           >
//             <Text style={styles.retryText}>Use Address Autocomplete</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//   },
//   manualContainer: {
//     marginTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//     minHeight: 100,
//     textAlignVertical: 'top',
//   },
//   retryButton: {
//     alignSelf: 'flex-start',
//     paddingVertical: 8,
//   },
//   retryText: {
//     color: COLORS.primary,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 5,
//   },
// });

// export default AddressInput;






// import React, { useState } from 'react';
// import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
// import * as Location from 'expo-location';
// import GoogleAutocomplete from './GooglePlacesAutocomplete'; // Make sure to import your component
// import COLORS from '../constants/colors'; // Ensure this path is correct
// import { GOOGLE_MAPS_API_KEY } from '../secret';
// import useLocationPermission from './UseLocationPermission';

// const AddressInput = ({ 
//   label,
//   value,
//   onChange,
//   onCoordinatesSet,
//   error 
// }) => {
//   const { hasPermission, requestPermission } = useLocationPermission();
//   const [showManualInput, setShowManualInput] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);

//   const handleAutocompleteSelected = async (selectedAddress) => {
//     try {
//       // First try Google geocoding
//       const googleResponse = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(selectedAddress)}&key=${GOOGLE_MAPS_API_KEY}`
//       );
//       const googleData = await googleResponse.json();

//       if (googleData.status === 'OK') {
//         const location = googleData.results[0].geometry.location;
//         onCoordinatesSet({ 
//           latitude: location.lat, 
//           longitude: location.lng 
//         });
//         onChange(selectedAddress);
//         return;
//       }
//       throw new Error('Google geocoding failed');
//     } catch (error) {
//       console.log('Falling back to Expo for autocomplete selection...');
//       await verifyWithExpo(selectedAddress);
//     }
//   };

//   const verifyWithExpo = async (address) => {
//     setIsVerifying(true);
//     try {
//       const expoResults = await Location.geocodeAsync(address);
//       if (expoResults.length > 0) {
//         onCoordinatesSet({
//           latitude: expoResults[0].latitude,
//           longitude: expoResults[0].longitude
//         });
//         onChange(address);
//       } else {
//         throw new Error('No coordinates found');
//       }
//     } catch (expoError) {
//       console.log('Expo geocoding failed:', expoError);
//       onCoordinatesSet(null);
//       setShowManualInput(true);
//     } finally {
//       setIsVerifying(false);
//     }
//   };


//   const handleManualVerification = async () => {
//     if (!value.trim()) return;

//     try {
//         // Check and request permissions if needed
//         const hasPerms = await requestPermission();
//         if (!hasPerms) return;
  
//         setIsVerifying(true);
//         const expoResults = await Location.geocodeAsync(value);
        
//         if (expoResults.length > 0) {
//           onCoordinatesSet({
//             latitude: expoResults[0].latitude,
//             longitude: expoResults[0].longitude
//           });
//         } else {
//           Alert.alert('Error', 'Could not verify address location');
//         }
//       } catch (error) {
//         Alert.alert('Error', 'Failed to process address verification');
//       } finally {
//         setIsVerifying(false);
//       }
//   };


//   return (
//     <View style={styles.container}>
//       {!showManualInput ? (
//         <GoogleAutocomplete
//           label={label}
//           selected_address={handleAutocompleteSelected}
//           handleError={() => setShowManualInput(true)}
//           initialValue={value}
//         />
//       ) : (
//         <View style={styles.manualContainer}>
//           <TextInput
//             placeholder="Enter address manually"
//             value={value}
//             onChangeText={onChange}
//             style={styles.input}
//             multiline
//             numberOfLines={3}
//           />
          
//           <View style={styles.buttonRow}>
//             <TouchableOpacity
//               style={styles.verifyButton}
//               onPress={handleManualVerification}
//               disabled={isVerifying}
//             >
//               {isVerifying ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.buttonText}>Verify Address</Text>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.retryButton}
//               onPress={() => setShowManualInput(false)}
//             >
//               <Text style={[styles.buttonText, { color: COLORS.primary }]}>
//                 Use Autocomplete
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//   },
//   manualContainer: {
//     marginTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//     minHeight: 100,
//     textAlignVertical: 'top',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//   },
//   verifyButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     padding: 12,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   retryButton: {
//     flex: 1,
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     padding: 12,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 5,
//   },
// });

// export default AddressInput;









import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import GoogleAutocomplete from './GooglePlacesAutocomplete';
import COLORS from '../constants/colors';
import { GOOGLE_MAPS_API_KEY } from '../secret';
import useLocationPermission from './UseLocationPermission';

const AddressInput = ({ 
  label,
  value,
  onChange,
  onCoordinatesSet,
  error 
}) => {
  const { hasPermission, requestPermission } = useLocationPermission();
  const [showManualInput, setShowManualInput] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerifiedAddress, setLastVerifiedAddress] = useState(null);

  // Reset verification if address changes
  useEffect(() => {
    if (value !== lastVerifiedAddress) {
      setLastVerifiedAddress(null);
    }
  }, [value]);

  const isVerified = value === lastVerifiedAddress;

  const handleAutocompleteSelected = async (selectedAddress) => {
    try {
      setIsVerifying(true);
      let coordinates = null;

      // Try Google Geocoding first
      const googleResponse = await fetch(
        `https://maps.googleapis.com/maps/json?address=${encodeURIComponent(selectedAddress)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const googleData = await googleResponse.json();

      if (googleData.status === 'OK') {
        const location = googleData.results[0].geometry.location;
        coordinates = { latitude: location.lat, longitude: location.lng };
      }

      // Fallback to Expo if Google fails
      if (!coordinates) {
        const expoResults = await Location.geocodeAsync(selectedAddress);
        if (expoResults.length > 0) {
          coordinates = {
            latitude: expoResults[0].latitude,
            longitude: expoResults[0].longitude
          };
        }
      }

      if (coordinates) {
        onChange(selectedAddress);
        onCoordinatesSet(coordinates);
        setLastVerifiedAddress(selectedAddress);
      } else {
        throw new Error('Location verification failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify address location');
      setShowManualInput(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerification = async () => {
    if (!value.trim() || isVerified) return;

    try {
      setIsVerifying(true);
      const hasPerms = await requestPermission();
      if (!hasPerms) return;

      const expoResults = await Location.geocodeAsync(value);
      if (expoResults.length > 0) {
        const coordinates = {
          latitude: expoResults[0].latitude,
          longitude: expoResults[0].longitude
        };
        onCoordinatesSet(coordinates);
        setLastVerifiedAddress(value);
      } else {
        Alert.alert('Error', 'Could not verify address location');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process address verification');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      {!showManualInput ? (
        <GoogleAutocomplete
          label={label}
          selected_address={handleAutocompleteSelected}
          handleError={() => setShowManualInput(true)}
          initialValue={value}
        />
      ) : (
        <View style={styles.manualContainer}>
          <TextInput
            placeholder="Enter address manually"
            value={value}
            onChangeText={onChange}
            style={styles.input}
            multiline
            numberOfLines={3}
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                isVerified && styles.verifiedButton
              ]}
              onPress={handleManualVerification}
              disabled={isVerified || isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="white" />
              ) : isVerified ? (
                <View style={styles.verifiedWrapper}>
                  <MaterialCommunityIcons 
                    name="check" 
                    size={20} 
                    color="white" 
                  />
                  <Text style={styles.buttonText}>Address Verified</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Verify Address</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => setShowManualInput(false)}
            >
              <Text style={[styles.buttonText, { color: COLORS.primary }]}>
                Use Autocomplete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  manualContainer: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  verifyButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  verifiedButton: {
    backgroundColor: COLORS.green,
  },
  verifiedWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 5,
  
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default AddressInput;
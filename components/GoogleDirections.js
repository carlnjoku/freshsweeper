// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import axios from 'axios';
// import { GOOGLE_MAPS_API_KEY } from '../secret';
// import MapView, { Polyline, Marker } from 'react-native-maps';
// import ChipIcon from './ChipIcon';
// import COLORS from '../constants/colors';

// const GOOGLE_API_KEY = GOOGLE_MAPS_API_KEY; // Replace with your Google API key

// const GoogleDirections = ({ origin, destination }) => {

//     const [mode, setMode] = useState('driving'); // Default mode is driving
//     const [directions, setDirections] = useState(null);
//     const [eta, setEta] = useState(null);

//     useEffect(() => {
//         // Function to fetch directions based on the selected mode
//         const fetchDirections = async () => {
//             try {
//                 const response = await axios.get(
//                     'https://maps.googleapis.com/maps/api/directions/json',
//                     {
//                         params: {
//                             origin: `${origin.latitude},${origin.longitude}`,
//                             destination: `${destination.latitude},${destination.longitude}`,
//                             key: GOOGLE_API_KEY,
//                             mode: mode, // Use the selected mode
//                         },
//                     }
//                 );

//                 // Parse the response to extract the directions and ETA
//                 const route = response.data.routes[0];
//                 const coordinates = route.overview_polyline.points; // Encoded polyline
//                 const duration = route.legs[0].duration.text;

//                 // Decode the encoded polyline to an array of coordinates
//                 const decodedCoordinates = decodePolyline(coordinates);

//                 // Set directions and ETA state
//                 setDirections(decodedCoordinates);
//                 setEta(duration);
//             } catch (error) {
//                 console.error('Error fetching directions:', error);
//             }
//         };

//         fetchDirections();
//     }, [mode, origin, destination]);

//     // Function to decode the polyline
//     const decodePolyline = (encoded) => {
//         const points = [];
//         let index = 0, lat = 0, lng = 0;

//         while (index < encoded.length) {
//             let byte, shift = 0, result = 0;
//             do {
//                 byte = encoded.charCodeAt(index++) - 63;
//                 result |= (byte & 0x1f) << shift;
//                 shift += 5;
//             } while (byte >= 0x20);

//             const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
//             lat += dlat;

//             shift = 0;
//             result = 0;
//             do {
//                 byte = encoded.charCodeAt(index++) - 63;
//                 result |= (byte & 0x1f) << shift;
//                 shift += 5;
//             } while (byte >= 0x20);

//             const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
//             lng += dlng;

//             points.push({
//                 latitude: lat / 1e5,
//                 longitude: lng / 1e5,
//             });
//         }

//         return points;
//     };

//     // Render the map and mode selection UI
//     return (
//         <View style={{ flex: 1 }}>
//             {/* Display the map */}
           
//             <MapView
//                 style={{ flex: 1 }}
//                 initialRegion={{
//                     latitude: origin.latitude,
//                     longitude: origin.longitude,
//                     latitudeDelta: 0.0922,
//                     longitudeDelta: 0.0421,
//                 }}
//                 apiKey={GOOGLE_API_KEY}
//             >
//                 {/* Render the route */}
//                 {directions && (
//                     <Polyline
//                         coordinates={directions}
//                         strokeColor="#000"
//                         strokeWidth={3}
//                     />
//                 )}

//                 {/* Render origin and destination markers */}
//                 <Marker coordinate={origin} title="Origin" />
//                 <Marker coordinate={destination} title="Destination" />
//             </MapView>

//             {/* Display ETA */}
//             <View style={styles.eta}>
//                 <ChipIcon
//                     onPress={() => setMode('driving')}
//                     iconName="car-outline"
//                     label={eta}
//                     iconSize={18}
//                 /> 
//                 <ChipIcon
//                     onPress={() => setMode('transit')}
//                     iconName="train"
//                     label={eta}
//                     iconSize={17}
//                 /> 
//                 <ChipIcon
//                     onPress={() => setMode('walking')}
//                     iconName="walk"
//                     label={eta}
//                     iconSize={18}
//                 /> 
//             </View>

            
            

//         </View>
//     );
// };

// export default GoogleDirections;



// const styles = StyleSheet.create({
//     eta:{
//         flexDirection:'row',
//         height:50,
//         padding:5,
//         borderWidth:0.5,
//         borderColor:COLORS.light_gray_1,
//         backgroundColor:COLORS.white,
//         justifyContent:'flex-start',
//         alignItems:'center'
//     },
// })






// import React, { useState, useEffect } from 'react';
// import { View } from 'react-native';
// import axios from 'axios';
// import MapView, { Polyline, Marker } from 'react-native-maps';
// import ChipIcon from './ChipIcon';
// import { GOOGLE_MAPS_API_KEY } from '../secret';

// const GoogleDirections = ({ origin, destination }) => {
//     // State to hold directions and ETAs for each mode
//     const [mode, setMode] = useState('transit'); // Default mode is driving
    
//     const [directions, setDirections] = useState({
//         driving: null,
//         transit: null,
//         walking: null,
//     });
//     const [eta, setEta] = useState({
//         driving: null,
//         transit: null,
//         walking: null,
//     });

//     // Function to fetch directions and ETA for a specific mode
//     const fetchDirections = async (mode) => {
//         try {
//             const response = await axios.get(
//                 'https://maps.googleapis.com/maps/api/directions/json',
//                 {
//                     params: {
//                         origin: `${origin.latitude},${origin.longitude}`,
//                         destination: `${destination.latitude},${destination.longitude}`,
//                         key: GOOGLE_MAPS_API_KEY,
//                         mode: mode,
//                     },
//                 }
//             );

//             // Parse the response to extract directions and ETA
//             const route = response.data.routes[0];
//             const coordinates = route.overview_polyline.points; // Encoded polyline
//             const duration = route.legs[0].duration.text;

//             // Decode the encoded polyline to an array of coordinates
//             const decodedCoordinates = decodePolyline(coordinates);

//             // Update state for the specified mode
//             setDirections((prev) => ({ ...prev, [mode]: decodedCoordinates }));
//             setEta((prev) => ({ ...prev, [mode]: duration }));
//         } catch (error) {
//             console.error(`Error fetching directions for ${mode}:`, error);
//         }
//     };

//     // Function to decode the polyline
//     const decodePolyline = (encoded) => {
//         const points = [];
//         let index = 0, lat = 0, lng = 0;

//         while (index < encoded.length) {
//             let byte, shift = 0, result = 0;
//             do {
//                 byte = encoded.charCodeAt(index++) - 63;
//                 result |= (byte & 0x1f) << shift;
//                 shift += 5;
//             } while (byte >= 0x20);

//             const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
//             lat += dlat;

//             shift = 0;
//             result = 0;
//             do {
//                 byte = encoded.charCodeAt(index++) - 63;
//                 result |= (byte & 0x1f) << shift;
//                 shift += 5;
//             } while (byte >= 0x20);

//             const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
//             lng += dlng;

//             points.push({
//                 latitude: lat / 1e5,
//                 longitude: lng / 1e5,
//             });
//         }

//         return points;
//     };

//     useEffect(() => {
//         // Fetch directions and ETA for each mode on component mount
//         const modes = ['driving', 'transit', 'walking'];
//         modes.forEach((mode) => {
//             fetchDirections(mode);
//         });
//     }, [origin, destination]);

//     // Render the map and mode selection UI
//     return (
//         <View style={{ flex: 1 }}>
//             {/* Display the map */}
//             <MapView
//                 style={{ flex: 1 }}
//                 initialRegion={{
//                     latitude: origin.latitude,
//                     longitude: origin.longitude,
//                     latitudeDelta: 0.0922,
//                     longitudeDelta: 0.0421,
//                 }}
//             >
//                 {/* Render origin and destination markers */}
//                 <Marker coordinate={origin} title="Origin" />
//                 <Marker coordinate={destination} title="Destination" />

//                 {/* Render the routes for each mode */}
//                 {directions.driving && (
//                     <Polyline
//                         coordinates={directions.driving}
//                         strokeColor="#FF0000"
//                         strokeWidth={3}
//                     />
//                 )}
//                 {directions.transit && (
//                     <Polyline
//                         coordinates={directions.transit}
//                         strokeColor="#00FF00"
//                         strokeWidth={3}
//                     />
//                 )}
//                 {directions.walking && (
//                     <Polyline
//                         coordinates={directions.walking}
//                         strokeColor="#0000FF"
//                         strokeWidth={3}
//                     />
//                 )}
//             </MapView>

//             {/* Display ETA for each mode */}
//             <View style={styles.eta}>
//                 <ChipIcon
//                     // onPress={() => {}}
//                     onPress={() => setMode('driving')}
//                     iconName="car-outline"
//                     label={eta.driving}
//                     iconSize={18}
//                     color="#FF0000"
//                 />
//                 <ChipIcon
//                     onPress={() => {}}
//                     iconName="train"
//                     label= {eta.transit}
//                     iconSize={17}
//                     color="#00FF00"
//                 />
//                 <ChipIcon
//                     onPress={() => {}}
//                     iconName="walk"
//                     label={eta.walking}
//                     iconSize={18}
//                     color="#0000FF"
//                 />
//             </View>
//         </View>
//     );
// };

// const styles = {
//     eta: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         padding: 10,
//     },
// };

// export default GoogleDirections;
















import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import MapView, { Polyline, Marker } from 'react-native-maps';
import ChipIcon from './ChipIcon';
import { GOOGLE_MAPS_API_KEY } from '../secret';
import COLORS from '../constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GoogleDirections = ({ origin, destination, getModeChange, triggerMap }) => {
    // alert(triggerMap)
    console.log("Destinatioooooooooon")
    console.log(destination)
    console.log(origin)
    const [selectedMode, setSelectedMode] = useState('driving'); // State for selected mode
    const [directions, setDirections] = useState(null); // State for directions to display on the map
    const [allDirections, setAllDirections] = useState({}); // State to store directions for all modes
    const [allEta, setAllEta] = useState({}); // State to store ETA for all modes
    const [allDistances, setAllDistances] = useState({}); // State to store distances for all modes
    const [eta_distance, setEtaDistance] = useState({}); // State to store distances for all modes

    const animatableViewRef = useRef(null); // Reference to the Animatable.View component
    const mapRef = useRef(null);
    // Initialize the map region based on the origin
    const [mapRegion, setMapRegion] = useState({
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta:0.008,
        longitudeDelta: 0.0041,
    });

    // Default coordinate values
    const defaultLatitude = 40.71137;
    const defaultLongitude = -74.2183682;

    // Center coordinate
    const centerCoordinate = {
        latitude: origin.latitude || defaultLatitude,
        longitude: origin.longitude || defaultLongitude,
    };
    // Function to abbreviate hours and minutes in the ETA
    const abbreviateEta = (eta) => {
        // Replace "hour" with "hr" and "minute" with "min"
        return eta.replace(/hours?/gi, 'hr').replace(/minutes?/gi, 'min');
    };

    const polylineStyles = {
        driving: { strokeColor: COLORS.deepBlue, strokeWidth: 7, lineDashPattern: [1, 1] }, // Red solid line for driving
        walking: { strokeColor: COLORS.green, strokeWidth: 6, lineDashPattern: [12, 12] }, // Green dashed line for walking
        transit: { strokeColor: COLORS.primary, strokeWidth: 7, lineDashPattern: [16, 16] }, // Blue dashed line for transit
    };

    useEffect(() => {
        const fetchDirectionsForAllModes = async () => {
            const modes = ['driving', 'transit', 'walking'];
            const directionsData = {};
            const etaData = {};
            const distanceData = {};
    
            for (const mode of modes) {
                try {
                    const response = await axios.get(
                        'https://maps.googleapis.com/maps/api/directions/json',
                        {
                            params: {
                                origin: `${origin.latitude},${origin.longitude}`,
                                destination: `${destination.latitude},${destination.longitude}`,
                                key: GOOGLE_MAPS_API_KEY,
                                mode: mode,
                            },
                        }
                    );
    
                    const route = response.data.routes[0];
                    const encodedPolyline = route.overview_polyline.points;
                    const decodedCoordinates = decodePolyline(encodedPolyline);
                    directionsData[mode] = decodedCoordinates;
    
                    const duration = route.legs[0].duration.text;
                    const distanceInMeters = route.legs[0].distance.value;
                    etaData[mode] = abbreviateEta(duration);
                    distanceData[mode] = (distanceInMeters / 1609.34).toFixed(2);
    
                    if (mode === selectedMode && mapRef.current) {
                        // Fit the map to the coordinates of the selected mode
                        mapRef.current.fitToCoordinates(decodedCoordinates, {
                            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                            animated: true,
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching directions for ${mode}:`, error);
                }
            }
    
            setAllDirections(directionsData);
            setAllEta(etaData);
            setAllDistances(distanceData);
            setDirections(directionsData[selectedMode]);
        };
    
        fetchDirectionsForAllModes();
    }, [origin, destination, triggerMap, selectedMode]);

    

    // Decode the polyline
    const decodePolyline = (encoded) => {
        const points = [];
        let index = 0, lat = 0, lng = 0;

        while (index < encoded.length) {
            let byte, shift = 0, result = 0;
            do {
                byte = encoded.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                byte = encoded.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
            lng += dlng;

            points.push({
                latitude: lat / 1e5,
                longitude: lng / 1e5,
            });
        }

        return points;
    };

    // Handle mode selection
    const handleModeChange = (mode) => {
        setSelectedMode(mode);
        // Update the map to show the directions for the selected mode
        setDirections(allDirections[mode]);
        // Recenter the map around the origin

        // Zoom the map to the selected route
        if (mapRef.current) {
            mapRef.current.fitToCoordinates(allDirections[mode], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }

        setMapRegion({
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.0041,
        });

        const eta_and_distance = {
            _eta : allEta[mode],
            _distance : allDistances[mode]
        }
        setEtaDistance(eta_and_distance)
        // Log the distance in miles for the selected mode
        console.log(allEta[mode])
        console.log(`Distance in ${mode}: ${allDistances[mode]} miles`);
        
        const mode_distance={
            mode:mode,
            distance:allEta[mode]
        }
        // alert("607")
        // getModeChange(mode_distance)

        // Trigger the animation
        // if (animatableViewRef.current) {
        //     animatableViewRef.current.slideInLeft(550);
        // }
    };

    return (
        <View style={styles.container}>
            <View style={{marginTop:0}}/>
            {/* Mode selection */}
            <View style={{backgroundColor:"#fff", paddingVertical:10}}>
                <View style={styles.modeContainer}>
                    <ChipIcon
                        onPress={() => handleModeChange('driving')}
                        iconName="car-outline"
                        label={allEta.driving}
                        iconSize={18}
                        active={selectedMode === 'driving'}
                    />
                    <ChipIcon
                        onPress={() => handleModeChange('transit')}
                        iconName="bus"
                        label={allEta.transit}
                        iconSize={17}
                        active={selectedMode === 'transit'}
                    />
                    <ChipIcon
                        onPress={() => handleModeChange('walking')}
                        iconName="walk"
                        label={allEta.walking}
                        iconSize={18}
                        active={selectedMode === 'walking'}
                    />

                    
                </View>
                {/* <View style={{justifyContent:'center', alignItems:'center', paddingBottom:5}}>
                    <Text style={{fontSize:12}}>20 Miles</Text>
                </View> */}
            </View>
            {/* Map View */}
            <MapView
                style={styles.map}
                region={mapRegion}
                apiKey={GOOGLE_MAPS_API_KEY}
                ref={mapRef}
            >
                

                {/* Render Polyline for the selected mode */}
                {/* {directions && (
                    // <Polyline
                    //     coordinates={directions}
                    //     strokeColor="#000"
                    //     strokeWidth={3}
                    // />

                    <Polyline
                        coordinates={directions}
                        strokeColor={polylineStyles[selectedMode].strokeColor}
                        strokeWidth={polylineStyles[selectedMode].strokeWidth}
                        lineDashPattern={polylineStyles[selectedMode].lineDashPattern}
                    />
                    
                )} */}


                {/* Render Polyline for the selected mode */}
                {directions && selectedMode === 'driving' && (
                    <Polyline
                        coordinates={directions}
                        strokeColor={polylineStyles.driving.strokeColor}
                        strokeWidth={polylineStyles.driving.strokeWidth}
                    />
                )}

                {/* Render Polyline for Walking and Transit Modes with dashed lines */}
                {directions && selectedMode !== 'driving' && (
                    <Polyline
                        coordinates={directions}
                        strokeColor={polylineStyles[selectedMode].strokeColor}
                        strokeWidth={polylineStyles[selectedMode].strokeWidth}
                        lineDashPattern={polylineStyles[selectedMode].lineDashPattern}
                    />
                )}


                {/* Markers for Origin and Destination */}
                <Marker coordinate={origin} title="Origin">
                    <MaterialCommunityIcons name="map-marker" size={30} color={COLORS.primary} />
                </Marker>
                <Marker coordinate={destination} title="Destination">
                    <MaterialCommunityIcons name="map-marker" size={30} color="#eb1337" />
                </Marker>
            </MapView>

            
            
                {/* <View style={styles.distance_info}> */}
                {/* <View style={styles.animatedView}>
                    <Text style={styles.distance_text}>{eta_distance._eta} <Text> ({eta_distance._distance} miles) </Text></Text>
                </View> */}
                {/* </View> */}
            
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    modeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 0,
    },
    distance_info:{
        // marginLeft:10, marginBottom:10,
        // backgroundColor:'#90EE90',
        // paddingLeft:0,
        // padding:3,
        borderTopRightRadius:5,
        borderBottomRightRadius:5,
        width:'55%',
        textAlign:'center'
    },
    distance_text:{
        color:'#00A86B',
        textAlign:'center'
        
    },
    animatedView: {
        // backgroundColor:'#00A86B',
        paddingLeft:10,
        padding:7,
        borderTopRightRadius:5,
        borderBottomRightRadius:5,
        marginRight:10
    },
    
});

export default GoogleDirections;












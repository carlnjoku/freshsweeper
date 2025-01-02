import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import polyline from '@mapbox/polyline';

const GooglePolyline = ({ encodedPolyline }) => {
  // Check if encodedPolyline is defined before decoding
  if (!encodedPolyline) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No route data available</Text>
      </View>
    );
  }

  // Decode the polyline points into coordinates
  const decodedCoordinates = polyline.decode(encodedPolyline);

  // Map the decoded coordinates to LatLng objects for the Polyline
  const routeCoordinates = decodedCoordinates.map(([latitude, longitude]) => ({
    latitude,
    longitude,
  }));

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: routeCoordinates[0].latitude,
        longitude: routeCoordinates[0].longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {/* Display the Polyline with the decoded coordinates */}
      <Polyline
        coordinates={routeCoordinates}
        strokeColor="#000" // Color of the polyline
        strokeWidth={4} // Width of the polyline
      />
    </MapView>
  );
};

export default GooglePolyline;

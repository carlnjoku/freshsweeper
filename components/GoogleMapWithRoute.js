import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from '../secret';
import GooglePolyline from './Polyline';


const GoogleMapWithRoute = () => {
  const [encodedPolyline, setEncodedPolyline] = useState(null);

  useEffect(() => {
    // Define the origin and destination coordinates
    const origin = '40.712776,-74.005974'; // New York City
    const destination = '34.052235,-118.243683'; // Los Angeles

    // Define your Google Maps Directions API key
    const apiKey = GOOGLE_MAPS_API_KEY;

    // Make a request to Google Maps Directions API to get route data
    fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Extract the encoded polyline from the response
        const encodedPolyline = data.routes[0].overview_polyline.points;
        setEncodedPolyline(encodedPolyline);
      })
      .catch((error) => {
        console.error('Error fetching route data:', error);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {encodedPolyline ? (
        <Text>ufyayf</Text>
        // <GooglePolyline encodedPolyline={encodedPolyline} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading route...</Text>
        </View>
      )}
    </View>
  );
};

export default GoogleMapWithRoute;

import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, Dimensions, Text, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import COLORS from '../constants/colors';
import { GOOGLE_MAPS_API_KEY } from '../secret';

const GoogleMapAndUsers = ({users,  apartment_name, apartment_address, apartment_latitude, apartment_longitude}) => {

  
  console.log("__________________________________")
  console.log(apartment_name)
  console.log("__________________________________")
  return (
    <View>
      <MapView
        style={styles.map}
        // initialRegion={center}
        // region={selectedCoordinate ? { ...selectedCoordinate, latitudeDelta: 0.008, longitudeDelta: 0.0041 } : undefined}
        initialRegion={{
          
          latitude: apartment_latitude,
          longitude: apartment_longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          latitudeDelta: 0.0880,
          longitudeDelta: 0.0441,
          // latitudeDelta: 0.008,
          // longitudeDelta: 0.0041,
        }}
        apiKey={GOOGLE_MAPS_API_KEY}
      >
       
        {/* Iterate over users array and add markers */}
        {users.map(user => (
          <Marker
            key={user._id}
            coordinate={{latitudeDelta: 0.008, longitudeDelta: 0.0041, latitude: user.location.latitude, longitude: user.location.longitude }}
            title={user.firstname+' '+user.lastname}
          >
          <Image source={{uri:user.avatar}} style={{ width: 32, height: 32, borderRadius:16 }} />
      
          </Marker>
        ))}

          <Marker
              coordinate={{ latitude: apartment_latitude, longitude: apartment_longitude }}
          >
              {/* Custom icon for the marker */}
              <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'white', borderRadius:35, width:70, height:70, opacity:0.9}}><FontAwesome5 name="house-user" size={40} color={COLORS.primary} /></View>
                <Callout>
                  <View>
                    <Text>{apartment_name}</Text>
                    <Text>{apartment_address}</Text>
                  </View>
                </Callout>
              
          </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/3,
  },
});

export default GoogleMapAndUsers;

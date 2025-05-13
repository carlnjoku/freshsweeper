import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import { Card, Avatar, Button, Divider, ActivityIndicator } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import moment from "moment";
import calculateDistance from "../../utils/calculateDistance";
import getFirstLetter from "../../utils/getFirstLetter";
import ROUTES from "../../constants/routes";
import { useNavigation } from '@react-navigation/native';


const NewlyPublishedSchedule = ({ schedule, pendingCount, acceptedCleaners }) => {
  
  const navigation = useNavigation();

  // Modified grouping logic with your distance function
const groupedSchedules = schedule.reduce((acc, current) => {
  const existing = acc.find(item => item.scheduleId === current.scheduleId);
  
  const apartmentCoords = current.schedule;
  const cleanerCoords = current.cleaner.location;



  // Calculate distance using your function
  const distance = calculateDistance(
    apartmentCoords.schedule.apartment_latitude,
    apartmentCoords.schedule.apartment_longitude,
    cleanerCoords.latitude,
    cleanerCoords.longitude
  );

  if (existing) {
    existing.totalRequests++;
      if (current.status === 'accepted') existing.accepted++;
      if (current.status === 'declined') existing.declined++;

    if (!existing.cleaners.some(c => c._id === current.cleaner._id)) {
      existing.cleaners.push({
        ...current.cleaner,
        distance: `${distance}` // Add formatted distance
        
      });
    }
  } else {
    acc.push({
      scheduleId: current.scheduleId,
      cleaning_date: current.cleaning_date,
      cleaning_time: current.cleaning_time,
      cleaners: [{
        ...current.cleaner,
        distance: `${distance}` // Add formatted distance
      }],
      scheduleDetails: {
        ...current.schedule,
        apartment_location: {
          lat: apartmentCoords.apartment_latitude,
          lng: apartmentCoords.apartment_longitude
        }
      },
      totalRequests: 1,
      accepted: current.status === 'pending_acceptance' ? 1 : 0,
      declined: current.status === 'declined' ? 1 : 0
    });
  }
  return acc;
}, []);

// Then sort cleaners by distance (nearest first)
groupedSchedules.forEach(group => {
  group.cleaners.sort((a, b) => 
    parseFloat(a.distance) - parseFloat(b.distance)
  );
});

  // console.log(JSON.stringify(groupedSchedules, null, 2))

  return (
    <View>
    <Card style={styles.card}>
      

      <FlatList
            data={groupedSchedules}
            keyExtractor={(item) => item.scheduleId}
            renderItem={({ item }) => (
              <View style={styles.scheduleContainer}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate(ROUTES.host_request_list, {
                    scheduleId:item.scheduleId,
                    apartment_name:item.scheduleDetails.schedule.apartment_name,
                    apartment_address:item.scheduleDetails.schedule.address,
                  })}
                  activeOpacity={0.9}
                >
                <Card.Title
                  title={
                    <Text style={styles.scheduleTitile}>{item.scheduleDetails.schedule.apartment_name}</Text>
                  }
                  subtitle={
                    <View>
                      <Text style={styles.addressText}>
                        {item.scheduleDetails.schedule.address}
                      </Text>
    
                      <Text style={styles.scheduleTex}>{`${moment(item.cleaning_date).format('ddd MMM D')} @ ${moment(item.cleaning_time, 'h:mm:ss A').format('h:mm A')}`}</Text>
                    </View>
                  }
                  left={(props) => <Avatar.Icon {...props} icon="calendar" style={styles.icon} />}

                  
                />

                {/* Status Statistics */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={[styles.statCount, styles.acceptedText]}>
                    {item.accepted}
                  </Text>
                  <Text style={styles.statLabel}>Accepted</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statCount, styles.declinedText]}>
                    {item.declined}
                  </Text>
                  <Text style={styles.statLabel}>Declined</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statCount, styles.pendingText]}>
                    {item.totalRequests - (item.accepted + item.declined)}
                  </Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
              </View>
         
              </TouchableOpacity>
                
                {/* <FlatList
                  data={item.cleaners}
                  keyExtractor={(cleaner) => cleaner._id}
                  renderItem={({ item: cleaner }) => (
                    <View style={styles.cleanerCard}>
                      <Image
                        source={{ uri: cleaner.avatar }}
                        style={styles.avatar}
                      />
                      <View style={styles.cleanerInfo}>
                        <Text style={styles.name}>
                          {cleaner.firstname} {getFirstLetter(cleaner.lastname)}.
                        </Text>
                        <Text style={styles.distance}>{cleaner.distance} miles away</Text>
                        
                        
                      </View>
                    </View>
                  )}
                /> */}
              </View>
            )}
          />

          

      <Divider style={styles.divider} />

      {pendingCount > 0 && (
        <View style={styles.pendingContainer}>
          <ActivityIndicator animating={true} color="#FFA500" />
          <Text style={styles.pendingText}>
            Waiting for cleaners to accept... ({pendingCount} requests sent)
          </Text>
        </View>
      )}

      
    </Card>

    
    </View>
  );
};

// Sample style
const styles = StyleSheet.create({
  card: {
    margin: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3, // Shadow for Android
  },
  icon: {
    backgroundColor: COLORS.light_pink_1,
  },
  divider: {
    marginVertical: 10,
  },
  pendingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal:15
  },
  pendingText: {
    marginLeft: 10,
    color: "#FFA500",
    fontWeight: "400",
    fontSize:13
  },
  acceptedContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  scheduleTitile:{
    fontSize: 16,
    fontWeight: "bold",
  },
  distance:{
    fontSize: 12,
    color:COLORS.gray
  },
  cleanerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  cleanerName: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
  },
  noAcceptedText: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
    marginTop: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#2196F3",
  },









  scheduleContainer: {
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  scheduleId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  cleanerCard: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    marginHorizontal:15,
    marginLeft:70,
    backgroundColor: '#f8f8f8',
    borderRadius: 8
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15
  },
  cleanerInfo: {
    flex: 1
  },
  name: {
    fontWeight: '500',
    fontSize: 14
  },
  scheduleTex:{
    fontSize:12,
    color: '#666',
  },

  addressText: {
  fontSize: 12,
  marginTop: -6,
},

statsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingVertical: 15,
  marginHorizontal: 15,
  borderTopWidth: 1,
  borderTopColor: '#eee'
},
statItem: {
  alignItems: 'center'
},
statCount: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 5
},
statLabel: {
  fontSize: 12,
  color: '#666'
},
acceptedText: {
  color: '#4CAF50' // Green
},
declinedText: {
  color: '#F44336' // Red
},
pendingText: {
  color: '#FF9800' // Orange
},
globalPendingText: {
  marginLeft: 10,
  color: "#FF9800",
  fontWeight: "400",
  fontSize: 13
},
});

export default NewlyPublishedSchedule;
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Avatar, Button, Divider, ActivityIndicator } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const NewlyPublishedSchedule = ({ schedule, pendingCount, acceptedCleaners }) => {
  return (
    <Card style={styles.card}>
      <Card.Title
        title={`🧹 ${schedule.apartmentName}`}
        subtitle={`${schedule.cleaning_date} at ${schedule.cleaning_time}`}
        left={(props) => <Avatar.Icon {...props} icon="calendar" style={styles.icon} />}
      />

      <Divider style={styles.divider} />

      {/* Pending Requests */}
      {pendingCount > 0 && (
        <View style={styles.pendingContainer}>
          <ActivityIndicator animating={true} color="#FFA500" />
          <Text style={styles.pendingText}>
            Waiting for cleaners to accept... ({pendingCount} requests sent)
          </Text>
        </View>
      )}

      {/* Accepted Cleaners */}
      {/* {acceptedCleaners.length > 0 ? (
        <View style={styles.acceptedContainer}>
          <Text style={styles.sectionTitle}>Accepted Cleaner(s)</Text>
          {acceptedCleaners.map((cleaner, index) => (
            <View key={index} style={styles.cleanerItem}>
              <MaterialIcons name="check-circle" size={20} color="green" />
              <Text style={styles.cleanerName}>{cleaner.name} (Accepted at {cleaner.acceptedTime})</Text>
            </View>
          ))}
        </View>
      ) : (
        pendingCount === 0 && (
          <Text style={styles.noAcceptedText}>No cleaners have accepted yet.</Text>
        )
      )} */}

      {/* Invite More Cleaners Button */}
      {/* {pendingCount > 0 && acceptedCleaners.length === 0 && (
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => console.log("Invite More Cleaners")}
        >
          Invite More Cleaners
        </Button>
      )} */}
    </Card>
  );
};

// Sample styles
const styles = StyleSheet.create({
  card: {
    margin: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3, // Shadow for Android
  },
  icon: {
    backgroundColor: "#4CAF50",
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
});

export default NewlyPublishedSchedule;
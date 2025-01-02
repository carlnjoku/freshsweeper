import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Button, Chip } from "react-native-paper";
import COLORS from "../../constants/colors";

const AvailableSchedules = ({ schedules, onClaim }) => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleClaim = (scheduleId) => {
    setSelectedSchedule(scheduleId);
    onClaim(scheduleId); // Call the parent function to update the claimed schedule
  };

  const renderSchedule = ({ item }) => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{item.propertyName}</Text>
          <Text style={styles.details}>Location: {item.location}</Text>
          <Text style={styles.details}>Date: {item.cleaningDate}</Text>
          <Text style={styles.details}>Time: {item.cleaningTime}</Text>
          
          <Chip style={styles.statusChip}>Status: {item.status}</Chip>
        </Card.Content>
        <Card.Actions>
          {item.status === "Open" ? (
            <Button
              mode="contained"
              onPress={() => handleClaim(item.id)}
              style={styles.claimButton}
            >
              Claim Task
            </Button>
          ) : (
            <Text style={styles.claimedText}>Claimed</Text>
          )}
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={schedules}
        renderItem={renderSchedule}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No available schedules at the moment.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  card: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  statusChip: {
    marginVertical: 5,
    alignSelf: "flex-start",
    borderRadius:50,
    backgroundColor:COLORS.primary_light_1
  },
  claimButton: {
    marginTop: 10,
    backgroundColor:COLORS.deepBlue
  },
  claimedText: {
    fontSize: 14,
    color: "green",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

export default AvailableSchedules;
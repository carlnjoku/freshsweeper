import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CleaningTimer = ({ initialTime, onRequestMoreTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <MaterialIcons name="timer" size={24} color="#FFA000" />
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onRequestMoreTime}>
        <Text style={styles.buttonText}>Request More Time</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "#FFF9C4",
    borderRadius: 10,
    marginBottom: 10,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
    color: "#FFA000",
  },
  button: {
    backgroundColor: "#FF7043",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default CleaningTimer;
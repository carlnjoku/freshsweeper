import React, { useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, Modal, Alert 
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const CleanerDashboard = () => {
  const [earnings, setEarnings] = useState({
    today: 50,
    weekly: 350,
    monthly: 1400,
  });

  const [jobs, setJobs] = useState([
    {
      id: "1",
      date: "2025-02-25",
      time: "10:00 AM",
      location: "123 Main St, NYC",
      status: "Upcoming",
    },
    {
      id: "2",
      date: "2025-02-26",
      time: "2:00 PM",
      location: "45 Elm St, Brooklyn",
      status: "Upcoming",
    },
  ]);

  const [notifications, setNotifications] = useState([
    { id: "1", message: "New job request at 200 Park Ave!", read: false },
    { id: "2", message: "Job at 123 Main St is marked as completed.", read: true },
  ]);

  const [newRequests, setNewRequests] = useState([
    {
      id: "101",
      date: "2025-02-27",
      time: "1:00 PM",
      location: "500 Lexington Ave, NYC",
      price: "$75",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const handleAcceptJob = (jobId) => {
    setNewRequests(newRequests.filter((job) => job.id !== jobId));
    Alert.alert("Job Accepted", "You have accepted the job successfully!");
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Earnings Section */}
      <View style={styles.earningsContainer}>
        <Text style={styles.sectionTitle}>Earnings</Text>
        <View style={styles.earningsRow}>
          <Text style={styles.earningsText}>Today: ${earnings.today}</Text>
          <Text style={styles.earningsText}>Week: ${earnings.weekly}</Text>
          <Text style={styles.earningsText}>Month: ${earnings.monthly}</Text>
        </View>
      </View>

      {/* Upcoming Jobs */}
      <View style={styles.jobsContainer}>
        <Text style={styles.sectionTitle}>Upcoming Jobs</Text>
        {jobs.length > 0 ? (
          <FlatList
            data={jobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.jobCard}>
                <View>
                  <Text style={styles.jobText}>
                    📅 {item.date} | ⏰ {item.time}
                  </Text>
                  <Text style={styles.jobText}>📍 {item.location}</Text>
                </View>
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noJobsText}>No upcoming jobs</Text>
        )}
      </View>

      {/* Notifications Section */}
      <TouchableOpacity style={styles.notificationButton}>
        <Ionicons name="notifications-outline" size={24} color="white" />
        <Text style={styles.notificationText}>Notifications</Text>
        {unreadNotifications > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadNotifications}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* New Job Requests Button */}
      <TouchableOpacity style={styles.requestButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="cleaning-services" size={24} color="white" />
        <Text style={styles.requestButtonText}>View New Requests</Text>
      </TouchableOpacity>

      {/* Modal for Job Requests */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Job Requests</Text>
            {newRequests.length > 0 ? (
              <FlatList
                data={newRequests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.jobCard}>
                    <View>
                      <Text style={styles.jobText}>
                        📅 {item.date} | ⏰ {item.time}
                      </Text>
                      <Text style={styles.jobText}>📍 {item.location}</Text>
                      <Text style={styles.priceText}>💰 {item.price}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAcceptJob(item.id)}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noJobsText}>No new job requests</Text>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9F9F9" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  earningsContainer: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  earningsRow: { flexDirection: "row", justifyContent: "space-between" },
  earningsText: { fontSize: 16, fontWeight: "600" },
  jobsContainer: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  jobCard: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#EFEFEF", padding: 15, borderRadius: 8, marginBottom: 10 },
  jobText: { fontSize: 15 },
  priceText: { fontSize: 16, fontWeight: "bold", color: "green" },
  startButton: { backgroundColor: "#007AFF", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
  startButtonText: { color: "white", fontWeight: "bold" },
  notificationButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#007AFF", padding: 15, borderRadius: 10, marginBottom: 10 },
  notificationText: { color: "white", fontSize: 16, fontWeight: "bold", marginLeft: 10 },
  badge: { backgroundColor: "red", borderRadius: 12, paddingHorizontal: 8, position: "absolute", right: 15, top: 10 },
  badgeText: { color: "white", fontSize: 12, fontWeight: "bold" },
  requestButton: { backgroundColor: "#28A745", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 15, borderRadius: 10 },
  requestButtonText: { color: "white", fontSize: 16, fontWeight: "bold", marginLeft: 10 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  acceptButton: { backgroundColor: "#28A745", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
  acceptButtonText: { color: "white", fontWeight: "bold" },
  closeButton: { marginTop: 15, alignSelf: "center" },
  closeButtonText: { color: "#007AFF", fontSize: 16 },
});

export default CleanerDashboard;
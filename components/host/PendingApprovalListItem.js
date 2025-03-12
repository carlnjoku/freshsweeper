import React, {useState} from 'react';
import Text from '../Text';
import { View, StyleSheet,TouchableOpacity, Alert, FlatList, Keyboard,KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Button, } from 'react-native';
import COLORS from '../../constants/colors';
import { formatDate } from '../../utils/formatDate';
import Card from '../Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import ROUTES from '../../constants/routes';
import { useNavigation } from '@react-navigation/native';
import FeedbackModal from '../Feedback';
import Modal from 'react-native-modal';
import userService from '../../services/userService';

const PendingApprovalListItem = ({item }) => {

  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [currentFeedbackTo, setCurrentFeedbackTo] = useState("");
  const [currentFeedbackToEmail, setCurrentFeedbackToEmail] = useState("");
  const [currentScheduleId, setCurrentScheduleId] = useState(null);
  const [isInputFocused, setInputFocused] = useState(false); // Focus state for TextInput

  console.log("item...........................item1")
  // console.log(JSON.stringify(item,null, 2))
  console.log("item...........................item")
  // const scheduleId = item.item._id
  const navigation = useNavigation();

  // const[schedules, setSchedules] = React.useState([])

  const updateApproved = async(schId) => {
    const data = {scheduleId:schId}
    const response = await userService.updateApproved(data)
  }

  const handleApproval = (scheduleId) => {
    Alert.alert(
      "Confirm Approval",
      "Are you sure you want to approve this schedule and payment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Approve",
          onPress: () => {
            setCurrentFeedbackTo(item.assignedTo.cleanerId);
            // setCurrentFeedbackToEmail(item.item.email);
            setCurrentScheduleId(scheduleId);
            setFeedbackVisible(true);
            updateApproved(scheduleId)
          },
        },
      ]
    );
  };

  const handleFeedbackSubmit = async(feedback) => {
    // console.log("submit", feedback)
    // console.log("Feedback submitted:", { scheduleId: currentScheduleId, cleanerId:currentFeedbackTo, ...feedback });
    
    try {
      
        const data = { 
          scheduleId: currentScheduleId, 
          cleanerId:currentFeedbackTo, 
          // email:currentFeedbackToEmail,
          created_on: new Date(),
          ...feedback }
        const response = await userService.sendFeedback(data);
        Alert.alert("Thank You", "Your feedback has been submitted!");
        setFeedbackVisible(false);
      } catch (error) {
        Alert.alert("Error", "Failed to send feedback try again.");
      }
  };

  // Function to reject a schedule
  const handleRejection = (scheduleId) => {
    Alert.alert(
      "Confirm Rejection",
      "Are you sure you want to reject this schedule?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          onPress: () => {
            setSchedules((prevSchedules) =>
              prevSchedules.map((schedule) =>
                schedule.id === scheduleId
                  ? { ...schedule, status: "Rejected" }
                  : schedule
              )
            );
            Alert.alert("Success", "Schedule rejected successfully.");
          },
        },
      ]
    );
  };


  return (
   

    <View style={styles.jobCard}>
      <View style={styles.container}>
        <View style={styles.date_time}>
          {/* <Text style={styles.date}>
            
            {moment(item.schedule.cleaning_date, "ddd MMM DD YYYY").format("ddd MMM DD")}
          </Text>
          <Text style={styles.time}>{item.schedule.cleaning_time}</Text> */}
        </View>

        <View style={styles.task_details}>
          <Text style={styles.task}>{item.schedule.apartment_name}</Text>
          <Text style={styles.apartment}>{item.schedule.address}</Text>
          <Text style={styles.status}>{item.schedule.status}</Text>
          <View style={styles.actions}>
            <Button title="Approve" onPress={() => handleApproval(item._id)} color="#4caf50" />
            <Button title="Reject" onPress={() => console.log("Rejected")} color="#f44336" />
          </View>
        </View>
      </View>

      {/* Feedback Modal */}
      <Modal
        isVisible={isFeedbackVisible}
        // style={styles.fullScreenModal}
        onBackdropPress={() => {
          if (!isInputFocused) setFeedbackVisible(false); // Close only if input is not focused
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
          >
            <FeedbackModal
              onSubmit={handleFeedbackSubmit}
              feedbackTo={currentFeedbackTo}
              onInputFocus={() => setInputFocused(true)} // Track input focus
              onInputBlur={() => setInputFocused(false)} // Track input blur
            />
            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
      </Modal>
    </View>
        
      

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 0,
    marginTop:5
  },
  dotline:{
    flex: 0.05,
    height:'100%',
    alignItems: 'flex-start'
  },
  line: {
    borderLeftWidth: 0.7, // Adjust the thickness of the line as needed
    borderLeftColor: COLORS.light_gray, // Change the color of the line as needed
    // borderStyle: 'dotted', // Set the line style to dotted
    minHeight: 78, // Make the line extend the full height of the container
    // marginRight: 10, // Adjust the spacing between the text and the line as needed
    marginHorizontal:5,
    marginVertical: 0 // Adjust vertical spacing as needed
  },
  date_time:{
    flex: 0.25,
    alignItems:'flex-end',
    marginRight:5
  },
  task: {
    fontWeight:'500'
  },
  apartment:{
    color:COLORS.gray,
    fontSize:13,
  },
  date:{
    marginTop:-4,
    fontSize:14,
    fontWeight:'500'
    // color:COLORS.gray
  },
  time:{
    marginTop:4,
    fontSize:12,
    // color:COLORS.gray
  },
  assignee:{
    fontSize:12,
    color:COLORS.gray
  },
  task_details:{
    flex: 0.75,
    alignItems: 'flex-start',
    width:'100%',
    marginTop:10
  },
  status:{
    textTransform:'capitalize',
    color:COLORS.light_gray
  },
  
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginBottom: 5, // Adjust this to control the space between the dot and the line
  },
  details:{
    fontSize:12,
    color:COLORS.primary,
    // textDecorationLine:'underline',
    fontWeight:'bold'
  },
  clockin:{
    fontSize:12,
    marginLeft:20,
    color:COLORS.primary,
    // textDecorationLine:'underline',
    fontWeight:'bold'
  },
  // action:{
  //   flexDirection:'row',
  //   justifyContent:'space-evenly',
  //   marginTop:5,
  //   marginBottom: 5,
  // },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  jobCard: { 
    padding: 15, 
    backgroundColor: '#f9f9f9', 
    marginVertical: 5,
    borderRadius:10 
  },
  fullScreenModal: {
  margin: 0, // Ensures the modal takes up the full screen
  justifyContent: "center", // Center the modal vertically
  alignItems: "center", // Center the modal horizontally
},
});

export default PendingApprovalListItem;



// import React, { useState } from "react";
// import { View, StyleSheet, TouchableOpacity, Modal, Keyboard,KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Alert, Button, Text } from "react-native";
// // import Modal from "react-native-modal";
// import FeedbackModal from "../Feedback";
// import COLORS from "../../constants/colors";
// import moment from "moment";

// const PendingApprovalListItem = ({ item }) => {
//   const [isFeedbackVisible, setFeedbackVisible] = useState(false);
//   const [currentFeedbackTo, setCurrentFeedbackTo] = useState("");
//   const [currentScheduleId, setCurrentScheduleId] = useState(null);
//   const [isInputFocused, setInputFocused] = useState(false); // Focus state for TextInput

//   const handleApproval = (scheduleId) => {
//     Alert.alert(
//       "Confirm Approval",
//       "Are you sure you want to approve this schedule?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Approve",
//           onPress: () => {
//             setCurrentFeedbackTo(item.item.assigned_to[0].cleanerId);
//             setCurrentScheduleId(scheduleId);
//             setFeedbackVisible(true);
//           },
//         },
//       ]
//     );
//   };

//   const handleFeedbackSubmit = (feedback) => {
//     console.log("submit", feedback)
//     console.log("Feedback submitted:", { scheduleId: currentScheduleId, ...feedback });
//     Alert.alert("Thank You", "Your feedback has been submitted!");
//     setFeedbackVisible(false);
//   };
//   console.log("Cleaner", item.item.assigned_to[0].cleanerId)
//   return (
//     <View style={styles.jobCard}>
//       <View style={styles.container}>
//         <View style={styles.date_time}>
//           <Text style={styles.date}>
//             {moment(item.item.schedule.cleaning_date, "ddd MMM DD YYYY").format("ddd MMM DD")}
//           </Text>
//           <Text style={styles.time}>{item.item.schedule.cleaning_time}</Text>
//         </View>

//         <View style={styles.task_details}>
//           <Text style={styles.task}>{item.item.schedule.apartment_name}</Text>
//           <Text style={styles.apartment}>{item.item.schedule.address}</Text>
//           <Text style={styles.status}>{item.item.schedule.status}</Text>
//           <View style={styles.actions}>
//             <Button title="Approve" onPress={() => handleApproval(item.item._id)} color="#4caf50" />
//             <Button title="Reject" onPress={() => console.log("Rejected")} color="#f44336" />
//           </View>
//         </View>
//       </View>

//       {/* Feedback Modal */}
//       <Modal
//         isVisible={isFeedbackVisible}
//         // style={styles.fullScreenModal}
//         onBackdropPress={() => {
//           if (!isInputFocused) setFeedbackVisible(false); // Close only if input is not focused
//         }}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//             style={styles.container}
//           >
//             <FeedbackModal
//               onSubmit={handleFeedbackSubmit}
//               feedbackTo={currentFeedbackTo}
//               onInputFocus={() => setInputFocused(true)} // Track input focus
//               onInputBlur={() => setInputFocused(false)} // Track input blur
//             />
//             </KeyboardAvoidingView>
//             </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flexDirection: "row", marginBottom: 0, marginTop: 5 },
//   date_time: { flex: 0.25, alignItems: "flex-end", marginRight: 5 },
//   task_details: { flex: 0.75, alignItems: "flex-start", marginTop: 10 },
//   date: { fontSize: 14, fontWeight: "500" },
//   time: { marginTop: 4, fontSize: 12 },
//   task: { fontWeight: "500" },
//   apartment: { color: COLORS.gray, fontSize: 13 },
//   status: { textTransform: "capitalize", color: COLORS.light_gray },
//   actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
//   jobCard: { padding: 15, backgroundColor: "#f9f9f9", marginVertical: 5, borderRadius: 10 },
//   fullScreenModal: { margin: 0, justifyContent: "center", alignItems: "center" },
// });

// export default PendingApprovalListItem;


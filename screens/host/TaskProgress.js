import React, { useContext, useEffect,useState } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, Linking, Button, FlatList, ScrollView, Image, View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import Modal from 'react-native-modal';



import BeforePhoto from './TaskTaps/BeforePhoto';
import AfterPhoto from './TaskTaps/AfterPhoto';
// import AfterPhoto from '../cleaner/AfterPhoto';
// import TaskChecklist from '../cleaner/TaskChecklist';
import TaskChecklist from './TaskTaps/TaskCheckList';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import CleanerProfile from './CleanerProfile';
import ViewCleanerProfile from './ViewCleanerProfile';
import { useNavigation } from '@react-navigation/native'
import TimeConversion1 from '../../utils/TimeConversion1';

const { width, height } = Dimensions.get('window');

const TaskProgress = ({route}) => {

 
  const {currentUserId, fbaseUser, currentUser} = useContext(AuthContext)
  const[openModal, setOpenModal] = useState(false)
  const[selectedCleanerId, setSelectedCleanerId] = useState("")
  const[visible, setVisible] = React.useState(false);
  const[schedule, setSchedule] = React.useState({});

  const navigation = useNavigation()
  const{scheduleId} = route.params


  
  const [currentStep, setCurrentStep] = useState(1);


    const [progress, setProgress] = useState(0);
    
    const startTime = moment(schedule?.schedule?.cleaning_time, "hh:mm A"); // Assuming the task started at 10:00 AM
    // const startTime = moment(schedule?.schedule.cleaning_time, "hh:mm A"); // Assuming the task started at 10:00 AM
    const totalEstimatedTime = 120 * schedule?.schedule?.total_cleaning_time * 1000;  // 120 minutes in milliseconds
    // const totalEstimatedTime = schedule?.schedule?.total_cleaning_time * 60 * 1000;

    const calculateEndTime = (startTime, durationInMinutes) => {
      const endTime = moment(startTime, 'hh:mm A').add(durationInMinutes, 'minutes');
      return endTime.format('hh:mm A');
    };
    
    // Example usage:
    const durationInMinutes = schedule?.schedule?.total_cleaning_time;
    
    const endTime = calculateEndTime(startTime, durationInMinutes);
    console.log('End time:', endTime);


    const calculateProgress = () => {
        const now = moment();  // Current time
        const elapsedTime = now.diff(startTime); // Time passed since start in milliseconds
    
        // Calculate percentage, ensuring it's between 0 and 100
        const percentage = Math.max(0, Math.min((elapsedTime / totalEstimatedTime) * 100, 100)); 
    
        setProgress(percentage);
    
    };

  

    const fetchSchedule = async() => {
      try {
        // Assuming userService.getPendingPayments fetches the pending payments from the API
        const response = await userService.getScheduleById(scheduleId);
        setSchedule(response.data);
        console.log("Fresh schedule", JSON.stringify(response.data, null, 2))
    } catch (error) {
        console.log(error);
        alert('Error fetching schedule');
    } finally {
        setLoading(false);
    }
    }

    useEffect(() => {
    const interval = setInterval(() => {
        calculateProgress();
    }, 5000); // Update every second

    fetchSchedule()
    return () => clearInterval(interval); // Clear interval on unmount
    }, []);

    const handleClosePreview = () => {
        setOpenModal(false)
    }
    const handleOpenPreview = (cleaner_id) => {
        setSelectedCleanerId(cleaner_id)
    setOpenModal(true)
    }

  return (
    <View style={{ flex: 1, backgroundColor:COLORS.white }}>


    {/* Content for each step */}
    <View style={styles.container0}>
      {/* Heading */}
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Cleaner{schedule?.assignedTo?.length > 1 ? 's': ''} at Work</Text>
      </View>

      {/* Subheading */}
      <View style={styles.subheadingContainer}>
        <Text style={styles.subheadingText}>Get to know the professionals who took care of your cleaning needs</Text>
      </View>


        <View style={styles.cleanerProgress}>
            {/* Cleaners Avatars */}
            <View style={styles.cleanersContainer}>

                {/* {schedule?.assignedTo?.map((cleaner, index) => ( */}
                <TouchableOpacity onPress={()=>handleOpenPreview(schedule.assignedTo?.cleanerId)} style={{flexDirection:'column', alignItems:'center'}}> 
                <Avatar.Image 
                    size={50} 
                    source={{ uri: schedule.assignedTo?.avatar }} 
                    style={{marginLeft: 10 }}
                />
                {/* <Text style={styles.initials}>{cleaner.firstname.charAt(0)} {cleaner.lastname.charAt(0)}</Text> */}
                <Text style={styles.infoText} >View Profile</Text>
                </TouchableOpacity>
                {/* ))} */}

                
            </View>

                <View style={styles.progressContainer}>
                    <AnimatedCircularProgress
                        size={50}
                        width={3}
                        fill={progress}           // The percentage of completion
                        tintColor={COLORS.primary}       // Progress bar color
                        backgroundColor="#e0e0e0" // Background color
                        lineCap="round"
                        rotation={0}
                    >
                        {() => (
                            <>
                        <View style={styles.textContainer}>
                            <Text style={styles.progressText}>
                            {`${Math.round(progress)}%`}    {/* Display the percentage */}
                            </Text>
                        </View>
                        
                        </>
                        )}
                    </AnimatedCircularProgress>
                    <Text style={styles.infoText}>Progress</Text>
                    {/* <Text style={styles.infoText}>Progress: {`${Math.round(progress)}%`}</Text> */}
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Started: {moment(schedule?.schedule?.cleaning_time, 'h:mm:ss A').format('h:mm A')} </Text>
                {/* <Text style={styles.infoText}><TimeConversion1 minutes={schedule?.schedule?.total_cleaning_time} /> </Text> */}
                <Text style={styles.infoText}>End {moment(endTime, 'h:mm:ss A').format('h:mm A')} </Text>
            </View>
        </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 1 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(1)}>
          <MaterialCommunityIcons name="camera" size={24} color={currentStep === 1 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Before Photos </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 2 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(2)}>
          <MaterialCommunityIcons name="camera-flip" size={24} color={currentStep === 2 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>After Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 3 ? COLORS.primary :"#f0f0f0"}]} onPress={() => setCurrentStep(3)}>
          <MaterialCommunityIcons name="format-list-checks" size={24} color={currentStep === 3 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Checklist</Text>
        </TouchableOpacity>
      </View>

      
      

      <View style={styles.container}>
        {currentStep === 1 && <BeforePhoto scheduleId={scheduleId} schedule={schedule} />}
        {currentStep === 2 && <AfterPhoto scheduleId={scheduleId} schedule={schedule} />}
        {currentStep === 3 && <TaskChecklist scheduleId={scheduleId} schedule={schedule} />}
      </View>

      {/* <Modal>
        <CleanerProfile schedule = {schedule} />
      </Modal> */}

          {/* <Modal 
            visible={openModal}
            animationType="slide" 
            // onRequestClose={onClose} // Handle hardware back button on Android
          >
            <ViewCleanerProfile 
                schedule = {schedule} 
                cleanerId={selectedCleanerId}
                close_modal={handleClosePreview}
            />
            
          </Modal> */}


          <Modal 
            isVisible={openModal} 
            onSwipeComplete={() => setVisible(false)} 
            swipeDirection="down"
            onBackdropPress={() => setVisible(false)}
            style={styles.modal}
            propagateSwipe={false}
            backdropColor="black"       // Set to black or any color
            backdropOpacity={0.1}       // Adjust opacity for transparency
            useNativeDriverForBackdrop={true}
        >
          <View style={styles.modalContent}>
            <ViewCleanerProfile 
                schedule = {schedule} 
                cleanerId={selectedCleanerId}
                close_modal={handleClosePreview}
            />
          </View>
        </Modal>
    </View>
    
  );
};


const styles = StyleSheet.create({
  container:{
    flex:1, 
    margin:10,
    backgroundColor:COLORS.white
  },
  
  tabsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    borderBottomColor: "#e9e9e9",
    elevation:2
  },
  tab:{
    borderBottomWidth:3,
    borderBottomColor: COLORS.primary,
    alignItems:'center',
    marginTop:10,
    paddingHorizontal:26
  },
  tab_text:{
    marginBottom:5,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  arrowButton: {
    padding: 10,
  },
  container0: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    margin: 10,
  },
  headingContainer: {
    marginBottom: 5,
  },
  headingText: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: COLORS.primary,
  },
  subheadingContainer: {
    marginBottom: 15,
  },
  subheadingText: {
    fontSize: 13,
    color: COLORS.gray,
  },
  cleanersContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  startTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    
  },
  timeText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  initials:{
    fontSize:13,
    fontWeight:'bold'
  },
  cleanerProgress:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  textContainer: {
    position: 'absolute',  // Absolute positioning inside the circular progress
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',      // Center horizontally
  },
  progressText: {
    marginLeft:6,
    fontSize: 12,           // Smaller font size for smaller circle
    fontWeight: 'bold',
    color: '#6A7FDB',
    
  },
  infoContainer: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop: 0,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  progressContainer:{
    flexDirection:'column',
    alignItems:'center'
  }, modal: {
    margin: 0,
    justifyContent: 'flex-end', // Aligns the modal to the bottom
  },
  modalContent: {
    width: width,
    height: height * 0.65, // Makes the modal a half-screen bottom sheet
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 0,
    alignItems: 'center',
  },
modal_header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    paddingBottom:10
  },
})
export default TaskProgress;


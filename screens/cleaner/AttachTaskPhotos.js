import React, { useContext, useEffect,useState } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BeforePhoto from './BeforePhoto';
import TaskChecklist from './TaskChecklist';
import TaskChecklistTest from './TaskChecklistTest';
import ReportIncident from './ReportIncident';
import AfterPhoto from './AfterPhoto';
import { useCleaningTimer } from '../../context/CleaningTimerContext';


const AttachTaskPhotos = ({route}) => {

  

  const cleaningTasks = [
    { id: 1, name: 'Clean Bedroom', task_title: 'Bedroom', completed: false },
    { id: 2, name: 'Clean Bathroom', task_title: 'Bathroom', completed: false },
    { id: 3, name: 'Clean Livingroom', task_title: 'Livingroom', completed: false },
  ];

  const{scheduleId, schedule, hostId} = route.params

  const { startTimer } = useCleaningTimer();
  startTimer(1800, schedule); // Start a 30-minute timer

  
  

 
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor:COLORS.white }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
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
          <Text style={styles.tab_text}>Incident Report</Text>
        </TouchableOpacity>
        
      </View>

      
      {/* Content for each step */}
      <View style={styles.container}>
        {currentStep === 1 && <BeforePhoto scheduleId={scheduleId}/>}
        {currentStep === 2 && <TaskChecklistTest scheduleId={scheduleId} hostId={hostId}  tasksList={cleaningTasks} />}
        {/* {currentStep === 2 && <AfterPhoto scheduleId={scheduleId} hostId={hostId}  tasksList={cleaningTasks}/>} */}
        {currentStep === 3 && <ReportIncident scheduleId={scheduleId}/>}
        
      </View>
      

      {/* Tab bar with icons */}
      


      {/* <View style={styles.navigation}>
        <TouchableOpacity onPress={handlePrevStep} style={styles.arrowButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextStep} style={styles.arrowButton}>
          <MaterialCommunityIcons name="arrow-right" size={24} color="black" />
        </TouchableOpacity>
      </View> */}
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
})
export default AttachTaskPhotos;





// import React, { useContext, useEffect,useState } from 'react';
// import Text from '../../components/Text';
// import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
// import COLORS from '../../constants/colors';
// import userService from '../../services/userService';
// import Card from '../../components/Card';
// import { AuthContext } from '../../context/AuthContext';
// import * as ImagePicker from 'expo-image-picker';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// const Tab = createMaterialTopTabNavigator();

// // Define screen components
// const Step1Screen = () => <Text>Step 1 Content</Text>;
// const Step2Screen = () => <Text>Step 2 Content</Text>;
// const Step3Screen = () => <Text>Step 3 Content</Text>;

// const AttachTaskPhotos = () => {

//   const [currentStep, setCurrentStep] = useState(0); // Change initial step to 0

//   const handleNextStep = () => {
//     setCurrentStep(currentStep => currentStep + 1); // Use functional update to ensure correct state transition
//   };

//   const handlePrevStep = () => {
//     setCurrentStep(currentStep => currentStep - 1); // Use functional update to ensure correct state transition
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {/* <View style={styles.tabsContainer}>
//         <TouchableOpacity style={styles.tab} onPress={() => setCurrentStep(1)}>
//           <MaterialCommunityIcons name="account" size={24} color={currentStep === 1 ? 'blue' : 'black'} />
//           <Text>Before Photos</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab} onPress={() => setCurrentStep(2)}>
//           <MaterialCommunityIcons name="briefcase" size={24} color={currentStep === 2 ? 'blue' : 'black'} />
//           <Text>Before Photos</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab} onPress={() => setCurrentStep(3)}>
//           <MaterialCommunityIcons name="cog" size={24} color={currentStep === 3 ? 'blue' : 'black'} />
//           <Text>Clock-Out</Text>
//         </TouchableOpacity>
//       </View> */}

//       <Tab.Navigator
//         initialRouteName="Before Photos"
//         tabBarOptions={{
//           showIcon: true,
//           style: { backgroundColor: '#f0f0f0', borderTopWidth: 1, borderTopColor: '#ccc' },
//           activeTintColor: COLORS.primary,
//           inactiveTintColor: 'black',
//           indicatorStyle: { backgroundColor: COLORS.primary, height: 3 },
//           labelStyle: { textTransform: 'none' },
//         }}
//       >
//         <Tab.Screen
//           name="Before Photos"
//           component={Step1Screen}
//           options={{
//             tabBarIcon: ({ color }) => <MaterialCommunityIcons name="camera" size={24} color={color} />,
//           }}
//         />
//         <Tab.Screen
//           name="After Photos"
//           component={Step2Screen}
//           options={{
//             tabBarIcon: ({ color }) => <MaterialCommunityIcons name="camera-flip" size={24} color={color} />,
//           }}
//         />
//         <Tab.Screen
//           name="Clock-Out"
//           component={Step3Screen}
//           options={{
//             tabBarIcon: ({ color }) => <MaterialCommunityIcons name="format-list-checks" size={24} color={color} />,
//           }}
//         />
//       </Tab.Navigator>

//       {/* Content for each step */}
//       <View style={{flex:1, margin:10}}>
//         {currentStep === 1 && <Text>Step 1 Content</Text>}
//         {currentStep === 2 && <Text>Step 2 Content</Text>}
//         {currentStep === 3 && <Text>Step 3 Content</Text>}
//       </View>

//       {/* Tab bar with icons */}
      


//       <View style={styles.navigation}>
//       <TouchableOpacity onPress={handlePrevStep} style={styles.arrowButton}>
//           <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleNextStep} style={styles.arrowButton}>
//           <MaterialCommunityIcons name="arrow-right" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
//     </View>
    
//   );
// };


// const styles = StyleSheet.create({
//   tabsContainer:{
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   tab:{
//     borderBottomWidth:2,
//     borderBottomColor: COLORS.primary,
//     alignItems:'center',
//     marginTop:10
//   },
//   navigation: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//   },
//   arrowButton: {
//     padding: 10,
//   },
// })
// export default AttachTaskPhotos;

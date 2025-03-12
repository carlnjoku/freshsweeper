// import React, {useState, useEffect} from 'react';
// import Text from '../../../components/Text';
// import { View, Button, StyleSheet, Pressable, Platform } from 'react-native';
// import { TextInput, Checkbox, RadioButton } from 'react-native-paper';
// import COLORS from '../../../constants/colors';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Picker } from '@react-native-picker/picker';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import TextInputContainer from '../../../components/TextInputContainer';
// import Tooltip from '../../../components/Tooltip';
// import moment from "moment";
// // import { calculateCleaningTime } from '../../../utils/cleaningTime';
// // import { calculateSmallCleaningTime } from '../../../utils/cleaningTime';
// // import TimeConversion from '../../../utils/TimeConversion';
// // import { calculateCleaningTimeByTasks } from '../../../utils/calculateCleaningTimeByTasks';


// export default function Duration({formData, setFormData, getCleanDate, getCleanTime, validateForm}) {

// //     // Define room times
// //     const roomTimes = {
// //         bedroom: {
// //         small: 10,
// //         medium: 15,
// //         large: 25,
// //         },
// //         bathroom: {
// //         small: 15,
// //         medium: 25,
// //         large: 35,
// //         },
// //         livingRoom: {
// //         small: 20,
// //         medium: 30,
// //         large: 40,
// //         },
// //         kitchen:{
// //         small:20,
// //         medium:30,
// //         large:40
// //         }
// //     };

  
// //   // Define rooms with room count
// //   const rooms = [
// //     { type: 'bedroom', size: 'medium', count: 3 },   // 3 large bedrooms
// //     { type: 'bathroom', size: 'medium', count: 1 }, // 2 medium bathrooms
// //     { type: 'livingRoom', size: 'small', count: 1 }, // 1 small living room
// //     { type: 'kitchen', size: 'small', count: 1 } // 1 small living room
// //   ];
  

// //   // Calculate total cleaning time based on rooms and their counts
// //   const calculateRoomCleaningTime = (rooms, roomTimes) => {
// //     return rooms.reduce((total, room) => {
// //       const { type, size, count } = room;
// //       const roomTime = roomTimes[type]?.[size] || 0; // Get time for room type and size
// //       return total + (roomTime * count); // Multiply room time by room count
// //     }, 0);
// //   };
  
// //   // Example usage
// //   const totalRoomCleaningTime = calculateRoomCleaningTime(rooms, roomTimes);
// //   console.log(`Total cleaning time for rooms: ${totalRoomCleaningTime} minutes`);

// //   const taskTimes = {
// //     dusting: 10,  // time in minutes
// //     vacuuming: 15,
// //     mopping: 20,
// //     makingBed: 5,
// //     organizing: 30,
// //   };
  
// //   // Define the tasks to be performed
// //   const tasks = ['dusting', 'vacuuming', 'mopping', 'makingBed', 'organizing'];
  
    
    
// //     const propertySize = 'medium';
// //     // const tasks = ['extraCleaning'];
    
// //     // const taskTimes = {
// //     //     // regularCleaning: 85,
// //     //     extraCleaning: totalRoomCleaningTime,
// //     // };

// //     const cleaningByTask = calculateCleaningTimeByTasks(tasks, taskTimes)
    
// //     console.log("L..........l")
// //     console.log(cleaningByTask)
// //     console.log("L..........l")

// //     // const tasks = ['vacuuming', 'bathroomCleaning', 'kitchenCleaning'];
// //     const cleaningTime = calculateCleaningTime(propertySize, tasks, taskTimes);
// //     const cleaningSmallTime = calculateSmallCleaningTime(propertySize, tasks, taskTimes);
    

// //     console.log(`Estimated cleaning time: ${cleaningSmallTime} minutesrss`);

//     const [date, setDate] = useState(new Date())
//     const [time, setTime] = useState(new Date())
//     const [show_picker, setShowPicker] = useState(false)
//     const [show_time_picker, setShowTimePicker] = useState(false)
//     const [clean_date, setCleanDate] = useState("")
//     const [clean_time, setCleanTime] = useState("")
//     const [selected_duration, setSelectedDuration] = useState("")

//     const hoursList = [];

//     for (let i = 1; i <= 10; i++) {
//     hoursList.push({ label: `${i} hour${i !== 1 ? 's' : ''}`, value: i });
//     }


//     useEffect(()=> {
  
//         validate
//       },[formData])

//     const validate = () => {
//         const isFormValid = clean_date =="" && clean_time =="" && selected_duration ==""

//         // alert('it is '+ isFormValid)
//         setIsValid(isFormValid); 
//         validateForm(isFormValid)
//       }

    
    
//     // const toggleDatePicker = () => {
//     //     setShowPicker(!show_picker)
//     //   }

//     //   const onChangeDatePicker = ({type}, selectedDate) => {
//     //     if(type=="set"){
//     //         const currentDate = selectedDate
//     //         setDate(currentDate)
//     //         if(Platform.OS==="android"){
//     //             toggleDatePicker()
//     //             setCleanDate(currentDate.toDateString())
               
//     //         }
//     //         getCleanDate(currentDate.toDateString(), 'cleaning_date')
//     //         setFormData((prevFormData) => ({
//     //             ...prevFormData,
//     //             cleaning_date: currentDate.toDateString(),
//     //           }));

//     //     }else{
//     //         toggleDatePicker()
//     //     }
//     //   }
    
//     //   const toggleTimePicker = () => {
//     //     setShowTimePicker(!show_time_picker)
//     //   }

//     //   const onChangeTimePicker = ({type}, selectedTime) => {
//     //     if(type=="set"){
//     //         const currentTime = selectedTime
//     //         setTime(currentTime)
//     //         if(Platform.OS==="android"){
//     //             toggleTimePicker()
//     //             setCleanTime(currentTime.toLocaleTimeString())
//     //         }

//     //         getCleanTime(currentTime.toLocaleTimeString(), 'cleaning_time')

//     //         setFormData((prevFormData) => ({
//     //             ...prevFormData,
//     //             cleaning_time: currentTime.toLocaleTimeString(),
//     //           }));
//     //           validate()
//     //     }else{
//     //         toggleTimePicker()
//     //     }
//     //   }

    

// const toggleDatePicker = () => {
//     setShowPicker(!show_picker);
// };

// const onChangeDatePicker = ({ type }, selectedDate) => {
//     if (type === "set") {
//         const currentDate = selectedDate;
//         setDate(currentDate);

//         // Format the date using Moment.js
//         const formattedDate = moment(currentDate).format("YYYY-MM-DD"); // ISO date format

//         if (Platform.OS === "android") {
//             toggleDatePicker();
//             setCleanDate(formattedDate);
//         }

//         // Update state and call external functions
//         getCleanDate(formattedDate, "cleaning_date");
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             cleaning_date: formattedDate,
//         }));
//     } else {
//         toggleDatePicker();
//     }
// };

// const toggleTimePicker = () => {
//     setShowTimePicker(!show_time_picker);
// };

// const calculateEndTime = (startTime, durationInMinutes) => {
//     const endTime = moment(startTime, 'hh:mm A').add(durationInMinutes, 'minutes');
//     // return endTime.format('hh:mm A');
//     return moment(endTime, 'hh:mm A').format('HH:mm:ss');
//   };

// const onChangeTimePicker = ({ type }, selectedTime) => {
//     if (type === "set") {
//         const currentTime = selectedTime;
//         setTime(currentTime);
//         // alert(currentTime)
//         // Format the time using Moment.js
//         const formattedTime = moment(currentTime).format("HH:mm:ss"); // 24-hour time format

//         if (Platform.OS === "android") {
//             toggleTimePicker();
//             setCleanTime(formattedTime);
//         }

//         // Update state and call external functions
//         getCleanTime(formattedTime, "cleaning_time");
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             cleaning_time: formattedTime,
//         }));

//         // Calculate end_cleaning_time
//         const cleaning_end_time = calculateEndTime(formattedTime, formData.total_cleaning_time)
//         alert(cleaning_end_time)
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             cleaning_end_time: cleaning_end_time,
//         }));
//         validate();
//     } else {
//         toggleTimePicker();
//     }
// };

//       const handleApartmentChange = (itemValue, itemIndex) => {
//         setSelectedDuration(itemValue);
//       }
//   return (
//     <View>
//         {/* <Text>{calculateCleaningTime(propertySize)}</Text> */}
//         {/* <Text>{formData.cleaning_date}</Text> */}
//         {/* <TimeConversion minutes = {calculateCleaningTime(propertySize)} /> */}
//     <Text bold style={{fontSize:24 }}>Schedule Cleaning Time</Text>
//     <Text style={{fontSize:14, marginBottom:20, color:COLORS.gray}}>Pick the Date and Time Convenient for Cleaning</Text>
//     {/* <View styles={{width:200}}><Tooltip text="This is a tooltip Pick the Date and Time Convenient for Cleaning" position="top"><Text>Hover me ...Tooltip</Text></Tooltip></View> */}
//     {show_picker && (
//         <DateTimePicker 
//             mode="date"
//             display="spinner"
//             value={date}
//             onChange={onChangeDatePicker}
//         />
//     )}
 
//     <Pressable
//         onPress={toggleDatePicker}
//     >
//         <TextInputContainer iconName="calendar" label="Select Date">
//             <TextInput
//                 mode="outlined"
//                 placeholderTextColor={COLORS.darkGray}
//                 outlineColor="transparent"
//                 value={date.toDateString()}
//                 activeOutlineColor="transparent"
//                 style={{marginBottom:5, fontSize:16, height:36, backgroundColor:COLORS.backgroundColor}}
//                 onChangeText={setCleanDate}
//                 onFocus={() => handleError(null, 'apt_name')}
//                 // error={errors.date}
//                 editable={false}
//             />
//         </TextInputContainer>
//     </Pressable>

//     {show_time_picker && (
//         <DateTimePicker 
//             mode="time"
//             display="spinner"
//             value={time}
//             onChange={onChangeTimePicker}
//         />
//     )}
//     <Pressable
//         onPress={toggleTimePicker}
//     >
//         <TextInputContainer iconName="clock-outline" label="Select Time">
//             <TextInput
//                 mode="outlined"
//                 placeholderTextColor={COLORS.darkGray}
//                 outlineColor="transparent"
//                 value={time.toLocaleTimeString()}
//                 activeOutlineColor="transparent"
//                 style={{marginBottom:5, fontSize:16, height:36,  backgroundColor:COLORS.backgroundColor}}
//                 onChangeText={setCleanTime}
//                 onFocus={() => handleError(null, 'apt_name')}
//                 iconName="email-outline"
//                 // error={errors.date}
//                 editable={false}
//             />
//         </TextInputContainer>   
//     </Pressable>

//     {/* <TextInputContainer iconName="timer-outline" label="Select Duration">
//         <TextInput
//             // label="Select Duration"
//             value={selected_duration}
//             mode="outlined"
//             outlineColor="transparent"
//             activeOutlineColor="transparent"
//             style={{marginBottom:5, fontSize:16, height:36, fontSize:14, backgroundColor:COLORS.backgroundColor}}
//             render={(props) => (
//                 <Picker
//                     selectedValue={selected_duration}
//                     // onValueChange={handleApartmentChange}
//                     onValueChange={(itemValue, itemIndex) => handleApartmentChange(itemValue, itemIndex)}
//                     mode="dropdown"
//                     // style={{ height: 20, width: 150 }}
//                     // itemStyle={{ height: 20 }} // Set the height of the items
//                     {...props}
//                 >
//                     <Picker.Item label="Select Duration" value="#" />
//                     {hoursList.map((item, index) => (
//                     <Picker.Item key={index} label={item.label} value={item.value} />
//                     ))}
//                 </Picker>
//             )}
//         />
//         </TextInputContainer> */}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//     input_container:{
//         borderRadius:8,
//         borderWidth:1,
//         padding:5,
//         borderColor:'#CCC',
//         marginVertical:10
//     },
//     input_container_inner:{
//         flexDirection:'row',
//         justifyContent:'space-between'
//     }
// })




// import React, { useState, useEffect } from 'react';
// import Text from '../../../components/Text';
// import { View, Pressable, StyleSheet, Platform } from 'react-native';
// import { TextInput } from 'react-native-paper';
// import COLORS from '../../../constants/colors';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import moment from 'moment';
// import TextInputContainer from '../../../components/TextInputContainer';

// export default function Duration({ formData, setFormData, getCleanDate, getCleanTime, validateForm }) {
//   const [date, setDate] = useState(new Date());
//   const [time, setTime] = useState(new Date()); // Ensure 'time' is a Date object
//   const [showPicker, setShowPicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [cleanDate, setCleanDate] = useState('');
//   const [cleanTime, setCleanTime] = useState('');
//   const [selectedDuration, setSelectedDuration] = useState('');
//   const [isValid, setIsValid] = useState(false);

//   const hoursList = Array.from({ length: 10 }, (_, i) => ({
//     label: `${i + 1} hour${i !== 0 ? 's' : ''}`,
//     value: i + 1,
//   }));

//   useEffect(() => {
//     validate();
//   }, [cleanDate, cleanTime, selectedDuration]);

//   const validate = () => {
//     const isFormValid = cleanDate !== '' && cleanTime !== '' && selectedDuration !== '';
//     setIsValid(isFormValid);
//     validateForm(isFormValid);
//   };

//   const toggleDatePicker = () => {
//     setShowPicker(!showPicker);
//   };

//   const onChangeDatePicker = (event, selectedDate) => {
//     if (event.type === 'set') {
//       const currentDate = selectedDate || date; // Ensure date fallback
//       setDate(currentDate);

//       // Format the date using Moment.js
//       const formattedDate = moment(currentDate).format('YYYY-MM-DD');

//       // Update the form data and clean_date state
//       setCleanDate(formattedDate);
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         cleaning_date: formattedDate,
//       }));

//       // Close the date picker after selection
//       setShowPicker(false);
//       getCleanDate(formattedDate, 'cleaning_date');
//     } else {
//       // Close the picker if the user cancels
//       setShowPicker(false);
//     }
//   };

//   const toggleTimePicker = () => setShowTimePicker(!showTimePicker);

//   const calculateEndTime = (startTime, durationInMinutes) => {
//     return moment(startTime, 'HH:mm:ss').add(durationInMinutes, 'minutes').format('HH:mm:ss');
//   };

//   const onChangeTimePicker = (event, selectedTime) => {
//     if (event.type === 'set') {
//       if (selectedTime) {
//         const currentTime = selectedTime || time; // Fallback to current time if no time selected
//         const formattedTime = moment(currentTime).format('HH:mm:ss'); // Format the time as 'HH:mm:ss'
        
//         console.log("Formatted Time:", formattedTime); // Log the formatted time for debugging

//         setTime(currentTime); // Update the time state to the selected time
//         setCleanTime(formattedTime); // Update the cleanTime with formatted time

//         setFormData((prev) => {
//           const endCleaningTime = calculateEndTime(formattedTime, formData.total_cleaning_time || 0);
//           return { ...prev, cleaning_time: formattedTime, cleaning_end_time: endCleaningTime };
//         });

//         getCleanTime(formattedTime, 'cleaning_time'); // Send formatted time to parent component

//         // Close the time picker after selection
//         setShowTimePicker(false);
//       }
//     } else {
//       // Close the picker if the user cancels
//       setShowTimePicker(false);
//     }
//   };

//   return (
//     <View>
//       <Text bold style={{ fontSize: 24 }}>Schedule Cleaning Time</Text>
//       <Text style={{ fontSize: 14, marginBottom: 20, color: COLORS.gray }}>
//         Pick the Date and Time Convenient for Cleaning
//       </Text>

//       {showPicker && (
//         <DateTimePicker
//           mode="date"
//           display="spinner"
//           value={date}
//           onChange={onChangeDatePicker}
//         />
//       )}

//       <Pressable onPress={toggleDatePicker}>
//         <TextInputContainer iconName="calendar" label="Select Date">
//           <TextInput
//             mode="outlined"
//             value={cleanDate}
//             editable={false}
//             placeholder="Select a date"
//             style={styles.input}
//           />
//         </TextInputContainer>
//       </Pressable>

//       {showTimePicker && (
//         <DateTimePicker
//           mode="time"
//           display="spinner"
//           value={time} // Ensure the value is a valid Date object
//           onChange={onChangeTimePicker}
//         />
//       )}

//       <Pressable onPress={toggleTimePicker}>
//         <TextInputContainer iconName="clock-outline" label="Select Time">
//           <TextInput
//             mode="outlined"
//             value={cleanTime}
//             editable={false}
//             placeholder="Select a time"
//             style={styles.input}
//           />
//         </TextInputContainer>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   input: {
//     marginBottom: 5,
//     fontSize: 16,
//     height: 36,
//     backgroundColor: COLORS.backgroundColor,
//   },
// });









// import React, { useState, useEffect } from 'react';
// import Text from '../../../components/Text';
// import { View, Pressable, StyleSheet, Platform } from 'react-native';
// import { TextInput } from 'react-native-paper';
// import COLORS from '../../../constants/colors';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import moment from 'moment';
// import TextInputContainer from '../../../components/TextInputContainer';

// export default function Duration({ formData, setFormData, getCleanDate, getCleanTime, validateForm }) {
//   const [date, setDate] = useState(new Date()); // Date object
//   const [time, setTime] = useState(new Date()); // Time object
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [cleanDate, setCleanDate] = useState("");
//   const [cleanTime, setCleanTime] = useState("");
//   const [dateError, setDateError] = useState(''); // For displaying date validation errors
  
//   const [isValid, setIsValid] = useState(false);


//   useEffect(() => {
//     // Prepopulate date and time if available in formData
//     if (formData.cleaning_date) {
//       const savedDate = new Date(formData.cleaning_date);
//       setDate(savedDate);
//       setCleanDate(moment(savedDate).format("YYYY-MM-DD"));
//     }

//     if (formData.cleaning_time) {
//       const savedTime = moment(formData.cleaning_time, "HH:mm:ss").toDate();
//       setTime(savedTime);
//       setCleanTime(moment(savedTime).format("HH:mm:ss"));
//     }
//   }, [formData]);


//   useEffect(() => {
//     validate();
//   }, [cleanDate, cleanTime]);

//   const validate = () => {
//     const isFormValid = cleanDate !== '' && cleanTime !== '';
//     setIsValid(isFormValid);
//     validateForm(isFormValid);
//   };

//   const toggleDatePicker = () => {
//     setShowDatePicker((prev) => !prev); // Toggle picker visibility
//   };

//   const onChangeDatePicker = ({ type }, selectedDate) => {
//     if (type === 'set') {
//       const currentDate = selectedDate;
//       setDate(currentDate);

//       const formattedDate = moment(currentDate).format('YYYY-MM-DD');
//       const today = moment().startOf('day');

//       // Validate that the selected date is before today
//       if (moment(currentDate).isSameOrAfter(today)) {
//         setDateError('Cleaning date must be in the past.');
//         setCleanDate('');
//       } else {
//         setDateError('');
//         setCleanDate(formattedDate);
//         getCleanDate(formattedDate, 'cleaning_date');
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           cleaning_date: formattedDate,
//         }));
//       }

//       if (Platform.OS === 'android') {
//         toggleDatePicker();
//       }
//     } else {
//       toggleDatePicker();
//     }
//   };

//   // const onChangeDatePicker = ({ type }, selectedDate) => {
//   //     if (type === "set") {
//   //         const currentDate = selectedDate;
//   //         setDate(currentDate);

//   //         // Format the date using Moment.js
//   //         const formattedDate = moment(currentDate).format("YYYY-MM-DD"); // ISO date format

//   //         if (Platform.OS === "android") {
//   //             toggleDatePicker();
//   //             setCleanDate(formattedDate);
//   //         }

//   //         // Update state and call external functions
//   //         getCleanDate(formattedDate, "cleaning_date");
//   //         setFormData((prevFormData) => ({
//   //             ...prevFormData,
//   //             cleaning_date: formattedDate,
//   //         }));
//   //     } else {
//   //         toggleDatePicker();
//   //     }
//   // };

  
//   const toggleTimePicker = () => setShowTimePicker((prev) => !prev); // Toggle time picker visibility

  

//   const onChangeTimePicker = ({ type }, selectedTime) => {
//     if (type === "set") {
//         const currentTime = selectedTime;
//         setTime(currentTime);
//         // Format the time using Moment.js
//         const formattedTime = moment(currentTime).format("HH:mm:ss"); // 24-hour time format

//         if (Platform.OS === "android") {
//             toggleTimePicker();
//             setCleanTime(formattedTime);
//         }

//         // Update state and call external functions
//         // getCleanTime(formattedTime, "cleaning_time");
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             cleaning_time: formattedTime,
//         }));

//         // Calculate end_cleaning_time
//         const cleaning_end_time = calculateEndTime(formattedTime, formData.total_cleaning_time)
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             cleaning_end_time: cleaning_end_time,
//         }));
//         validate();
//     } else {
//         toggleTimePicker();
//     }
// };



// const calculateEndTime = (startTime, durationInMinutes) => {
//     return moment(startTime, "HH:mm:ss")
//       .add(durationInMinutes, "minutes")
//       .format("HH:mm:ss");
//   };

//   return (
//     <View>
//       <Text bold style={{ fontSize: 24 }}>Schedule Cleaning Time</Text>
//       <Text style={{ fontSize: 14, marginBottom: 20, color: COLORS.gray }}>
//         Pick the date and time  for cleaning
//       </Text>

//       {showDatePicker && (
//         <DateTimePicker
//           mode="date"
//           display="spinner"
//           value={date} // Ensure 'date' is a Date object
//           onChange={onChangeDatePicker}
//         />
//       )}

//       <Pressable onPress={toggleDatePicker}>
//         <TextInputContainer iconName="calendar" label="Select Date">
//           {/* <TextInput
//             mode="outlined"
//             value={cleanDate}
//             editable={false}
//             placeholder="Select a date"
//             style={styles.input}
//           /> */}
//           <TextInput
//                 mode="outlined"
//                 placeholderTextColor={COLORS.darkGray}
//                 outlineColor="transparent"
//                 value={date.toDateString()}
//                 activeOutlineColor="transparent"
//                 style={{marginBottom:5, fontSize:16, height:36, backgroundColor:COLORS.white}}
//                 onChangeText={setCleanDate}
//                 onFocus={() => handleError(null, 'apt_name')}
//                 // error={errors.date}
//                 editable={false}
//             />
//         </TextInputContainer>
//       </Pressable>
//       {dateError ? <Text style={{ color: 'red', fontSize: 12 }}>{dateError}</Text> : null}

//       {showTimePicker && (
//         <DateTimePicker
//           mode="time"
//           display="spinner"
//           value={time} // Ensure 'time' is a Date object
//           onChange={onChangeTimePicker}
//         />
//       )}

//       <Pressable onPress={toggleTimePicker}>
//         <TextInputContainer iconName="clock-outline" label="Select Time">
//           {/* <TextInput
//             mode="outlined"
//             value={cleanTime}
//             editable={false}
//             placeholder="Select a time"
//             style={styles.input}
//           /> */}
//           <TextInput
//             mode="outlined"
//             placeholderTextColor={COLORS.darkGray}
//             outlineColor="transparent"
//             value={time.toLocaleTimeString()}
//             activeOutlineColor="transparent"
//             style={{marginBottom:5, fontSize:16, height:36,  backgroundColor:COLORS.white}}
//             onChangeText={setCleanTime}
//             onFocus={() => handleError(null, 'apt_name')}
//             iconName="email-outline"
//             // error={errors.date}
//             editable={false}
//         />
//         </TextInputContainer>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   input: {
//     marginBottom: 5,
//     fontSize: 16,
//     height: 36,
//     backgroundColor: COLORS.backgroundColor,
//   },
// }); 



import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import Text from '../../../components/Text'; // Assuming a custom Text component
import COLORS from '../../../constants/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default function Duration({ formData, setFormData, getCleanDate, getCleanTime, validateForm }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formData.cleaning_date);
  const [selectedTime, setSelectedTime] = useState(formData.cleaning_time);

  const [date, setDate] = useState(new Date()); // Date object
  const [time, setTime] = useState(new Date()); // Time object
  const [clean_date, setCleanDate] = useState("");
  const [clean_time, setCleanTime] = useState("");
  const [dateError, setDateError] = useState(''); // For displaying date validation errors


  const [isValid, setIsValid] = useState(false);
    useEffect(() => {
    // Prepopulate date and time if available in formData
    if (formData.cleaning_date) {
      const savedDate = new Date(formData.cleaning_date);
      setDate(savedDate);
      setCleanDate(moment(savedDate).format("YYYY-MM-DD"));

      console.log("Existing schedule", formData)
    }

    if (formData.cleaning_time) {
      const savedTime = moment(formData.cleaning_time, "HH:mm:ss").toDate();
      setTime(savedTime);
      setCleanTime(moment(savedTime).format("HH:mm:ss"));
    }
  }, [formData]);

    useEffect(() => {
      validate();
    }, [clean_date, clean_time]);

    const validate = () => {
      const isFormValid = clean_date !== '' && clean_time !== '';
      setIsValid(isFormValid);
      validateForm(isFormValid);
    };


        

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);
  
  
  
  const handleConfirmDate = (date) => {
    // console.log(date)
    const formattedDate = moment(date).format('YYYY-MM-DD');
    
      setSelectedDate(formattedDate);
      getCleanDate(date);
      setFormData((prevFormData) => ({
        ...prevFormData,
        cleaning_date: formattedDate,
      }));
      hideDatePicker();
      validateForm();
      validate();
  
  };


  const handleConfirmTime = (time) => {
    const formattedTime = time.toTimeString().split(' ')[0]; // Format as HH:mm:ss
    setSelectedTime(formattedTime);
    getCleanTime(time)
    setFormData((prevFormData) => ({
      ...prevFormData,
      cleaning_time: formattedTime,
    }));

    // Calculate end_cleaning_time
    const cleaning_end_time = calculateEndTime(formattedTime, formData.total_cleaning_time)
    setFormData((prevFormData) => ({
        ...prevFormData,
        cleaning_end_time: cleaning_end_time,
    }));
    // validate();
    hideTimePicker();
    validateForm();
  };

  console.log("My formData", formData)

  return (
    <View>
      <Text bold style={styles.title}>
        Schedule Cleaning Time
      </Text>
      <Text style={styles.subtitle}>
        Pick the date and time for cleaning
      </Text>

      {/* Date Picker */}
      <Pressable onPress={showDatePicker} style={styles.overlay}>
        <TextInput
          mode="outlined"
          label="Cleaning Date"
          value={selectedDate}
          placeholder="Select Date"
          editable={false} // Prevent typing
          style={styles.textInput}
          outlineColor={COLORS.gray}
          activeOutlineColor={COLORS.primary}
          right={<TextInput.Icon name="calendar" />}
        />
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display="spinner"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />

      {/* Time Picker */}
      <Pressable onPress={showTimePicker} style={styles.overlay}>
        <TextInput
          mode="outlined"
          label="Cleaning Time"
          value={selectedTime}
          placeholder="Select Time"
          editable={false} // Prevent typing
          style={styles.textInput}
          outlineColor={COLORS.gray}
          activeOutlineColor={COLORS.primary}
          right={<TextInput.Icon name="clock-outline" />}
        />
      </Pressable>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        display="spinner"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: COLORS.gray,
  },
  textInput: {
    marginBottom: 20,
    backgroundColor: COLORS.white,
    height: 56, // Consistent height
    justifyContent: 'center', // Align text vertically
    fontSize: 16,
  },
  overlay: {
    position: 'relative',
  },
});
import React, {useState, useEffect} from 'react';
import Text from '../../../components/Text';
import { View, Button, StyleSheet, Pressable, Platform } from 'react-native';
import { TextInput, Checkbox, RadioButton } from 'react-native-paper';
import COLORS from '../../../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextInputContainer from '../../../components/TextInputContainer';
import Tooltip from '../../../components/Tooltip';
import moment from "moment";
// import { calculateCleaningTime } from '../../../utils/cleaningTime';
// import { calculateSmallCleaningTime } from '../../../utils/cleaningTime';
// import TimeConversion from '../../../utils/TimeConversion';
// import { calculateCleaningTimeByTasks } from '../../../utils/calculateCleaningTimeByTasks';


export default function Duration({formData, setFormData, getCleanDate, getCleanTime, validateForm}) {

//     // Define room times
//     const roomTimes = {
//         bedroom: {
//         small: 10,
//         medium: 15,
//         large: 25,
//         },
//         bathroom: {
//         small: 15,
//         medium: 25,
//         large: 35,
//         },
//         livingRoom: {
//         small: 20,
//         medium: 30,
//         large: 40,
//         },
//         kitchen:{
//         small:20,
//         medium:30,
//         large:40
//         }
//     };

  
//   // Define rooms with room count
//   const rooms = [
//     { type: 'bedroom', size: 'medium', count: 3 },   // 3 large bedrooms
//     { type: 'bathroom', size: 'medium', count: 1 }, // 2 medium bathrooms
//     { type: 'livingRoom', size: 'small', count: 1 }, // 1 small living room
//     { type: 'kitchen', size: 'small', count: 1 } // 1 small living room
//   ];
  

//   // Calculate total cleaning time based on rooms and their counts
//   const calculateRoomCleaningTime = (rooms, roomTimes) => {
//     return rooms.reduce((total, room) => {
//       const { type, size, count } = room;
//       const roomTime = roomTimes[type]?.[size] || 0; // Get time for room type and size
//       return total + (roomTime * count); // Multiply room time by room count
//     }, 0);
//   };
  
//   // Example usage
//   const totalRoomCleaningTime = calculateRoomCleaningTime(rooms, roomTimes);
//   console.log(`Total cleaning time for rooms: ${totalRoomCleaningTime} minutes`);

//   const taskTimes = {
//     dusting: 10,  // time in minutes
//     vacuuming: 15,
//     mopping: 20,
//     makingBed: 5,
//     organizing: 30,
//   };
  
//   // Define the tasks to be performed
//   const tasks = ['dusting', 'vacuuming', 'mopping', 'makingBed', 'organizing'];
  
    
    
//     const propertySize = 'medium';
//     // const tasks = ['extraCleaning'];
    
//     // const taskTimes = {
//     //     // regularCleaning: 85,
//     //     extraCleaning: totalRoomCleaningTime,
//     // };

//     const cleaningByTask = calculateCleaningTimeByTasks(tasks, taskTimes)
    
//     console.log("L..........l")
//     console.log(cleaningByTask)
//     console.log("L..........l")

//     // const tasks = ['vacuuming', 'bathroomCleaning', 'kitchenCleaning'];
//     const cleaningTime = calculateCleaningTime(propertySize, tasks, taskTimes);
//     const cleaningSmallTime = calculateSmallCleaningTime(propertySize, tasks, taskTimes);
    

//     console.log(`Estimated cleaning time: ${cleaningSmallTime} minutesrss`);

    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())
    const [show_picker, setShowPicker] = useState(false)
    const [show_time_picker, setShowTimePicker] = useState(false)
    const [clean_date, setCleanDate] = useState("")
    const [clean_time, setCleanTime] = useState("")
    const [selected_duration, setSelectedDuration] = useState("")

    const hoursList = [];

    for (let i = 1; i <= 10; i++) {
    hoursList.push({ label: `${i} hour${i !== 1 ? 's' : ''}`, value: i });
    }


    useEffect(()=> {
  
        validate
      },[formData])

    const validate = () => {
        const isFormValid = clean_date =="" && clean_time =="" && selected_duration ==""

        // alert('it is '+ isFormValid)
        setIsValid(isFormValid); 
        validateForm(isFormValid)
      }

    
    
    // const toggleDatePicker = () => {
    //     setShowPicker(!show_picker)
    //   }

    //   const onChangeDatePicker = ({type}, selectedDate) => {
    //     if(type=="set"){
    //         const currentDate = selectedDate
    //         setDate(currentDate)
    //         if(Platform.OS==="android"){
    //             toggleDatePicker()
    //             setCleanDate(currentDate.toDateString())
               
    //         }
    //         getCleanDate(currentDate.toDateString(), 'cleaning_date')
    //         setFormData((prevFormData) => ({
    //             ...prevFormData,
    //             cleaning_date: currentDate.toDateString(),
    //           }));

    //     }else{
    //         toggleDatePicker()
    //     }
    //   }
    
    //   const toggleTimePicker = () => {
    //     setShowTimePicker(!show_time_picker)
    //   }

    //   const onChangeTimePicker = ({type}, selectedTime) => {
    //     if(type=="set"){
    //         const currentTime = selectedTime
    //         setTime(currentTime)
    //         if(Platform.OS==="android"){
    //             toggleTimePicker()
    //             setCleanTime(currentTime.toLocaleTimeString())
    //         }

    //         getCleanTime(currentTime.toLocaleTimeString(), 'cleaning_time')

    //         setFormData((prevFormData) => ({
    //             ...prevFormData,
    //             cleaning_time: currentTime.toLocaleTimeString(),
    //           }));
    //           validate()
    //     }else{
    //         toggleTimePicker()
    //     }
    //   }

    

const toggleDatePicker = () => {
    setShowPicker(!show_picker);
};

const onChangeDatePicker = ({ type }, selectedDate) => {
    if (type === "set") {
        const currentDate = selectedDate;
        setDate(currentDate);

        // Format the date using Moment.js
        const formattedDate = moment(currentDate).format("YYYY-MM-DD"); // ISO date format

        if (Platform.OS === "android") {
            toggleDatePicker();
            setCleanDate(formattedDate);
        }

        // Update state and call external functions
        getCleanDate(formattedDate, "cleaning_date");
        setFormData((prevFormData) => ({
            ...prevFormData,
            cleaning_date: formattedDate,
        }));
    } else {
        toggleDatePicker();
    }
};

const toggleTimePicker = () => {
    setShowTimePicker(!show_time_picker);
};

const calculateEndTime = (startTime, durationInMinutes) => {
    const endTime = moment(startTime, 'hh:mm A').add(durationInMinutes, 'minutes');
    // return endTime.format('hh:mm A');
    return moment(endTime, 'hh:mm A').format('HH:mm:ss');
  };

const onChangeTimePicker = ({ type }, selectedTime) => {
    if (type === "set") {
        const currentTime = selectedTime;
        setTime(currentTime);
        // alert(currentTime)
        // Format the time using Moment.js
        const formattedTime = moment(currentTime).format("HH:mm:ss"); // 24-hour time format

        if (Platform.OS === "android") {
            toggleTimePicker();
            setCleanTime(formattedTime);
        }

        // Update state and call external functions
        getCleanTime(formattedTime, "cleaning_time");
        setFormData((prevFormData) => ({
            ...prevFormData,
            cleaning_time: formattedTime,
        }));

        // Calculate end_cleaning_time
        
        const cleaning_end_time = calculateEndTime(formattedTime, formData.total_cleaning_time)
        alert(cleaning_end_time)
        setFormData((prevFormData) => ({
            ...prevFormData,
            cleaning_end_time: cleaning_end_time,
        }));
        validate();
    } else {
        toggleTimePicker();
    }
};

      const handleApartmentChange = (itemValue, itemIndex) => {
        setSelectedDuration(itemValue);
      }
  return (
    <View>
        {/* <Text>{calculateCleaningTime(propertySize)}</Text> */}
        {/* <Text>{formData.cleaning_date}</Text> */}
        {/* <TimeConversion minutes = {calculateCleaningTime(propertySize)} /> */}
    <Text bold style={{fontSize:24 }}>Schedule Cleaning Time</Text>
    <Text style={{fontSize:14, marginBottom:20, color:COLORS.gray}}>Pick the Date and Time Convenient for Cleaning</Text>
    {/* <View styles={{width:200}}><Tooltip text="This is a tooltip Pick the Date and Time Convenient for Cleaning" position="top"><Text>Hover me ...Tooltip</Text></Tooltip></View> */}
    {show_picker && (
        <DateTimePicker 
            mode="date"
            display="spinner"
            value={date}
            onChange={onChangeDatePicker}
        />
    )}
 
    <Pressable
        onPress={toggleDatePicker}
    >
        <TextInputContainer iconName="calendar" label="Select Date">
            <TextInput
                mode="outlined"
                placeholderTextColor={COLORS.darkGray}
                outlineColor="transparent"
                value={date.toDateString()}
                activeOutlineColor="transparent"
                style={{marginBottom:5, fontSize:16, height:36, backgroundColor:COLORS.backgroundColor}}
                onChangeText={setCleanDate}
                onFocus={() => handleError(null, 'apt_name')}
                // error={errors.date}
                editable={false}
            />
        </TextInputContainer>
    </Pressable>

    {show_time_picker && (
        <DateTimePicker 
            mode="time"
            display="spinner"
            value={time}
            onChange={onChangeTimePicker}
        />
    )}
    <Pressable
        onPress={toggleTimePicker}
    >
        <TextInputContainer iconName="clock-outline" label="Select Time">
            <TextInput
                mode="outlined"
                placeholderTextColor={COLORS.darkGray}
                outlineColor="transparent"
                value={time.toLocaleTimeString()}
                activeOutlineColor="transparent"
                style={{marginBottom:5, fontSize:16, height:36,  backgroundColor:COLORS.backgroundColor}}
                onChangeText={setCleanTime}
                onFocus={() => handleError(null, 'apt_name')}
                iconName="email-outline"
                // error={errors.date}
                editable={false}
            />
        </TextInputContainer>   
    </Pressable>

    <TextInputContainer iconName="timer-outline" label="Select Duration">
        <TextInput
            // label="Select Duration"
            value={selected_duration}
            mode="outlined"
            outlineColor="transparent"
            activeOutlineColor="transparent"
            style={{marginBottom:5, fontSize:16, height:36, fontSize:14, backgroundColor:COLORS.backgroundColor}}
            render={(props) => (
                <Picker
                    selectedValue={selected_duration}
                    // onValueChange={handleApartmentChange}
                    onValueChange={(itemValue, itemIndex) => handleApartmentChange(itemValue, itemIndex)}
                    mode="dropdown"
                    // style={{ height: 20, width: 150 }}
                    // itemStyle={{ height: 20 }} // Set the height of the items
                    {...props}
                >
                    <Picker.Item label="Select Duration" value="#" />
                    {hoursList.map((item, index) => (
                    <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                </Picker>
            )}
        />
        </TextInputContainer>
    </View>
  )
}

const styles = StyleSheet.create({
    input_container:{
        borderRadius:8,
        borderWidth:1,
        padding:5,
        borderColor:'#CCC',
        marginVertical:10
    },
    input_container_inner:{
        flexDirection:'row',
        justifyContent:'space-between'
    }
})
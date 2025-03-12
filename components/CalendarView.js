// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import moment from 'moment';
// import COLORS from '../constants/colors';

// const CalendarView = ({title}) => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   // Get the number of days in the current month
//   const daysInMonth = (month, year) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   // Get the day of the week for the first day of the month
//   const getFirstDayOfMonth = (month, year) => {
//     return new Date(year, month, 1).getDay();
//   };

//   // Render the calendar grid
// const renderCalendarGrid = () => {
//     const currentDate = new Date();
//     const currentDay = currentDate.getDate(); // Get current day
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();
//     const numDays = daysInMonth(currentMonth, currentYear);
//     const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear);
  
//     const calendarCells = [];

   


  
//     // Data structure representing dates with cleaning schedules
//     const cleaningScheduleDates = ['2024-03-19', '2024-03-24', '2024-03-28'];
  
//     // Convert cleaning schedule dates to object for efficient lookup
//     const highlightedDates = {};
//     cleaningScheduleDates.forEach(date => {
//       const [year, month, day] = date.split('-').map(Number);
//       highlightedDates[`${month}-${day}`] = true;
//     });
  
//     // Fill in empty cells for days before the first day of the month
//     for (let i = 0; i < firstDayOfWeek; i++) {
//       calendarCells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
//     }
  
//     // Render cells for each day in the month
//     for (let day = 1; day <= numDays; day++) {
//       const isSelected = selectedDate === day;
//       const isHighlighted = highlightedDates[`${currentMonth + 1}-${day}`];
//       const isPastDate = currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() && day < currentDay; // Check if it's a past date
//       const isDisabled = isPastDate; // Disable past dates
    
//       calendarCells.push(
//         <TouchableOpacity
//           key={day}
//           style={[
//             styles.calendarCell,
//             isSelected && styles.selectedDay,
//             isHighlighted && styles.highlightedDay,
//             isDisabled && styles.disabledDay, // Apply disabled style
//           ]}
//           onPress={() => handleDayPress(day)}
//           disabled={isDisabled} // Disable touch events for past dates
//         >
//           <Text style={[styles.date, isSelected && styles.selectedDate]}>{day}</Text>
//           {isHighlighted && <Text style={styles.time}>11:00 AM</Text>}

//           {/* <Text style={[styles.date, isSelected && styles.selectedDate]}>{day}</Text>
//           {isHighlighted && <Text style={styles.time}>11:00 AM</Text>} */}
//         </TouchableOpacity>
//       );
//     }
  
//     // Fill in empty cells for remaining days in the last week
//     const remainingCells = 7 - ((firstDayOfWeek + numDays) % 7);
//     for (let i = 0; i < remainingCells && remainingCells !== 7; i++) {
//        calendarCells.push(<View key={`empty-${firstDayOfWeek + numDays + i}`} style={styles.calendarCell} />);
//     }
  
//     return calendarCells;
//   };
  
  

//   // Handle day press
//   const handleDayPress = (day) => {
//     setSelectedDate(day);
//     // Do something with the selected date, such as marking it as booked
//   };

//   return (
//     <View style={{marginTop:30}}>
//        <View header_container>
//        {/* <Text style={styles.title}>{title}</Text> */}
//        <Text style={styles.header}>{moment().format('MMMM YYYY')}</Text>
//        </View>
//        <View style={styles.daysOfWeek}>
//          <Text style={styles.day}>Sun</Text>
//          <Text style={styles.day}>Mon</Text>
//          <Text style={styles.day}>Tue</Text>
//          <Text style={styles.day}>Wed</Text>
//          <Text style={styles.day}>Thu</Text>
//          <Text style={styles.day}>Fri</Text>
//          <Text style={styles.day}>Sat</Text>
//        </View>
//        <View style={styles.calendarGrid}>{renderCalendarGrid()}</View>
//      </View>
    
//   );
// };

// const styles = StyleSheet.create({
//     header_container:{
//       flexDirection:'row',
//       justifyContent:'space-between',
//       alignItems:'center'
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color:COLORS.white
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color:COLORS.white
//     },
//     daysOfWeek: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 8,
//         width:'94%',
//         paddingLeft:6
//     },
//     day: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         color:COLORS.white
//     },
//     calendarGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginBottom:-80
//     },
//     calendarCell: {
//         width: '14%',
//         aspectRatio: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 0,
//         borderRadius:5,
//         borderColor: '#ccc',
//         marginBottom: 5,
//     },
//     date: {
//         fontSize: 14,
//         color:COLORS.light_gray_1
//     },
//     time:{
//         fontSize:9,
//         color:COLORS.white
//     },
//     selectedDay: {
//         backgroundColor: '#ADD8E6', // Light blue background for selected day
//     },
//     selectedDate: {
//         color: '#FFF', // White text color for selected date
//     },
//     highlightedDay: {
//         backgroundColor: COLORS.darkBlue_1, // Yellow background for dates with cleaning schedules
//     },
    
//     // disabledDay:{
//     //     backgroundColor: COLORS.light_gray_1
//     // }
// });

// export default CalendarView;



// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import moment from 'moment';
// import COLORS from '../constants/colors';

// const CalendarView = ({ title }) => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   const schedule_dates = ["Wed Oct 28 2024", "Wed Oct 28 2024" , "Wed Oct 29 2024", "Wed Oct 30 2024"]
//   // Parse and format schedule dates
//   const formattedScheduleDates = schedule_dates.map(date => moment(date).format('YYYY-MM-DD'));

//   const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
//   const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

//   const renderCalendarGrid = () => {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();
//     const numDays = daysInMonth(currentMonth, currentYear);
//     const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear);

//     const calendarCells = [];

//     // Fill in empty cells for days before the first day of the month
//     for (let i = 0; i < firstDayOfWeek; i++) {
//       calendarCells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
//     }

//     // Render cells for each day in the month
//     for (let day = 1; day <= numDays; day++) {
//       const dateKey = moment(new Date(currentYear, currentMonth, day)).format('YYYY-MM-DD');
//       const isScheduled = formattedScheduleDates.includes(dateKey);

//       calendarCells.push(
//         <TouchableOpacity
//           key={day}
//           style={[
//             styles.calendarCell,
//             isScheduled && styles.scheduledDay, // Apply gray highlight for scheduled days
//           ]}
//           onPress={() => handleDayPress(day)}
//         >
//           <Text style={styles.date}>{day}</Text>
//         </TouchableOpacity>
//       );
//     }

//     // Fill in empty cells for remaining days in the last week
//     const remainingCells = 7 - ((firstDayOfWeek + numDays) % 7);
//     for (let i = 0; i < remainingCells && remainingCells !== 7; i++) {
//       calendarCells.push(<View key={`empty-${firstDayOfWeek + numDays + i}`} style={styles.calendarCell} />);
//     }

//     return calendarCells;
//   };

//   const handleDayPress = (day) => setSelectedDate(day);

//   return (
//     <View style={{ marginTop: 30 }}>
//       <Text style={styles.header}>{moment().format('MMMM YYYY')}</Text>
//       <View style={styles.daysOfWeek}>
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//           <Text key={day} style={styles.day}>{day}</Text>
//         ))}
//       </View>
//       <View style={styles.calendarGrid}>{renderCalendarGrid()}</View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: COLORS.white,
//   },
//   daysOfWeek: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//     width: '94%',
//     paddingLeft: 6,
//   },
//   day: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: COLORS.white,
//   },
//   calendarGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: -80,
//   },
//   calendarCell: {
//     width: '14%',
//     aspectRatio: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 0,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   date: {
//     fontSize: 14,
//     color: COLORS.light_gray_1,
//   },
//   scheduledDay: {
//     backgroundColor: 'gray', // Highlight color for scheduled dates
//     borderRadius: 5,
//   },
// });

// export default CalendarView;







// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import moment from 'moment';
// import COLORS from '../constants/colors';

// const CalendarView = ({ title }) => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   const schedule_dates = ["Wed Oct 28 2024", "Wed Oct 28 2024" , "Wed Oct 29 2024", "Wed Oct 30 2024"]
//   // Parse and format schedule dates
//   const formattedScheduleDates = schedule_dates.map(date => moment(date).format('YYYY-MM-DD'));

//   const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
//   const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

//   const renderCalendarGrid = () => {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();
//     const numDays = daysInMonth(currentMonth, currentYear);
//     const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear);

//     const calendarCells = [];

//     // Fill in empty cells for days before the first day of the month
//     for (let i = 0; i < firstDayOfWeek; i++) {
//       calendarCells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
//     }

//     // Render cells for each day in the month
//     for (let day = 1; day <= numDays; day++) {
//       const dateKey = moment(new Date(currentYear, currentMonth, day)).format('YYYY-MM-DD');
//       const isScheduled = formattedScheduleDates.includes(dateKey);
//       const isPastDate = moment(dateKey).isBefore(moment(), 'day'); // Check if the date is in the past

//       calendarCells.push(
//         <TouchableOpacity
//           key={day}
//           style={[
//             styles.calendarCell,
//             isScheduled && styles.scheduledDay, // Apply gray highlight for scheduled days
//           ]}
//           onPress={() => handleDayPress(day)}
//         >
//           <Text style={[
//             styles.date,
//             isPastDate && styles.pastDate // Apply strikethrough for past dates
//           ]}>
//             {day}
//           </Text>
//         </TouchableOpacity>
//       );
//     }

//     // Fill in empty cells for remaining days in the last week
//     const remainingCells = 7 - ((firstDayOfWeek + numDays) % 7);
//     for (let i = 0; i < remainingCells && remainingCells !== 7; i++) {
//       calendarCells.push(<View key={`empty-${firstDayOfWeek + numDays + i}`} style={styles.calendarCell} />);
//     }

//     return calendarCells;
//   };

//   const handleDayPress = (day) => setSelectedDate(day);

//   return (
//     <View style={{ marginTop: 30 }}>
//       <Text style={styles.header}>{moment().format('MMMM YYYY')}</Text>
//       <View style={styles.daysOfWeek}>
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//           <Text key={day} style={styles.day}>{day}</Text>
//         ))}
//       </View>
//       <View style={styles.calendarGrid}>{renderCalendarGrid()}</View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: COLORS.white,
//   },
//   daysOfWeek: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//     width: '94%',
//     paddingLeft: 6,
//   },
//   day: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: COLORS.white,
//   },
//   calendarGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: -80,
//   },
//   calendarCell: {
//     width: '14%',
//     aspectRatio: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 0,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   date: {
//     fontSize: 14,
//     color: COLORS.light_gray_1,
//   },
//   scheduledDay: {
//     backgroundColor: 'gray', // Highlight color for scheduled dates
//     borderRadius: 5,
//   },
//   pastDate: {
//     textDecorationLine: 'line-through', // Strikethrough for past dates
//     color: COLORS.light_gray_1, // Change color if needed
//   },
// });

// export default CalendarView;









// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import moment from 'moment';
// import COLORS from '../constants/colors';

// const CalendarView = ({ title }) => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   const schedule_dates = ["Wed Oct 27 2024", "Wed Oct 28 2024" , "Wed Oct 29 2024", "Wed Oct 30 2024"]
//   // Parse and format schedule dates
//   const formattedScheduleDates = schedule_dates.map(date => moment(date).format('YYYY-MM-DD'));

//   const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
//   const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

//   const renderCalendarGrid = () => {
//     const currentDate = moment(); // Current date using moment
//     const currentMonth = currentDate.month();
//     const currentYear = currentDate.year();
//     const numDays = daysInMonth(currentMonth, currentYear);
//     const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear);

//     const calendarCells = [];

//     // Fill in empty cells for days before the first day of the month
//     for (let i = 0; i < firstDayOfWeek; i++) {
//       calendarCells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
//     }

//     // Render cells for each day in the month
//     for (let day = 1; day <= numDays; day++) {
//       const dateKey = moment(new Date(currentYear, currentMonth, day)).format('YYYY-MM-DD');
//       const isScheduled = formattedScheduleDates.includes(dateKey);
//       const isToday = moment().isSame(dateKey, 'day'); // Check if the date is today
//       const isPastDate = moment(dateKey).isBefore(moment(), 'day'); // Check if the date is in the past

//       calendarCells.push(
//         <TouchableOpacity
//           key={day}
//           style={[
//             styles.calendarCell,
//             isScheduled && !isToday && styles.scheduledDay, // Gray for scheduled days that are not today
//             isToday && styles.today, // Green for today
//           ]}
//           onPress={() => handleDayPress(day)}
//         >
//           <Text style={[
//             styles.date,
//             isPastDate && styles.pastDate // Apply strikethrough for past dates
//           ]}>
//             {day}
//           </Text>
//         </TouchableOpacity>
//       );
//     }

//     // Fill in empty cells for remaining days in the last week
//     const remainingCells = 7 - ((firstDayOfWeek + numDays) % 7);
//     for (let i = 0; i < remainingCells && remainingCells !== 7; i++) {
//       calendarCells.push(<View key={`empty-${firstDayOfWeek + numDays + i}`} style={styles.calendarCell} />);
//     }

//     return calendarCells;
//   };

//   const handleDayPress = (day) => setSelectedDate(day);

//   return (
//     <View style={{ marginTop: 30 }}>
//       <Text style={styles.header}>{moment().format('MMMM YYYY')}</Text>
//       <View style={styles.daysOfWeek}>
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//           <Text key={day} style={styles.day}>{day}</Text>
//         ))}
//       </View>
//       <View style={styles.calendarGrid}>{renderCalendarGrid()}</View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: COLORS.white,
//   },
//   daysOfWeek: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//     width: '94%',
//     paddingLeft: 6,
//   },
//   day: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: COLORS.white,
//   },
//   calendarGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: -80,
//   },
//   calendarCell: {
//     width: '14%',
//     aspectRatio: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 0,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   date: {
//     fontSize: 14,
//     color: COLORS.light_gray_1,
//   },
//   scheduledDay: {
//     backgroundColor: 'gray', // Gray for scheduled dates
//     borderRadius: 5,
//   },
//   today: {
//     backgroundColor: 'green', // Green background for today's date
//     borderRadius: 5,
//   },
//   pastDate: {
//     textDecorationLine: 'line-through', // Strikethrough for past dates
//     color: COLORS.light_gray_1, // Change color if needed
//   },
// });

// export default CalendarView;




// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import moment from 'moment';
// import COLORS from '../constants/colors';

// const CalendarView = ({ title }) => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const schedule_dates = ["Wed Oct 27 2024", "Wed Oct 28 2024" , "Wed Oct 28 2024" , "Wed Oct 28 2024" ,"Wed Oct 29 2024", "Wed Oct 30 2024"]
//   // Parse and format schedule dates
//   const formattedScheduleDates = schedule_dates.map(date => moment(date).format('YYYY-MM-DD'));

//   // Count schedules for each date
//   const scheduleCount = formattedScheduleDates.reduce((acc, date) => {
//     acc[date] = (acc[date] || 0) + 1;
//     return acc;
//   }, {});

//   const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
//   const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

//   const renderCalendarGrid = () => {
//     const currentDate = moment(); // Current date using moment
//     const currentMonth = currentDate.month();
//     const currentYear = currentDate.year();
//     const numDays = daysInMonth(currentMonth, currentYear);
//     const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear);

//     const calendarCells = [];

//     // Fill in empty cells for days before the first day of the month
//     for (let i = 0; i < firstDayOfWeek; i++) {
//       calendarCells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
//     }

//     // Render cells for each day in the month
//     for (let day = 1; day <= numDays; day++) {
//       const dateKey = moment(new Date(currentYear, currentMonth, day)).format('YYYY-MM-DD');
//       const isScheduled = formattedScheduleDates.includes(dateKey);
//       const isToday = moment().isSame(dateKey, 'day'); // Check if the date is today
//       const isPastDate = moment(dateKey).isBefore(moment(), 'day'); // Check if the date is in the past
//       const scheduleNum = scheduleCount[dateKey] || 0; // Get the count for the date

//       calendarCells.push(
//         <TouchableOpacity
//           key={day}
//           style={[
//             styles.calendarCell,
//             isScheduled && !isToday && styles.scheduledDay, // Gray for scheduled days that are not today
//             isToday && styles.today, // Green for today
//           ]}
//           onPress={() => handleDayPress(day)}
//         >
//           {scheduleNum > 0 && <View style={styles.scheduleCount}><Text style={styles.countText}>{scheduleNum}</Text></View>}
//           <Text style={[
//             styles.date,
//             isPastDate && styles.pastDate // Apply strikethrough for past dates
//           ]}>
//             {day}
//           </Text>
//         </TouchableOpacity>
//       );
//     }

//     // Fill in empty cells for remaining days in the last week
//     const remainingCells = 7 - ((firstDayOfWeek + numDays) % 7);
//     for (let i = 0; i < remainingCells && remainingCells !== 7; i++) {
//       calendarCells.push(<View key={`empty-${firstDayOfWeek + numDays + i}`} style={styles.calendarCell} />);
//     }

//     return calendarCells;
//   };

//   const handleDayPress = (day) => setSelectedDate(day);

//   return (
//     <View style={{ marginTop: 30 }}>
//       <Text style={styles.header}>{moment().format('MMMM YYYY')}</Text>
//       <View style={styles.daysOfWeek}>
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//           <Text key={day} style={styles.day}>{day}</Text>
//         ))}
//       </View>
//       <View style={styles.calendarGrid}>{renderCalendarGrid()}</View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: COLORS.white,
//   },
//   daysOfWeek: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//     width: '94%',
//     paddingLeft: 6,
//   },
//   day: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: COLORS.white,
//   },
//   calendarGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: -80,
//   },
//   calendarCell: {
//     width: '14%',
//     aspectRatio: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 0,
//     borderRadius: 5,
//     marginBottom: 5,
//     position: 'relative', // Make the cell a positioned container
//   },
//   date: {
//     fontSize: 14,
//     color: COLORS.light_gray_1,
//   },
//   scheduledDay: {
//     backgroundColor:COLORS.primary_light, // Gray for scheduled dates
//     borderRadius: 5,
//   },
//   today: {
//     backgroundColor:  COLORS.light_gray, // Green background for today's date
//     borderRadius: 5,
//   },
//   pastDate: {
//     textDecorationLine: 'line-through', // Strikethrough for past dates
//     color: COLORS.light_gray_1, // Change color if needed
//   },
//   scheduleCount: {
//     position: 'absolute', // Positioning the count badge
//     top: -8,
//     right: 3,
//     backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent background for visibility
//     borderRadius: 10,
//     paddingLeft: 5,
//     height:15,
//     width:15
//   },
//   countText: {
//     color: 'white',
//     fontSize: 9
//   },
// });

// export default CalendarView;









// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import moment from 'moment';
// import COLORS from '../constants/colors';

// const CalendarView = ({ title, openUpcomingTab , openOngoingTab, future_schedule_dates}) => {

//   const schedule_dates = ["Wed Feb 27 2025", "Wed Feb 28 2025" , "Wed Feb 28 2025" , "Wed Feb 28 2025" ,"Wed Feb 29 2025", "Wed Feb 30 2025"]

//   const [selectedDate, setSelectedDate] = useState(null);

//   // Parse and format schedule dates
//   const formattedScheduleDates = future_schedule_dates.map(date => moment(date).format('YYYY-MM-DD'));

//   // Count schedules for each date
//   const scheduleCount = formattedScheduleDates.reduce((acc, date) => {
//     acc[date] = (acc[date] || 0) + 1;
//     return acc;
//   }, {});

//   const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
//   const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

//   const renderCalendarGrid = () => {
//     const currentDate = moment();
//     const currentMonth = currentDate.month();
//     const currentYear = currentDate.year();
//     const numDays = daysInMonth(currentMonth, currentYear);
//     const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear);

//     const calendarCells = [];

//     // Fill in empty cells for days before the first day of the month
//     for (let i = 0; i < firstDayOfWeek; i++) {
//       calendarCells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
//     }

//     // Render cells for each day in the month
//     for (let day = 1; day <= numDays; day++) {
//       const dateKey = moment(new Date(currentYear, currentMonth, day)).format('YYYY-MM-DD');
//       const isScheduled = formattedScheduleDates.includes(dateKey);
//       const isToday = moment().isSame(dateKey, 'day');
//       const isPastDate = moment(dateKey).isBefore(moment(), 'day');
//       const scheduleNum = scheduleCount[dateKey] || 0;

//       calendarCells.push(
//         <TouchableOpacity
//           key={day}
//           style={[
//             styles.calendarCell,
//             isScheduled && !isToday && styles.scheduledDay,
//             isToday && styles.today,
//           ]}
//           onPress={() => {
//             if (isToday) {
//               openOngoingTab(); // Open ongoing tab if the date is today
//             } else if (isScheduled) {
//               openUpcomingTab(); // Open upcoming tab if the date has a schedule
//             } else {
//               handleDayPress(day);
//             }
//           }}
//         >
//           {scheduleNum > 0 && (
//             <View style={styles.scheduleCount}>
//               <Text style={styles.countText}>{scheduleNum}</Text>
//             </View>
//           )}
//           <Text style={[
//             styles.date,
//             isPastDate && styles.pastDate,
//           ]}>
//             {day}
//           </Text>
//         </TouchableOpacity>
//       );
//     }
//     // alert(future_schedule_dates)
//     // Fill in empty cells for remaining days in the last week
//     const remainingCells = 7 - ((firstDayOfWeek + numDays) % 7);
//     for (let i = 0; i < remainingCells && remainingCells !== 7; i++) {
//       calendarCells.push(<View key={`empty-${firstDayOfWeek + numDays + i}`} style={styles.calendarCell} />);
//     }

//     return calendarCells;
//   };

//   const handleDayPress = (day) => setSelectedDate(day);

//   return (
//     <View style={{ marginTop: 0 }}>
//       <Text style={styles.header}>{moment().format('MMMM YYYY')}</Text>
//       <View style={styles.daysOfWeek}>
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//           <Text key={day} style={styles.day}>{day}</Text>
//         ))}
//       </View>
//       <View style={styles.calendarGrid}>{renderCalendarGrid()}</View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: COLORS.white,
//   },
//   daysOfWeek: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//     width: '94%',
//     paddingLeft: 6,
//   },
//   day: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: COLORS.white,
//   },
//   calendarGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: -80,
//   },
//   calendarCell: {
//     width: '14%',
//     aspectRatio: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 0,
//     borderRadius: 5,
//     marginBottom: 5,
//     position: 'relative',
//   },
//   date: {
//     fontSize: 14,
//     color: COLORS.light_gray_1,
//   },
//   scheduledDay: {
//     backgroundColor: COLORS.darkBlue,
//     borderRadius: 5,
//   },
//   today: {
//     backgroundColor:COLORS.deepBlue,
//     borderRadius: 5,
//   },
//   pastDate: {
//     textDecorationLine: 'line-through',
//     color: COLORS.light_gray_1,
//   },
//   scheduleCount: {
//     position: 'absolute', // Positioning the count badge
//     top: -8,
//     right: 3,
//     backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent background for visibility
//     borderRadius: 10,
//     paddingLeft: 5,
//     height:15,
//     width:15
//   },
//   countText: {
//     color: 'white',
//     fontSize: 9,
//     // fontWeight: 'bold',
//   },
// });

// export default CalendarView;


import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import COLORS from '../constants/colors';

const CalendarView = ({ title, openUpcomingTab, openOngoingTab, future_schedule_dates }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null);

  // Process schedule dates
  const formattedScheduleDates = future_schedule_dates.map(date => 
    moment(date).format('YYYY-MM-DD')
  );

  // Create schedule count object
  const scheduleCount = formattedScheduleDates.reduce((acc, date) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Calendar calculation functions
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const renderCalendarGrid = () => {
    const currentMonth = currentDate.month();
    const currentYear = currentDate.year();
    const numDays = daysInMonth(currentMonth, currentYear);
    const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear);

    let calendarCells = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarCells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
    }

    // Create day cells
    for (let day = 1; day <= numDays; day++) {
      const dateKey = moment(new Date(currentYear, currentMonth, day)).format('YYYY-MM-DD');
      const isScheduled = formattedScheduleDates.includes(dateKey);
      const isToday = moment().isSame(dateKey, 'day');
      const isPastDate = moment(dateKey).isBefore(moment(), 'day');
      const scheduleNum = scheduleCount[dateKey] || 0;

      calendarCells.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarCell,
            isScheduled && !isToday && styles.scheduledDay,
            isToday && styles.today,
          ]}
          onPress={() => handleDatePress(isToday, isScheduled)}
        >
          {scheduleNum > 0 && (
            <View style={styles.scheduleCount}>
              <Text style={styles.countText}>{scheduleNum}</Text>
            </View>
          )}
          <Text style={[styles.date, isPastDate && styles.pastDate]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    // Fill remaining week days
    const remainingCells = 7 - ((firstDayOfWeek + numDays) % 7);
    if (remainingCells !== 7) {
      for (let i = 0; i < remainingCells; i++) {
        calendarCells.push(<View key={`empty-end-${i}`} style={styles.calendarCell} />);
      }
    }

    return calendarCells;
  };

  const handleDatePress = (isToday, isScheduled) => {
    if (isToday) {
      openOngoingTab();
    } else if (isScheduled) {
      openUpcomingTab();
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(currentDate.clone().add(direction, 'month'));
  };

  return (
    <View style={styles.container}>
      {/* Month Navigation Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigateMonth(-1)}>
          <Text style={styles.navButton}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.header}>
          {currentDate.format('MMMM YYYY')}
        </Text>
        
        <TouchableOpacity onPress={() => navigateMonth(1)}>
          <Text style={styles.navButton}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Days of Week */}
      <View style={styles.daysOfWeek}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.day}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {renderCalendarGrid()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingHorizontal: 0,
    height:330,
    paddingTop:20
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.white,
  },
  navButton: {
    fontSize: 30,
    color: COLORS.white,
    paddingHorizontal: 15,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  day: {
    width: '14%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.light_gray_1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 8,
    position: 'relative',
  },
  date: {
    fontSize: 16,
    color: COLORS.light_gray_1,
  },
  scheduledDay: {
    backgroundColor: COLORS.darkBlue,
  },
  today: {
    backgroundColor: COLORS.deepBlue,
  },
  pastDate: {
    textDecorationLine: 'line-through',
    color: COLORS.light_gray_1,
  },
  scheduleCount: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CalendarView;
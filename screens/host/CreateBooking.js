import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, Platform } from 'react-native';
import CircleIconButton from '../../components/CircleButton';
import GoogleAutocomplete from '../../components/GooglePlacesAutocomplete';
import COLORS from '../../constants/colors';
import { GOOGLE_MAPS_API_KEY } from '../../secret';
import { geocodeAddress } from '../../utils/geocodeAddress';
import { TextInput, Checkbox, RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import ProgressiveForm from '../../components/ProgresiveForm';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import GoogleMapComponent from '../../components/GoogleMap';




const CreateBooking = ({close_modal}) => {
  const[inputs, setInputs]= useState({
    apt_name:""
  })
  const cleaning_types = [
    // {
    //   label: "Select Cleaning Type",
    //   value: "#",
    // },
    {
      label: "Check-In Cleaning",
      value: "Check-In Cleaning",
    },
    {
      label: "Check-Out Cleaning",
      value: "Check-Out Cleaning",
    },
    {
      label: "Deep Cleaning",
      value: "Deep Cleaning",
    },
    {
      label: "Maintenance Cleaning",
      value: "Maintenance Cleaning",
    },
    
  ];

 
  const {userId} = useContext(AuthContext)


  
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState("")
  const [errors, setErrors] = useState("")
  const [checked, setChecked] = useState('');
  const [showDropDown, setShowDropDown] = useState(false);
  const [apt_type, setAptType] = useState("");
  const [cleaning_type, setCleaningType] = useState("");
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [show_picker, setShowPicker] = useState(false)
  const [show_time_picker, setShowTimePicker] = useState(false)
  const [clean_date, setCleanDate] = useState("")
  const [clean_time, setCleanTime] = useState("")
  const [owner_apartments, setOwnerApartments] = useState([])
  const [selected_apartments, setSelectedApartments] = useState("")
  const [selected_apartment, setSelectedApartment] = useState("")
  const [selected_apartment_deatils, setSelectedApartmentDetails] = useState("")

  useEffect(()=> {
    fetchApartment()
  },[])

  const fetchApartment = async () => {
    
    try {
      await userService.getApartment(userId)
      .then(response=> {
        const res = response.data
        setOwnerApartments(res)
        setOwnerApartments(res)
        
      })
      
    } catch(e) {
      // error reading value
    }
  }
  const handleSubmit = () => {
    // Handle form submission here (e.g., send data to server)
    console.log('Form submitted');
  };

  const handleAddPress = () => {
    // Increase the number by 1
    setBedroomNum((prevNumber) => String(parseInt(prevNumber, 10) + 1));
  };

  const handleMinusPress = () => {
    // Decrease the number by 1
    setBedroomNum((prevNumber) => {
      const newValue = parseInt(prevNumber, 10) - 1;
      return newValue >= 0 ? String(newValue) : prevNumber;
    });
  };
  const handleAddPressBath = () => {
    // Increase the number by 1
    setBathroomNum((prevNumber) => String(parseInt(prevNumber, 10) + 1));
  };

  const handleMinusPressBath = () => {
    // Decrease the number by 1
    setBathroomNum((prevNumber) => {
      const newValue = parseInt(prevNumber, 10) - 1;
      return newValue >= 0 ? String(newValue) : prevNumber;
    });
  };

  const handleChange = (text, input)=> {
    setInputs(prevState => ({...prevState, [input]: text}));
  }
  const handleValueChange = (value)=> {
    setCleaningType(value);
  }
  const handleApartmentChange = (itemValue, itemIndex)=> {
    console.log(itemValue)
    setSelectedApartment(itemValue);
    setSelectedApartmentDetails(itemValue)
  }

  const toggleDatePicker = () => {
    setShowPicker(!show_picker)
  }
  const onChangeDatePicker = ({type}, selectedDate) => {
    if(type=="set"){
        const currentDate = selectedDate
        setDate(currentDate)
        if(Platform.OS==="android"){
            toggleDatePicker()
            setCleanDate(currentDate.toDateStings())
        }
    }else{
        toggleDatePicker()
    }
  }

  const toggleTimePicker = () => {
    setShowTimePicker(!show_time_picker)
  }
  const onChangeTimePicker = ({type}, selectedTime) => {
    if(type=="set"){
        const currentTime = selectedTime
        setTime(currentTime)
        if(Platform.OS==="android"){
            toggleTimePicker()
            setCleanTime(currentTime.toLocaleTimeString())
        }
    }else{
        toggleTimePicker()
    }
  }
  
  
  const onClose = () => {
    close_modal(false)
  }
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
  const handleSelectedAddress = async (e) => {
    console.log("________________________________")
    console.log(e)
    
    // setAddress(e)
   
    try {
        const { latitude, longitude } = await geocodeAddress(e);
        setCoordinates({ latitude, longitude });
        setAddress(e)
        navigation.navigate(ROUTES.host_bookings)
      } catch (error) {
        alert('Error', 'Failed to geocode address');
      }
    console.log("________________________________2")
  }

  const onSubmit = () => {
    const data = {

    }
  }

  return (
    <View style={styles.container}>
        
      <Text style={styles.label}>Book a schedule</Text>
      {/* <GoogleAutocomplete 
        apiKey={GOOGLE_MAPS_API_KEY}
        selected_address= {handleSelectedAddress}
        handleError={handleError}
        /> */}
        
        <TextInput
        label="Cleaning Type"
        value={selected_apartment}
        // setValue={apt_type}
        mode="outlined"
        outlineColor="#CCC"
        activeOutlineColor={COLORS.primary}
        style={{marginBottom:10, width:'100%', fontSize:14, backgroundColor:"#fff"}}
        render={(props) => (
                <Picker
                    selectedValue={selected_apartment}
                    // onValueChange={handleApartmentChange}
                    onValueChange={(itemValue, itemIndex) => handleApartmentChange(itemValue, itemIndex)}
                    mode="dropdown"
                    // style={{ height: 20, width: 150 }}
                    // itemStyle={{ height: 20 }} // Set the height of the items
                    {...props}
                >
                    <Picker.Item label="Select Apartment" value="#" />
                    {owner_apartments.map((item, index) => (
                    <Picker.Item key={index} label={item.apt_name} value={item} />
                    ))}
                </Picker>
        )}
      />
      

      <GoogleMapComponent 
        latitude={selected_apartment.latitude}
        longitude={selected_apartment.longitude}
      />
     
      <View style={styles.address}>
        <Text>{selected_apartment.address}</Text>
      </View>
        {/* <TextInput
        label="Cleaning Type"
        value={cleaning_type}
        // setValue={apt_type}
        mode="outlined"
        outlineColor="#CCC"
        activeOutlineColor={COLORS.primary}
        style={{marginBottom:10, width:'100%', fontSize:14, backgroundColor:"#fff"}}
        render={(props) => (
                <Picker
                    selectedValue={cleaning_type}
                    onValueChange={handleValueChange}
                    mode="dropdown"
                    // style={{ height: 20, width: 150 }}
                    // itemStyle={{ height: 20 }} // Set the height of the items
                    {...props}
                >
                    <Picker.Item label="Select Cleaning Type" value="" />
                    {cleaning_types.map((item, index) => (
                    <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                </Picker>
        )}
      />
      
      <TextInput
            mode="outlined"
            label="Apartment Name / Number"
            placeholder="Apartment Name / Number"
            placeholderTextColor={COLORS.darkGray}
            outlineColor="#CCC"
            value={inputs.apt_name}
            activeOutlineColor={COLORS.primary}
            style={{marginBottom:10, fontSize:14, backgroundColor:"#fff"}}
            onChangeText={text => handleChange(text, 'apt_name')}
            onFocus={() => handleError(null, 'apt_name')}
            iconName="email-outline"
            error={errors.apt_name}
        />

     */}

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
    <TextInput
            mode="outlined"
            label="Select Date"
            placeholder="Select Date"
            placeholderTextColor={COLORS.darkGray}
            outlineColor="#CCC"
            value={date.toDateString()}
            activeOutlineColor={COLORS.primary}
            style={{marginBottom:10, fontSize:14, backgroundColor:"#fff"}}
            onChangeText={setCleanDate}
            onFocus={() => handleError(null, 'apt_name')}
            iconName="email-outline"
            // error={errors.date}
            editable={false}
        />
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
    <TextInput
            mode="outlined"
            label="Select Time"
            placeholder="Select Time"
            placeholderTextColor={COLORS.darkGray}
            outlineColor="#CCC"
            value={time.toLocaleTimeString()}
            activeOutlineColor={COLORS.primary}
            style={{marginBottom:10, fontSize:14, backgroundColor:"#fff"}}
            onChangeText={setCleanTime}
            onFocus={() => handleError(null, 'apt_name')}
            iconName="email-outline"
            // error={errors.date}
            editable={false}
        />
    </Pressable>

    <View style={styles.radioButtonMainContainer}>
    <View>
        <Text>Have Cleaning Supplies: </Text>
    </View>
    <View style={styles.radioButtonContainer}>
        <RadioButton
          value="yes"
          status={checked === 'yes' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('yes')}
          color={COLORS.primary} // Customize the color if needed
        />
        <Text>Yes</Text>
      </View>
      <View style={styles.radioButtonContainer}>
        <RadioButton
          value="no"
          status={checked === 'no' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('no')}
          color={COLORS.primary} // Customize the color if needed
        />
        <Text>No</Text>
      </View>
      </View>
    <View style={styles.extra}>
        <CircleIconButton 
            iconName="window-closed"
            iconSize={30}
            buttonSize={40}
            title="Window"
        />
        <CircleIconButton 
            iconName="broom"
            iconSize={30}
            buttonSize={40}
            title="Kitchen"
        />
        <CircleIconButton 
            iconName="hoop-house"
            iconSize={30}
            buttonSize={40}
            title="Garden"
        />
        <CircleIconButton 
            iconName="apache-kafka"
            iconSize={30}
            buttonSize={40}
            title="Garbage"
        />
        <CircleIconButton 
            iconName="bowl-mix-outline"
            iconSize={30}
            buttonSize={40}
            title="Laundry"
        />
    </View>
    <View style={{ backgroundColor: 'transparent' }}>
      {/* <DropDown
        label="Select item"
        data={[
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 },
        ]}
        style={{ backgroundColor: 'transparent' }}
      /> */}
      </View>
    <View style={{margin:30}}>
      {/* Other input fields (Date, Time, Duration, Guest Information, Notes, etc.) */}
      <Button title="Submit" onPress={handleSubmit} />
      <Button title="Close" onPress={onClose} />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
    marginLeft:10

  },
  radioButtonMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:'space-around'
  },
  dropdownContent: {
    backgroundColor: 'transparent',
    width:'100%'
  },
  dropdownItem: {
    backgroundColor:"#fff",
    justifyContent: 'flex-start',
  },
  dropdown:{
    backgroundColor: 'transparent'
  },
  extra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-evenly',
    marginTop:10
  },
  address:{
    marginVertical:5
  }
});

export default CreateBooking;












// import React, { useState } from 'react';
// import { View } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { TextInput, Checkbox, RadioButton } from 'react-native-paper';


// const my_appartment = [
//     {
//         "_id": "65da112fcaa29d190b5f5ba8",
//         "userId": "65d994b97a017903d15bfb75",
//         "owner_info": {
//           "userId": "65d994b97a017903d15bfb75",
//           "firstname": "Carl",
//           "lastname": "Njoku ",
//           "email": "carl@yahoo.com"
//         },
//         "apt_name": "Royal Suites ",
//         "square_footage": "10000",
//         "bathroom_num": 2,
//         "bedroom_num": 2,
//         "floor_level": "",
//         "instructions": "I have some information for you. Call me as soon as you get this message. ",
//         "lock_code": "4000",
//         "cleaning_supplies": "yes",
//         "contact_phone": "(960) 541-4763",
//         "address": "294 Weequahic Avenue, Newark, NJ, USA",
//         "longitude": -74.2183682,
//         "latitude": 40.71137,
//         "created_on": "2024-02-24 10:15:02",
//         "apt_type": "studio"
//       },
//       {
//         "_id": "65db4b8d57ad39d146825423",
//         "userId": "65d994b97a017903d15bfb75",
//         "owner_info": {
//           "userId": "65d994b97a017903d15bfb75",
//           "firstname": "Carl",
//           "lastname": "Njoku ",
//           "email": "carl@yahoo.com"
//         },
//         "apt_name": "Skyview Apartment ",
//         "square_footage": "10000",
//         "bathroom_num": 2,
//         "bedroom_num": 2,
//         "floor_level": "",
//         "instructions": "I have some information for you .call me when you get to the property. ",
//         "lock_code": "6640",
//         "cleaning_supplies": "yes",
//         "contact_phone": "(803) 456-7319",
//         "address": "581 South 10th Street, Newark, NJ, USA",
//         "longitude": -74.2038853,
//         "latitude": 40.7325009,
//         "created_on": "2024-02-25 08:36:15",
//         "apt_type": "two_bed"
//       }
// ]

// const YourComponent = () => {
//   const [selectedItem, setSelectedItem] = useState({
//     _id: '',
//     token: '',
//     userType: '',
//     email: '',
//     avatar: '',
//     loggedIn: true,
//     account_verification: false,
//     created_at: ''
//   });

  

//   const handleChange = (itemValue, itemIndex) => {
//     console.log(itemValue.label)
//     setSelectedItem(itemValue.label);
//     setSelectedApartmentDetails(itemValue)
//   };

//   return (
//     <View>
//       <TextInput
//         label="Cleaning Type"
//         value={selected_apartment}
//         // setValue={apt_type}
//         mode="outlined"
//         outlineColor="#CCC"
//         activeOutlineColor={COLORS.primary}
//         style={{marginBottom:10, width:'100%', fontSize:14, backgroundColor:"#fff"}}
//         render={(props) => (
//                 <Picker
//                     selectedValue={selectedItem}
//                     // onValueChange={handleApartmentChange}
//                     onValueChange={(itemValue, itemIndex) => handleApartmentChange(itemValue, itemIndex)}
//                     mode="dropdown"
//                     // style={{ height: 20, width: 150 }}
//                     // itemStyle={{ height: 20 }} // Set the height of the items
//                     {...props}
//                 >
//                     <Picker.Item label="Select Apartment" value="" />
//                     {my_appartment.map((item, index) => (
//                     <Picker.Item key={index} label={item.apt_name} value={{"label":item.apt_name, "id":item._id}} />
//                     ))}
//                 </Picker>
//         )}
//       />
//     </View>
//   );
// };

// export default YourComponent;
// import React, { useContext, useEffect, useState } from 'react';
// import Text from '../../../components/Text';
// import COLORS from '../../../constants/colors';
// import { TextInput, Checkbox, RadioButton } from 'react-native-paper';
// import { View, Button, StyleSheet, Pressable, Platform } from 'react-native';
// import { AuthContext } from '../../../context/AuthContext';
// import GoogleMapComponent from '../../../components/GoogleMap';
// import { Picker } from '@react-native-picker/picker';
// import userService from '../../../services/userService';
// import TextInputContainer from '../../../components/TextInputContainer';
// import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
// import { calculateRoomCleaningTime } from '../../../utils/calculateRoomCleaningTime';
// import { calculateCleaningPrice } from '../../../utils/calculateRegularPrice';
// import FloatingLabelPicker from '../../../components/FloatingLabelPicker';
// import FloatingLabelPickerFull from '../../../components/FloatingLabelPickerFull';
// import SingleApartmentItem from '../../../components/SinngleApartmentItem';

// export default function PropertyDetails({selectedProperty,formData,setFormData,validateForm}) {

//   const {currentUserId} = useContext(AuthContext)
//   const [owner_apartments, setOwnerApartments] = useState([])
//   const [selected_apartment, setSelectedApartment] = useState("")
//   const [selected_apartment_name, setSelectedApartmentName] = useState("")
//   const [selected_apartment_latitude, setSelectedApartmentLatitude] = useState("")
//   const [selected_apartment_longitude, setSelectedApartmentLongitude] = useState("")
//   const [selected_apartment_room_size, setSelectedApartmentRoomSize] = useState("")
//   const [selected_apt_room_type_and_size, setSelectedRoomTypeAndSize] = useState([])
  
 
//   const [selected_apartment_deatils, setSelectedApartmentDetails] = useState("")
//   const [isValid, setIsValid] = useState(false);
//   const [regular_cleaning_fee, setRegularCleaningFee] = useState(0);
//   const [regular_cleaning_time, setRegularCleaningTime] = useState(0);

//   const [total_cleaning_fee, setTotalCleaningFee] = useState(0);
//   const [total_cleaning_time, setTotalCleaningTime] = useState(0);

//   useEffect(()=> {
  
//     // validateForm(isValid);
//     fetchApartment()
//   },[formData])

//   const validate = () => {
//     const isFormValid = selected_apartment !== ""
//     // alert('it is '+ isFormValid)
//     setIsValid(isFormValid); 
//     validateForm(isFormValid)
//   }
  
//   const fetchApartment = async () => {
    
//     try {
//       await userService.getApartment(currentUserId)
//       .then(response=> {
//         const res = response.data
//         setOwnerApartments(res)
//         console.log(JSON.stringify(res, null, 2))
        
//       })
      
//     } catch(e) {
//       // error reading value
//     }
//   }

//   console.log("What is this", selected_apartment)

//   const handleApartmentChange = (itemValue) => {
  

//     console.log(itemValue)
//     setSelectedApartment(itemValue);
//     setSelectedApartmentDetails(itemValue)

//     setSelectedApartmentName(itemValue.apt_name)
//     setSelectedApartmentLatitude(itemValue.latitude)
//     setSelectedApartmentLongitude(itemValue.logitude)
//     setSelectedRoomTypeAndSize(itemValue.roomDetails)
//     setRegularCleaningFee(calculateCleaningPrice(itemValue.roomDetails));
//     setRegularCleaningTime(calculateRoomCleaningTime(itemValue.roomDetails))
    
//     setSelectedApartment(itemValue);

//     // setFormData((prevFormData) => ({
//     //   ...prevFormData,
//     //   address: itemValue.address,
//     //   aptId:itemValue._id,
//     //   apartment_name: itemValue.apt_name,
//     //   apartment_latitude: itemValue.latitude,
//     //   apartment_longitude: itemValue.longitude,
//     //   selected_apt_room_type_and_size: itemValue.roomDetails,
//     //   regular_cleaning_fee: regular_cleaning_fee,
//     //   regular_cleaning_time: regular_cleaning_time,
//     //   total_cleaning_fee: regular_cleaning_fee,
//     //   total_cleaning_time: regular_cleaning_time
      
//     // }));


//     console.log("................7777")
//     console.log(calculateCleaningPrice(itemValue.roomDetails))
//     console.log("................7777")

//     // console.log(itemValue.room_size)
//     // validate()
//     // const address = itemValue.address
//     // selectedProperty(address, 'address')
//   };

//   const handleApartmentChange1 = (itemValue)=> {
//     console.log(itemValue)
//     console.log("Selected Apartment:", itemValue);
//     setSelectedApartment(itemValue);
//     setSelectedApartmentDetails(itemValue)
//     setSelectedApartmentName(itemValue.apt_name)
//     setSelectedApartmentLatitude(itemValue.latitude)
//     setSelectedApartmentLongitude(itemValue.logitude)
//     setSelectedApartmentRoomSize(itemValue.room_size)
//     setSelectedRoomTypeAndSize(itemValue.roomDetails)
//     setRegularCleaningFee(calculateCleaningPrice(itemValue.roomDetails));
//     setRegularCleaningTime(calculateRoomCleaningTime(itemValue.roomDetails))
 
//     console.log("................7777")
//     console.log(calculateCleaningPrice(itemValue.roomDetails))
//     console.log("................7777")

//     console.log(itemValue.room_size)
//     validate()
//     const address = itemValue.address
//     selectedProperty(address, 'address')
    
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       address: itemValue.address,
//       aptId:itemValue._id,
//       apartment_name: itemValue.apt_name,
//       apartment_latitude: itemValue.latitude,
//       apartment_longitude: itemValue.longitude,
//       selected_apt_room_type_and_size: itemValue.roomDetails,
//       regular_cleaning_fee: regular_cleaning_fee,
//       regular_cleaning_time: regular_cleaning_time,
//       total_cleaning_fee: regular_cleaning_fee,
//       total_cleaning_time: regular_cleaning_time
      
//     }));
    
//   }

//   return (
//     <View>
//       <Text bold style={{fontSize:24, }}>Choose Your Property</Text>
//       <Text style={{fontSize:14, marginBottom:20, color:COLORS.gray}}>Select the Apartment You Want to Schedule for Cleaning</Text>
  
     

//       <FloatingLabelPickerFull
//         title="Select Apartment"
//         selectedValue={selected_apartment}
//         onValueChange={handleApartmentChange}
//         options={owner_apartments}
//         labelKey="apt_name"
//       />

//       {selected_apartment &&
//         <SingleApartmentItem apartment={selected_apartment} />
//       }
     
      

     
//     </View>
    
//   )
// }


// const styles = StyleSheet.create({
  
//   address:{
//     marginVertical:10
//   },
//   address_text:{
//     fontSize:16
//   },
//   info:{
//     marginVertical:5
//   },
//   bedrooms:{
//     flexDirection:'row',
//     justifyContent:'space-between',
//     marginVertical:5,
//     backgroundColor:COLORS.backgroundColor
//   },
//   bathrooms:{
//     flexDirection:'row',
//     justifyContent:'space-between',
    
//   }
// });




// import React, { useContext, useEffect, useState } from 'react';
// import Text from '../../../components/Text';
// import COLORS from '../../../constants/colors';
// import { View, StyleSheet } from 'react-native';
// import { AuthContext } from '../../../context/AuthContext';
// import * as Animatable from 'react-native-animatable';
// import FloatingLabelPickerFull from '../../../components/FloatingLabelPickerFull';
// import SingleApartmentItem from '../../../components/SinngleApartmentItem';
// import userService from '../../../services/userService';
// import { calculateRoomCleaningTime } from '../../../utils/calculateRoomCleaningTime';
// import { calculateCleaningPrice } from '../../../utils/calculateRegularPrice';

// export default function PropertyDetails({ selectedProperty, formData, setFormData, validateForm }) {
//   const { currentUserId } = useContext(AuthContext);
//   const [ownerApartments, setOwnerApartments] = useState([]);
//   const [selectedApartment, setSelectedApartment] = useState(null);
//   const [isValid, setIsValid] = useState(false);

//   useEffect(() => {
//     fetchApartments();
//   }, []);

//   useEffect(() => {
//     validateForm(isValid);
//   }, [isValid, validateForm]);

//   const fetchApartments = async () => {
//     try {
//       const response = await userService.getApartment(currentUserId);
//       setOwnerApartments(response.data);
//       console.log('Fetched Apartments:', response.data);
//     } catch (error) {
//       console.error('Error fetching apartments:', error);
//     }
//   };

//   const handleApartmentChange = (apartment) => {
//     setSelectedApartment(apartment);

//     // Calculate cleaning details
//     const cleaningFee = calculateCleaningPrice(apartment.roomDetails);
//     const cleaningTime = calculateRoomCleaningTime(apartment.roomDetails);

//     // Update formData
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       address: apartment.address,
//       aptId: apartment._id,
//       apartment_name: apartment.apt_name,
//       apartment_latitude: apartment.latitude,
//       apartment_longitude: apartment.longitude,
//       selected_apt_room_type_and_size: apartment.roomDetails,
//       regular_cleaning_fee: cleaningFee,
//       regular_cleaning_time: cleaningTime,
//       total_cleaning_fee: cleaningFee,
//       total_cleaning_time: cleaningTime,
//     }));

//     // Validate form
//     setIsValid(!!apartment);

//   };

//   return (
//     <View>
//       <Text bold style={{ fontSize: 24 }}>Choose Your Property</Text>
//       <Text style={{ fontSize: 14, marginBottom: 20, color: COLORS.gray }}>
//         Select the Apartment You Want to Schedule for Cleaning
//       </Text>

//       <FloatingLabelPickerFull
//         title="Select Apartment"
//         selectedValue={selectedApartment}
//         onValueChange={handleApartmentChange}
//         options={ownerApartments}
//         labelKey="apt_name"
//       />

//       {selectedApartment && <Animatable.View animation="slideInRight" duration={550}><SingleApartmentItem apartment={selectedApartment} /></Animatable.View>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   address: {
//     marginVertical: 10,
//   },
//   address_text: {
//     fontSize: 16,
//   },
// });



import React, { useContext, useEffect, useState } from 'react';
import Text from '../../../components/Text';
import COLORS from '../../../constants/colors';
import { View, StyleSheet } from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import * as Animatable from 'react-native-animatable';
import FloatingLabelPickerFull from '../../../components/FloatingLabelPickerFull';
import SingleApartmentItem from '../../../components/SinngleApartmentItem';
import userService from '../../../services/userService';
import { calculateRoomCleaningTime } from '../../../utils/calculateRoomCleaningTime';
import { calculateCleaningPrice } from '../../../utils/calculateRegularPrice';


export default function PropertyDetails({ selectedProperty, formData, setFormData, validateForm }) {
  const { currentUserId } = useContext(AuthContext);
  const [ownerApartments, setOwnerApartments] = useState([]);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    fetchApartments();
  }, []);

  useEffect(() => {
    // Dynamically validate form whenever the selected apartment changes
    setIsValid(!!formData.aptId);
  }, [formData.aptId]);

  useEffect(() => {
    // Propagate form validity up to parent component
    validateForm(isValid);
  }, [isValid, validateForm]);

  const fetchApartments = async () => {
    try {
      const response = await userService.getApartment(currentUserId);
      setOwnerApartments(response.data);
      // console.log('Fetched Apartments:', response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  const handleApartmentChange = (apartment) => {
    // Update selected apartment in formData
    const cleaningFee = calculateCleaningPrice(apartment.roomDetails);
    const cleaningTime = calculateRoomCleaningTime(apartment.roomDetails);

    setFormData((prevFormData) => ({
      ...prevFormData,
      address: apartment.address,
      aptId: apartment._id,
      apartment_name: apartment.apt_name,
      apartment_latitude: apartment.latitude,
      apartment_longitude: apartment.longitude,
      selected_apt_room_type_and_size: apartment.roomDetails,
      regular_cleaning_fee: cleaningFee,
      regular_cleaning_time: cleaningTime,
      total_cleaning_fee: cleaningFee,
      total_cleaning_time: cleaningTime,
    }));

  };

  // Dynamically derive the selected apartment from formData
  const selectedApartment = ownerApartments.find((apt) => apt._id === formData.aptId) || null;

  return (
    <View>
      <Text bold style={{ fontSize: 24 }}>Choose Your Property</Text>
      <Text style={{ fontSize: 14, marginBottom: 20, color: COLORS.gray }}>
        Select the Apartment You Want to Schedule for Cleaning
      </Text>

      <FloatingLabelPickerFull
        title="Select Apartment"
        selectedValue={selectedApartment}
        onValueChange={handleApartmentChange}
        options={ownerApartments}
        labelKey="apt_name"
      />

      {selectedApartment && (
        <Animatable.View animation="slideInRight" duration={550}>
          <SingleApartmentItem apartment={selectedApartment} />
        </Animatable.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  address: {
    marginVertical: 10,
  },
  address_text: {
    fontSize: 16,
  },
});
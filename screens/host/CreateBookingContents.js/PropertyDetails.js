import React, { useContext, useEffect, useState } from 'react';
import Text from '../../../components/Text';
import COLORS from '../../../constants/colors';
import { TextInput, Checkbox, RadioButton } from 'react-native-paper';
import { View, Button, StyleSheet, Pressable, Platform } from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import GoogleMapComponent from '../../../components/GoogleMap';
import { Picker } from '@react-native-picker/picker';
import userService from '../../../services/userService';
import TextInputContainer from '../../../components/TextInputContainer';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { calculateRoomCleaningTime } from '../../../utils/calculateRoomCleaningTime';
import { calculateCleaningPrice } from '../../../utils/calculateRegularPrice';

export default function PropertyDetails({selectedProperty,formData,setFormData,validateForm}) {

  const {currentUserId} = useContext(AuthContext)

  const [owner_apartments, setOwnerApartments] = useState([])
  const [selected_apartment, setSelectedApartment] = useState("")
  const [selected_apartment_name, setSelectedApartmentName] = useState("")
  const [selected_apartment_latitude, setSelectedApartmentLatitude] = useState("")
  const [selected_apartment_longitude, setSelectedApartmentLongitude] = useState("")
  const [selected_apartment_room_size, setSelectedApartmentRoomSize] = useState("")
  const [selected_apt_room_type_and_size, setSelectedRoomTypeAndSize] = useState([])
  

  const [selected_apartment_deatils, setSelectedApartmentDetails] = useState("")
  const [isValid, setIsValid] = useState(false);
  const [regular_cleaning_fee, setRegularCleaningFee] = useState(0);
  const [regular_cleaning_time, setRegularCleaningTime] = useState(0);

  const [total_cleaning_fee, setTotalCleaningFee] = useState(0);
  const [total_cleaning_time, setTotalCleaningTime] = useState(0);

  useEffect(()=> {
  
    // validateForm(isValid);
    fetchApartment()
  },[formData])

  const validate = () => {
    const isFormValid = selected_apartment !== ""
    alert('it is '+ isFormValid)
    setIsValid(isFormValid); 
    validateForm(isFormValid)
  }
  
  const fetchApartment = async () => {
    
    try {
      await userService.getApartment(currentUserId)
      .then(response=> {
        const res = response.data
        setOwnerApartments(res)
        console.log(JSON.stringify(res, null, 2))
        
      })
      
    } catch(e) {
      // error reading value
    }
  }


  

  const handleApartmentChange = (itemValue, itemIndex)=> {

    console.log("Selected Apartment:", itemValue);
    setSelectedApartment(itemValue);
    setSelectedApartmentDetails(itemValue)
    setSelectedApartmentName(itemValue.apt_name)
    setSelectedApartmentLatitude(itemValue.latitude)
    setSelectedApartmentLongitude(itemValue.logitude)
    setSelectedApartmentRoomSize(itemValue.room_size)
    setSelectedRoomTypeAndSize(itemValue.roomDetails)
    setRegularCleaningFee(calculateCleaningPrice(itemValue.roomDetails));
    setRegularCleaningTime(calculateRoomCleaningTime(itemValue.roomDetails))
 
    console.log("................7777")
    console.log(calculateCleaningPrice(itemValue.roomDetails))
    console.log("................7777")

    console.log(itemValue.room_size)
    validate()
    const address = itemValue.address
    selectedProperty(address, 'address')
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: itemValue.address,
      aptId:itemValue._id,
      apartment_name: itemValue.apt_name,
      apartment_latitude: itemValue.latitude,
      apartment_longitude: itemValue.longitude,
      selected_apt_room_type_and_size: itemValue.roomDetails,
      regular_cleaning_fee: regular_cleaning_fee,
      regular_cleaning_time: regular_cleaning_time,
      total_cleaning_fee: regular_cleaning_fee,
      total_cleaning_time: regular_cleaning_time
      
    }));
    
  }

  return (
    <View>
      <Text bold style={{fontSize:24, }}>Choose Your Property</Text>
      <Text style={{fontSize:14, marginBottom:20, color:COLORS.gray}}>Select the Apartment You Want to Schedule for Cleaning</Text>
  
      <TextInputContainer iconName="home-variant-outline" label="Select Property">
      {/* <TextInput
        // label="Select Property"
        value={selected_apartment}
        // setValue={apt_type}
        mode="outlined"
        outlineColor="transparent"
        activeOutlineColor="transparent"
        style={{marginBottom:5, fontSize:16, height:36, backgroundColor:"#fff"}}
        render={(props) => ( */}
                <Picker
                    selectedValue={selected_apartment._id}
                    onValueChange={handleApartmentChange}
                    // onValueChange={(itemValue, itemIndex) => handleApartmentChange(itemValue, itemIndex)}
                    mode="dropdown"
                    // style={{ height: 20, width: 150 }}
                    // itemStyle={{ height: 20 }} // Set the height of the items
                    // {...props}
                >
                    <Picker.Item label="Select Property" value="#" />
                    {owner_apartments.map((item, index) => (
                    <Picker.Item key={index} label={item.apt_name} value={item} />
                    ))}
                </Picker>
        {/* )}
      /> */}
      </TextInputContainer>
      

      <GoogleMapComponent 
        latitude={selected_apartment_deatils.latitude}
        longitude={selected_apartment_deatils.longitude}
      />
     
      <View style={styles.address}>
        <Text bold style={styles.address_text}>{selected_apartment_deatils.address}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.bedrooms}>
          <Text style={{fontSize:14}}><MaterialCommunityIcons name="bed-empty" color={COLORS.gray} size={16} /> 3 Bedrooms</Text>
          <Text style={{fontSize:16}}>{selected_apartment_deatils.bedroom_num}</Text>
        </View>
        <View style={styles.bathrooms}>
          <Text><MaterialCommunityIcons name="shower-head" color={COLORS.gray} size={16} /> 1 Bathrooms</Text>
          <Text>{selected_apartment_deatils.bathroom_num}</Text>
        </View>
      </View>
    </View>
    
  )
}


const styles = StyleSheet.create({
  
  address:{
    marginVertical:10
  },
  address_text:{
    fontSize:16
  },
  info:{
    marginVertical:5
  },
  bedrooms:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginVertical:5,
    backgroundColor:COLORS.backgroundColor
  },
  bathrooms:{
    flexDirection:'row',
    justifyContent:'space-between',
    
  }
});





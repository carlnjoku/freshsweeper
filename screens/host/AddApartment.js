import React, {useState, useEffect, useRef, useContext} from  'react';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { TextInput, Checkbox, RadioButton } from 'react-native-paper';
import COLORS from '../../constants/colors';
import { SafeAreaView,StyleSheet, KeyboardAvoidingView, Keyboard, Platform, StatusBar, Linking,  FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import moment from 'moment';
import PhoneInput from "react-native-phone-number-input";
import DropDown from "react-native-paper-dropdown";
import { AuthContext } from '../../context/AuthContext';
import GoogleAutocomplete from '../../components/GooglePlacesAutocomplete';
import { GOOGLE_MAPS_API_KEY } from '../../secret';
import userService from '../../services/userService';
import CircleIconButton from '../../components/CircleButton';
import CircleIconButton2 from '../../components/CirculeIconButton2';
import ProgressiveForm from '../../components/ProgresiveForm';
import GoogleMapComponent from '../../components/GoogleMap';
import { geocodeAddress } from '../../utils/geocodeAddress';
import ROUTES from '../../constants/routes';
import { Picker } from '@react-native-picker/picker';
import TextInputContainer1 from '../../components/TextInputContainer1';
import Slider from '@react-native-community/slider';
// import { calculateCleaningTime } from '../../utils/cleaningTime';



export default function AddApartment({navigation}) {

    const{currentUserId} = useContext(AuthContext)
    const genderList = [
        { 
          label: 'Select Apartment type', 
          value: '#' },
        {
          label: "House",
          value: "house",
        },
        {
          label: "Apartment",
          value: "apartment",
        },
        {
          label: "Studio Apartment",
          value: "studio",
        },
        {
          label: "Cabin",
          value: "cabin",
        },
        {
          label: "Lighthouse",
          value: "lighthouse",
        },
        {
          label: "Bungalow",
          value: "Bungalow",
        },
        {
          label: "Basement Apartment",
          value: "basement",
        },
        {
          label: "Loft",
          value: "loft",
        },
        {
          label: "Condo",
          value: "condo",
        },
        {
          label: "Cottage",
          value: "cottage",
        },
        {
          label: "TownHouse",
          value: "townHouse",
        },
        {
          label: "Mansion",
          value: "mansion",
        },
        
        
      ];

  //     Apartment
	// 2.	House
	// 3.	Secondary unit (guesthouse, in-law suite)
	// 4.	Unique space (treehouse, yurt, dome)
	// 5.	Bed and breakfast
	// 6.	Boutique hotel
	// 7.	Cabin
	// 8.	Chalet
	// 9.	Cottage
	// 10.	Villa
	// 11.	Castle
	// 12.	Farm stay
	// 13.	Loft
	// 14.	Condo
	// 15.	Studio
	// 16.	Townhouse
	// 17.	Bungalow
	// 18.	Tiny house
	// 19.	Barn
	// 20.	Tent
	// 21.	Boat
	// 22.	Camper/RV
	// 23.	Earth house
	// 24.	Dome
	// 25.	Houseboat
	// 26.	Igloo
	// 27.	Island
	// 28.	Lighthouse
	// 29.	Cave
	// 30.	Container home
	// 31.	Bus
	// 32.	Train
	// 33.	Plane
	// 34.	Treehouse
	// 35.	Windmill
	// 36.	Tower
	// 37.	Shepherd’s hut
	// 38.	Warehouse
	// 39.	Mansion
	// 40.	Basement

    const {geolocationData} = useContext(AuthContext)
    const phoneInput = useRef(); 
    const[inputs, setInputs] = useState({
        apt_name:"",
        square_footage:"",
        bathroom_num:"",
        bedroom_num:"",
        livingroom_num:"",
        floor_level:"",
        instructions:"",
        lock_code:"",
        cleaning_supplies:"",
        contact_phone:"",
        created_on: "",
        roomInfo:[]
    })
    const[roomSize, setRoomSize] = useState(150); // Default size in square feet

    // State to manage the list of rooms
    const [roomInfo, setRoomInfo] = useState([]);

    // State to manage the input for adding a new room
    const [newRoom, setNewRoom] = useState({
      type: 'bedroom',
      size: 'small',
      count: 1,
    });
  
    const[firstname, setFirstname] = useState("")
    const[lastname, setLastname] = useState("")
    const[email, setEmail] = useState("")
    const[bathroom, setBathroomNum] = useState('0')
    const[bedroom, setBedroomNum] = useState('0')
    const[livingroom, setLivingNum] = useState('0')
    const[address, setAddress] = useState("")
    // const[errors, setErrors] = useState("")
    const [errors, setErrors] = useState({
      room_count: {},
      room_size: {}
    });
    const[value_phone, setValuePhone] = useState('');
    const[formattedValue, setFormattedValue] = useState("");
    const[loading, setLoading] = React.useState(false);

    const[showDropDown, setShowDropDown] = useState(false);
    const[apt_type, setAptType] = useState("");
    const[showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);

    const[phoneNumber, setPhoneNumber] = useState('');
    const[number, setNumber] = useState(0);
    const[textInputBottomMargin, setTextInputBottomMargin] = useState(0);
    const[checked, setChecked] = useState('');
    const[latitude, setLatitude] = useState(null);
    const[longitude, setLongitude] = useState(null);
    const[city, setCity] = useState(null);

    const [roomDetails, setRoomDetails] = useState([
      {
        type: 'Bedroom',
        number: 0,
        size: 0,
        size_range:''
      },
      {
        type: 'Bathroom',
        number: 0,
        size: 0,
        size_range:''
      },
      {
        type: 'Livingroom',
        number: 0,
        size: 0,
        size_range:''
      },
    ]);

console.log(roomDetails)
  useEffect(() => {
    fetchUser()
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setTextInputBottomMargin(60); // Adjust this value as needed
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setTextInputBottomMargin(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const getRoomSizeCategory = (size) => {
    if (size < 150) return 'Small';
    if (size >= 150 && size <= 300) return 'Medium';
    return 'Large';
  };

  const fetchUser = async () => {
        
    try {
      
      await userService.getUser(currentUserId)
      .then(response=> {
        const res = response.data
        setFirstname(res.firstname)
        setLastname(res.lastname)
        setEmail(res.email)
        setCity(res.location.city)
      })

    } catch(e) {
      // error reading value
    }
  }

    const formatPhoneNumber = (input) => {
        const cleaned = ('' + input).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return input;
      };
    
      const handleInputChange = (text) => {
        setPhoneNumber(formatPhoneNumber(text));
      };



    


  // Generalized handleAddPress function
  const handleAddPress = (roomType) => {
    if (roomType === 'bedroom') {
      setBedroomNum((prevNumber) => String(parseInt(prevNumber, 10) + 1));
    } else if (roomType === 'bathroom') {
      setBathroomNum((prevNumber) => String(parseInt(prevNumber, 10) + 1));
    } else if (roomType === 'livingroom') {
      setLivingNum((prevNumber) => String(parseInt(prevNumber, 10) + 1));
    }
  };

  // Generalized handleMinusPress function
  const handleMinusPress = (roomType) => {
    if (roomType === 'bedroom') {
      setBedroomNum((prevNumber) => {
        const newValue = parseInt(prevNumber, 10) - 1;
        return newValue >= 0 ? String(newValue) : prevNumber;
      });
    } else if (roomType === 'bathroom') {
      setBathroomNum((prevNumber) => {
        const newValue = parseInt(prevNumber, 10) - 1;
        return newValue >= 0 ? String(newValue) : prevNumber;
      });
    } else if (roomType === 'livingroom') {
      setLivingNum((prevNumber) => {
        const newValue = parseInt(prevNumber, 10) - 1;
        return newValue >= 0 ? String(newValue) : prevNumber;
      });
    }
  };


















  // Function to handle room count change
  const handleRoomCountChange = (type, action) => {
    setRoomDetails(prevDetails =>
      prevDetails.map(room =>
        room.type === type
          ? { ...room, number: action === 'add' ? room.number + 1 : room.number - 1 }
          : room
      )
    );
  };

  const getRoomSizeCategory1 = (size) => {
    if (size < 100) return 'Small';
    if (size >= 100 && size < 300) return 'Medium';
    if (size >= 300) return 'Large';
    return '';
  };

  
    
  
    

  // Function to handle room size change
  const handleRoomSizeChange = (type, size) => {
    const size_range = getRoomSizeCategory1(size);
    console.log("value........")
    console.log(size_range)
    console.log("value........")
    setRoomDetails(prevDetails =>
      prevDetails.map(room =>
        room.type === type
          ? { ...room, size, size_range }
          : room
      )
    );
  };













  // const handleAddPress = () => {
  //   // Increase the number by 1
  //   setBedroomNum((prevNumber) => String(parseInt(prevNumber, 10) + 1))
  // };

  // const handleMinusPress = () => {
  //   // Decrease the number by 1
  //   setBedroomNum((prevNumber) => {
  //     const newValue = parseInt(prevNumber, 10) - 1;
  //     return newValue >= 0 ? String(newValue) : prevNumber;
  //   });
  // };
  // const handleAddPressBath = () => {
  //   // Increase the number by 1
  //   setBathroomNum((prevNumber) => String(parseInt(prevNumber, 10) + 1));
  // };

  // const handleMinusPressBath = () => {
  //   // Decrease the number by 1
  //   setBathroomNum((prevNumber) => {
  //     const newValue = parseInt(prevNumber, 10) - 1;
  //     return newValue >= 0 ? String(newValue) : prevNumber;
  //   });
  // };

  // const handleAddPressLiving = () => {
  //   // Increase the number by 1
  //   setLivingNum((prevNumber) => String(parseInt(prevNumber, 10) + 1));
  // };

  // const handleMinusPressLiving = () => {
  //   // Decrease the number by 1
  //   setLivingNum((prevNumber) => {
  //     const newValue = parseInt(prevNumber, 10) - 1;
  //     return newValue >= 0 ? String(newValue) : prevNumber;
  //   });
  // };

    const handleChange = (text, input)=> {
        setInputs(prevState => ({...prevState, [input]: text}));
    }

    const onSubmit = async() => {
        setLoading(true);
        setTimeout(async () => {
          const owner_info = {
            firstname:firstname,
            lastname:lastname,
            email:email,
            userId:currentUserId
          }
          const data = {
            userId:currentUserId,
            owner_info:owner_info,
            apt_name:inputs.apt_name,
            square_footage:inputs.square_footage,
            bathroom_num:bathroom,
            bedroom_num:bedroom,
            livingroom_num:livingroom,
            floor_level:inputs.floor_level,
            instructions:inputs.instructions,
            lock_code:inputs.lock_code,
            cleaning_supplies:checked,
            contact_phone:phoneNumber,
            address:address,
            city:city,
            latitude:latitude,
            longitude:longitude,
            created_on: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            apt_type:apt_type,
            roomDetails:roomDetails
            // roomSize:
          }
          console.log("Newwwwwwwwwwwwwwwwww")
          console.log(data)
          console.log("Newwwwwwwwwwwwwwwwww")
          await userService.addApartment(data)
   
          .then(response => {
            console.log(response.status)
            if(response.status === 200){
              const res = response.data
              console.log(res)
              navigation.navigate(ROUTES.host_bookings)
              // Redirect to list
            }else {
              console.log("could not verify")
            //   Alert.alert('Error', "Either username or password incorrect");
            }  
          }).catch((err)=> {
            console.log(err)
            setErrMsg(true)
            console.log("Either username or password incorrect")
            Alert.alert('Error', "Something went wrong, please try again");
          })
          setLoading(false);
        }, 1000);
        
      };

    const handleSelectedAddress = async (e) => {
        console.log("________________________________")
        console.log(e)
        
        // setAddress(e)
       
        try {
            const { latitude, longitude } = await geocodeAddress(e);
            // setCoordinates({ latitude, longitude });
            setLatitude(latitude)
            setLongitude(longitude)
            setAddress(e)
            
          } catch (error) {
            alert('Error', 'Failed to geocode address');
          }
        console.log("________________________________2")
      }
      const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
      };
      
      // const validate = async () => {
      
      //   let isValid = true;
        
      //   if(inputs.apt_name ==="") {
      //       handleError(<Text style={{color: "red", fontSize:12, marginTop:-5}}>Please enter Apartment Name</Text>, 'apt_name');
      //       isValid = false;
      //     } 

      //   // if (!apt_type) {
      //   //     handleError(<Text style={{color: "red" , opacity:0.6}}>Please enter title</Text>, 'apt_type');
      //   //     isValid = false;
      //   //   }
        
      //   if (!bathroom) {
      //       handleError(<Text style={{color: "red", opacity:0.6}}>Enter num. bathrooms</Text>, 'bathroom_num');
      //       isValid = false;
      //     }
      //   if (!bedroom) {
      //       handleError(<Text style={{color: "red", opacity:0.6}}>Enter num. badrooms</Text>, 'bedroom_num');
      //       isValid = false;
      //     }
      //   if (!livingroom) {
      //       handleError(<Text style={{color: "red", opacity:0.6}}>Add num. of livingrooms</Text>, 'livingroom_num');
      //       isValid = false;
      //     }
        
      //   // if (!address) {
      //   //     handleError(<Text style={{color: "red", opacity:0.6}}>Please enter your phone number</Text>, 'location');
      //   //     isValid = false;
      //   //   }
      //   // if (!phoneNumber) {
      //   //     handleError(<Text style={{color: "red", opacity:0.6}}>Please describe what you are selling</Text>, 'contact_phone');
      //   //     isValid = false;
      //   //   }
        
      //   if (isValid) {
      //   //   setLoading(!loading);
      //     onSubmit();
      //   }
      // };


      const validate = () => {
        let isValid = true;
        let errors = {};
      
        // Validate Apartment Name
        if (!inputs.apt_name) {
          errors.apt_name = 'Apartment Name is required';
          isValid = false;
        }
      
        if (!inputs.address) {
          setErrors(prevErrors => ({
            ...prevErrors,
            address: 'Address is required'
          }));
          isValid = false;
        }
      
        

        // Validate address
        if (!inputs.apt_address) {
          setErrors((prevErrors) => ({ ...prevErrors, apt_address: "Please select a valid address." }));
          isValid = false;
        }
      
        // Validate Apartment Type
        if (!apt_type) {
          errors.apt_type = 'Apartment Type is required';
          isValid = false;
        }
      
        // // Validate Room Count (ensure all rooms have a valid count)
        // roomDetails.forEach((room, index) => {
        //   if (room.number <= 0) {
        //     errors[`room_${room.type}_count`] = `${room.type} count must be greater than 0`;
        //     isValid = false;
        //   }
        // });
      
        // // Validate Room Size
        // roomDetails.forEach((room, index) => {
        //   if (room.size <= 50 || room.size > 600) {
        //     errors[`room_${room.type}_size`] = `${room.type} size must be between 50 and 600 sq ft`;
        //     isValid = false;
        //   }
        // });



       
        
          // Validate other fields like apartment name, etc.
        
          // Validate each room's count and size in roomDetails
          roomDetails.forEach((room, index) => {
            // Validate room count (must be greater than 0)
            if (room.number <= 0) {
              errors[`room_${room.type}_count`] = `${room.type} count must be greater than 0`;
              isValid = false;
            }
        
            // Validate room size (must be within the valid range)
            if (room.size < 50 || room.size > 600) {
              errors[`room_${room.type}_size`] = `${room.type} size must be between 50 and 600 sq ft`;
              isValid = false;
            }
          });

          if (!phoneNumber) {
            handleError(<Text style={{color: "red", opacity:0.6}}>Please describe what you are selling</Text>, 'contact_phone');
            isValid = false;
          }
        
         
        




      
        // Validate Phone Number (must be a valid format)
        // const phoneRegex = /^[0-9]{10}$/;
        // if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
        //   errors.contack_phone = 'Enter a valid 10-digit phone number';
        //   isValid = false;
        // }
      
        // Validate Specific Instructions (optional field, you can check for length if required)
        if (inputs.instructions && inputs.instructions.length < 5) {
          errors.instructions = 'Instructions must be at least 5 characters long';
          isValid = false;
        }
      
        setErrors(errors);  // Update the errors state
        return isValid;
       

        // if (isValid) {
        // //   setLoading(!loading);
        //   onSubmit();
        // }
      };

      

      const handleValueChange = (value) => {
        console.log('Selected value:', value);
        // Do something with the selected value, such as updating state
        setAptType(value);
      };

  return (
    
    <SafeAreaView
          style={{
            flex:1,
            backgroundColor:COLORS.backgroundColor,
            // justifyContent:"center",
            // alignItems:"center",
            marginBottom:0,

          }}
        >
             <StatusBar translucent backgroundColor="transparent" />
            
            <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{paddingTop: 30, paddingHorizontal: 0}}
        >

            
    <View style={{marginHorizontal:20}}>

    {/* <ProgressiveForm /> */}
    
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
      <GoogleAutocomplete 
          label="Apartment Address"
          apiKey={GOOGLE_MAPS_API_KEY}
          selected_address= {handleSelectedAddress}
          handleError={handleError}
        />
        {errors.apt_address && <Text style={{ color: 'red' }}>{errors.apt_address}</Text>}

      <TextInput
          label="Apartment Type"
          value={apt_type}
          // setValue={apt_type}
          mode="outlined"
          outlineColor="#CCC"
          activeOutlineColor={COLORS.primary}
          style={{marginBottom:10, width:'100%', fontSize:14, backgroundColor:"#fff"}}
          render={(props) => (
            <Picker
                selectedValue={apt_type}
                onValueChange={handleValueChange}
                mode="dropdown"
                // style={{ height: 20, width: 150 }}
                // itemStyle={{ height: 20 }} // Set the height of the items
                {...props}
            >
                {genderList.map((item, index) => (
                <Picker.Item key={index} label={item.label} value={item.value} />
                ))}
            </Picker>
          )}
        />
        

    
        
      
        

      {roomDetails.map((room, index) => {
      // Check if room count and size are valid
      const isCountValid = room.number > 0;
      const isSizeValid = room.size >= 50 && room.size <= 600;
      
      return(
        <TextInputContainer1 iconName="calendar">
          <Text style={{marginHorizontal:15, marginTop:10}}>Number of {room.type}</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
            {/* <Text>How Many Bedrooms  </Text> */}
            <View>
            <TextInput
                mode="outlined"
                outlineColor="transparent"
                value={String(room.number)}  // Convert the number to a string for TextInput
                editable={false}
                keyboardType="numeric" // Accepts only numeric input
                style={{marginLeft:10, marginBottom:5,marginTop:8, width:'60%', fontSize:18, backgroundColor:COLORS.white, borderRadius:20}}
                underlineColor="transparent" // Remove the underline border
                onFocus={() => handleError(null, `${room.type}_count`)}  // Clear error on focus
                error={errors[`room_${room.type}_count`]}  // Display error dynamically
            />
            {errors[`room_${room.type}_count`] && <Text style={{ color: 'red', fontSize:11,marginLeft:10 }}>{errors[`room_${room.type}_count`]}</Text>}
            </View>
            <CircleIconButton2 iconName='minus' buttonSize={36}  iconSize={26} onPress={() => handleRoomCountChange(room.type, 'remove')} disabled={room.number <= 0} />
            <CircleIconButton2 iconName='plus' buttonSize={36} iconSize={26} onPress={() => handleRoomCountChange(room.type, 'add')} disabled={room.number <= 0} />
          </View>

          <View style={styles.line} />

          
          
          <View>
            <Text style={styles.sliderLabel}>{room.type} Size: {getRoomSizeCategory(room.size)}  </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={600}
              step={10}
              value={room.size}
              onValueChange={(value) => handleRoomSizeChange(room.type, value)}
              // minimumTrackTintColor="#1fb28a"
              // maximumTrackTintColor="#d3d3d3"
              minimumTrackTintColor={isSizeValid ? "#1fb28a" : "red"}  // Change track color based on size validity
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor={isSizeValid ? "#1fb28a" : "red"}  // Change thumb color based on size validity
          
              // thumbTintColor="#1fb28a"
            />
            
            {/* <Text style={styles.value}>{room.size} sq ft</Text>
            {errors[`room_${room.type}_size`] && 
            <Text style={{
              color: isSizeValid ? COLORS.normalText : 'red',  // Change text color if invalid
              fontSize: 11, marginBottom:2, marginLeft:10
            }}>
              {errors[`room_${room.type}_size`]}
            </Text>} */}

        <Text style={{
          color: isSizeValid ? COLORS.normalText : 'red',  // Change text color if invalid
          fontSize: 14
        }}>
          {room.size} sq ft
        </Text>
        {errors[`room_${room.type}_size`] && <Text style={styles.value}>{errors[`room_${room.type}_size`]}</Text>}
          </View>
        </TextInputContainer1>
      )
  })}
        
        

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
        <TextInput
            mode="outlined"
            label="Specific Intsruction"
            placeholder="Specific Intsruction"
            placeholderTextColor={COLORS.gray}
            outlineColor="#D8D8D8"
            value={inputs.instructions}
            activeOutlineColor={COLORS.primary}
            style={{marginBottom:5, color:COLORS.gray, fontSize:14, backgroundColor:"#fff"}}
            onChangeText={text => handleChange(text, 'instructions')}
            onFocus={() => handleError(null, 'instruction')}
            error={errors.instructions}
            iconName="email-outline"
            multiline
        />


        <View style={styles.inputContainer}>
        
        
      </View>
        
        
        <TextInput
            label="Contact Phone Number"
            placeholder="Contact Phone Number"
            mode="outlined"
            outlineColor="#CCC"
            activeOutlineColor={COLORS.primary}
            value={phoneNumber}
            onChangeText={handleInputChange}
            keyboardType="phone-pad" // Show numeric keypad on mobile
            style={{marginBottom:10, fontSize:14, width:'100%', backgroundColor:"#fff"}}
            onFocus={() => handleError(null, 'contack_phone')}
            error={errors.contack_phone}
        />
    
      
        <Button title="Add Apartment" loading={loading} onPress={onSubmit} />
    </View>
    
    </ScrollView>
    
    
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
    dropdownContent: {
        backgroundColor: 'transparent',
        width:'100%'
      },
      dropdownItem: {
        backgroundColor:"#fff",
        justifyContent: 'flex-start',
        backgroundColor:"transparent"
      },
      label: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      textInput: {
        flex: 1,
        marginHorizontal: 10,
      },
      button: {
        
        color:COLORS.primary,
        fontSize:28
      },
      radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1,
      },
      radioButtonMainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent:'space-around'
      },
      container: {
        marginVertical: 8,
      },
      input: {
        backgroundColor: 'transparent',
      },
      line: {
        height: 1,               // Thickness of the line
        backgroundColor: '#CCC',  // Line color
        marginVertical: 5,       // Vertical spacing around the line
        width: '100%', 
      },
      sliderLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
      },
      slider: {
        width: '100%',
        height: 20,
      },
      value: {
        fontSize: 14,
        textAlign: 'center',
        // marginTop: 10,
        marginVertical:5
      },
      container0: {
        marginTop: 50,
        padding: 20,
      },
})
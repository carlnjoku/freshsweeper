import React, { useEffect, useState } from 'react';
import Text from '../../components/Text';
import { TextInput } from 'react-native-paper';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList,Dimensions, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import Card from '../../components/Card';
import userService from '../../services/userService';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../constants/routes';

export default function Approve({selectedUser,selected_scheduleId,hostId, currency, chatroomId, selectedSchedule,totalPrice, close_modal}) {
  
    

    const[price, setPrice] = useState(totalPrice)
    const[errors, setErrors] = React.useState("");

    const navigation = useNavigation()

    console.log("scheduleeeeeeeeeee&usssssssser")
    // console.log(selectedUser.firstname)
    // console.log(JSON.stringify(selectedSchedule, null , 2))
    console.log("scheduleeeeeeeeeee&usssssssser")

    useEffect(()=> {
        setPrice(totalPrice.toString());
    },[])
    
      const handlePriceChange = (value) => {
        // Remove any non-numeric characters and parse the value as an integer
        const intValue = parseInt(value.replace(/\D/g, ''), 10);
        if (!isNaN(intValue) && intValue >= 0) {
            setPrice(intValue.toString()); // Set the state with the parsed integer value
            setErrors(prevState => ({...prevState, price: null})); // Clear any previous error for the price field
        } else {
            setPrice(''); // Set the price to an empty string if the input is not a valid number
            handleError('Price must be a number between 0 and 1000', 'price'); // Set an error message for the price field
        }
        
      };
    
      const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
      };

        const onClose = () => {
            close_modal(false)
        }

        const validate = async () => {
      
            let isValid = true;
            
            if (price ==="") {
                handleError(<Text style={{color: "red", fontSize:12, marginTop:-5}}>Please enter Apartment Name</Text>, 'price');
                isValid = false;
              } 
    
            if (isValid) {
            //   setLoading(!loading);
            handleApprove();
            }
          };

        // Function to handle confirmation
        const handleApprove = async() => {
            // Send automated message tho the chatroom
            console.log('Task confirmed');
           
            //Update the schedule STATUS = upcoming add cleanerID to assigned field 
            const data = {
                aptId: selectedSchedule.aptId,
                apartment_name: selectedSchedule.apartment_name,
                currency:currency,
                cleanerId: selectedUser.userId,
                hostId: hostId,
                avatar: selectedUser.avatar,
                firstname: selectedUser.firstname,
                lastname: selectedUser.lastname,
                cleaning_date: selectedSchedule.cleaning_date,
                scheduleId: selected_scheduleId,
                total_cleaning_fee: price
            }

            // console.log(data)
            
            await userService.approveSchedule(data)
            .then(response => {
                const res = response.data
                // console.log(res)
            })
            // Navigate to the chat screen to negotiate or discuss further
            navigation.navigate(ROUTES.host_messages, { chatroomId });
        };
    



  return (
    <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
         <StatusBar translucent backgroundColor="transparent" />

        <View style={styles.close_button}><MaterialCommunityIcons name="close" color={COLORS.gray} size={24} onPress={onClose} /></View>
        
        <Text style={styles.heading}>Confirmation</Text>
        {/* <Card> */}
        <View style={styles.detailsContainer}>
            <Text style={styles.label}>Task Details:</Text>
            <Text style={styles.details}>Regular Cleaning</Text>
            <Text style={styles.details}>Date: {selectedSchedule.cleaning_date}</Text>
            <Text style={styles.details}>Time: {selectedSchedule.cleaning_time}</Text>
        </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Estimated Time of Arrival (ETA):</Text>
        <Text style={styles.details}>20mins</Text>
      </View>
        
            <TextInput
                mode="outlined"
                label="Price"
                placeholder="Enter your first name"
                placeholderTextColor={COLORS.gray}
                outlineColor="#D8D8D8"
                // keyboardType="numeric"
                value={price}
                activeOutlineColor={COLORS.primary}
                style={{marginBottom:10, color:COLORS.gray, fontSize:16, backgroundColor:"#fff"}}
                onChangeText={handlePriceChange}
                onFocus={() => handleError(null, 'price')}
                error={errors.price}
                left={<TextInput.Icon name={() => <MaterialIcons name="attach-money" size={24} color="black" />} />}
                // left={<TextInput.Icon  icon="account-outline" style={{marginTop:10}} fontSize="small" />}
            />


        <TouchableOpacity 
          onPress={validate} style={styles.button} 
        >
          
          <Text bold style={styles.button_text}> Confirm</Text>
        </TouchableOpacity>
          {/* </Card> */}
        </View>
    </View>
  )
}

const windowHeight = Dimensions.get('window').height;
const modalHeight = windowHeight * 0.65;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:COLORS.backgroundColor,
      padding:20,
      justifyContent: 'center',
    alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      detailsContainer: {
        marginBottom: 20,
      },
      label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      details: {
        fontSize: 16,
      },
      button: {
        flexDirection:'row',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical:20,
        justifyContent:'center',
        backgroundColor: COLORS.primary,
        borderRadius:50
      },
      button_text:{
        color:COLORS.white
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // semi-transparent background
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        // borderRadius: 10,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        elevation: 5,
        height: modalHeight, // Set the height of the modal
        width: '100%',
      },
      close_button:{
       
        alignItems:'flex-end'
      }
})


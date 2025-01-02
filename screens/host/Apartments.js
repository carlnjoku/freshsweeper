import React, {useState, useEffect, useRef, useContext} from  'react';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import { TextInput, Checkbox, RadioButton } from 'react-native-paper';
import COLORS from '../../constants/colors';
import { SafeAreaView,StyleSheet, KeyboardAvoidingView, Keyboard, Platform, StatusBar, Linking,  FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import CardNoPrimary from '../../components/CardNoPrimary';
import ROUTES from '../../constants/routes';
import FloatingButton from '../../components/FloatingButton';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';


export default function Apartments({navigation}) {

  const{currentUserId, currentUser} = useContext(AuthContext)

  const genericArray = new Array(5).fill(null);

  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);


//   const fetchApartments =  async() => {
//     await userService.getApartment(currentUserId)
//     .then(response => {
//       const res = response.data
//       setApartments(res)
//       console.log(res)
//   }).catch((err)=> {
//       console.log(err)
//       setErrMsg(true)
//       console.log("error")
//       Alert.alert('Error', "Something went wrong, please try again");
//     })
// }
const fetchApartments = async () => {
    try {
        // Assuming userService.getPendingPayments fetches the pending payments from the API
        const response = await userService.getApartment(currentUserId);
        setApartments(response.data);
        console.log(response.data)
    } catch (error) {
        console.log(error);
        // alert('Error fetching pending payments');
    } finally {
        setLoading(false);
    }
};

  useEffect(()=> {
  
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh data or reset state here
      fetchApartments()
      
  });
  
  fetchApartments()
  return unsubscribe; // Cleanup subscription
  
  },[])

  const handleOpenCreateBooking = () => {
    navigation.navigate(ROUTES.host_add_apt)
  }

//   useEffect(() => {
//       const fetchApartments =  async() => {
//           await userService.getApartment(currentUserId)
//           .then(response => {
//             const res = response.data
//             setApartments(res)
//             console.log(res)
//         }).catch((err)=> {
//             console.log(err)
//             setErrMsg(true)
//             console.log("error")
//             Alert.alert('Error', "Something went wrong, please try again");
//           })
//       }

//       const unsubscribe = navigation.addListener('tabPress', () => {
//         // Refresh data or reset state here
//         fetchApartments();
//     });

//     return unsubscribe; // Cleanup subscription
      
//   }, [navigation]);


  const emptyApartment = () => (
    <View style={styles.empty_apartment}>
      <Text>No apartment found</Text>
      <TouchableOpacity 
        style={styles.action_button}
        onPress = {() => navigation.navigate(ROUTES.host_add_apt)}
      >
        <Text style={styles.action_button_color}>Create new apartment</Text>
      </TouchableOpacity>
    </View>
  )

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />;
  }

    if (apartments.length === 0) {
        return (
            <View style={styles.noData}>
                <Text style={styles.noDataText}>No apartment listed.</Text>
            </View>
        );
    }


  return (
    <SafeAreaView
          style={{
            flex:1,
            backgroundColor:COLORS.backgroundColor,
            justifyContent:"center",
            // alignItems:"center",
            marginBottom:0
          }}
        >
    
        <View style={styles.container}>
            <FlatList
                data={apartments}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.host_apt_dashboard, {
                        property:item,
                        // selected_schedule:selectedSchedule,
                        // selected_scheduleId:selectedScheduleId,
                        hostId:currentUserId,
                        // hostFname: currentUser.firstname,
                        // hostLname: currentUser.lastname
                      })}
                    >
                        
                    <CardNoPrimary>
                        <View style={styles.itemContent}>
                            <View>
                                <AntDesign name="home" size={40} color={COLORS.gray}/>
                            </View>
                            <View style={{marginLeft:15}}>
                                <Text style={styles.apartmentName}>{item.apt_name}</Text>
                                <Text style={styles.apartmentDetails}>{item.address}</Text>
                            </View>
                        </View>
                    </CardNoPrimary>
                    </TouchableOpacity>
                )}
                ListEmptyComponent= {emptyApartment}
                
            />

       
        
        <FloatingButton 
            onPress={handleOpenCreateBooking}
            color="green"
        />

        </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    itemContent:{
        flexDirection:'row',
        alignItems:'center'
    },
    empty_listing: {
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      marginTop:'50%'
    },
    empty_apartment: {
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      marginTop:'50%'
    },
    apartmentItem: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 5,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
    },
    apartmentName: {
        fontSize: 18,
    },
    apartmentAddress:{
      fontSize: 14,
      color: '#555',
    },
    
    item_separator : {
        marginTop:5,
        marginBottom:5,
        height:1,
        width:"100%",
        backgroundColor:"#E4E4E4",
    },
    noData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 18,
        color: COLORS.gray,
    },
  
  });
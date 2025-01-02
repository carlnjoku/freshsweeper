import React, { useEffect, useState } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import userService from '../../services/userService';
import COLORS from '../../constants/colors';
import { Avatar, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '../../components/StarRating';
import GoogleMapAndUsers from '../../components/GoogleMapAndUsers';
import ROUTES from '../../constants/routes';
import { HomeSkeleton } from '../../components/skeleton/HomeSkeleton';
import * as Animatable from 'react-native-animatable';

export default function RecommendedCleaners({navigation, route}) {

    const {hostId, hostFname, hostLname, scheduleId, schedule} = route.params
    const[recommended_cleaners, setRecommendedCleaners] = useState([])
    const[err_msg, setErrMsg] = useState("")
    const [loading, setLoading] = useState(true);

    const genericArray = new Array(5).fill(null);

    console.log("scheeeeeeeeeeeeeeeeeeeeedule")
    console.log(schedule)
    console.log("scheeeeeeeeeeeeeeeeeeeeedule")

    const fechRecommendedCleaners = () => {
        userService.getRecommendedCleaners(scheduleId)
        .then(response => {
            const res = response.data
            // Introduce a delay of 3 seconds before setting the state
            setTimeout(() => {
                setRecommendedCleaners(res)
                setLoading(false); // Set loading to false after the delay
                console.log("recoooomendeeeeeeeeeeeeeeeed")
                console.log(res)
                console.log("recoooomendeeeeeeeeeeeeeeeed")
            }, 20000)
        }).catch((err)=> {
            console.log(err)
              setErrMsg(true)
              console.log("error")
              Alert.alert('Error', "Something went wrong, please try again");
          })
    }

    useEffect(()=> {
        fechRecommendedCleaners()
    },[])

    if (loading) {
        return (
          <View style={styles.container}>
            
            <View style={styles.loadingContainer}>
            <Text>Seaching for cleaners near you...</Text>
            </View>
                <View>
                    <View>
                    
                        <HomeSkeleton width="100%" height={300} />
                        </View>
                    {genericArray.map((item, index) => (
                        <Animatable.View animation="slideInLeft" duration={550}>
                            <View style={{flexDirection: 'row', paddingVertical:5}}>
                            {<View style={{flex: 0.18}}>
                                <HomeSkeleton width={50} height={50} variant="circle" />
                            </View>
                            }
                            {<View style={{flex: 0.8}}>
                                <HomeSkeleton width="80%" height={12} />
                                <HomeSkeleton width={160} height={10} />
                                <HomeSkeleton width={120} height={8}  /> 
                            </View>
                            }
                            </View>
                        </Animatable.View>
                    ))}

                </View>


          </View>
        );
      }

    const singleItem = ({item}) => (
        
        <Animatable.View animation="slideInRight" duration={550}>
            <TouchableOpacity style={styles.categoryBtn} 
                onPress={() => navigation.navigate(ROUTES.cleaner_profile_info, {
                    item:item,
                    selected_schedule:schedule,
                    selected_scheduleId:scheduleId,
                    hostId:hostId,
                    hostFname: hostFname,
                    hostLname: hostLname  
                })}
            >
        
        
            <View style={{flexDirection: 'row', paddingVertical:5}}>
                <View style={{flex: 0.15}}>
                    {/* <Image source={{uri:item.avata}} style={styles.icon_url_style} /> */}
                    {item.avatar ? 
                            <Image 
                                source={{uri:item.avatar}}
                                style={{height:50, width:50, borderRadius:25, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
                            />
                            :

                            <Avatar.Image
                                size={50}
                                source={require('../../assets/default_avatar.png')}
                                style={{ backgroundColor: COLORS.gray }}
                            />
                        }
                
                </View>
                <View style={{flex: 0.8}}>
                    <Text bold style={{marginLeft:10, fontSize:15, color:COLORS.secondary}}>{item.firstname} {item.lastname}</Text>
                    <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.location.city}, {item.location.region} </Text>
                    <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.distance.toFixed(1)} miles away</Text>
                    <StarRating />
                </View>
            
                {/* {item.label==="Notifications" ? <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}></Text></View> : <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}>  {item.value}</Text></View>} */}
                <View style={{flex: 0.1, alignItems: 'flex-end'}}><Ionicons name="chevron-forward-outline" color={COLORS.secondary} size={16}></Ionicons></View>
            </View>
            
            </TouchableOpacity>
        </Animatable.View>
      )


      const itemSeparator = () => (
        
        <View style={styles.item_separator}></View>
      )

      const emptyListing = () => (
        <View style={styles.empty_listing}><Text>No cleaner found near you</Text></View>
      )


  return (
    <SafeAreaView
        style={{
            flex:1,
            backgroundColor:COLORS.backgroundColor,
      }}
    >
        <StatusBar translucent backgroundColor="transparent" />

        <View style={styles.container}>

            <GoogleMapAndUsers 
                users={recommended_cleaners}
                apartment_name ={schedule.schedule.apartment_name}
                apartment_address={schedule.schedule.address}
                apartment_latitude={schedule.schedule.apartment_latitude}
                apartment_longitude={schedule.schedule.apartment_longitude} 
            />
            
        {loading ? (
          <View style={styles.loadingContainer}>
            <HomeSkeleton width="100%" height={300} />
                {genericArray.map((item, index) => (
                        <Animatable.View animation="slideInLeft" duration={550}>
                        
                        <View style={{flexDirection: 'row', paddingVertical:5}}>
                        {<View style={{flex: 0.18}}>
                            <HomeSkeleton width={50} height={50} variant="circle" />
                        </View>
                        }
                        {<View style={{flex: 0.8}}>
                            <HomeSkeleton width="80%" height={12} />
                            <HomeSkeleton width={160} height={10} />
                            <HomeSkeleton width={120} height={8}  /> 
                        </View>
                        }
                        </View>
                        </Animatable.View>
                    ))}
            <View style={styles.overlay}>
              <Text style={styles.loadingText}>Searching for cleaners near you...</Text>
            </View>
          </View>
        ) : (
          <View style={{margin:15}}>
            <FlatList
                data={recommended_cleaners}
                renderItem={singleItem}
                ListEmptyComponent={emptyListing}
                ItemSeparatorComponent={itemSeparator}
                keyExtractor={recommended_cleaners => recommended_cleaners._id}
                numColumns={1}
                showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
        {/* </View> */}
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    container:{
        margin:0,
        flex:1
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position:'relative'
      },
      overlay: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      },
      loadingText: {
        fontSize: 18,
        color: COLORS.secondary,
      },
    item_separator : {
        marginTop:5,
        marginBottom:5,
        height:1,
        width:"100%",
        backgroundColor:"#E4E4E4",
        },
      empty_listing: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:'50%'
      },
})
import React from 'react';
import { SafeAreaView,StyleSheet, Image, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import COLORS from '../constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-paper';
import userService from '../services/userService';







const CustomDrawer = (props) => {
    const { logout, currentUserId, currentUser, applicationCounts }  = useContext(AuthContext)
    

    const[uid, setUserId] = React.useState("")
    // const[user_avatar, setUserAvatar] = React.useState(avatar)
    const[firstname, setFirstname] = React.useState("")
    const[lastname, setLastname] = React.useState("Njoku")
    const[username, setUsername] = React.useState("calito")
    const[city, setCity] = React.useState("Newark")
    const[state, setState] = React.useState("New Jersey")
    const[avatar, setAvatar] = React.useState("")
    // const[applicationCounts, setApplicationCounts] = React.useState(6)

    const getUser = async () => {
      
        try {

        //   const jsonValue = await AsyncStorage.getItem('@storage_Key')
        //   const userInfo = JSON.parse(jsonValue)
        //   console.log(userInfo)
        //   console.log(userInfo._id)
        //   setUserAvatar(userInfo._id)
          
        
          
          await userService.getUser(currentUserId)
          .then(response => {
            const res = response.data
   
            setFirstname(res.firstname)
            setLastname(res.lastname)
            setUsername(res.username)
            setCity(res.location.city)
            setState(res.location.region)
            setAvatar(res.avatar)
            
          })
          
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
          // error reading value
        }
    }


    React.useEffect(() => {

        getUser()
    },[])

    const logUserOut = (id) => {

        logout()
        const data = {userId:id}
        userService.logOut(data)
            .then(response => {
                const res = response.data.data
                console.log(res)
        
            })
    }
    
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}
                contentContainerStyle={{backgroundColor:COLORS.secondary}}
            >
                <ImageBackground style={{padding:20, marginTop:-5, backgroundColor:COLORS.primary}}>
                    {currentUser.avatar ? 
                        <Image 
                            source={{uri:avatar}}
                            style={{height:100, width:100, borderRadius:50, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
                        />
                        :

                        <Avatar.Image
                            size={100}
                            source={require('../assets/default_avatar.png')}
                            style={{ backgroundColor: COLORS.gray }}
                        />
                    }
                    <Text style={{color:"#f3f3f3",  fontSize:18, fontWeight:"600"}}>{firstname} {lastname}</Text>
                    {city ? 
                    <View style={{flexDirection:"row"}}>
                        <Text style={{color:COLORS.white, fontSize:14, fontWeight:"normal"}}>{city}, {state}</Text>
                        <Ionicons name="flag-outline" color = "#ddd" style={{marginTop:5, marginLeft:5}} />
                    </View>
                    :

                    <View style={{flexDirection:"row"}}>
                        
                    </View>
                    }
                </ImageBackground>
                <View style={{backgroundColor:"#fff"}}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{padding:20, borderTopWidth:1, borderTopColor:"#eee"}}>
                {/* <TouchableOpacity style={{paddingVertical:15}} onPress = {(e)=>{logUserOut(currentUser._id)}} > */}
                    <View style={{ flexDirection:"row", alignItems:'center'}}>
                        <Ionicons name='log-out-outline' size={22} />
                        <Text style={{fontSize:15, marginLeft:10, color:"#333"}}>Logout</Text>
                    </View>
                {/* </TouchableOpacity> */}
            </View>
        </View>
    )
}


export default CustomDrawer
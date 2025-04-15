import React, {useEffect,useContext} from 'react'
import { 
    SafeAreaView,
    StyleSheet, 
    ScrollView, 
    Text, 
    View,  
    Alert,
    Keyboard, 
    TouchableOpacity
   } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';  
import { useRoute } from '@react-navigation/native'
import ROUTES from '../../constants/routes';
import COLORS from '../../constants/colors';
import Input from '../../components/Input';
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../hooks/useNotification';
import * as Notifications from 'expo-notifications'
import Button from '../../components/Button';
import userService from '../../services/userService';
import { db } from '../../firebase/config';
import {
  getDatabase, 
  ref,
  get,
  onValue, 
  set } from 'firebase/database'; // Import necessary functions from 'firebase/database'
import axios from 'axios';
import * as Device from 'expo-device';






const Signin = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const {login} = useContext(AuthContext)
    const { registerForPushNotificationsAsync } = useNotification();
    // const {expo_push_token, registerForPushNotificationsAsync , handleNotificationResponse } = useNotification()
    const { expoPushToken, handleNotificationResponse } = useNotification();

    const [inputs, setInputs] = React.useState({email: '', password: ''});
    const [fbCurrentUser, setFBCurrentUser] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [errMsg, setErrMsg] = React.useState(false);
    const [device_name, setDeviceName] = React.useState("");
    const [os_type, setOsType] = React.useState("false");

    

    // useEffect(()=>{
    //     registerForPushNotificationsAsync()

    //     Notifications.setNotificationHandler({
    //       handleNotification: async () => ({
    //         shouldShowAlert: true,
    //         shouldPlaySound: true,
    //         shouldSetBadge: true,
    //       }),
    //     });
    
    //     const responseListener = 
    //     Notifications.addNotificationReceivedListener(
    //       handleNotificationResponse
    //     )
        
    //     return  () => {
    //       if(responseListener){
    //         Notifications.removeNotificationSubscription(responseListener)
    //       }
    //     }
    //   },[])

    


    const getDeviceInfo = async () => {
      const deviceName = Device.deviceName;   // Device name
      const osFull = Device.osName || '';     // Full OS name
      const osVersion = Device.osVersion;     // OS version
      let osType = 'Unknown OS';              // Fallback OS type
      setDeviceName(deviceName)
      setOsType(Device.os_type)
      // Simplify OS detection based on `osName`
      if (osFull.toLowerCase().includes('android')) {
        osType = 'Android';
      } else if (osFull.toLowerCase().includes('ios')) {
        osType = 'iOS';
      }
    
      console.log(`Device Name: ${deviceName}`);
      console.log(`OS Type: ${osType}`);
      console.log(`OS Version: ${osVersion}`);
    };
    
    
    
  

    useEffect(() => {
      // alert(expoPushToken)
      if (expoPushToken) {
          // alert('Expo Push Token:', expoPushToken);
          // You can perform additional actions here, e.g., storing the token in the database
      }

      // Call the function to get device info
      getDeviceInfo();
  }, [expoPushToken]);

    const writeUserData = (userData) => {
      try {
          // setDoc(doc(db, "userChats", userData._id), {});
          const userId = userData._id;
          const firstname = userData.firstname;
          const lastname = userData.lastname;
          const email = userData.email;
          const avatar = userData.avatar
          const userRef = `users/${userId}`;
          const userDatabaseRef = ref(db, userRef);
          set(userDatabaseRef, {
            userId: userId,
            firstname:firstname,
            lastname:lastname,
            email:email,
            avatar:avatar
          });
  
          // alert("Data written successfully!");
      } catch (error) {
          console.error("Error writing data: ", error);
          // alert("An error occurred while writing data.");
      }
  };

  

  const fetchUserFirebaseData = async(uid,response) => {

    const mySnapshot = await get(ref(db, `users/${uid}`))
    
    setFBCurrentUser(mySnapshot.val())

    const data_to_send = {
      resp:response,
      fbUser: mySnapshot.val(),
      expo_push_token:expoPushToken

    }
    login(data_to_send)

    

   
    // Check if expo_push_token already exisit if exisit do nothing otherwise update
    if(response.expo_push_token !== expoPushToken){
      const userTokenData = {
        userId:uid,
        expo_push_token:expoPushToken
      }

    
      // console.log(userTokenData)
      // userService.updateExpoPushToken(userTokenData)
      // .then(response => {
      //   const res = response.data.data
      //   // console.log(res)
      // })
    }
    
  }

  

      const validate = async () => {
    
        Keyboard.dismiss();
        let isValid = true;
        if (!inputs.email) {
          handleError(<Animatable.View animation="fadeInUpBig"><Text style={{color: COLORS.red}}>Please enter email</Text></Animatable.View>, 'email');
          isValid = false;
        }
        if (!inputs.password) {
          handleError(<Animatable.View animation="fadeInUpBig"><Text style={{color: COLORS.red}}>Please enter password</Text></Animatable.View>, 'password');
          isValid = false;
        }
        if (isValid) {
          setLoading(!loading);
          handleLogin();
        }
      };

      const handleLogin = async() => {
     
        setLoading(true);
        setTimeout(async () => {
          
          await userService.userLogin(inputs)
          // alert(uid)
          .then(response => {
            if(response.status === 200){
              const res = response.data.data
              console.log("Meeeeeeeeeeeee")
              // console.log(JSON.stringify(res, null, 2))
              // writeUserData(res)
              fetchUserFirebaseData(res._id,res)
              
              // Register for push notifications
              console.log("UserId", res._id)
              
              registerForPushNotificationsAsync(res._id);

              console.log("fbbbbbbbbbbbbbbbbbbbbbbb")
              // console.log(fbCurrentUser)
              console.log("fbbbbbbbbbbbbbbbbbbbbbbb")
              
             
    
      
            }else {
              console.log("could not verify")
              Alert.alert('Error', "Either username or password incorrect");
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
      
      const handleOnchange = (text, input) => {
        setInputs(prevState => ({...prevState, [input]: text}));
      };
    
      const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
      };
    
    

  return (
    
    <SafeAreaView
        style={{
            flex:1,
            justifyContent:'center',
            backgroundColor:COLORS.white,
            alignItems:'center',
        }}
    >


        <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{paddingTop: 60, paddingHorizontal: 0}}
        >

            <View style={{paddingTop: 120, paddingHorizontal: 0}}>
                <View style={styles.header}>
                    <Text style={styles.text_header}>{expoPushToken} Welcome back</Text>
                    {/* {errMsg && <Animatable.View animation="fadeInUpBig"> <Text style={{marginBottom:30, marginTop:10, textAlign:'center', color:"red"}}>Either username or password incorrect</Text></Animatable.View> } */}
                </View>

                <Animatable.View 
                    animation="fadeInUpBig"
                    style={[styles.footer, {
                        backgroundColor: COLORS.white
                    }]}
                >
                <View style={{marginVertical: 0}}>
                <Input
                    autoCap="none"
                    onChangeText={text => handleOnchange(text, 'email')}
                    onFocus={() => handleError(null, 'email')}
                    iconName="email-outline"
                    label="Email"
                    placeholder="Enter your username or email address"
                    error={errors.email}
                />
                <Input
                    autoCap="none"
                    onChangeText={text => handleOnchange(text, 'password')}
                    onFocus={() => handleError(null, 'password')}
                    iconName="lock-outline"
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password}
                    password
                />
                <Text onPress = {() => navigation.navigate(ROUTES.forgot_password)} style={{textAlign:"right", marginTop:0, marginBottom:10, fontSize:12, color:COLORS.primary}}>Forgot Password</Text>


                <Button title="Log In" loading={loading} onPress={validate} />

                <Text
                    onPress={() => navigation.navigate(ROUTES.getting_started)}
                    style={{
                        color: COLORS.black,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: 16,
                    }}
                >
                Don't have account ? Register
                </Text>
            </View>
            </Animatable.View>

        </View>

        </ScrollView>
    </SafeAreaView>
  )
}

export default Signin

const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      justifyContent:'space-between',
      padding:10,
      height:30,
      borderRadius:5,
      width:"90%",
      marginBottom:50
    },
    header: {
      flex: 0,
      justifyContent: 'center',
      paddingTop: 60,
      paddingBottom: 20
    },
    footer: {
        flex: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        // elevation:5,
        // shadowColor: "#99e5ff",
        // shadowOpacity: 0.2,
        // shadowOffset: { width: 0, height: 2},
    },
    text_header: {
      color: COLORS.dark,
      textAlign:'center',
      fontWeight: 'bold',
      fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
  });
  
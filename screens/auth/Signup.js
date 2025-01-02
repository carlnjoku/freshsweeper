import React, {useContext, useRef, useState } from 'react';
import Input from '../../components/Input';
import { 
  SafeAreaView,
  StyleSheet, 
  ScrollView, 
  Keyboard,
  Text, 
  Alert,
  StatusBar,
  View, TouchableOpacity, TextInputComponent } from 'react-native';
import Button from '../../components/Button';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import COLORS from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';

import ROUTES from '../../constants/routes';
// import PhoneInput from "react-native-phone-number-input";
import userService from '../../services/userService';

import { TextInput } from 'react-native-paper';
// import {
//   arrayUnion,
//   doc,
//   serverTimestamp,
//   Timestamp,
//   updateDoc,
//   setDoc,
//   getDoc,
//   collection,
//   addDoc
// } from "firebase/firestore";
import { db } from '../../firebase/config';
import {getDatabase, ref, set } from 'firebase/database'; // Import necessary functions from 'firebase/database'





export default function Signup({navigation, route}) {

  
  const {userType} = route.params
  console.log(userType)
  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
    const randomString = Math.random().toString(36).substr(2, 5); // Generate a random string
    return `${timestamp}${randomString}`;
  };

  const[email, setEmail]=useState("")
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const[phoneNumber, setPhoneNumber] = useState('');
  const phoneInput = useRef();




  const {signup,geolocationData} = useContext(AuthContext)

  const [inputs, setInputs] = React.useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    userType:userType,
    phone:'',
    location: geolocationData,
    aboutme: [],
    availability: [],
    certification: [],
  });

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  
  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const createUserChats = async(userinfo) => {
    await setDoc(doc(db, "userChats", userinfo._id), {});
    // await setDoc(doc(db, "users", userinfo._id), userinfo);
  }

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

        const unreadMsgRef = `unreadMessages/${userId}`;
        const unreadMsgDatabaseRef = ref(db, unreadMsgRef);
        set(unreadMsgDatabaseRef, {
          
        })
        // alert("Data written successfully!");
    } catch (error) {
        console.error("Error writing data: ", error);
        // alert("An error occurred while writing data.");
    }

};

// find user in firebase database 
// const findUser = async(email) => {
//   const mySnapshot = get(ref(db, `users/${email}`));
//   return mySnapshot.val()
// }

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError(<Animatable.View animation="fadeInUpBig"><Text style={{color: COLORS.red}}>Please enter email</Text></Animatable.View>, 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError(<Animatable.View animation="fadeInUpBig"><Text style={{color: COLORS.red}}>Please enter a valid email</Text></Animatable.View>, 'email');
      isValid = false;
    }

    // if (!inputs.username) {
    //   handleError(<Animatable.View animation="fadeInUpBig"><Text style={{color: COLORS.red}}>Please enter username</Text></Animatable.View>, 'username');
    //   isValid = false;
    // }
    if (!inputs.firstname) {
      handleError(<Animatable.View animation="fadeInUpBig"><Text style={{color: COLORS.red}}>Please enter first name</Text></Animatable.View>, 'firstname');
      isValid = false;
    }
    if (!inputs.lastname) {
      handleError(<Animatable.View animation="fadeInUpBig"><Text style={{color: COLORS.red}}>Please enter last name</Text></Animatable.View>, 'lastname');
      isValid = false;
    }

    // if (!inputs.phone) {
    //   handleError(<Animatable.View animation="fadeInUpBig"><Text style={{color: COLORS.red}}>Please enter phone number</Text></Animatable.View>, 'phone');
    //   isValid = false;
    // }

    if (!inputs.password) {
      handleError(<Animatable.View animation="fadeInUpBig"><Text style={{color: COLORS.red}}>Please input password</Text></Animatable.View>, 'password');
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError(<Animatable.View animation="fadeInUpBig"><Text style={{color: COLORS.red}}>Min password length of 5</Text></Animatable.View>, 'password');
      isValid = false;
    }

    if (isValid) {
      setLoading(!loading);
      register();
    }
  };

  const addDataToCollection = async (data) => {
    try {
      const collectionRef = doc(db, "your-collection-name", "1234567");
      await setDoc(collectionRef, {
        // Your data object here
        data
      });
      console.log("Data added successfully");
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };

  // const createUser = async (userData) => {
  //   try {
  //     const usersCollection = collection(db, "users"); // Replace "users" with your collection name
  //     const newUserRef = await addDoc(usersCollection, userData);
  //     console.log("New user added with ID: ", newUserRef.id);
  //   } catch (error) {
  //     console.error("Error creating user: ", error);
  //   }
  // };

  const createUser = async (userData) => {
    
    try {
        const usersCollection = collection(db, "users"); // Replace "users" with your collection name
        alert("You")
        const newUserRef = await addDoc(usersCollection, userData);
        console.log("New user added with ID: ", newUserRef.id);
    } catch (error) {
        console.error("Error creating user: ", error);
    }
};
  

  const register = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        setLoading(false);
        console.log(inputs)
        const data = {
          inputs,
        }
        AsyncStorage.setItem('userData', JSON.stringify(inputs));
        userService.createUser(inputs)
        .then(response => {
          const status = response.status;
          const res = response.data;
          console.log("_______________________________12____________________")
          console.log(response.status)
          console.log("_______________________________12____________________")
          if(status === 200){
            setEmail(res.email)
            writeUserData(res)
            // Login user after signup
            navigation.navigate(ROUTES.signin, {"email":res.email});
          }

        }).catch(err=> {
          console.log(err)
        })
        
      } catch (error) {
        Alert.alert('Error', 'Something went wrong');
      }
    }, 3000);
  };

  const formatPhoneNumber = (input) => {
    const cleaned = ('' + input).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return input;
  };

  const handleInputChange = (text, input) => {
    // setPhoneNumber(formatPhoneNumber(text));
    setInputs(prevState => ({...prevState, [input]: formatPhoneNumber(text)}));
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
            backgroundColor:COLORS.backgroundColor,
            alignItems:'center',
          }}
        >
          <StatusBar backgroundColor={COLORS.backgroundColor} />
          {/* <Loader visible={loading} /> */}
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{paddingTop: 60, paddingHorizontal: 0}}>
         
          <View style={styles.header}>
            <Text style={styles.text_header}>Create {userType == "host" ?  "host":  "cleaner" } account</Text>
          </View>
          
          
          <View style={{marginVertical: 0}}>
            

            {/* <Input
              onChangeText={text => handleOnchange(text, 'username')}
              onFocus={() => handleError(null, 'username')}
              iconName="account-outline"
              label="Username / Nickname"
              placeholder="Enter your user name"
              error={errors.firstname}
            /> */}
            
             
            <TextInput
              mode="outlined"
              label="First Name"
              placeholder="Enter your first name"
              placeholderTextColor={COLORS.gray}
              outlineColor="#D8D8D8"
              value={inputs.firstname}
              activeOutlineColor={COLORS.primary}
              style={{marginBottom:10, color:COLORS.gray, fontSize:14, backgroundColor:"#fff"}}
              onChangeText={text => handleOnchange(text, 'firstname')}
              onFocus={() => handleError(null, 'firstname')}
              error={errors.firstname}
              left={<TextInput.Icon  icon="account-outline" style={{marginTop:10}} fontSize="small" />}
          />
            <TextInput
              mode="outlined"
              onChangeText={text => handleOnchange(text, 'lastname')}
              onFocus={() => handleError(null, 'lastname')}
              label="Last Name"
              outlineColor="#D8D8D8"
              placeholder="Enter your last name"
              error={errors.lastname}
              left={<TextInput.Icon  icon="account-outline" style={{marginTop:10}} fontSize="small" />}
              value={inputs.lastname}
              activeOutlineColor={COLORS.primary}
              style={{marginBottom:10, color:COLORS.gray, fontSize:14, backgroundColor:"#fff"}}
            />
            <TextInput
              mode="outlined"
              autoCap="none"
              onChangeText={text => handleOnchange(text, 'email')}
              onFocus={() => handleError(null, 'email')}
              label="Email"
              placeholder="Enter your email address"
              outlineColor="#D8D8D8"
              autoCapitalize="none" // Disable automatic capitalization
              error={errors.email}
              left={<TextInput.Icon  icon="email-outline" style={{marginTop:10}} fontSize="small" />}
              value={inputs.email}
              activeOutlineColor={COLORS.primary}
              style={{marginBottom:10, color:COLORS.gray, fontSize:14, backgroundColor:"#fff"}}
            />
            
            <TextInput
              label="Mobile Phone"
              placeholder="Mobile Phone"
              mode="outlined"
              outlineColor="#D8D8D8"
              activeOutlineColor={COLORS.primary}
              value={inputs.phone}
              left={<TextInput.Icon  icon="phone-outline" style={{marginTop:10}} fontSize="small" />}
              onChangeText={text => handleInputChange(text, 'phone')}
              keyboardType="phone-pad" // Show numeric keypad on mobile
              style={{marginBottom:10, fontSize:14, width:'100%', backgroundColor:"#fff"}}
              onFocus={() => handleError(null, 'phone')}
              error={errors.contack_phone}
          />

          {/* <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode={geolocationData.country_code}
            layout="first"
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            withDarkTheme
            withShadow
            autoFocus
          /> */}
             

            <TextInput
              mode='outlined'
              autoCap="none"
              onChangeText={text => handleOnchange(text, 'password')}
              onFocus={() => handleError(null, 'password')}
              left={<TextInput.Icon  icon="lock-outline" style={{marginTop:10}} fontSize="small" />}
              label="Password"
              placeholder="Create your password"
              outlineColor="#D8D8D8"
              activeOutlineColor={COLORS.primary}
              error={errors.password}
              autoCapitalize="none" // Disable automatic capitalization
              style={{marginBottom:10, fontSize:14, width:'100%', backgroundColor:"#fff"}}
              secureTextEntry={secureTextEntry} // Password masking
              right={<TextInput.Icon name={secureTextEntry ? 'eye-off-outline' : 'eyeoutline'} onPress={togglePasswordVisibility} />}
            />
            <Button title="Create Account" loading={loading} onPress={validate} />
            
            <Text
              onPress={() => navigation.navigate(ROUTES.signin)}
              style={{
                color: COLORS.black,
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 16,
              }}>
              Already have account ? Login
            </Text>
          </View>
         
        </ScrollView>

        </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    justifyContent:'space-between',
    padding:10,
    borderRadius:5,
    width:"90%",
    marginBottom:50
  },
  header: {
    flex: 0,
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20
  },
  footer: {
      flex: 5, //Platform.OS === 'ios' ? 3 : 5,
      // backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 20,
  },
  text_header: {
    color: COLORS.dark,
    textAlign:'center',
    fontSize: 30
  },
  text_footer: {
      color: '#05375a',
      fontSize: 18
  },
});




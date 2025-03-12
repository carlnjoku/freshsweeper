import React, { useState,useEffect, useContext } from "react";
import { View, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { TextInput, Button, Avatar, Text } from "react-native-paper";
import COLORS from "../../constants/colors";
import AvatarUploader from '../../components/AvatarUploader';
import { AuthContext } from '../../context/AuthContext';
import {
  get,
  ref,
  update,
  snapshot
 } from 'firebase/database'; 
import { db } from '../../firebase/config';
import userService from "../../services/userService";




const ProfilePage = () => {

  const {currentUserId, currentUser} = useContext(AuthContext)

  const [editMode, setEditMode] = useState(false); // To toggle between edit and view mode
  const [profile, setProfile] = useState({
    userId:currentUserId,
    firstname: currentUser.firstname,
    lastname: currentUser.lastname,
    email: currentUser.email,
    // address: "",
    phone: currentUser.phone,
    updated_at: new Date()
  });
  const[avatar, setUserAvatar] = useState("")

  const handleSave = async() => {
    // Example save logic (replace with API call if needed)
    try{
    await userService.updateHostProfile(profile)
    .then(response => {
      const res = response.data
    })
    Alert.alert("Profile Updated", "Your profile has been saved successfully.");
    setEditMode(false); // Exit edit mode

    }catch{
      Alert.alert("Something wet wrong", "Please try again");
    }
  };

  

  useEffect(()=>{
    fetchUser()
  },[avatar])

  const fetchUser = async () => {
    try {

      // setLoading(true)
      
      await userService.getUser(currentUserId)
      .then(response=> {
        const res = response.data
        setUserAvatar(res.avatar)

      })
  
      // setLoading(false)

      // return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
      console.log(e)
    }
  }


  const getUploadePhoto = (e) => {
    // Update avatar
    const data = {
      userId: currentUserId,
      avatar:e
    }

    userService.updateProfileAvatar(data)
    .then(response => {
      // Update user avatar on firebase database
      updateFirebaseAvatar(data)
      Alert.alert("Upload Picture", "This feature is not implemented yet.");
    }).catch((err)=> {
      console.log(err)
    })
    setUserAvatar(e);
    
  }


  
  
  const updateFirebaseAvatar = async data => {
    const mySnapshot = await get(ref(db, `users/${data.userId}`))
    if(mySnapshot.exists) {
      update(ref(db, `users/${data.userId}`), {avatar:data.avatar})
    }
    return mySnapshot.val()

  }

  const updateUser = () => {

  } 
    

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView contentContainerStyle={styles.scrollContent}>
    
      {/* Profile Picture Section */}
      
        
        <AvatarUploader  userId={currentUserId} default_photo={avatar} image_type = "avatar" get_uploaded_photo = {getUploadePhoto} />
        {/* <Button onPress={handleImageUpload} mode="text" textColor={COLORS.primary} style={styles.imageButton}>
          Upload Picture
        </Button> */}

        {/* Profile Fields */}
        {/* <TextInput
          mode="outlined"
          label="Certification/ License Name"
          placeholder="Certification/ License Name"
          placeholderTextColor={COLORS.gray}
          outlineColor="#D8D8D8"
          // keyboardType="numeric"
          value={inputs.name}
          activeOutlineColor={COLORS.primary}
          style={{marginBottom:10, color:COLORS.gray, fontSize:16, backgroundColor:"#fff"}}
          onChangeText={text => handleAChange(text, 'name')}
          onFocus={() => handleError(null, 'name')}
          error={errors.name}
                  
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>} */}

      <TextInput
        label="First Name"
        placeholder="First Name"
        value={profile.firstname}
        onChangeText={(text) => setProfile({ ...profile, firstname: text })}
        mode="outlined"
        style={styles.input}
        activeOutlineColor={COLORS.primary}
        disabled={!editMode}
      />
      <TextInput
        label="Last Name"
        value={profile.lastname}
        onChangeText={(text) => setProfile({ ...profile, lastname: text })}
        mode="outlined"
        style={styles.input}
        activeOutlineColor={COLORS.primary}
        disabled={!editMode}
      />
      <TextInput
        label="Email"
        value={profile.email}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
        mode="outlined"
        style={styles.input}
        activeOutlineColor={COLORS.primary}
        disabled={!editMode}
        keyboardType="email-address"
      />
      <TextInput
        label="Address"
        value={profile.address}
        onChangeText={(text) => setProfile({ ...profile, address: text })}
        mode="outlined"
        style={styles.input}
        activeOutlineColor={COLORS.primary}
        disabled={!editMode}
      />
      <TextInput
        label="Phone Number"
        value={profile.phone}
        onChangeText={(text) => setProfile({ ...profile, phone: text })}
        mode="outlined"
        style={styles.input}
        activeOutlineColor={COLORS.primary}
        disabled={!editMode}
        keyboardType="phone-pad"
      />

      {/* Buttons for Edit and Save */}
      {editMode ? (
        <Button mode="contained" buttonColor={COLORS.primary} onPress={handleSave} style={styles.button}>
          Save
        </Button>
      ) : (
        <Button mode="outlined" textColor={COLORS.primary} onPress={() => setEditMode(true)} style={styles.button}>
          Edit Profile
        </Button>
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor:COLORS.gray
  },
  input: {
    width: "100%",
    marginVertical: 8,
    color:COLORS.gray, 
    fontSize:16, 
    backgroundColor:"#fff"
  },
  button: {
    marginTop: 16,
    width: "100%",
  },
});

export default ProfilePage;
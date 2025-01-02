import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, Button, Image, StyleSheet,Linking, Dimensions } from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import { CameraView } from "expo-camera"; // Correct import of Camera
import { Ionicons } from "@expo/vector-icons"; // If using icons
import * as ImageManipulator from "expo-image-manipulator";

import { useStripe } from '@stripe/stripe-react-native';
import userService from "../../../services/userService";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");


// const CameraType = {
//   front: "front",
//   back: "back",
// };

const IDVerification = () => {
  // const cameraRef = useRef(null);

  // const [hasPermission, setHasPermission] = useState("granted");
  // const [photoUri, setPhotoUri] = useState(null); // Store captured photo URI

  // // Request camera permissions
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   })();
  // }, []);

  // // Toggle camera type (front/back)
  // const toggleCameraType = () => {
  //   setCameraType((prevType) =>
  //     prevType === CameraType.back ? CameraType.front : CameraType.back
  //   );
  // };

  // const capturePhoto = async () => {
  //   if (cameraRef.current) {
  //     const photo = await cameraRef.current.takePictureAsync({ quality: 1, base64: true });

  //     // Cropping dimensions relative to the screen
  //     const croppingDimensions = {
  //       originX: screenWidth * 0.1,
  //       originY: screenHeight * 0.2,
  //       width: screenWidth * 0.8,
  //       height: screenHeight * 0.4,
  //     };

  //     // Crop the image
  //     const croppedImage = await ImageManipulator.manipulateAsync(
  //       photo.uri,
  //       [{ crop: croppingDimensions }],
  //       { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
  //     );

  //     setPhotoUri(croppedImage.uri);
  //     onImageCaptured(croppedImage.uri); // Pass the cropped image URI
  //   }
  // };

  // if (hasPermission === null) {
  //   return <Text>Requesting camera permissions...</Text>;
  // }

  // if (hasPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }

  

  // const startVerification = async (sessionId) => {
  //   const { confirmVerificationSession } = useStripe();
  
  //   const { error } = await confirmVerificationSession(sessionId);
  //   if (error) {
  //     console.error("Error confirming session: ", error);
  //   } else {
  //     console.log("Identity verification complete.");
  //   }
  // };

  const { currentUserId, currentUser } = useContext(AuthContext)

  const [loading, setLoading] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState(null);
  Linking.openURL('freshsweeper://verification-success');
  const createVerificationSession = async () => {
    setLoading(true);
    try {
      // Replace with your FastAPI server URL
      // const apiUrl = "http://<your-server-url>/create-verification-session";
      const data = {
        cleanerId:currentUserId,
        firstname:currentUser.firstname,
        lastname:currentUser.lastname
      }
      await userService.createVerificationSession(data)
      .then(response => {
        
        const { url } = response.data; // Extract verification URL
       
        setVerificationUrl(url); // Save the URL to state

        // Optionally open the URL directly
        Linking.openURL(url);
      })
      
      
    } catch (error) {
      console.error("Error creating verification session:", error.message);
      alert("Failed to create verification session.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
    
      <Button
        title={loading ? "Loading..." : "Start Verification"}
        onPress={createVerificationSession}
        disabled={loading}
      />
      {verificationUrl && (
        <Text style={styles.linkText}>
          Verification URL: {verificationUrl}
        </Text>
      )}
 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  linkText: {
    marginTop: 20,
    color: "blue",
  },
});

export default IDVerification;





import React, { useEffect, useContext,useCallback, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image, FlatList, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import COLORS from '../../constants/colors'; // Your predefined color constants
import userService from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
import CardNoPrimary from '../../components/CardNoPrimary';
import { Checkbox } from 'react-native-paper';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';


const BeforePhoto = ({ scheduleId, tasksList }) => {

  const cameraRef = useRef(null);
  const {currentUserId} = useContext(AuthContext)

  const[tasks, setTasks] = useState([]);
  const[isLoading, setIsLoading] = useState(false);
  const[selected_images, setSelectedImages] = React.useState({})
  const[selected_task_title, setSelectedTaskTitle] = React.useState("")

  const [tasksByCategory, setTasksByCategory] = useState();

  const[facing, setFacing] = useState('back');
  const[permission, requestPermission] = useCameraPermissions();
  const[photos, setPhotos] = useState([]);
  const[cameraVisible, setCameraVisible] = useState(false); // New state to control camera visibility
  const[images, setImages] = useState([])


  const fetchImages = async () => {
    // Fetch images from the database
        setIsLoading(true);
          setTimeout(async () => {
        await userService.getUpdatedImageUrls(scheduleId)
        .then(response => {
          const res = response.data.data

          console.log("sooooooooooooooooon")
          console.log(JSON.stringify(res.before_photos, null, 2))
          console.log("sooooooooooooooooon")
          
          setSelectedImages(res.before_photos);
            
          

          setTasks(res.before_photos)
          setIsLoading(false);
        })
      }, 2000); // Add a 2-second delay
    }

    // Execute fetchImages when the screen comes into focuss
    useFocusEffect(
      useCallback(() => {
        fetchImages();
      }, [])
    );
    
    useEffect(() => {
      if (permission && !permission.granted) {
        requestPermission();
      }
    }, [permission]);

    
    if (permission === null) {
      return <View />;
    }

    if (!permission.granted) {
      return <Text>No access to camera</Text>;
    }

    const takePicture = async (title) => {
      console.log("weeeeoeoeoeoeoeoeooeoeoe")
      console.log(title)
      setSelectedTaskTitle("Bathroom")
      setCameraVisible(true);
    
      if (cameraRef.current) {
        const options = { quality: 1, base64: true };
        const newPhoto = await cameraRef.current.takePictureAsync(options);
    
        // Update the photos state (immutably)
        setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
    
      //   // Avoid mutating existing images array, use a new array
      //   const images = [];
    
        // Add new photos to the updated images array
        photos.forEach((i) => {
          let imgSrc = "data:image/png;base64," + i.base64;
          images.push({
            filename: i.uri.replace(
              'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540flavoursoft%252Ffresh-sweeper-1/Camera/',
              ''
            ),
            file: imgSrc
          });
        });
    
        // Avoid logging entire object with circular references
        try {
          console.log("Updated Images:", JSON.stringify(images));  // Safely log the updated images
        } catch (error) {
          console.error("Error logging updatedImages:", error.message);
        }
      }
    };
  
    const onSubmit = async () => {
        
        alert(selected_task_title)
      setIsLoading(true);
      setTimeout(async () => {
        const data = {
          photo_type: "before_photos",
          scheduleId: scheduleId,
          images: images,
          currentUserId: currentUserId,
          task_title: selected_task_title,
          updated_tasks: selected_images
        };

        try {
          const response = await userService.uploadBeforeTaskPhotos(data);
          fetchImages();
          console.log("Upload Response:", response.data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
          onCloseCamera();
        }
      }, 2000); // Add a 2-second delay
    
  };
    
  
    const removePhoto = (index) => {
      setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
    };

    // Simulate completion submission
  const submitCompletion = async() => {

    if (validateTasks()) {
      setIsLoading(true);
      setTimeout(async () => {

      const jobCompletionData = {
        scheduleId: scheduleId,
        completed_tasks: selected_images,
        completionTime: new Date(),
      };

      try {
        const response = await userService.finishCleaning(jobCompletionData);
        fetchImages();
        console.log("Upload Response:", response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    
    }, 2000); // Add a 2-second delay
   }
    
  };

  const onCloseCamera = () => {
    setCameraVisible(false)
  }

  return(
    <View style={styles.container}>

      {/* Button to trigger camera visibility */}
      {!cameraVisible && (
        <View>
          {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text>Uploading...</Text>
        </View>
      )}
          {!isLoading && (
            <ScrollView>
            <Text style={styles.headline}>Cleaning Checklist and Photo Upload</Text>
            <Text style={styles.subheading}>Complete all cleaning tasks and upload at least 3 photos per category to ensure quality assurance.</Text>

            {Object.keys(selected_images).map(taskTitle => (
                <CardNoPrimary>
                 <View key={taskTitle} style={{marginBottom:20}}>
                     
                     <Text style={styles.roomTitle}>
                        {taskTitle}
                     </Text>
                     
                     <ScrollView horizontal style={styles.previewContainer}>
                        {selected_images[taskTitle]["photos"].map((photo, index) => (
                        <View key={index} style={styles.thumbnailContainer}>
                            <Image source={{ uri: photo.img_url }} style={styles.preview} />
                            
                        </View>
                        ))}
                    </ScrollView>
                    

                    <Text style={styles.title}>Tasks</Text>
                        <FlatList
                            data={selected_images[taskTitle]["tasks"]}
                            // renderItem={renderTask}
                            renderItem={(item) => renderTask(item, taskTitle)} // Pass taskTi
                            keyExtractor={item => item.id.toString()}
                            numColumns={2} // Make 2 columns
                            columnWrapperStyle={styles.columnWrapper} // Style the column wrapper
                        />
          


                    <View style={styles.horizontalLine} />

                    <View style={{alignItems:'center'}}>
                        {/* <Text onPress={() => takePicture()} style={{color:COLORS.primary}}>Upload Photos</Text> */}
                        <TouchableOpacity style={styles.sendButton} onPress={() => takePicture(taskTitle)} >
                            <View style={styles.sendButtonContent}>
                                <Ionicons name="cloud-upload" size={24} color="gray" />
                                <Text style={styles.addButtonText}>Add photo to {taskTitle}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* <Button
                        // title={item.afterPhoto ? "Change Photo" : "Upload Photo2"}
                        title="Upload Photo2"
                        onPress={() => takePicture()}
                    />
                    <Button
                        // title={item.completed ? "Undo" : "Complete"}
                        title="Complete"
                        // onPress={() => toggleTaskCompletion(item.id)}
                        // color={item.completed ? COLORS.success : COLORS.primary}
                        color={COLORS.primary}
                    /> */}
                 </View>
                 </CardNoPrimary>
             ))}
             {/* Finish Cleaning Button */}
              <Button title="Finish Cleaning" onPress={submitCompletion} color={COLORS.success} />
             </ScrollView>
             )}
        </View>
        
      )}

      {/* Conditionally render the CameraView */}

      {cameraVisible && (
        <CameraView 
          style={styles.camera} 
          facing={facing}
          ref={cameraRef}
        >

            {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onCloseCamera} >
          <Ionicons name="close-circle" size={32} color="white" />
        </TouchableOpacity>

          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={40} color="white" />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Ionicons name="camera" size={70} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={onSubmit}>
              <View style={styles.sendButtonContent}>
                <Ionicons name="cloud-upload" size={40} color="white" />
                <Text style={styles.sendButtonText}>Upload</Text>
              </View>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {/* Display thumbnails */}
      <ScrollView horizontal style={styles.previewContainer}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.thumbnailContainer}>
            <Image source={{ uri: photo.uri }} style={styles.preview} />
            <TouchableOpacity onPress={() => removePhoto(index)} style={styles.removeButton}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'black',
    // backgroundColor: COLORS.backgroundColor,
    borderRadius:10
  },
 
  openCameraButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007aff',
    borderRadius: 10,
    margin: 20,
  },
  openCameraText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  camera: {
    flex: 20, // Adjusted to take more than half the screen
    borderRadius:10,
    overflow: 'hidden', // Ensure content respects borderRadius
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Make sure the button is above the camera view
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    alignItems: 'center',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 35,
    padding: 10,
  },
  sendButton: {
    alignItems: 'center',
  },
  sendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  addButtonText: {
    color: 'black',
    fontSize: 14,
    marginLeft: 5,
  },
  previewContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 10,
    marginTop:10
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius:5
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
  },
  roomContainer: {
    marginVertical: 20,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
  },

  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    flex: 1,
  },
  taskText: {
    marginLeft: -5,
    fontSize: 14,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Create space between columns
  },
  horizontalLine: {
    borderBottomColor: COLORS.light_gray_1,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 0,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default BeforePhoto

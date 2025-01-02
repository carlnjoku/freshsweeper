
import React, { useEffect, useContext,useCallback, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image, FlatList, ScrollView } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import COLORS from '../../constants/colors'; // Your predefined color constants
import userService from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
import CardNoPrimary from '../../components/CardNoPrimary';
import { Checkbox } from 'react-native-paper';
// import { checklist } from '../../utils/tasks_photo';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';

const TaskChecklistTest = ({ scheduleId, tasksList }) => {
     
  const {currentUserId} = useContext(AuthContext)

  // Use a ref to store the camera reference
  const cameraRef = useRef(null);

  
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

  const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);


  const fetchImages = async () => {
    // Fetch images from the database
    setIsLoading(true);
      setTimeout(async () => {
    await userService.getUpdatedImageUrls(scheduleId)
    .then(response => {
      const res = response.data.data
      console.log("sooooooooooooooooon")
      console.log(JSON.stringify(res.checklist, null, 2))
      console.log("sooooooooooooooooon")
      
      // Update checklist 
      // const data = {
      //   scheduleId:scheduleId,
      //   checklist: checklist
      // }
      // userService.updateChecklist(data)
      // .then(response=> {
      //   // const res = response.data.data
      // })
      // Update state with the fetched images
      setSelectedImages(res.checklist);
        
      

      setTasks(res.checklist)
      setIsLoading(false);
    })
  }, 2000); // Add a 2-second delay
    
  };

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

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  
  
  const takePicture = async (text) => {
    console.log("weeeeoeoeoeoeoeoeooeoeoe")
    console.log(text)
    setSelectedTaskTitle("Kitchen")
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

  

  const removePhoto = (index) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  };

  
  


  const validateTasks = () => {
    let invalidCategories = [];  // To store categories that are not validated
    let categoriesWithInsufficientImages = [];  // To store categories with fewer than 3 images

    // Loop through each category in the selected_images object
    Object.keys(selected_images).forEach((category) => {
        const tasks = selected_images[category].tasks;
        const photos = selected_images[category].photos;

        // Check if all tasks in this category are completed (i.e., value is true)
        const allTasksCompleted = tasks.every(task => task.value === true);

        // If any task is incomplete, mark this category as invalid
        if (!allTasksCompleted) {
            invalidCategories.push(category);  // Add the category to the invalid list
        }

        // Check if at least 3 images are uploaded for this category
        if (photos.length < 3) {
            categoriesWithInsufficientImages.push(category);  // Add the category with insufficient images
        }
    });

    // Create alert messages based on the validation checks
    if (invalidCategories.length > 0 || categoriesWithInsufficientImages.length > 0) {
        let errorMessage = '';

        if (invalidCategories.length > 0) {
            errorMessage += `The following categories have incomplete tasks: ${invalidCategories.join(', ')}.\n`;
        }

        if (categoriesWithInsufficientImages.length > 0) {
            errorMessage += `The following categories have fewer than 3 images: ${categoriesWithInsufficientImages.join(', ')}.`;
        }

        // Show the alert with appropriate error messages
        alert(errorMessage);

        // Return false since validation failed
        return false;
    }

    // If all tasks are completed and at least 3 images are uploaded, return true
    return true;
};

  const onSubmit1 = async() => {
    setIsLoading(true);  // Show loading while uploading
    if (validateTasks()) {
        // Proceed with form submission or next action
        console.log("All tasks are validated and sufficient images uploaded. Proceeding...");
    } else {
        console.log("Validation failed.");
    }
  
    console.log("l..........................l")
        alert(selected_task_title)
        console.log("l..........................l")

        // console.log(images.substring(0, 100))
        const data = {
          photo_type:"after_photos",
          scheduleId:scheduleId,
          images:images,
          currentUserId:currentUserId,
          task_title:selected_task_title
        }
    
        await userService.uploadTaskPhotos(data)
        .then(response => {
          const res = response.data;
          setIsLoading(false);  // Show loading while uploading
          fetchImages();
          console.log("Weeeeeeeeeeeeeep")
          console.log(res)
          console.log("Weeeeeeeeeeeeeep")
          onCloseCamera()
        }).catch((err) => {
          console.log(err)
        })
        
      }


      const onSubmit = async () => {
        
        
          setIsLoading(true);
          setTimeout(async () => {
            const data = {
              photo_type: "after_photos",
              scheduleId: scheduleId,
              images: images,
              currentUserId: currentUserId,
              task_title: selected_task_title,
              updated_tasks: selected_images
            };
    
            try {
              const response = await userService.uploadTaskPhotos(data);
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

      // Validate and complete cleaning
      const completeCleaning = () => {
          const allTasksComplete = tasks.every(task => task.completed && task.afterPhoto);

          if (!allTasksComplete) {
          Alert.alert("Incomplete Tasks", "Please complete all tasks and upload photos before finishing.");
          return;
          }

          submitCompletion();
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


//   const toggleCheckbox = (id, rooname) => {
//     const updatedTasks = checklist[rooname].map(task =>
//       task.id === id ? { ...task, checked: !task.checked } : task
//     );
//     setMicroTasks(updatedTasks);
//   };

  const onCloseCamera = () => {
    setCameraVisible(false)
  }

  
// Function to handle the checkbox toggle
const handleTaskToggle = (category, taskId) => {
    const updatedImages = { ...selected_images };

    // Find the task and toggle its value
    const tasks = updatedImages[category].tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, value: !task.value };
      }
      return task;
    });

    updatedImages[category].tasks = tasks;

    // Update the state with the new tasks
    setSelectedImages(updatedImages);
    console.log(JSON.stringify(updatedImages,null, 2))

    ///////////////////////////////////////////


    // const updatedTasks = { ...tasksByCategory };

    // updatedTasks[category].tasks = updatedTasks[category].tasks.map(task => 
    //   task.id === taskId ? { ...task, value: !task.value } : task
    // );

    // setTasksByCategory(updatedTasks);
  
    
  };

  // Render task checkbox with label
  const renderTask = ({ item }, category) => (
   
    <View style={styles.taskContainer}>
      <Checkbox
        status={item.value ? 'checked' : 'unchecked'}
        onPress={() => handleTaskToggle(category, item.id)} // Call toggle function
      />
      <Text>{item.label}</Text>
    </View>
  );

  // Open modal and set images for the selected task title
  const openImageViewer = (images, index) => {
    const formattedImages = images.map(photo => ({ url: photo.img_url }));
    setCurrentImages(formattedImages);
    setCurrentImageIndex(index);
    setBeforeModalVisible(true);
  };

  return (
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
                            <TouchableOpacity
                            key={index}
                            onPress={() => openImageViewer(selected_images[taskTitle]["photos"], index)}
                            style={styles.thumbnailContainer}
                          >
                            <Image source={{ uri: photo.img_url }} style={styles.preview} />
                          </TouchableOpacity>
                            
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
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={40} color="white" />
            </TouchableOpacity>
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

      {/* Modal with ImageViewer */}
      <Modal
          isVisible={isBeforeModalVisible}
          style={styles.fullScreenModal}
          onBackdropPress={() => setBeforeModalVisible(false)}
        >
          {/* <View style={styles.imageViewerContainer}> */}
          <ImageViewer
            imageUrls={currentImages}
            index={currentImageIndex}
            onClick={() => setBeforeModalVisible(false)}
            enableSwipeDown
            onSwipeDown={() => setBeforeModalVisible(false)}
            backgroundColor="black"
          />
          
        {/* </View> */}
        </Modal>
    </View>
  );
};

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

export default TaskChecklistTest;
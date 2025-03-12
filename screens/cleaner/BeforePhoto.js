// import React, { useEffect, useContext, useCallback, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
//   Image,
//   FlatList,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import COLORS from '../../constants/colors'; // Your predefined color constants
// import userService from '../../services/userService';
// import { AuthContext } from '../../context/AuthContext';
// import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
// import CardNoPrimary from '../../components/CardNoPrimary';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// const BeforePhoto = ({ scheduleId, tasksList }) => {
//   const cameraRef = useRef(null);
//   const { currentUserId } = useContext(AuthContext);

//   const [tasks, setTasks] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedImages, setSelectedImages] = useState({});
//   const [selectedTaskTitle, setSelectedTaskTitle] = useState('');
//   const [permission, requestPermission] = useCameraPermissions();
//   const [photos, setPhotos] = useState([]);
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [images, setImages] = useState([]);

//   const fetchImages = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await userService.getUpdatedImageUrls(scheduleId);
//       const res = response.data.data;
//       setSelectedImages(res.before_photos);
//       setTasks(res.before_photos);
//     } catch (error) {
//       console.error('Error fetching images:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [scheduleId]);

//   useFocusEffect(fetchImages);

//   useEffect(() => {
//     if (permission && !permission.granted) {
//       requestPermission();
//     }
//   }, [permission]);

//   if (!permission) return <View />;
//   if (!permission.granted) return <Text>No access to camera</Text>;

//   const takePicture = async (taskTitle) => {
//     setSelectedTaskTitle(taskTitle);
//     setCameraVisible(true);

//     if (cameraRef.current) {
//       const options = { quality: 1, base64: true };
//       const newPhoto = await cameraRef.current.takePictureAsync(options);
//       const imgSrc = `data:image/png;base64,${newPhoto.base64}`;
//       const photoData = {
//         filename: newPhoto.uri.split('/').pop(),
//         file: imgSrc,
//       };

//       setPhotos((prevPhotos) => [...prevPhotos, photoData]);
//     }
//   };

//   const onSubmit = async () => {
//     setIsLoading(true);
//     const data = {
//       photo_type: 'before_photos',
//       scheduleId,
//       images: photos,
//       currentUserId,
//       task_title: selectedTaskTitle,
//       updated_tasks: selectedImages,
//     };

//     try {
//       await userService.uploadBeforeTaskPhotos(data);
//       fetchImages();
//     } catch (err) {
//       console.error('Error uploading photos:', err);
//     } finally {
//       setIsLoading(false);
//       setCameraVisible(false);
//       setPhotos([]);
//     }
//   };

//   const removePhoto = (index) => {
//     setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
//   };

//   const submitCompletion = async () => {
//     const jobCompletionData = {
//       scheduleId,
//       completed_tasks: selectedImages,
//       completionTime: new Date(),
//     };

//     if (Object.keys(selectedImages).length === 0) {
//       Alert.alert('Error', 'Please complete all tasks before finishing.');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await userService.finishCleaning(jobCompletionData);
//       fetchImages();
//     } catch (err) {
//       console.error('Error submitting completion:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onCloseCamera = () => {
//     setCameraVisible(false);
//   };

//   const renderTask = ({ item }, taskTitle) => (
//     <TouchableOpacity
//       style={styles.taskContainer}
//       onPress={() => console.log(`Task selected: ${item}`)}
//     >
//       <Text>{item}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {!cameraVisible && (
//         <View>
//           {isLoading && (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color={COLORS.primary} />
//               <Text>Uploading...</Text>
//             </View>
//           )}
//           {!isLoading && (
//             <ScrollView>
//               <Text style={styles.headline}>Cleaning Checklist and Photo Upload</Text>
//               <Text style={styles.subheading}>
//                 Complete all cleaning tasks and upload at least 3 photos per category to ensure quality assurance.
//               </Text>

//               {Object.keys(selectedImages).map((taskTitle) => (
//                 <CardNoPrimary key={taskTitle}>
//                   <View style={{ marginBottom: 20 }}>
//                     <Text style={styles.roomTitle}>{taskTitle}</Text>
//                     <ScrollView horizontal style={styles.previewContainer}>
//                       {selectedImages[taskTitle]?.photos?.map((photo, index) => (
//                         <View key={index} style={styles.thumbnailContainer}>
//                           <Image source={{ uri: photo.img_url }} style={styles.preview} />
//                         </View>
//                       ))}
//                     </ScrollView>
//                     <FlatList
//                       data={selectedImages[taskTitle]?.tasks || []}
//                       renderItem={(item) => renderTask(item, taskTitle)}
//                       keyExtractor={(item, index) => index.toString()}
//                       numColumns={2}
//                       columnWrapperStyle={styles.columnWrapper}
//                     />
//                     <View style={{ alignItems: 'center' }}>
//                       <TouchableOpacity
//                         style={styles.sendButton}
//                         onPress={() => takePicture(taskTitle)}
//                       >
//                         <View style={styles.sendButtonContent}>
//                           <Ionicons name="cloud-upload" size={24} color="gray" />
//                           <Text style={styles.addButtonText}>
//                             Add photo to {taskTitle}
//                           </Text>
//                         </View>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </CardNoPrimary>
//               ))}

//               <Button title="Finish Cleaning" onPress={submitCompletion} color={COLORS.success} />
//             </ScrollView>
//           )}
//         </View>
//       )}

//       {cameraVisible && (
//         <CameraView style={styles.camera} ref={cameraRef}>
//           <TouchableOpacity style={styles.closeButton} onPress={onCloseCamera}>
//             <Ionicons name="close-circle" size={32} color="white" />
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.captureButton} onPress={() => takePicture(selectedTaskTitle)}>
//               <Ionicons name="camera" size={70} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.sendButton} onPress={onSubmit}>
//               <View style={styles.sendButtonContent}>
//                 <Ionicons name="cloud-upload" size={40} color="white" />
//                 <Text style={styles.sendButtonText}>Upload</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </CameraView>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   headline: { fontSize: 20, fontWeight: 'bold', margin: 10 },
//   subheading: { marginHorizontal: 10, marginBottom: 20 },
//   camera: { flex: 1 },
//   closeButton: { position: 'absolute', top: 10, right: 10 },
//   sendButton: { alignItems: 'center' },
//   sendButtonContent: { flexDirection: 'row', alignItems: 'center' },
//   sendButtonText: { color: 'white', fontSize: 16 },
//   addButtonText: { fontSize: 14, marginLeft: 5 },
//   previewContainer: { flexDirection: 'row' },
//   thumbnailContainer: { margin: 10 },
//   preview: { width: 100, height: 100 },
// });

// export default BeforePhoto;


import React, { useEffect, useContext, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import CardNoPrimary from '../../components/CardNoPrimary';
import { CameraView, useCameraPermissions } from 'expo-camera';
import CustomActivityIndicator from '../../components/CuustomActivityIndicator';
import { Image } from 'expo-image'; 
import Modal from 'react-native-modal';

const BeforePhoto = ({ scheduleId, tasksList }) => {
  const cameraRef = useRef(null);
  const { currentUserId } = useContext(AuthContext);

  const MAX_IMAGES_UPLOAD = 5
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Spinner for uploading state
  const [selectedImages, setSelectedImages] = useState({});
  const [selectedTaskTitle, setSelectedTaskTitle] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userService.getUpdatedImageUrls(scheduleId);
      const res = response.data.data;
      setSelectedImages(res.before_photos);
      setTasks(res.before_photos);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId]);

  useFocusEffect(fetchImages);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) return <View />;
  if (!permission.granted) return <Text>No access to camera</Text>;

  const takePicture = async (taskTitle) => {
    setSelectedTaskTitle(taskTitle);
    setCameraVisible(true);

    if (cameraRef.current) {
      const options = { quality: 1, base64: true };
      const newPhoto = await cameraRef.current.takePictureAsync(options);
      const imgSrc = `data:image/png;base64,${newPhoto.base64}`;
      const photoData = {
        filename: newPhoto.uri.split('/').pop(),
        file: imgSrc,
      };
      setPhotos((prevPhotos) => [...prevPhotos, photoData]);
    }
  };

  const onSubmit = async () => {
    // Check if the number of photos exceeds the limit
    if (photos.length > MAX_IMAGES_UPLOAD) {
      Alert.alert(
        'Upload Limit Exceeded',
        `You can only upload up to ${MAX_IMAGES_UPLOAD} images at a time. Please remove some images before uploading.`
      );
      return;
    }

    setIsUploading(true); // Start spinner for upload
    setLoading(true); // Start spinner for upload
    const data = {
      photo_type: 'before_photos',
      scheduleId,
      images: photos,
      currentUserId,
      task_title: selectedTaskTitle,
      updated_tasks: selectedImages,
    };

    try {
      await userService.uploadBeforeTaskPhotos(data);
      fetchImages();
    } catch (err) {
      console.error('Error uploading photos:', err);
    } finally {
      setLoading(false)
      setIsUploading(false); // Stop spinner
      setCameraVisible(false);
      setPhotos([]);
    }
  };

  const removePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const submitCompletion = async () => {
    const jobCompletionData = {
      scheduleId,
      completed_tasks: selectedImages,
      completionTime: new Date(),
    };

    if (Object.keys(selectedImages).length === 0) {
      Alert.alert('Error', 'Please complete all tasks before finishing.');
      return;
    }

    setIsLoading(true);
    try {
      await userService.finishCleaning(jobCompletionData);
      fetchImages();
    } catch (err) {
      console.error('Error submitting completion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseCamera = () => {
    setCameraVisible(false);
    setPhotos([]); // Empty the photos array
  };

  const renderTask = ({ item }, taskTitle) => (
    <TouchableOpacity
      style={styles.taskContainer}
      onPress={() => console.log(`Task selected: ${item}`)}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  // const deleteImage = (taskTitle, imageIndex) => {
  //   setSelectedImages((prevImages) => {
  //     const updatedImages = { ...prevImages };
  //     updatedImages[taskTitle].photos.splice(imageIndex, 1);
      
  //     // If no photos left, remove the taskTitle from the list
  //     if (updatedImages[taskTitle].photos.length === 0) {
  //       delete updatedImages[taskTitle];
  //     }
      
  //     return { ...updatedImages };
  //   });
  // };

  // const deleteImage = async (scheduleId, taskTitle, imageUrl) => {
  //   try {
  //     const response = await userService.deleteBeforePhoto(scheduleId, taskTitle, imageUrl);
  
  //     if (!response.ok) {
  //       fetchImages();
  //       const data = await response.json();
  //       throw new Error(data.detail || "Failed to delete image");
  //     }
  
  //     const data = await response.json();
  //     console.log("Image deleted:", data.message);
  //   } catch (error) {
  //     console.error("Error deleting image:", error.message);
  //   }
  // };

  // const deleteImage = async (scheduleId, taskTitle, imageUrl) => {
  //   try {
  //     const response = await userService.deleteBeforePhoto(scheduleId, taskTitle, imageUrl);
  
  //     if (!response.ok) {
  //       // const data = await response.json();
  //       throw new Error(data.detail || "Failed to delete image");
  //     }
  
  //     const data = await response.json();
  //     console.log("Image deleted:", data.message);
  
  //     // ✅ Update state without refreshing
  //     setSelectedImages((prevImages) => {
  //       const updatedPhotos = prevImages[taskTitle]?.photos.filter(photo => photo.img_url !== imageUrl) || [];
  
  //       return {
  //         ...prevImages,
  //         [taskTitle]: {
  //           ...prevImages[taskTitle],
  //           photos: updatedPhotos,
  //         },
  //       };
  //     });
  
  //   } catch (error) {
  //     console.error("Error deleting image:", error.message);
  //   }
  // };

  // const deleteImage = async (scheduleId, taskTitle, imageUrl) => {
  //   try {
  //     // Add confirmation dialog
  //     Alert.alert(
  //       "Delete Image",
  //       "Are you sure you want to delete this image?",
  //       [
  //         {
  //           text: "Cancel",
  //           style: "cancel"
  //         },
  //         {
  //           text: "Delete",
  //           onPress: async () => {
  //             try {
  //               const response = await userService.deleteBeforePhoto(
  //                 scheduleId, 
  //                 taskTitle, 
  //                 encodeURIComponent(imageUrl) // Properly encode URL for backend
  //               );
  //               console.log(response)
  //               if (!response.ok) {
  //                 const errorData = await response.json();
  //                 throw new Error(errorData.detail || "Failed to delete image");
  //               }
  
  //               const data = await response.json();
                
  //               // Update local state
  //               setSelectedImages(prev => {
  //                 const updatedPhotos = prev[taskTitle]?.photos?.filter(
  //                   photo => photo.img_url !== imageUrl
  //                 ) || [];
  
  //                 // Cleanup empty tasks
  //                 if (updatedPhotos.length === 0) {
  //                   const newState = {...prev};
  //                   delete newState[taskTitle];
  //                   return newState;
  //                 }
  
  //                 return {
  //                   ...prev,
  //                   [taskTitle]: {
  //                     ...prev[taskTitle],
  //                     photos: updatedPhotos
  //                   }
  //                 };
  //               });
  
  //               Alert.alert("Success", data.message || "Image deleted successfully");
  //             } catch (error) {
  //               console.error("Delete error:", error);
  //               Alert.alert(
  //                 "Deletion Failed", 
  //                 error.message || "Could not delete image. Please try again."
  //               );
  //             }
  //           }
  //         }
  //       ]
  //     );
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //     Alert.alert(
  //       "Error", 
  //       "An unexpected error occurred. Please try again later."
  //     );
  //   }
  // };

  const deleteImage = async (scheduleId, taskTitle, imageUrl) => {
    try {
      Alert.alert(
        "Delete Image",
        "Are you sure you want to delete this image?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: async () => {
              try {
                const encodedUrl = encodeURIComponent(imageUrl);
                const response = await userService.deleteBeforePhoto(
                  scheduleId, 
                  taskTitle, 
                  encodedUrl
                );
                console.log(response.data.message)
                // Handle non-2xx responses
                if (!response.ok) {
                  const errorText = await response.data.text();
                  throw new Error(errorText || "Delete failed");
                }
  
                const data = await response.json();
  
                // Update state
                setSelectedImages(prev => {
                  const updatedPhotos = prev[taskTitle]?.photos?.filter(
                    photo => photo.img_url !== imageUrl
                  ) || [];
  
                  if (updatedPhotos.length === 0) {
                    const newState = {...prev};
                    delete newState[taskTitle];
                    return newState;
                  }
  
                  return {
                    ...prev,
                    [taskTitle]: {
                      ...prev[taskTitle],
                      photos: updatedPhotos
                    }
                  };
                });
  
                Alert.alert("Success", data.message);
              } catch (error) {
                console.error("Delete error:", error);
                Alert.alert(
                  "Error",
                  error.message || "Failed to delete image. Please try again."
                );
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const handleImagePress = (taskTitle, index) => {
    setCurrentImages(selectedImages[taskTitle]?.photos || []);
    setCurrentImageIndex(index);
    setBeforeModalVisible(true);
  };

  // Add to your delete button (prevent event bubbling)
  const handleDelete = (scheduleId, taskTitle, imageUrl, e) => {
    e.stopPropagation();
    deleteImage(scheduleId, taskTitle, imageUrl);
  };

  return (
    <View style={styles.container}>

      {/* Add Modal component here */}
      <Modal
        isVisible={isBeforeModalVisible}
        style={styles.fullScreenModal}
        onBackdropPress={() => {
          if (!isDragging) {
            setBeforeModalVisible(false);
          }
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.imageContainer}>
            <ImageViewer
              imageUrls={currentImages}
              index={currentImageIndex}
              backgroundColor="black"
              enableSwipeDown
              enableImageZoom
              onSwipeDown={() => setBeforeModalVisible(false)}
              
              renderImage={(props) => (
                <Image
                  source={props.source}
                  style={styles.fullSizeImage}
                  contentFit="contain"
                  transition={300}
                  cachePolicy="memory-disk"
                />
              )}
              
            />
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setBeforeModalVisible(false)}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {!cameraVisible && (
        <View>
          {isLoading && (
              <View style={styles.loadingContainer}>
              <CustomActivityIndicator 
                size={40} 
                logo={require('../../assets/logo_loading.png')} // Replace with your logo path
              />
            </View>
          )}
          {!isLoading && (
            <ScrollView>
              

              <Text style={styles.headline}>Document the Starting Point</Text>
              
              <View style={styles.message}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="warning" size={24} color="#FFA000" />
              </View>
              <Text style={styles.subheading}>
                Before you begin cleaning, please capture and upload at least 3 photos for each area. This helps ensure transparency and maintain quality standards.
              </Text>
            </View>

             

              {Object.keys(selectedImages).map((taskTitle) => (
                <CardNoPrimary key={taskTitle}>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={styles.roomTitle}>{taskTitle}</Text>
                    
                    <ScrollView horizontal style={styles.previewContainer}>
                      {selectedImages[taskTitle]?.photos?.map((photo, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.thumbnailContainer}
                          onPress={() => handleImagePress(taskTitle, index)}
                        >
                          <Image source={{ uri: photo.img_url }} style={styles.preview} />
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={(e) => handleDelete(scheduleId, taskTitle, photo.img_url, e)}
                          >
                            <Ionicons name="trash" size={18} color="orange" />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <FlatList
                      data={selectedImages[taskTitle]?.tasks || []}
                      renderItem={(item) => renderTask(item, taskTitle)}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={2}
                      columnWrapperStyle={styles.columnWrapper}
                    />
                    <View style={styles.horizontalLine} />

                    <View style={{ alignItems: 'center' }}>
                      <TouchableOpacity
                        style={styles.sendButton}
                        onPress={() => takePicture(taskTitle)}
                      >
                        <View style={styles.sendButtonContent}>
                          <Ionicons name="cloud-upload" size={24} color="gray" />
                          <Text style={styles.addButtonText}>
                            Add photo to {taskTitle}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </CardNoPrimary>
              ))}

                <TouchableOpacity
                  style={styles.finishButton}
                  onPress={submitCompletion}
                >
                  <Text style={styles.finishButtonText}>Finish Cleaning</Text>
                </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      )}
      
      {cameraVisible && (

        <CameraView style={styles.camera} ref={cameraRef}>
          <TouchableOpacity style={styles.closeButton} onPress={onCloseCamera}>
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
          <View style={styles.spinnerContainer}>
            {isUploading ? ( // Show spinner when uploading
             <ActivityIndicator size="large" color={COLORS.primary} /> 
            ) : (
              <>
                <TouchableOpacity style={styles.captureButton} onPress={() => takePicture(selectedTaskTitle)}>
                  <Ionicons name="camera" size={70} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </CameraView>
      )}

      {/* Display thumbnails */}

        <View style={{height:200}}>
          <ScrollView horizontal style={styles.previewContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.thumbnailContainer}>
                <Image source={{ uri: photo.file }} style={styles.preview} />
                <TouchableOpacity onPress={() => removePhoto(index)} style={styles.removeButton}>
                  <Ionicons name="trash" size={20} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          
          {photos.length > 0 ? 
          // <TouchableOpacity onPress={onSubmit} style={styles.buttonContainer1}>
          //   <View style={styles.buttonContent1}>
          //     <Ionicons name="arrow-up-circle-outline" size={24} color="white" />
          //     <Text style={styles.buttonText1}>Save Photos</Text>
          //   </View>
          // </TouchableOpacity>

          <TouchableOpacity 
            onPress={onSubmit} 
            style={styles.buttonContainer1}
            disabled={loading} // Disable button when loading
          >
            <View style={styles.buttonContent1}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="arrow-up-circle-outline" size={24} color="white" />
                  <Text style={styles.buttonText1}>Save Photos</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          :
            ""
          }
          </View>
        
        </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headline: { fontSize: 20, fontWeight: 'bold', margin: 10 },
  camera: { flex: 1 },
  closeButton: { position: 'absolute', top: 10, right: 10 },
  sendButton: { alignItems: 'left' },
  sendButtonContent: { flexDirection: 'row', alignItems: 'center'},
  sendButtonText: { color: 'white', fontSize: 16 },
  addButtonText: { fontSize: 14, marginLeft: 5 },
  horizontalLine: {
    borderBottomColor: COLORS.light_gray_1,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  roomTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  previewContainer: { 
    flexDirection: 'row',
  },
  thumbnailContainer: { 
    margin: 5 
  },
  preview: { 
    width: 100, 
    height: 100,
    borderRadius:5
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute', 
    top: 100, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background
    zIndex: 10, // Ensure it appears above other content
  },
  finishButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureButton:{
    marginTop:'80%'
  },
  buttonContainer1: {
    backgroundColor: 'green', // Set button container color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Arrange icon and text horizontally
    borderRadius:50
  },
  buttonContent1: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',
  },
  buttonText1: {
    color: 'white', // Text color
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8, // Add space between icon and text
  },
  spinnerContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  removeButton: {
    position: 'absolute', // Position the trash button absolutely
    top: 5, // Distance from the top
    right: 5, // Distance from the right
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional: Adds background color to make it more visible
    borderRadius: 15, // Optional: Makes the background round
    padding: 5, // Optional: Increases clickable area
  },
  message: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
    margin: 5,
  },
  iconContainer: {
    marginRight: 8,
    marginTop: 2, // Adjust for vertical alignment
  },
  subheading: {
    flex: 1,
    fontSize: 14,
    color: '#616161', // Gray text for contrast
    lineHeight: 18,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    elevation: 3, // Android shadow
  },
  // Modal styles
  fullScreenModal: {
    margin: 0,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
  },
  footerOverlay: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 5,
  },
  imageCounter: {
    color: 'white',
    fontSize: 16,
    marginLeft:100
  },
  
});

export default BeforePhoto;
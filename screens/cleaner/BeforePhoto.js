import React, { useEffect, useContext, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  FlatList,
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

  const MAX_IMAGES_UPLOAD = 5;
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
  }, [scheduleId]);  // Make sure dependencies are correct



  useFocusEffect(
    useCallback(() => {
      let isActive = true;
  
      const fetchData = async () => {
        try {
          if (isActive) {
            await fetchImages();
          }
        } catch (error) {
          if (isActive) {
            console.error("Error fetching data:", error);
          }
        }
      };
  
      fetchData();
  
      return () => {
        isActive = false;
      };
    }, [fetchImages])
  );

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
    if (photos.length > MAX_IMAGES_UPLOAD) {
      Alert.alert(
        'Upload Limit Exceeded',
        `You can only upload up to ${MAX_IMAGES_UPLOAD} images at a time.`
      );
      return;
    }

    setIsUploading(true);
    setLoading(true);
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
      setLoading(false);
      setIsUploading(false);
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
    setPhotos([]);
  };

  const renderTask = ({ item }, taskTitle) => (
    <TouchableOpacity
      style={styles.taskContainer}
      onPress={() => console.log(`Task selected: ${item}`)}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

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
                
                if (!response.ok) {
                  throw new Error("Delete failed");
                }

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

                Alert.alert("Success", "Image deleted successfully");
              } catch (error) {
                Alert.alert("Error", "Failed to delete image. Please try again.");
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const handleImagePress = (taskTitle, index) => {
    const imagesForViewer = (selectedImages[taskTitle]?.photos || []).map(photo => ({
      url: photo?.img_url || "",  // Ensure URL is not undefined
      props: { source: { uri: photo?.img_url || "" } }
    }));
  
    if (imagesForViewer.length === 0) return; // Prevent errors if no images
  
    setCurrentImages(imagesForViewer);
    setCurrentImageIndex(index);
    setBeforeModalVisible(true);
  };

  const handleDelete = (scheduleId, taskTitle, imageUrl, e) => {
    e.stopPropagation();
    deleteImage(scheduleId, taskTitle, imageUrl);
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={isBeforeModalVisible}
        style={styles.fullScreenModal}
        onBackdropPress={() => setBeforeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ImageViewer
            imageUrls={currentImages}
            index={currentImageIndex}
            backgroundColor="black"
            enableSwipeDown
            enableImageZoom
            saveToLocalByLongPress={false}
            onSwipeDown={() => setBeforeModalVisible(false)}
            renderImage={(props) => (
              <Image
                source={{ uri: props.source.uri }}
                style={styles.fullSizeImage}
                contentFit="contain"
                transition={300}
                cachePolicy="memory-disk"
              />
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setBeforeModalVisible(false)}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {!cameraVisible ? (
        <View style={{ flex: 1 }}>
          {isLoading ? (
            <CustomActivityIndicator 
              size={40} 
              logo={require('../../assets/logo_loading.png')}
            />
          ) : (
            <FlatList
              data={Object.keys(selectedImages)}
              keyExtractor={(item) => item}
              ListHeaderComponent={
                <>
                  <Text style={styles.headline}>Document the Starting Point</Text>
                  <View style={styles.message}>
                    <MaterialIcons name="warning" size={24} color="#FFA000" />
                    <Text style={styles.subheading}>
                      Before you begin cleaning, please capture and upload at least 3 photos for each area.
                    </Text>
                  </View>
                </>
              }
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.finishButton}
                  onPress={submitCompletion}
                >
                  <Text style={styles.finishButtonText}>Finish Cleaning</Text>
                </TouchableOpacity>
              }
              renderItem={({ item: taskTitle }) => (
                <CardNoPrimary key={taskTitle}>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={styles.roomTitle}>{taskTitle}</Text>
                    <FlatList
                      horizontal
                      data={selectedImages[taskTitle]?.photos || []}
                      keyExtractor={(_, index) => `photo-${index}`}
                      renderItem={({ item: photo, index }) => (
                        <TouchableOpacity 
                          style={styles.thumbnailContainer}
                          onPress={() => handleImagePress(taskTitle, index)}
                        >
                          <Image 
                            source={{ uri: photo.img_url }} 
                            style={styles.preview} 
                            transition={400}
                            cachePolicy="memory-disk"
                          />
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={(e) => handleDelete(scheduleId, taskTitle, photo.img_url, e)}
                          >
                            <Ionicons name="trash" size={18} color="white" />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      )}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.previewContainer}
                    />
                    <View style={styles.tasksContainer}>
                      {selectedImages[taskTitle]?.tasks?.map((task, index) => (
                        <View key={index.toString()} style={styles.taskItem}>
                          {renderTask({ item: task }, taskTitle)}
                        </View>
                      ))}
                    </View>
                    <View style={styles.horizontalLine} />
                    <TouchableOpacity
                      style={styles.sendButton}
                      onPress={() => takePicture(taskTitle)}
                    >
                      <Ionicons name="cloud-upload" size={24} color="gray" />
                      <Text style={styles.addButtonText}>
                        Add photo to {taskTitle}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </CardNoPrimary>
              )}
            />
          )}
        </View>
      ) : (
        <CameraView style={styles.camera} ref={cameraRef}>
          <TouchableOpacity style={styles.closeButton} onPress={onCloseCamera}>
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
          <View style={styles.spinnerContainer}>
            {isUploading ? (
              <ActivityIndicator size="large" color={COLORS.primary} /> 
            ) : (
              <TouchableOpacity 
                style={styles.captureButton} 
                onPress={() => takePicture(selectedTaskTitle)}
              >
                <Ionicons name="camera" size={70} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <View style={{height:200}}>
          <FlatList
            horizontal
            data={photos}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.thumbnailContainer}>
                <Image source={{ uri: item.file }} style={styles.preview} />
                <TouchableOpacity 
                  onPress={() => removePhoto(index)} 
                  style={styles.removeButton}
                >
                  <Ionicons name="trash" size={20} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.previewContainer}
            showsHorizontalScrollIndicator={false}
          />
          </View>
          {photos.length > 0 && (
            <TouchableOpacity 
              onPress={onSubmit} 
              style={styles.buttonContainer1}
              disabled={loading}
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
          )}
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
  headline: { fontSize: 20, fontWeight: 'bold', margin: 10 },
  camera: { flex: 2 },
  
  closeButton: {
    position: 'absolute',
    top: 28,
    right: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
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
    elevation: 3, // Android shadow
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 15,
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









  // container: { flex: 1 },
  // headline: { 
  //   fontSize: 20, 
  //   fontWeight: 'bold', 
  //   margin: 10, 
  //   textAlign: 'center' 
  // },
  // camera: { flex: 1 },
  // closeButton: {
  //   position: 'absolute',
  //   top: 10,
  //   right: 10,
  //   zIndex: 1,
  // },
  // sendButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 10,
  //   backgroundColor: COLORS.lightGray,
  //   borderRadius: 8,
  //   marginTop: 10,
  // },
  // addButtonText: {
  //   marginLeft: 5,
  //   color: COLORS.dark,
  // },
  // horizontalLine: {
  //   borderBottomColor: COLORS.lightGray,
  //   borderBottomWidth: 1,
  //   marginVertical: 10,
  // },
  // roomTitle: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  // },
  // previewContainer: { 
  //   paddingHorizontal: 10,
  // },
  // thumbnailContainer: { 
  //   margin: 5,
  //   position: 'relative',
  // },
  // preview: { 
  //   width: 100, 
  //   height: 100,
  //   borderRadius: 5,
  // },
  // loadingContainer: {
  //   ...StyleSheet.absoluteFillObject,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(255, 255, 255, 0.8)',
  //   zIndex: 10,
  // },
  // finishButton: {
  //   backgroundColor: COLORS.primary,
  //   padding: 15,
  //   borderRadius: 8,
  //   margin: 20,
  //   alignItems: 'center',
  // },
  // finishButtonText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  // },
  // captureButton: {
  //   alignSelf: 'center',
  //   marginTop: '80%',
  // },
  // buttonContainer1: {
  //   backgroundColor: COLORS.primary,
  //   padding: 12,
  //   borderRadius: 25,
  //   margin: 10,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // buttonContent1: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // buttonText1: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   marginLeft: 8,
  // },
  // spinnerContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // removeButton: {
  //   position: 'absolute',
  //   top: 5,
  //   right: 5,
  //   backgroundColor: 'rgba(255, 255, 255, 0.7)',
  //   borderRadius: 15,
  //   padding: 5,
  // },
  // message: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 10,
  //   backgroundColor: '#FFF9C4',
  //   borderRadius: 10,
  //   margin: 10,
  // },
  // subheading: {
  //   flex: 1,
  //   fontSize: 14,
  //   color: '#616161',
  //   marginLeft: 8,
  // },
  // deleteButton: {
  //   position: 'absolute',
  //   top: 5,
  //   right: 5,
  //   backgroundColor: 'rgba(0,0,0,0.6)',
  //   padding: 5,
  //   borderRadius: 15,
  // },
  // fullScreenModal: {
  //   margin: 0,
  // },
  // modalContainer: {
  //   flex: 1,
  //   backgroundColor: 'black',
  // },
  // fullSizeImage: {
  //   flex: 1,
  // },
  // tasksContainer: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 5,
  // },
  // taskItem: {
  //   width: '48%',
  //   marginBottom: 8,
  // },
});

export default BeforePhoto;




























// import React, { useEffect, useContext, useCallback, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
//   FlatList,
//   ScrollView,
// } from 'react-native';
// import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import ImageViewer from 'react-native-image-zoom-viewer';
// import COLORS from '../../constants/colors';
// import userService from '../../services/userService';
// import { AuthContext } from '../../context/AuthContext';
// import { useFocusEffect } from '@react-navigation/native';
// import CardNoPrimary from '../../components/CardNoPrimary';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import CustomActivityIndicator from '../../components/CuustomActivityIndicator';
// import { Image } from 'expo-image'; 
// import Modal from 'react-native-modal';

// const BeforePhoto = ({ scheduleId, tasksList }) => {
//   const cameraRef = useRef(null);
//   const { currentUserId } = useContext(AuthContext);

//   const MAX_IMAGES_UPLOAD = 5
//   const [tasks, setTasks] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isUploading, setIsUploading] = useState(false); // Spinner for uploading state
//   const [selectedImages, setSelectedImages] = useState({});
//   const [selectedTaskTitle, setSelectedTaskTitle] = useState('');
//   const [permission, requestPermission] = useCameraPermissions();
//   const [photos, setPhotos] = useState([]);
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
//   const [currentImages, setCurrentImages] = useState([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);

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
//     // Check if the number of photos exceeds the limit
//     if (photos.length > MAX_IMAGES_UPLOAD) {
//       Alert.alert(
//         'Upload Limit Exceeded',
//         `You can only upload up to ${MAX_IMAGES_UPLOAD} images at a time. Please remove some images before uploading.`
//       );
//       return;
//     }

//     setIsUploading(true); // Start spinner for upload
//     setLoading(true); // Start spinner for upload
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
//       setLoading(false)
//       setIsUploading(false); // Stop spinner
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
//     setPhotos([]); // Empty the photos array
//   };

//   const renderTask = ({ item }, taskTitle) => (
//     <TouchableOpacity
//       style={styles.taskContainer}
//       onPress={() => console.log(`Task selected: ${item}`)}
//     >
//       <Text>{item}</Text>
//     </TouchableOpacity>
//   );

  

//   const deleteImage = async (scheduleId, taskTitle, imageUrl) => {
//     try {
//       Alert.alert(
//         "Delete Image",
//         "Are you sure you want to delete this image?",
//         [
//           { text: "Cancel", style: "cancel" },
//           {
//             text: "Delete",
//             onPress: async () => {
//               try {
//                 const encodedUrl = encodeURIComponent(imageUrl);
//                 const response = await userService.deleteBeforePhoto(
//                   scheduleId, 
//                   taskTitle, 
//                   encodedUrl
//                 );
//                 console.log(response.data.message)
//                 // Handle non-2xx responses
//                 if (!response.ok) {
//                   const errorText = await response.data.text();
//                   throw new Error(errorText || "Delete failed");
//                 }
  
//                 const data = await response.json();
  
//                 // Update state
//                 setSelectedImages(prev => {
//                   const updatedPhotos = prev[taskTitle]?.photos?.filter(
//                     photo => photo.img_url !== imageUrl
//                   ) || [];
  
//                   if (updatedPhotos.length === 0) {
//                     const newState = {...prev};
//                     delete newState[taskTitle];
//                     return newState;
//                   }
  
//                   return {
//                     ...prev,
//                     [taskTitle]: {
//                       ...prev[taskTitle],
//                       photos: updatedPhotos
//                     }
//                   };
//                 });
  
//                 Alert.alert("Success", data.message);
//               } catch (error) {
//                 console.error("Delete error:", error);
//                 Alert.alert(
//                   "Error",
//                   error.message || "Failed to delete image. Please try again."
//                 );
//               }
//             }
//           }
//         ]
//       );
//     } catch (error) {
//       console.error("Unexpected error:", error);
//       Alert.alert("Error", "An unexpected error occurred");
//     }
//   };



//   const handleImagePress = (taskTitle, index) => {
//     // Transform images to the format ImageViewer expects
//     const imagesForViewer = (selectedImages[taskTitle]?.photos || []).map(photo => ({
//       url: photo.img_url,
//       // Add any additional properties needed for the viewer
//       props: {
//         source: { uri: photo.img_url }
//       }
//     }));
    
//     setCurrentImages(imagesForViewer);
//     setCurrentImageIndex(index);
//     setBeforeModalVisible(true);
//   };

//   // Add to your delete button (prevent event bubbling)
//   const handleDelete = (scheduleId, taskTitle, imageUrl, e) => {
//     e.stopPropagation();
//     deleteImage(scheduleId, taskTitle, imageUrl);
//   };

//   return (
//     <View style={styles.container}>

//       {/* Add Modal component here */}
//       <Modal
//         isVisible={isBeforeModalVisible}
//         style={styles.fullScreenModal}
//         onBackdropPress={() => {
//           if (!isDragging) {
//             setBeforeModalVisible(false);
//           }
//         }}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.imageContainer}>
            
//             <ImageViewer
//               imageUrls={currentImages}
//               index={currentImageIndex}
//               backgroundColor="black"
//               enableSwipeDown
//               enableImageZoom
//               saveToLocalByLongPress={false}
//               menuContext={{ saveToLocal: 'Save', cancel: 'Cancel' }}
//               enablePreload={false}
//               enableHorizontalBounce={false}
//               pageAnimateTime={200}
//               flipThreshold={100} // Make harder to accidentally trigger
//               onSwipeDown={() => setBeforeModalVisible(false)}
//               renderImage={(props) => (
//                 <Image
//                   source={{ uri: props.source.uri }}
//                   style={styles.fullSizeImage}
//                   placeholder={require('../../assets/logo_loading.png')}
//                   onError={(error) => console.log('Image load error:', error)}
//                   contentFit="contain"
//                   transition={300}
//                   cachePolicy="memory-disk"
//                 />
//               )}
//               renderFooter={(currentIndex) => (
//                 <View style={styles.footerOverlay}>
//                   {/* <Text style={styles.imageCounter}>
//                     {currentIndex + 1}/{currentImages.length}
//                   </Text> */}
//                 </View>
//               )}
//             />
//           </View>

//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setBeforeModalVisible(false)}
//           >
//             <Ionicons name="close" size={28} color="white" />
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       {!cameraVisible && (
//         <View>
//           {isLoading && (
//               <View style={styles.loadingContainer}>
//               <CustomActivityIndicator 
//                 size={40} 
//                 logo={require('../../assets/logo_loading.png')} // Replace with your logo path
//               />
//             </View>
//           )}
//           {!isLoading && (
//             <ScrollView>
              

//               <Text style={styles.headline}>Document the Starting Point</Text>
              
//               <View style={styles.message}>
//               <View style={styles.iconContainer}>
//                 <MaterialIcons name="warning" size={24} color="#FFA000" />
//               </View>
//               <Text style={styles.subheading}>
//                 Before you begin cleaning, please capture and upload at least 3 photos for each area. This helps ensure transparency and maintain quality standards.
//               </Text>
//             </View>

             

//               {Object.keys(selectedImages).map((taskTitle) => (
//                 <CardNoPrimary key={taskTitle}>
//                   <View style={{ marginBottom: 20 }}>
//                     <Text style={styles.roomTitle}>{taskTitle}</Text>
                    
                    

//                     <FlatList
//                       horizontal
//                       data={selectedImages[taskTitle]?.photos || []}
//                       keyExtractor={(item, index) => `photo-${index}`}
//                       renderItem={({ item: photo, index }) => (
//                         <TouchableOpacity 
//                           style={styles.thumbnailContainer}
//                           onPress={() => handleImagePress(taskTitle, index)}
//                         >
//                           <Image 
//                             source={{ uri: photo.img_url }} 
//                             style={styles.preview} 
//                             transition={400}
//                             cachePolicy="memory-disk"
//                           />
//                           <TouchableOpacity
//                             style={styles.deleteButton}
//                             onPress={(e) => handleDelete(scheduleId, taskTitle, photo.img_url, e)}
//                           >
//                             <Ionicons name="trash" size={18} color="white" />
//                           </TouchableOpacity>
//                         </TouchableOpacity>
//                       )}
//                       showsHorizontalScrollIndicator={false}
//                       contentContainerStyle={styles.previewContainer}
//                     />

//                     <FlatList
//                       data={selectedImages[taskTitle]?.tasks || []}
//                       renderItem={(item) => renderTask(item, taskTitle)}
//                       keyExtractor={(item, index) => index.toString()}
//                       numColumns={2}
//                       columnWrapperStyle={styles.columnWrapper}
//                     />
//                     <View style={styles.horizontalLine} />

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

//                 <TouchableOpacity
//                   style={styles.finishButton}
//                   onPress={submitCompletion}
//                 >
//                   <Text style={styles.finishButtonText}>Finish Cleaning</Text>
//                 </TouchableOpacity>
//             </ScrollView>
//           )}
//         </View>
//       )}

      
      
      
//       {!isLoading && (
//         <FlatList
//           data={Object.keys(selectedImages)}
//           keyExtractor={(item) => item}
//           ListHeaderComponent={
//             <>
//               <Text style={styles.headline}>Document the Starting Point</Text>
//               <View style={styles.message}>
//                 <View style={styles.iconContainer}>
//                   <MaterialIcons name="warning" size={24} color="#FFA000" />
//                 </View>
//                 <Text style={styles.subheading}>
//                   Before you begin cleaning, please capture and upload at least 3 photos for each area...
//                 </Text>
//               </View>
//             </>
//           }
//           ListFooterComponent={
//             <TouchableOpacity
//               style={styles.finishButton}
//               onPress={submitCompletion}
//             >
//               <Text style={styles.finishButtonText}>Finish Cleaning</Text>
//             </TouchableOpacity>
//           }
//           renderItem={({ item: taskTitle }) => (
//             <CardNoPrimary key={taskTitle}>
//               {Object.keys(selectedImages).map((taskTitle) => (
//                 <CardNoPrimary key={taskTitle}>
//                   <View style={{ marginBottom: 20 }}>
//                     <Text style={styles.roomTitle}>{taskTitle}</Text>
                    
                    

//                     <FlatList
//                       horizontal
//                       data={selectedImages[taskTitle]?.photos || []}
//                       keyExtractor={(item, index) => `photo-${index}`}
//                       renderItem={({ item: photo, index }) => (
//                         <TouchableOpacity 
//                           style={styles.thumbnailContainer}
//                           onPress={() => handleImagePress(taskTitle, index)}
//                         >
//                           <Image 
//                             source={{ uri: photo.img_url }} 
//                             style={styles.preview} 
//                             transition={400}
//                             cachePolicy="memory-disk"
//                           />
//                           <TouchableOpacity
//                             style={styles.deleteButton}
//                             onPress={(e) => handleDelete(scheduleId, taskTitle, photo.img_url, e)}
//                           >
//                             <Ionicons name="trash" size={18} color="white" />
//                           </TouchableOpacity>
//                         </TouchableOpacity>
//                       )}
//                       showsHorizontalScrollIndicator={false}
//                       contentContainerStyle={styles.previewContainer}
//                     />

//                     <FlatList
//                       data={selectedImages[taskTitle]?.tasks || []}
//                       renderItem={(item) => renderTask(item, taskTitle)}
//                       keyExtractor={(item, index) => index.toString()}
//                       numColumns={2}
//                       columnWrapperStyle={styles.columnWrapper}
//                     />
//                     <View style={styles.horizontalLine} />

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
//             </CardNoPrimary>
//           )}
//         />
//       )}




      
//       {cameraVisible && (

//         <CameraView style={styles.camera} ref={cameraRef}>
//           <TouchableOpacity style={styles.closeButton} onPress={onCloseCamera}>
//             <Ionicons name="close-circle" size={32} color="white" />
//           </TouchableOpacity>
//           <View style={styles.spinnerContainer}>
//             {isUploading ? ( // Show spinner when uploading
//              <ActivityIndicator size="large" color={COLORS.primary} /> 
//             ) : (
//               <>
//                 <TouchableOpacity style={styles.captureButton} onPress={() => takePicture(selectedTaskTitle)}>
//                   <Ionicons name="camera" size={70} color="white" />
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </CameraView>
//       )}

//       {/* Display thumbnails */}

//         <View style={{height:200}}>
//           <ScrollView horizontal style={styles.previewContainer}>
//             {photos.map((photo, index) => (
//               <View key={index} style={styles.thumbnailContainer}>
//                 <Image source={{ uri: photo.file }} style={styles.preview} />
//                 <TouchableOpacity onPress={() => removePhoto(index)} style={styles.removeButton}>
//                   <Ionicons name="trash" size={20} color={COLORS.gray} />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
          
//           {photos.length > 0 ? 
//           // <TouchableOpacity onPress={onSubmit} style={styles.buttonContainer1}>
//           //   <View style={styles.buttonContent1}>
//           //     <Ionicons name="arrow-up-circle-outline" size={24} color="white" />
//           //     <Text style={styles.buttonText1}>Save Photos</Text>
//           //   </View>
//           // </TouchableOpacity>

//           <TouchableOpacity 
//             onPress={onSubmit} 
//             style={styles.buttonContainer1}
//             disabled={loading} // Disable button when loading
//           >
//             <View style={styles.buttonContent1}>
//               {loading ? (
//                 <ActivityIndicator size="small" color="white" />
//               ) : (
//                 <>
//                   <Ionicons name="arrow-up-circle-outline" size={24} color="white" />
//                   <Text style={styles.buttonText1}>Save Photos</Text>
//                 </>
//               )}
//             </View>
//           </TouchableOpacity>
//           :
//             ""
//           }
//           </View>
        
//         </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   headline: { fontSize: 20, fontWeight: 'bold', margin: 10 },
//   camera: { flex: 1 },
  
//   closeButton: {
//     position: 'absolute',
//     top: 28,
//     right: 24,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   sendButton: { alignItems: 'left' },
//   sendButtonContent: { flexDirection: 'row', alignItems: 'center'},
//   sendButtonText: { color: 'white', fontSize: 16 },
//   addButtonText: { fontSize: 14, marginLeft: 5 },
  
//   horizontalLine: {
//     borderBottomColor: COLORS.light_gray_1,
//     borderBottomWidth: 1,
//     marginVertical: 10,
//   },
//   roomTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 0,
//   },
//   previewContainer: { 
//     flexDirection: 'row',
//   },
//   thumbnailContainer: { 
//     margin: 5 
//   },
//   preview: { 
//     width: 100, 
//     height: 100,
//     borderRadius:5
//   },
//   loadingContainer: {
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     position: 'absolute', 
//     top: 100, 
//     left: 0, 
//     right: 0, 
//     bottom: 0, 
//     backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background
//     zIndex: 10, // Ensure it appears above other content
//   },
//   finishButton: {
//     backgroundColor: COLORS.success,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginVertical: 20,
//     marginHorizontal: 10,
//   },
//   finishButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   captureButton:{
//     marginTop:'80%'
//   },
//   buttonContainer1: {
//     backgroundColor: 'green', // Set button container color
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row', // Arrange icon and text horizontally
//     borderRadius:50
//   },
//   buttonContent1: {
//     flexDirection: 'row', // Align icon and text horizontally
//     alignItems: 'center',
//   },
//   buttonText1: {
//     color: 'white', // Text color
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 8, // Add space between icon and text
//   },
//   spinnerContainer:{
//     flex:1,
//     justifyContent:'center',
//     alignItems:'center'
//   },
//   removeButton: {
//     position: 'absolute', // Position the trash button absolutely
//     top: 5, // Distance from the top
//     right: 5, // Distance from the right
//     backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional: Adds background color to make it more visible
//     borderRadius: 15, // Optional: Makes the background round
//     padding: 5, // Optional: Increases clickable area
//   },
//   message: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     padding: 10,
//     backgroundColor: '#FFF9C4',
//     borderRadius: 10,
//     margin: 5,
//   },
//   iconContainer: {
//     marginRight: 8,
//     marginTop: 2, // Adjust for vertical alignment
//   },
//   subheading: {
//     flex: 1,
//     fontSize: 14,
//     color: '#616161', // Gray text for contrast
//     lineHeight: 18,
//   },
//   deleteButton: {
//     position: 'absolute',
//     elevation: 3, // Android shadow
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 5,
//     borderRadius: 15,
//   },
//   // Modal styles
//   fullScreenModal: {
//     margin: 0,
//     justifyContent: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   imageContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   fullSizeImage: {
//     width: '100%',
//     height: '100%',
//   },
//   footerOverlay: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 5,
//     borderRadius: 5,
//   },
//   imageCounter: {
//     color: 'white',
//     fontSize: 16,
//     marginLeft:100
//   },
  
// });

// export default BeforePhoto;














// "checklist": {
//   "Bedroom": {
//     "photos": [
//       {
//         "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/6bbec91e64ed49459eb65761f16bc4fa.jpg",
//         "filename": "6bbec91e64ed49459eb65761f16bc4fa.jpg",
//         "extension": "jpg",
//         "size": 5484186,
//         "cleanliness": {
//           "scores": {
//             "bed_making": 6.03,
//             "clutter": 5.97,
//             "linen_cleanliness": 8.03,
//             "floor_cleanliness": 8.01,
//             "dust": 7.1,
//             "trash": 7.44,
//             "odor": 8.37,
//             "personal_items_organization": 5.31,
//             "pillow_arrangement": 5.22,
//             "curtain_drapes_cleanliness": 6.05,
//             "under_bed_cleanliness": 7.4,
//             "closet_organization": 5.58,
//             "wall_ceiling_cleanliness": 4.65,
//             "lighting_condition": 5.74,
//             "sanitation": 6.83,
//             "mirror_cleanliness": 6.81,
//             "tile_grout": 3.65,
//             "toilet_cleanliness": 4.36,
//             "supply_organization": 7.69,
//             "sink_cleanliness": 6.47,
//             "showerhead_cleanliness": 6.28,
//             "cabinet_organization": 8.17,
//             "soap_shampoo_availability": 4.04,
//             "appliance_cleanliness": 7.1,
//             "counter_organization": 5.89,
//             "dish_cleanliness": 4.24,
//             "trash_management": 7.9,
//             "food_storage": 4.63,
//             "pest_signs": 5.29,
//             "debris": 5.6,
//             "weed_control": 7.47,
//             "path_cleanliness": 7.51,
//             "drainage": 5.66,
//             "exterior_walls": 7.04,
//             "lighting_cleanliness": 7.33,
//             "desk_organization": 4.65,
//             "tech_cleanliness": 5.15,
//             "air_quality": 5.74,
//             "document_management": 4.93,
//             "trash_recycling": 3.63,
//             "machine_hygiene": 7.99,
//             "lint_management": 7.55,
//             "odor_control": 5.27,
//             "mold_prevention": 6.51
//           },
//           "individual_overall": 6.19,
//           "cleanliness_label": "Needs Attention",
//           "problem_area": {
//             "name": "odor",
//             "description": {
//               "type": "general",
//               "severity": "medium"
//             }
//           },
//           "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/6bbec91e64ed49459eb65761f16bc4fa_heatmap.jpg",
//           "spot_count": 1991,
//           "rating_version": "v4.1"
//         }
//       },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/6ba71be75fc9476c93eba9eef2526a83.jpg",
  //       "filename": "6ba71be75fc9476c93eba9eef2526a83.jpg",
  //       "extension": "jpg",
  //       "size": 3908551,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 6.48,
  //           "clutter": 5.67,
  //           "linen_cleanliness": 6.56,
  //           "floor_cleanliness": 5.67,
  //           "dust": 7.58,
  //           "trash": 6.73,
  //           "odor": 6.81,
  //           "personal_items_organization": 3.91,
  //           "pillow_arrangement": 6.03,
  //           "curtain_drapes_cleanliness": 7.09,
  //           "under_bed_cleanliness": 6.34,
  //           "closet_organization": 5.89,
  //           "wall_ceiling_cleanliness": 5.92,
  //           "lighting_condition": 5.49,
  //           "sanitation": 5.66,
  //           "mirror_cleanliness": 6.35,
  //           "tile_grout": 3.22,
  //           "toilet_cleanliness": 5.67,
  //           "supply_organization": 5.22,
  //           "sink_cleanliness": 4.78,
  //           "showerhead_cleanliness": 6.85,
  //           "cabinet_organization": 7.06,
  //           "soap_shampoo_availability": 4.61,
  //           "appliance_cleanliness": 6.16,
  //           "counter_organization": 5.01,
  //           "dish_cleanliness": 3.64,
  //           "trash_management": 5.85,
  //           "food_storage": 4.6,
  //           "pest_signs": 6.05,
  //           "debris": 5.19,
  //           "weed_control": 7.22,
  //           "path_cleanliness": 6.32,
  //           "drainage": 5,
  //           "exterior_walls": 6.64,
  //           "lighting_cleanliness": 5.7,
  //           "desk_organization": 4.49,
  //           "tech_cleanliness": 5.09,
  //           "air_quality": 5.87,
  //           "document_management": 5.32,
  //           "trash_recycling": 5.09,
  //           "machine_hygiene": 4.67,
  //           "lint_management": 6.66,
  //           "odor_control": 5.4,
  //           "mold_prevention": 5.96
  //         },
  //         "individual_overall": 5.72,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "dust",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/6ba71be75fc9476c93eba9eef2526a83_heatmap.jpg",
  //         "spot_count": 2223,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/8175013988f94ef2aaf96c113e199050.jpg",
  //       "filename": "8175013988f94ef2aaf96c113e199050.jpg",
  //       "extension": "jpg",
  //       "size": 3472786,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 5.49,
  //           "clutter": 6.65,
  //           "linen_cleanliness": 7.24,
  //           "floor_cleanliness": 6.39,
  //           "dust": 6.84,
  //           "trash": 7.61,
  //           "odor": 7.88,
  //           "personal_items_organization": 5.77,
  //           "pillow_arrangement": 5.5,
  //           "curtain_drapes_cleanliness": 7.23,
  //           "under_bed_cleanliness": 6.85,
  //           "closet_organization": 5.98,
  //           "wall_ceiling_cleanliness": 5.67,
  //           "lighting_condition": 7.03,
  //           "sanitation": 5.27,
  //           "mirror_cleanliness": 7.14,
  //           "tile_grout": 4.29,
  //           "toilet_cleanliness": 4.48,
  //           "supply_organization": 7.74,
  //           "sink_cleanliness": 5.21,
  //           "showerhead_cleanliness": 5.17,
  //           "cabinet_organization": 6.59,
  //           "soap_shampoo_availability": 4.72,
  //           "appliance_cleanliness": 6.89,
  //           "counter_organization": 6.33,
  //           "dish_cleanliness": 4.05,
  //           "trash_management": 7.51,
  //           "food_storage": 4.48,
  //           "pest_signs": 5.28,
  //           "debris": 6.07,
  //           "weed_control": 7.38,
  //           "path_cleanliness": 6.37,
  //           "drainage": 5.68,
  //           "exterior_walls": 6.93,
  //           "lighting_cleanliness": 7.52,
  //           "desk_organization": 3.55,
  //           "tech_cleanliness": 7.2,
  //           "air_quality": 6.21,
  //           "document_management": 6.29,
  //           "trash_recycling": 4.84,
  //           "machine_hygiene": 5.98,
  //           "lint_management": 6.66,
  //           "odor_control": 5.86,
  //           "mold_prevention": 5.26
  //         },
  //         "individual_overall": 6.11,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "odor",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/8175013988f94ef2aaf96c113e199050_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/07a4050cd88149ab93ef8589ecdaafec.jpg",
  //       "filename": "07a4050cd88149ab93ef8589ecdaafec.jpg",
  //       "extension": "jpg",
  //       "size": 6055474,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 7.43,
  //           "clutter": 6.92,
  //           "linen_cleanliness": 8.33,
  //           "floor_cleanliness": 8.94,
  //           "dust": 8.92,
  //           "trash": 8.48,
  //           "odor": 7.6,
  //           "personal_items_organization": 6.54,
  //           "pillow_arrangement": 4.18,
  //           "curtain_drapes_cleanliness": 7.99,
  //           "under_bed_cleanliness": 7.23,
  //           "closet_organization": 8.19,
  //           "wall_ceiling_cleanliness": 7.4,
  //           "lighting_condition": 4.31,
  //           "sanitation": 8,
  //           "mirror_cleanliness": 8.32,
  //           "tile_grout": 3,
  //           "toilet_cleanliness": 6.32,
  //           "supply_organization": 7.29,
  //           "sink_cleanliness": 5.53,
  //           "showerhead_cleanliness": 4.85,
  //           "cabinet_organization": 7.96,
  //           "soap_shampoo_availability": 3.67,
  //           "appliance_cleanliness": 7.9,
  //           "counter_organization": 6.26,
  //           "dish_cleanliness": 6.13,
  //           "trash_management": 6.81,
  //           "food_storage": 5.84,
  //           "pest_signs": 6.32,
  //           "debris": 4.73,
  //           "weed_control": 7.63,
  //           "path_cleanliness": 6.25,
  //           "drainage": 6.45,
  //           "exterior_walls": 8.4,
  //           "lighting_cleanliness": 8.57,
  //           "desk_organization": 4.46,
  //           "tech_cleanliness": 7.61,
  //           "air_quality": 8.15,
  //           "document_management": 7.52,
  //           "trash_recycling": 7.03,
  //           "machine_hygiene": 5.12,
  //           "lint_management": 8.06,
  //           "odor_control": 7.8,
  //           "mold_prevention": 5.09
  //         },
  //         "individual_overall": 6.81,
  //         "cleanliness_label": "Requires Deep Cleaning",
  //         "problem_area": {
  //           "name": "floor_cleanliness",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/07a4050cd88149ab93ef8589ecdaafec_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/aa01a2b965e843dbab4b9a0278198e7e.jpg",
  //       "filename": "aa01a2b965e843dbab4b9a0278198e7e.jpg",
  //       "extension": "jpg",
  //       "size": 5716490,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 7.06,
  //           "clutter": 6.55,
  //           "linen_cleanliness": 6.98,
  //           "floor_cleanliness": 8.4,
  //           "dust": 8.5,
  //           "trash": 7.14,
  //           "odor": 8.65,
  //           "personal_items_organization": 6.26,
  //           "pillow_arrangement": 5.41,
  //           "curtain_drapes_cleanliness": 8.2,
  //           "under_bed_cleanliness": 6.82,
  //           "closet_organization": 6.76,
  //           "wall_ceiling_cleanliness": 7.38,
  //           "lighting_condition": 5.81,
  //           "sanitation": 7.04,
  //           "mirror_cleanliness": 7.45,
  //           "tile_grout": 3.13,
  //           "toilet_cleanliness": 4.85,
  //           "supply_organization": 7.05,
  //           "sink_cleanliness": 4.97,
  //           "showerhead_cleanliness": 5.3,
  //           "cabinet_organization": 7.55,
  //           "soap_shampoo_availability": 3.47,
  //           "appliance_cleanliness": 7.61,
  //           "counter_organization": 6.33,
  //           "dish_cleanliness": 6.15,
  //           "trash_management": 8.15,
  //           "food_storage": 5.1,
  //           "pest_signs": 7.52,
  //           "debris": 5.31,
  //           "weed_control": 6.68,
  //           "path_cleanliness": 6.82,
  //           "drainage": 4.83,
  //           "exterior_walls": 8.74,
  //           "lighting_cleanliness": 7.18,
  //           "desk_organization": 4.72,
  //           "tech_cleanliness": 4.73,
  //           "air_quality": 7.79,
  //           "document_management": 5.86,
  //           "trash_recycling": 6.91,
  //           "machine_hygiene": 6.36,
  //           "lint_management": 7.47,
  //           "odor_control": 6.79,
  //           "mold_prevention": 6.8
  //         },
  //         "individual_overall": 6.56,
  //         "cleanliness_label": "Requires Deep Cleaning",
  //         "problem_area": {
  //           "name": "exterior_walls",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/aa01a2b965e843dbab4b9a0278198e7e_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/46675a8b282a43419e27a582f6244cda.jpg",
  //       "filename": "46675a8b282a43419e27a582f6244cda.jpg",
  //       "extension": "jpg",
  //       "size": 3921144,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 6.78,
  //           "clutter": 6.54,
  //           "linen_cleanliness": 8.06,
  //           "floor_cleanliness": 7.61,
  //           "dust": 7.55,
  //           "trash": 6.84,
  //           "odor": 8.5,
  //           "personal_items_organization": 5.48,
  //           "pillow_arrangement": 6.06,
  //           "curtain_drapes_cleanliness": 7.04,
  //           "under_bed_cleanliness": 7.8,
  //           "closet_organization": 6.42,
  //           "wall_ceiling_cleanliness": 5.66,
  //           "lighting_condition": 6.16,
  //           "sanitation": 6.3,
  //           "mirror_cleanliness": 8.78,
  //           "tile_grout": 4.53,
  //           "toilet_cleanliness": 4.04,
  //           "supply_organization": 7.01,
  //           "sink_cleanliness": 6.53,
  //           "showerhead_cleanliness": 6.28,
  //           "cabinet_organization": 8.16,
  //           "soap_shampoo_availability": 5.53,
  //           "appliance_cleanliness": 7.4,
  //           "counter_organization": 6.84,
  //           "dish_cleanliness": 5.18,
  //           "trash_management": 7.16,
  //           "food_storage": 5.43,
  //           "pest_signs": 6.98,
  //           "debris": 6.45,
  //           "weed_control": 7.4,
  //           "path_cleanliness": 7.39,
  //           "drainage": 5.1,
  //           "exterior_walls": 7.85,
  //           "lighting_cleanliness": 8.01,
  //           "desk_organization": 3.15,
  //           "tech_cleanliness": 7.6,
  //           "air_quality": 7.33,
  //           "document_management": 7.07,
  //           "trash_recycling": 6.29,
  //           "machine_hygiene": 6.05,
  //           "lint_management": 7.14,
  //           "odor_control": 7.25,
  //           "mold_prevention": 6
  //         },
  //         "individual_overall": 6.65,
  //         "cleanliness_label": "Requires Deep Cleaning",
  //         "problem_area": {
  //           "name": "mirror_cleanliness",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/46675a8b282a43419e27a582f6244cda_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/be757e37ea854f70a40725dd059661e3.jpg",
  //       "filename": "be757e37ea854f70a40725dd059661e3.jpg",
  //       "extension": "jpg",
  //       "size": 5504336,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 5.79,
  //           "clutter": 5.8,
  //           "linen_cleanliness": 6.54,
  //           "floor_cleanliness": 8.33,
  //           "dust": 6.65,
  //           "trash": 6.78,
  //           "odor": 8.51,
  //           "personal_items_organization": 6.92,
  //           "pillow_arrangement": 6.31,
  //           "curtain_drapes_cleanliness": 6.74,
  //           "under_bed_cleanliness": 6.67,
  //           "closet_organization": 4.99,
  //           "wall_ceiling_cleanliness": 5.45,
  //           "lighting_condition": 7.22,
  //           "sanitation": 6.83,
  //           "mirror_cleanliness": 5.91,
  //           "tile_grout": 2.34,
  //           "toilet_cleanliness": 3.61,
  //           "supply_organization": 7.64,
  //           "sink_cleanliness": 7.03,
  //           "showerhead_cleanliness": 6.52,
  //           "cabinet_organization": 7.31,
  //           "soap_shampoo_availability": 5.87,
  //           "appliance_cleanliness": 7.21,
  //           "counter_organization": 5.01,
  //           "dish_cleanliness": 3.44,
  //           "trash_management": 7.88,
  //           "food_storage": 6.3,
  //           "pest_signs": 4.84,
  //           "debris": 5.13,
  //           "weed_control": 7.41,
  //           "path_cleanliness": 6.08,
  //           "drainage": 4,
  //           "exterior_walls": 6.96,
  //           "lighting_cleanliness": 8.18,
  //           "desk_organization": 2.49,
  //           "tech_cleanliness": 3.22,
  //           "air_quality": 5.07,
  //           "document_management": 4.85,
  //           "trash_recycling": 5.7,
  //           "machine_hygiene": 7.79,
  //           "lint_management": 6.57,
  //           "odor_control": 3.55,
  //           "mold_prevention": 6.79
  //         },
  //         "individual_overall": 6.01,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "odor",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/be757e37ea854f70a40725dd059661e3_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/e52239e847ef4512a5621f7c45f4480a.jpg",
  //       "filename": "e52239e847ef4512a5621f7c45f4480a.jpg",
  //       "extension": "jpg",
  //       "size": 3563026,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 7.37,
  //           "clutter": 6.14,
  //           "linen_cleanliness": 6.97,
  //           "floor_cleanliness": 8.31,
  //           "dust": 8.76,
  //           "trash": 6.28,
  //           "odor": 8.16,
  //           "personal_items_organization": 6.99,
  //           "pillow_arrangement": 6.56,
  //           "curtain_drapes_cleanliness": 8.27,
  //           "under_bed_cleanliness": 4.71,
  //           "closet_organization": 6.07,
  //           "wall_ceiling_cleanliness": 7.37,
  //           "lighting_condition": 5.45,
  //           "sanitation": 5.93,
  //           "mirror_cleanliness": 7.67,
  //           "tile_grout": 4.01,
  //           "toilet_cleanliness": 4.55,
  //           "supply_organization": 7.19,
  //           "sink_cleanliness": 5.65,
  //           "showerhead_cleanliness": 4.25,
  //           "cabinet_organization": 7.69,
  //           "soap_shampoo_availability": 5.92,
  //           "appliance_cleanliness": 7.52,
  //           "counter_organization": 7.4,
  //           "dish_cleanliness": 6.21,
  //           "trash_management": 7.87,
  //           "food_storage": 5.15,
  //           "pest_signs": 7.57,
  //           "debris": 6.36,
  //           "weed_control": 6.74,
  //           "path_cleanliness": 7.35,
  //           "drainage": 5.15,
  //           "exterior_walls": 8.05,
  //           "lighting_cleanliness": 6.03,
  //           "desk_organization": 5.66,
  //           "tech_cleanliness": 5.42,
  //           "air_quality": 7.36,
  //           "document_management": 6.25,
  //           "trash_recycling": 6.68,
  //           "machine_hygiene": 4.99,
  //           "lint_management": 6.1,
  //           "odor_control": 7.98,
  //           "mold_prevention": 5.77
  //         },
  //         "individual_overall": 6.54,
  //         "cleanliness_label": "Requires Deep Cleaning",
  //         "problem_area": {
  //           "name": "dust",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/e52239e847ef4512a5621f7c45f4480a_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/66ad808205c745488c996efe2557283e.jpg",
  //       "filename": "66ad808205c745488c996efe2557283e.jpg",
  //       "extension": "jpg",
  //       "size": 705510,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 5.24,
  //           "clutter": 5.44,
  //           "linen_cleanliness": 6.57,
  //           "floor_cleanliness": 7.26,
  //           "dust": 7.45,
  //           "trash": 6.97,
  //           "odor": 7.13,
  //           "personal_items_organization": 5,
  //           "pillow_arrangement": 5.04,
  //           "curtain_drapes_cleanliness": 6.15,
  //           "under_bed_cleanliness": 4.37,
  //           "closet_organization": 7.07,
  //           "wall_ceiling_cleanliness": 5.91,
  //           "lighting_condition": 4.36,
  //           "sanitation": 7.15,
  //           "mirror_cleanliness": 6.32,
  //           "tile_grout": 3.01,
  //           "toilet_cleanliness": 4.05,
  //           "supply_organization": 5.81,
  //           "sink_cleanliness": 4.91,
  //           "showerhead_cleanliness": 6.75,
  //           "cabinet_organization": 7.46,
  //           "soap_shampoo_availability": 2.91,
  //           "appliance_cleanliness": 6.7,
  //           "counter_organization": 4.94,
  //           "dish_cleanliness": 4.68,
  //           "trash_management": 5.5,
  //           "food_storage": 4.32,
  //           "pest_signs": 4.79,
  //           "debris": 4.22,
  //           "weed_control": 5.36,
  //           "path_cleanliness": 5.72,
  //           "drainage": 4.28,
  //           "exterior_walls": 6.03,
  //           "lighting_cleanliness": 7.68,
  //           "desk_organization": 3.93,
  //           "tech_cleanliness": 4.59,
  //           "air_quality": 6.06,
  //           "document_management": 4.45,
  //           "trash_recycling": 4.35,
  //           "machine_hygiene": 5.05,
  //           "lint_management": 6.43,
  //           "odor_control": 6.13,
  //           "mold_prevention": 6.07
  //         },
  //         "individual_overall": 5.54,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "lighting_cleanliness",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/66ad808205c745488c996efe2557283e_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/bd1b05b771f64d4d8eb8cb056323b88c.jpg",
  //       "filename": "bd1b05b771f64d4d8eb8cb056323b88c.jpg",
  //       "extension": "jpg",
  //       "size": 758649,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 5.34,
  //           "clutter": 6.88,
  //           "linen_cleanliness": 7.68,
  //           "floor_cleanliness": 7.38,
  //           "dust": 7.97,
  //           "trash": 7.09,
  //           "odor": 8.46,
  //           "personal_items_organization": 5.34,
  //           "pillow_arrangement": 6.05,
  //           "curtain_drapes_cleanliness": 7.13,
  //           "under_bed_cleanliness": 7.54,
  //           "closet_organization": 5.45,
  //           "wall_ceiling_cleanliness": 5.38,
  //           "lighting_condition": 7.37,
  //           "sanitation": 6.46,
  //           "mirror_cleanliness": 6.45,
  //           "tile_grout": 2.06,
  //           "toilet_cleanliness": 4.81,
  //           "supply_organization": 7.09,
  //           "sink_cleanliness": 5.65,
  //           "showerhead_cleanliness": 6.69,
  //           "cabinet_organization": 7.36,
  //           "soap_shampoo_availability": 5.02,
  //           "appliance_cleanliness": 7.42,
  //           "counter_organization": 6.81,
  //           "dish_cleanliness": 3.86,
  //           "trash_management": 8.18,
  //           "food_storage": 4.24,
  //           "pest_signs": 6.73,
  //           "debris": 5.87,
  //           "weed_control": 7.61,
  //           "path_cleanliness": 7.22,
  //           "drainage": 5.67,
  //           "exterior_walls": 7.28,
  //           "lighting_cleanliness": 7.84,
  //           "desk_organization": 3.15,
  //           "tech_cleanliness": 5.22,
  //           "air_quality": 6.13,
  //           "document_management": 5.73,
  //           "trash_recycling": 5.48,
  //           "machine_hygiene": 7.41,
  //           "lint_management": 7.36,
  //           "odor_control": 5.12,
  //           "mold_prevention": 6.07
  //         },
  //         "individual_overall": 6.3,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "odor",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/bd1b05b771f64d4d8eb8cb056323b88c_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/61f07c45a1ce4c12b2c75c8880abcbe7.jpg",
  //       "filename": "61f07c45a1ce4c12b2c75c8880abcbe7.jpg",
  //       "extension": "jpg",
  //       "size": 566443,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 5.99,
  //           "clutter": 6.86,
  //           "linen_cleanliness": 6.77,
  //           "floor_cleanliness": 7.6,
  //           "dust": 7.23,
  //           "trash": 6.39,
  //           "odor": 7.83,
  //           "personal_items_organization": 6.05,
  //           "pillow_arrangement": 5.52,
  //           "curtain_drapes_cleanliness": 7.24,
  //           "under_bed_cleanliness": 5.14,
  //           "closet_organization": 6.21,
  //           "wall_ceiling_cleanliness": 5.92,
  //           "lighting_condition": 5.87,
  //           "sanitation": 6.91,
  //           "mirror_cleanliness": 6.97,
  //           "tile_grout": 3.73,
  //           "toilet_cleanliness": 3.28,
  //           "supply_organization": 7.47,
  //           "sink_cleanliness": 5.8,
  //           "showerhead_cleanliness": 4.28,
  //           "cabinet_organization": 8.12,
  //           "soap_shampoo_availability": 5.36,
  //           "appliance_cleanliness": 6.91,
  //           "counter_organization": 6.31,
  //           "dish_cleanliness": 4.9,
  //           "trash_management": 7.06,
  //           "food_storage": 5.71,
  //           "pest_signs": 5.28,
  //           "debris": 5.41,
  //           "weed_control": 7.69,
  //           "path_cleanliness": 5.66,
  //           "drainage": 5.44,
  //           "exterior_walls": 7.24,
  //           "lighting_cleanliness": 7,
  //           "desk_organization": 4.52,
  //           "tech_cleanliness": 5.17,
  //           "air_quality": 6.86,
  //           "document_management": 5.33,
  //           "trash_recycling": 6.63,
  //           "machine_hygiene": 5.89,
  //           "lint_management": 6.89,
  //           "odor_control": 6.77,
  //           "mold_prevention": 5
  //         },
  //         "individual_overall": 6.14,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "cabinet_organization",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/61f07c45a1ce4c12b2c75c8880abcbe7_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/84d4f6131da044809e30a15813d083f3.jpg",
  //       "filename": "84d4f6131da044809e30a15813d083f3.jpg",
  //       "extension": "jpg",
  //       "size": 162994,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 6.18,
  //           "clutter": 6.85,
  //           "linen_cleanliness": 7.91,
  //           "floor_cleanliness": 7.5,
  //           "dust": 7.96,
  //           "trash": 7.39,
  //           "odor": 8.11,
  //           "personal_items_organization": 5.56,
  //           "pillow_arrangement": 6.61,
  //           "curtain_drapes_cleanliness": 7.55,
  //           "under_bed_cleanliness": 7.38,
  //           "closet_organization": 6.64,
  //           "wall_ceiling_cleanliness": 6.1,
  //           "lighting_condition": 6.48,
  //           "sanitation": 5.52,
  //           "mirror_cleanliness": 7.38,
  //           "tile_grout": 3.9,
  //           "toilet_cleanliness": 4.53,
  //           "supply_organization": 7.55,
  //           "sink_cleanliness": 5.46,
  //           "showerhead_cleanliness": 4.93,
  //           "cabinet_organization": 7.19,
  //           "soap_shampoo_availability": 4.72,
  //           "appliance_cleanliness": 7.47,
  //           "counter_organization": 7.25,
  //           "dish_cleanliness": 5.53,
  //           "trash_management": 7.68,
  //           "food_storage": 4.18,
  //           "pest_signs": 6.96,
  //           "debris": 5.95,
  //           "weed_control": 7.19,
  //           "path_cleanliness": 7.35,
  //           "drainage": 6.25,
  //           "exterior_walls": 7.67,
  //           "lighting_cleanliness": 8.24,
  //           "desk_organization": 3.64,
  //           "tech_cleanliness": 7.37,
  //           "air_quality": 6.02,
  //           "document_management": 7.36,
  //           "trash_recycling": 4.88,
  //           "machine_hygiene": 5.91,
  //           "lint_management": 6.84,
  //           "odor_control": 7.11,
  //           "mold_prevention": 5.2
  //         },
  //         "individual_overall": 6.49,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "lighting_cleanliness",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/84d4f6131da044809e30a15813d083f3_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/87bd5b38a9cf4f22b49d8710a021be71.jpg",
  //       "filename": "87bd5b38a9cf4f22b49d8710a021be71.jpg",
  //       "extension": "jpg",
  //       "size": 163989,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 5.77,
  //           "clutter": 7.08,
  //           "linen_cleanliness": 8.46,
  //           "floor_cleanliness": 6.99,
  //           "dust": 7.45,
  //           "trash": 7.78,
  //           "odor": 8.62,
  //           "personal_items_organization": 5.62,
  //           "pillow_arrangement": 4.7,
  //           "curtain_drapes_cleanliness": 6.97,
  //           "under_bed_cleanliness": 7.61,
  //           "closet_organization": 5.72,
  //           "wall_ceiling_cleanliness": 5.63,
  //           "lighting_condition": 7.05,
  //           "sanitation": 6.62,
  //           "mirror_cleanliness": 7.85,
  //           "tile_grout": 3.8,
  //           "toilet_cleanliness": 4.64,
  //           "supply_organization": 8.02,
  //           "sink_cleanliness": 5.75,
  //           "showerhead_cleanliness": 5.69,
  //           "cabinet_organization": 7.37,
  //           "soap_shampoo_availability": 4.11,
  //           "appliance_cleanliness": 7.62,
  //           "counter_organization": 7.22,
  //           "dish_cleanliness": 5.34,
  //           "trash_management": 8.28,
  //           "food_storage": 4.28,
  //           "pest_signs": 6.38,
  //           "debris": 7.54,
  //           "weed_control": 7.18,
  //           "path_cleanliness": 7.47,
  //           "drainage": 5.75,
  //           "exterior_walls": 7.16,
  //           "lighting_cleanliness": 8.26,
  //           "desk_organization": 3.35,
  //           "tech_cleanliness": 7.73,
  //           "air_quality": 7.11,
  //           "document_management": 6.8,
  //           "trash_recycling": 5.11,
  //           "machine_hygiene": 6.55,
  //           "lint_management": 7.18,
  //           "odor_control": 7.02,
  //           "mold_prevention": 5.54
  //         },
  //         "individual_overall": 6.55,
  //         "cleanliness_label": "Requires Deep Cleaning",
  //         "problem_area": {
  //           "name": "odor",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/87bd5b38a9cf4f22b49d8710a021be71_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/a7bcf6d1909549f08f09bb123d873668.jpg",
  //       "filename": "a7bcf6d1909549f08f09bb123d873668.jpg",
  //       "extension": "jpg",
  //       "size": 165318,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 7.98,
  //           "clutter": 6.89,
  //           "linen_cleanliness": 8.3,
  //           "floor_cleanliness": 7.92,
  //           "dust": 9.03,
  //           "trash": 6.22,
  //           "odor": 7.36,
  //           "personal_items_organization": 6.74,
  //           "pillow_arrangement": 5.92,
  //           "curtain_drapes_cleanliness": 7.97,
  //           "under_bed_cleanliness": 7.47,
  //           "closet_organization": 5.62,
  //           "wall_ceiling_cleanliness": 6.22,
  //           "lighting_condition": 5.69,
  //           "sanitation": 6.96,
  //           "mirror_cleanliness": 8.52,
  //           "tile_grout": 3.77,
  //           "toilet_cleanliness": 4.97,
  //           "supply_organization": 6.06,
  //           "sink_cleanliness": 5.78,
  //           "showerhead_cleanliness": 4.95,
  //           "cabinet_organization": 8.55,
  //           "soap_shampoo_availability": 4.61,
  //           "appliance_cleanliness": 7.55,
  //           "counter_organization": 6.66,
  //           "dish_cleanliness": 7.12,
  //           "trash_management": 7.63,
  //           "food_storage": 5.41,
  //           "pest_signs": 6.68,
  //           "debris": 6.51,
  //           "weed_control": 7.76,
  //           "path_cleanliness": 6.72,
  //           "drainage": 4.77,
  //           "exterior_walls": 9.07,
  //           "lighting_cleanliness": 6.17,
  //           "desk_organization": 5.82,
  //           "tech_cleanliness": 7.1,
  //           "air_quality": 8.63,
  //           "document_management": 6.58,
  //           "trash_recycling": 6,
  //           "machine_hygiene": 6.32,
  //           "lint_management": 6.9,
  //           "odor_control": 7.9,
  //           "mold_prevention": 7.59
  //         },
  //         "individual_overall": 6.78,
  //         "cleanliness_label": "Requires Deep Cleaning",
  //         "problem_area": {
  //           "name": "exterior_walls",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/a7bcf6d1909549f08f09bb123d873668_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/988ce2951cc14ed59608f298dd793abe.jpg",
  //       "filename": "988ce2951cc14ed59608f298dd793abe.jpg",
  //       "extension": "jpg",
  //       "size": 229187,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 6.47,
  //           "clutter": 6.31,
  //           "linen_cleanliness": 6.4,
  //           "floor_cleanliness": 7.03,
  //           "dust": 7.34,
  //           "trash": 5.57,
  //           "odor": 5.92,
  //           "personal_items_organization": 4.69,
  //           "pillow_arrangement": 5.63,
  //           "curtain_drapes_cleanliness": 6.31,
  //           "under_bed_cleanliness": 5.97,
  //           "closet_organization": 6.7,
  //           "wall_ceiling_cleanliness": 5.28,
  //           "lighting_condition": 5.52,
  //           "sanitation": 5.27,
  //           "mirror_cleanliness": 7.17,
  //           "tile_grout": 3.64,
  //           "toilet_cleanliness": 5.09,
  //           "supply_organization": 4.49,
  //           "sink_cleanliness": 4.84,
  //           "showerhead_cleanliness": 5.32,
  //           "cabinet_organization": 5.83,
  //           "soap_shampoo_availability": 4.6,
  //           "appliance_cleanliness": 5.07,
  //           "counter_organization": 5,
  //           "dish_cleanliness": 5.91,
  //           "trash_management": 5.52,
  //           "food_storage": 5.68,
  //           "pest_signs": 6.41,
  //           "debris": 5.5,
  //           "weed_control": 5.11,
  //           "path_cleanliness": 6.08,
  //           "drainage": 6.38,
  //           "exterior_walls": 7.19,
  //           "lighting_cleanliness": 6.98,
  //           "desk_organization": 4.47,
  //           "tech_cleanliness": 6.32,
  //           "air_quality": 5.23,
  //           "document_management": 7.03,
  //           "trash_recycling": 6.82,
  //           "machine_hygiene": 3.73,
  //           "lint_management": 7.02,
  //           "odor_control": 6.1,
  //           "mold_prevention": 5.04
  //         },
  //         "individual_overall": 5.77,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "dust",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/988ce2951cc14ed59608f298dd793abe_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     }
  //   ],
  //   "tasks": [
  //     {
  //       "label": "Change linens",
  //       "value": true,
  //       "name": "change_linens_bedroom",
  //       "id": "task_01"
  //     },
  //     {
  //       "label": "Make the bed",
  //       "value": true,
  //       "name": "make_bed_bedroom",
  //       "id": "task_02"
  //     },
  //     {
  //       "label": "Dust surfaces",
  //       "value": true,
  //       "name": "dust_surfaces_bedroom",
  //       "id": "task_03"
  //     },
  //     {
  //       "label": "Vacuum carpet",
  //       "value": true,
  //       "name": "vacuum_carpet_bedroom",
  //       "id": "task_04"
  //     },
  //     {
  //       "label": "Organize closet",
  //       "value": true,
  //       "name": "organize_closet_bedroom",
  //       "id": "task_05"
  //     },
  //     {
  //       "label": "Check for damages",
  //       "value": false,
  //       "name": "check_damages_bedroom",
  //       "id": "task_06"
  //     }
  //   ]
  // },
  // "Bathroom": {
  //   "photos": [
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/a4799e84b15244c6bf76d9df011671b6.jpg",
  //       "filename": "a4799e84b15244c6bf76d9df011671b6.jpg",
  //       "extension": "jpg",
  //       "size": 534197,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 5.05,
  //           "clutter": 6.46,
  //           "linen_cleanliness": 6.49,
  //           "floor_cleanliness": 5.33,
  //           "dust": 7.27,
  //           "trash": 6.16,
  //           "odor": 7.01,
  //           "personal_items_organization": 5.89,
  //           "pillow_arrangement": 5.81,
  //           "curtain_drapes_cleanliness": 6.35,
  //           "under_bed_cleanliness": 6.01,
  //           "closet_organization": 5.15,
  //           "wall_ceiling_cleanliness": 6.27,
  //           "lighting_condition": 6.89,
  //           "sanitation": 5.72,
  //           "mirror_cleanliness": 5.96,
  //           "tile_grout": 3.14,
  //           "toilet_cleanliness": 4.74,
  //           "supply_organization": 5.95,
  //           "sink_cleanliness": 4.61,
  //           "showerhead_cleanliness": 5.43,
  //           "cabinet_organization": 6.74,
  //           "soap_shampoo_availability": 4.5,
  //           "appliance_cleanliness": 5.34,
  //           "counter_organization": 6.05,
  //           "dish_cleanliness": 4.72,
  //           "trash_management": 6.54,
  //           "food_storage": 4.69,
  //           "pest_signs": 6.42,
  //           "debris": 6.15,
  //           "weed_control": 5.98,
  //           "path_cleanliness": 5.92,
  //           "drainage": 4.86,
  //           "exterior_walls": 7.18,
  //           "lighting_cleanliness": 5.69,
  //           "desk_organization": 4.24,
  //           "tech_cleanliness": 5.22,
  //           "air_quality": 6.26,
  //           "document_management": 5.33,
  //           "trash_recycling": 5.08,
  //           "machine_hygiene": 5.72,
  //           "lint_management": 5.84,
  //           "odor_control": 5.33,
  //           "mold_prevention": 5.56
  //         },
  //         "individual_overall": 5.71,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "dust",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/a4799e84b15244c6bf76d9df011671b6_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/7e2a90cb39994d9ab028c002c27e7070.jpg",
  //       "filename": "7e2a90cb39994d9ab028c002c27e7070.jpg",
  //       "extension": "jpg",
  //       "size": 517543,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 6.9,
  //           "clutter": 4.72,
  //           "linen_cleanliness": 6.06,
  //           "floor_cleanliness": 6.28,
  //           "dust": 8.38,
  //           "trash": 7.07,
  //           "odor": 5.74,
  //           "personal_items_organization": 6.4,
  //           "pillow_arrangement": 5.5,
  //           "curtain_drapes_cleanliness": 8,
  //           "under_bed_cleanliness": 5.94,
  //           "closet_organization": 5.51,
  //           "wall_ceiling_cleanliness": 7.25,
  //           "lighting_condition": 7.87,
  //           "sanitation": 5.91,
  //           "mirror_cleanliness": 7.85,
  //           "tile_grout": 3.33,
  //           "toilet_cleanliness": 5.44,
  //           "supply_organization": 5.42,
  //           "sink_cleanliness": 5.53,
  //           "showerhead_cleanliness": 6.7,
  //           "cabinet_organization": 6.28,
  //           "soap_shampoo_availability": 5.14,
  //           "appliance_cleanliness": 6.91,
  //           "counter_organization": 5.75,
  //           "dish_cleanliness": 4.13,
  //           "trash_management": 7.25,
  //           "food_storage": 5.65,
  //           "pest_signs": 6.31,
  //           "debris": 5.86,
  //           "weed_control": 6.18,
  //           "path_cleanliness": 6.69,
  //           "drainage": 3.43,
  //           "exterior_walls": 8.19,
  //           "lighting_cleanliness": 5.78,
  //           "desk_organization": 2.86,
  //           "tech_cleanliness": 6.28,
  //           "air_quality": 7.94,
  //           "document_management": 5.76,
  //           "trash_recycling": 6.87,
  //           "machine_hygiene": 3.89,
  //           "lint_management": 7.02,
  //           "odor_control": 5.35,
  //           "mold_prevention": 5.54
  //         },
  //         "individual_overall": 6.07,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "dust",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/7e2a90cb39994d9ab028c002c27e7070_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/cb4388b7839d4c53b8564873fa51466c.jpg",
  //       "filename": "cb4388b7839d4c53b8564873fa51466c.jpg",
  //       "extension": "jpg",
  //       "size": 587941,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 5.6,
  //           "clutter": 6.67,
  //           "linen_cleanliness": 6.19,
  //           "floor_cleanliness": 7.74,
  //           "dust": 7.56,
  //           "trash": 6.79,
  //           "odor": 8.41,
  //           "personal_items_organization": 6.05,
  //           "pillow_arrangement": 5.98,
  //           "curtain_drapes_cleanliness": 7.29,
  //           "under_bed_cleanliness": 5.68,
  //           "closet_organization": 5.95,
  //           "wall_ceiling_cleanliness": 6.16,
  //           "lighting_condition": 5.97,
  //           "sanitation": 6.14,
  //           "mirror_cleanliness": 7.61,
  //           "tile_grout": 2.44,
  //           "toilet_cleanliness": 4.9,
  //           "supply_organization": 7.21,
  //           "sink_cleanliness": 4.93,
  //           "showerhead_cleanliness": 5.61,
  //           "cabinet_organization": 6.49,
  //           "soap_shampoo_availability": 4.75,
  //           "appliance_cleanliness": 7.12,
  //           "counter_organization": 5.9,
  //           "dish_cleanliness": 4.76,
  //           "trash_management": 7.45,
  //           "food_storage": 5.38,
  //           "pest_signs": 7.25,
  //           "debris": 5.42,
  //           "weed_control": 5.67,
  //           "path_cleanliness": 5.86,
  //           "drainage": 3.88,
  //           "exterior_walls": 6.96,
  //           "lighting_cleanliness": 6.82,
  //           "desk_organization": 4.1,
  //           "tech_cleanliness": 3.93,
  //           "air_quality": 6.34,
  //           "document_management": 5.6,
  //           "trash_recycling": 6.92,
  //           "machine_hygiene": 6.15,
  //           "lint_management": 4.92,
  //           "odor_control": 6.02,
  //           "mold_prevention": 5.9
  //         },
  //         "individual_overall": 6.01,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "odor",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/cb4388b7839d4c53b8564873fa51466c_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     },
  //     {
  //       "img_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/task_photos/677f772a223bde045c90c683/f1807bf96a1c4ffbb03309263d100561.jpg",
  //       "filename": "f1807bf96a1c4ffbb03309263d100561.jpg",
  //       "extension": "jpg",
  //       "size": 526345,
  //       "cleanliness": {
  //         "scores": {
  //           "bed_making": 6.68,
  //           "clutter": 6.18,
  //           "linen_cleanliness": 7.27,
  //           "floor_cleanliness": 5.52,
  //           "dust": 8.13,
  //           "trash": 5.34,
  //           "odor": 4.66,
  //           "personal_items_organization": 7.32,
  //           "pillow_arrangement": 4.59,
  //           "curtain_drapes_cleanliness": 5.64,
  //           "under_bed_cleanliness": 6.32,
  //           "closet_organization": 5.39,
  //           "wall_ceiling_cleanliness": 4.29,
  //           "lighting_condition": 6.55,
  //           "sanitation": 7.59,
  //           "mirror_cleanliness": 6.92,
  //           "tile_grout": 2.78,
  //           "toilet_cleanliness": 4.13,
  //           "supply_organization": 5.96,
  //           "sink_cleanliness": 5.44,
  //           "showerhead_cleanliness": 4.25,
  //           "cabinet_organization": 7.15,
  //           "soap_shampoo_availability": 4.59,
  //           "appliance_cleanliness": 6.17,
  //           "counter_organization": 6.64,
  //           "dish_cleanliness": 6.47,
  //           "trash_management": 6.67,
  //           "food_storage": 5.97,
  //           "pest_signs": 5.15,
  //           "debris": 7.06,
  //           "weed_control": 5.65,
  //           "path_cleanliness": 5.06,
  //           "drainage": 4.25,
  //           "exterior_walls": 7.57,
  //           "lighting_cleanliness": 4.75,
  //           "desk_organization": 3.58,
  //           "tech_cleanliness": 5.7,
  //           "air_quality": 6.78,
  //           "document_management": 4.76,
  //           "trash_recycling": 6.29,
  //           "machine_hygiene": 6.44,
  //           "lint_management": 5.25,
  //           "odor_control": 6.8,
  //           "mold_prevention": 6.52
  //         },
  //         "individual_overall": 5.82,
  //         "cleanliness_label": "Needs Attention",
  //         "problem_area": {
  //           "name": "dust",
  //           "description": {
  //             "type": "general",
  //             "severity": "medium"
  //           }
  //         },
  //         "heatmap_url": "https://freshsweeper.nyc3.digitaloceanspaces.com/heatmaps/677f772a223bde045c90c683/f1807bf96a1c4ffbb03309263d100561_heatmap.jpg",
  //         "spot_count": 20,
  //         "rating_version": "v4.1"
  //       }
  //     }
  //   ],
  //   "tasks": [
  //     {
  //       "label": "Clean toilet",
  //       "value": true,
  //       "name": "clean_toilet_bathroom",
  //       "id": "task_07"
  //     },
  //     {
  //       "label": "Wipe mirrors",
  //       "value": true,
  //       "name": "wipe_mirrors_bathroom",
  //       "id": "task_08"
  //     },
  //     {
  //       "label": "Sanitize sink",
  //       "value": true,
  //       "name": "sanitize_sink_bathroom",
  //       "id": "task_09"
  //     },
  //     {
  //       "label": "Empty trash",
  //       "value": true,
  //       "name": "empty_trash_bathroom",
  //       "id": "task_10"
  //     },
  //     {
  //       "label": "Check for mold",
  //       "value": true,
  //       "name": "check_mold_bathroom",
  //       "id": "task_11"
  //     }
  //   ]
  // },
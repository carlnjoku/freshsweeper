import React, { useEffect, useContext, useCallback, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity, Alert, FlatList, ScrollView, PanResponder, Animated } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import CardNoPrimary from '../../components/CardNoPrimary';
import { Checkbox } from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import { sendPushNotifications } from '../../utils/sendPushNotification';
import ROUTES from '../../constants/routes';
import axios from 'axios';
import CircularProgress from 'react-native-circular-progress-indicator';
import { Image } from 'expo-image'; 
import CustomActivityIndicator from '../../components/CuustomActivityIndicator';

// Memoized thumbnail component to prevent unnecessary re-renders
// const ThumbnailItem = React.memo(({ 
//   photo, 
//   index, 
//   openImageViewer, 
//   taskTitle,
//   invertPercentage, 
//   getCleanlinessColor, 
//   photosArray // Add this new prop
// }) => {
//   const photoScore = invertPercentage(photo.cleanliness?.individual_overall || 0);
//   const isProblemPhoto = photoScore < 35;

//   return (
//     <TouchableOpacity
//       onPress={() => openImageViewer(photosArray, index, taskTitle)} // Pass full array and correct index
//       style={styles.thumbnailContainer}
//     >
//       <Image
//         source={{ uri: photo.img_url }}
//         style={[
//           styles.preview,
//           isProblemPhoto && { borderWidth: 2, borderColor: '#e74c3c' }
//         ]}
//         cachePolicy="memory-disk"
//         transition={300}
//       />
//       <View style={[
//         styles.percentageOverlay, 
//         { backgroundColor: getCleanlinessColor(photoScore) }
//       ]}>
//         <Text style={styles.percentageText1}>{photoScore.toFixed(0)}%</Text>
//       </View>
//       {isProblemPhoto && (
//         <MaterialIcons 
//           name="warning" 
//           size={20} 
//           color="#e74c3c" 
//           style={styles.warningIcon}
//         />
//       )}
//     </TouchableOpacity>
//   );
// });

const ThumbnailItem = React.memo(({ 
  photo, 
  index, 
  openImageViewer, 
  taskTitle,
  invertPercentage, 
  getCleanlinessColor, 
  photosArray,
  onDelete // Add this prop
}) => {
  const photoScore = invertPercentage(photo.cleanliness?.individual_overall || 0);
  const isProblemPhoto = photoScore < 35;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleDelete = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to permanently delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true
            }).start(() => onDelete(index, taskTitle)); // Pass both index and category
          }
        }
      ]
    );
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        onPress={() => openImageViewer(photosArray, index, taskTitle)}
        style={styles.thumbnailContainer}
      >
        <Image
          source={{ uri: photo.img_url }}
          style={[
            styles.preview,
            // isProblemPhoto && { borderWidth: 2, borderColor: '#e74c3c' }
          ]}
          cachePolicy="memory-disk"
          transition={300}
        />
        <View style={[
          styles.percentageOverlay, 
          { backgroundColor: getCleanlinessColor(photoScore) }
        ]}>
          <Text style={styles.percentageText1}>{photoScore.toFixed(0)}%</Text>
        </View>
        <TouchableOpacity 
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
        {isProblemPhoto && (
          <MaterialIcons 
            name="warning" 
            size={20} 
            color="#e74c3c" 
            style={styles.warningIcon}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

const TaskChecklistTest = ({ scheduleId, tasksList, hostId }) => {
  const { currentUserId, currentUser } = useContext(AuthContext);
  const cameraRef = useRef(null);
  const MAX_IMAGES_UPLOAD = 5;
  
  // State declarations
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState({});

  
  const [isUploading, setIsUploading] = useState(false);

  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [hostTokens, setHostPushToken] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  

  // Animation refs
  const pan = useRef(new Animated.ValueXY()).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (e, gesture) => {
      if (gesture.dy > 50) {
        Animated.timing(pan, {
          toValue: { x: 0, y: 300 },
          duration: 300,
          useNativeDriver: true
        }).start();
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true
        }).start();
        Animated.spring(overlayOpacity, {
          toValue: 1,
          useNativeDriver: true
        }).start();
      }
    }

  })
).current;

  // Helper functions
  const invertPercentage = (score) => 100 - (score * 10);

  // const getCleanlinessLabel = (score) => {
  //   if (score >= 65) return 'Needs Deep Cleaning';
  //   if (score >= 35) return 'Requires Attention';
  //   return 'Very Clean';
  // };
  // const getCleanlinessColor = (score) => {
  //   if (score >= 65) return '#e74c3c';
  //   if (score >= 35) return '#f1c40f';
  //   return '#2ecc71';
  // };

  const getCleanlinessLabel = (invertedScore) => {
    if (invertedScore <= 35) return 'Needs Deep Cleaning';  // Red (worst)
    if (invertedScore <= 40) return 'Requires Attention';   // Yellow
    return 'Very Clean';                                    // Green (best)
  };
  
  const getCleanlinessColor = (invertedScore) => {
    if (invertedScore <= 35) return '#e74c3c';  // Red
    if (invertedScore <= 40) return '#f1c40f';  // Yellow
    return '#2ecc71';                           // Green
  };


  // Data fetching
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userService.getUpdatedImageUrls(scheduleId);
      const res = response.data.data;
      setSelectedImages(res.checklist);
      setTasks(res.checklist);
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId]);

 
  const fetchHostPushTokens = useCallback(async () => {
    const response = await userService.getUserPushTokens(hostId);
    setHostPushToken(response.data.tokens);
  }, [hostId]);


  useFocusEffect(
    useCallback(() => {
      let isActive = true;
  
      const fetchData = async () => {
        try {
          await fetchImages();
          await fetchHostPushTokens();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      if (isActive) {
        fetchData();
      }
  
      return () => {
        isActive = false;
      };
    }, [fetchImages, fetchHostPushTokens])
  );

  // if (permission === null) {
  //   return <View />;
  // }

  // if (!permission.granted) {
  //   return <Text>No access to camera</Text>;
  // }


  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);


  // Add this useEffect to handle index changes
  useEffect(() => {
    if (currentImages[currentImageIndex]?.cleanliness) {
      // Reset animations when image changes
      pan.setValue({ x: 0, y: 0 });
      overlayOpacity.setValue(1);
    }
  }, [currentImageIndex]);
  
  

  // Image handling
  const openImageViewer = useCallback((images, index, category) => {
    pan.setValue({ x: 0, y: 0 });
    overlayOpacity.setValue(1);

    const formattedImages = images.map(photo => {
      const score = invertPercentage(photo.cleanliness?.individual_overall || 0);
      const status = getCleanlinessLabel(score);
      
      return {
        url: status === "Very Clean" ? photo.img_url : photo.cleanliness?.heatmap_url || photo.img_url,
        cleanliness: photo.cleanliness,
        props: {
          source: { uri: status === "Very Clean" ? photo.img_url : photo.cleanliness?.heatmap_url }
        },
        category: category // Make sure this is set
      };
    });
  
    setCurrentImages(formattedImages);
    setCurrentImageIndex(index);
    setBeforeModalVisible(true);
  }, []);


  // Camera functions
  const takePicture = async (taskTitle) => {
    setSelectedTaskTitle(taskTitle);
    setCameraVisible(true);
    if (cameraRef.current) {
      const options = { quality: 0.8, base64: true };
      const newPhoto = await cameraRef.current.takePictureAsync(options);
      setPhotos(prev => [...prev, {
        filename: newPhoto.uri.split('/').pop(),
        file: `data:image/jpeg;base64,${newPhoto.base64}`
      }]);
    }
  };

  const validateTasks = () => {
  let invalidCategories = []; // To store categories with incomplete tasks
  let insufficientImagesCategories = []; // To store categories with fewer than 3 images

  // Log selectedImages to verify its structure
  console.log("Validating Tasks. Selected Images:", selectedImages);

  // Check if `selectedImages` is empty or undefined
  if (!selectedImages || Object.keys(selectedImages).length === 0) {
    Alert.alert("Validation Error", "No tasks or images found for validation.");
    return false;
  }

  // Loop through each category in `selectedImages`
  Object.keys(selectedImages).forEach((category) => {
    const categoryData = selectedImages[category];

    // Handle missing or malformed category data
    if (!categoryData || !categoryData.tasks || !Array.isArray(categoryData.tasks)) {
      console.warn(`Invalid data for category: ${category}`);
      return; // Skip this category
    }

    const { tasks, photos } = categoryData;

    // Check if all tasks are marked as completed (value: true)
    const allTasksCompleted = tasks.every((task) => task.value === true);

    // Add category to invalid list if not all tasks are completed
    if (!allTasksCompleted) invalidCategories.push(category);

    // Check if photos exist and ensure at least 3 images are uploaded
    if (!photos || photos.length < 3) insufficientImagesCategories.push(category);
  });

  // Construct validation error message
  if (invalidCategories.length > 0 || insufficientImagesCategories.length > 0) {
    let errorMessage = "";

    if (invalidCategories.length > 0) {
      errorMessage += `Incomplete tasks in: ${invalidCategories.join(", ")}.\n`;
    }
    if (insufficientImagesCategories.length > 0) {
      errorMessage += `Insufficient images in: ${insufficientImagesCategories.join(", ")}.`;
    }

    Alert.alert("Validation Error", errorMessage);
    return false; // Validation failed
  }

  // All tasks completed and sufficient images uploaded
  return true;
};

  // Submission handlers
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
  
    const data = {
      photo_type: 'before_photos',
      scheduleId: scheduleId,
      images: photos,
      currentUserId: currentUserId,
      task_title: selectedTaskTitle,
      updated_tasks: selectedImages,
    };
    console.log(data.updated_tasks)
    try {
      const response = await axios.put('https://www.freshsweeper.com/api2/upload_task_photos', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Handle the response, you can check status or success message
      if (response.status === 200) {
        Alert.alert('Upload Successful', 'Your photos have been uploaded successfully!');
        fetchImages(); // Refresh the list of images if necessary
      }
    } catch (err) {
      console.error('Error uploading photos:', err);
      Alert.alert('Upload Failed', 'An error occurred while uploading your photos.');
    } finally {
      setIsUploading(false); // Stop spinner
      setCameraVisible(false);
      setPhotos([]);
    }
  };


  const updateChecklistInBackend = async (updatedChecklist) => {
    try {
      const data = {
        scheduleId: scheduleId,
        checklist: updatedChecklist,
      };
  
      await userService.updateChecklist(data); // Make sure this API is correctly implemented
      console.log("Checklist updated successfully in backend");
    } catch (err) {
      console.error("Error updating checklist:", err);
    }
  };

  const handleTaskToggle = async (category, taskId) => {
    setSelectedImages((prevSelectedImages) => {
      // Clone the existing state
      const updatedImages = { ...prevSelectedImages };
  
      if (!updatedImages[category]) return prevSelectedImages; // Ensure category exists
  
      // Find the task and toggle its value
      updatedImages[category].tasks = updatedImages[category].tasks.map((task) =>
        task.id === taskId ? { ...task, value: !task.value } : task
      );
  
      // Send updated checklist to backend
      updateChecklistInBackend(updatedImages);
  
      return updatedImages;
    });
  };

  const removePhoto = (index) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  };

  

  // const handleDeletePhoto = (indexToDelete, category) => {
  //   setSelectedImages(prev => {
  //     const updated = { ...prev };
  //     if (updated[category]?.photos) {
  //       updated[category].photos = updated[category].photos.filter(
  //         (_, i) => i !== indexToDelete
  //       );

        
  //       updateChecklistInBackend(updated);
  //     }
  //     return updated;
  //   });
  // };

  // const handleDeletePhoto = async (indexToDelete, category) => {
  //   try {
  //     // Get the photo details before deleting
  //     const photoToDelete = selectedImages[category]?.photos[indexToDelete];
      
  //     // Optimistically update UI
  //     setSelectedImages(prev => {
  //       const updated = { ...prev };
  //       if (updated[category]?.photos) {
  //         updated[category].photos = updated[category].photos.filter(
  //           (_, i) => i !== indexToDelete
  //         );
  //       }
  //       return updated;
  //     });
  
  //     // Delete from DigitalOcean Spaces and backend
  //     await userService.deleteSpacePhoto({
  //       filename: photoToDelete.filename,
  //       category: category,
  //       scheduleId: scheduleId
  //     });
  
  //     // Update checklist after successful deletion
  //     updateChecklistInBackend(selectedImages);
  
  //   } catch (error) {
  //     console.error('Delete failed:', error);
  //     // Revert UI if deletion fails
  //     setSelectedImages(prev => ({ ...prev }));
  //     Alert.alert(
  //       'Deletion Failed', 
  //       'Could not delete photo. Please try again.'
  //     );
  //   }
  // };


  const handleDeletePhoto = async (indexToDelete, category) => {
    try {
      const photoToDelete = selectedImages[category]?.photos[indexToDelete];
      
      if (!photoToDelete) {
        Alert.alert("Error", "Photo not found");
        return;
      }
  
      // Extract filenames from URLs
      const originalFilename = photoToDelete.img_url.split('/').pop();
      const heatmapFilename = photoToDelete.cleanliness?.heatmap_url?.split('/').pop();
  
      // Optimistic UI update
      setSelectedImages(prev => {
        const updated = {...prev};
        updated[category].photos = updated[category].photos.filter(
          (_, i) => i !== indexToDelete
        );
        return updated;
      });
  
      // Delete from backend and Spaces
      const data = {
        originalFilename,
        heatmapFilename,
        category,
        scheduleId
      }
      console.log(data)
      await userService.deleteSpaceAfterPhoto(data);
  
      // Final state update
      updateChecklistInBackend(selectedImages);
  
    } catch (error) {
  
      console.error('Delete failed:', error);
      // Revert UI on error
      setSelectedImages(prev => ({...prev}));
      Alert.alert(
        'Deletion Failed',
        error.response?.data?.detail || 'Could not delete photo'
      );
    }
  };


  
  // Task completion logic
  const submitCompletion = useCallback(async () => {
    if (!validateTasks()) return;
    
    setIsLoading(true);
    try {
      await userService.finishCleaning({
        scheduleId,
        completed_tasks: selectedImages,
        completionTime: new Date()
      });
      sendPushNotifications(hostTokens, 
        `${currentUser.firstname} Completed Cleaning`,
        `${currentUser.firstname} ${currentUser.lastname} has completed the cleaning.`,
        { screen: ROUTES.host_task_progress, params: { scheduleId } }
      );
      Alert.alert("Success", "Cleaning completed successfully!");
    } finally {
      setIsLoading(false);
    }
  }, [selectedImages, hostTokens, scheduleId, currentUser]);

  // Render functions
  const renderTask = useCallback(({ item }, category) => (
    <View style={styles.taskContainer}>
      <Checkbox
        status={item.value ? 'checked' : 'unchecked'}
        onPress={() => handleTaskToggle(category, item.id)}
      />
      <Text>{item.label}</Text>
    </View>
  ), []);

  const renderCategoryItem = useCallback(({ item: taskTitle }) => {
    const categoryPhotos = selectedImages[taskTitle]?.photos || [];
    const totalScore = categoryPhotos.reduce((sum, photo) => 
      sum + (photo.cleanliness?.individual_overall || 0), 0);
    const averageScore = categoryPhotos.length > 0 ? totalScore / categoryPhotos.length : 0;
    const invertedScore = invertPercentage(averageScore);
    const cleanlinessColor = getCleanlinessColor(invertedScore);

    return (
      <CardNoPrimary key={taskTitle}>
        <View style={{ marginBottom: 20 }}>
          <View style={styles.categoryHeader}>
            <Text style={styles.roomTitle}>{taskTitle}</Text>
            <CircularProgress
              value={invertedScore}
              radius={30}
              duration={1000}
              progressValueColor={cleanlinessColor}
              activeStrokeColor={cleanlinessColor}
              inActiveStrokeColor="#e0e0e0"
              maxValue={100}
              valueSuffix={'%'}
              titleStyle={{ color: cleanlinessColor, fontSize: 12 }}
            />
          </View>

          
        <FlatList
          data={categoryPhotos}
          horizontal
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={({ item, index }) => (
            <ThumbnailItem
              photo={item}
              index={index}
              taskTitle={taskTitle} // Pass the category name here
              photosArray={categoryPhotos} // Pass the full array
              onDelete={handleDeletePhoto}
              openImageViewer={openImageViewer}
              invertPercentage={invertPercentage}
              getCleanlinessColor={getCleanlinessColor}
            />
          )}
          showsHorizontalScrollIndicator={false} // Hide scrollbar for cleaner UI
          contentContainerStyle={styles.previewContainer} // Maintain styling
        />

          <FlatList
            data={selectedImages[taskTitle]?.tasks || []}
            renderItem={({ item }) => renderTask({ item }, taskTitle)}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            initialNumToRender={4}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews
          />

          <View style={styles.horizontalLine} />
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={() => takePicture(taskTitle)}
            >
              <View style={styles.sendButtonContent}>
                <Ionicons name="cloud-upload" size={24} color="gray" />
                <Text style={styles.addButtonText}>Add photo to {taskTitle}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </CardNoPrimary>
    );
  }, [selectedImages, openImageViewer]);


  

  return (
    <View style={styles.container}>
      {!cameraVisible ? (
        <View style={styles.container}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <CustomActivityIndicator 
                size={40} 
                logo={require('../../assets/logo_loading.png')} // Replace with your logo path
              />
              {/* <ActivityIndicator size="large" color={COLORS.primary} /> */}
              {/* <Text>Loading...</Text> */}
            </View>
          ) : (
            <FlatList
              data={Object.keys(selectedImages)}
              renderItem={renderCategoryItem}
              keyExtractor={item => item}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={refreshing}
              //     onRefresh={handleRefresh}
              //     colors={[COLORS.primary]} // Android
              //     tintColor={COLORS.primary} // iOS
              //     progressBackgroundColor="#ffffff"
              //   />
              // }
              ListHeaderComponent={
                <>
                  
                 <Text style={styles.headline}>Showcase Your Work</Text>
                 <Text style={styles.subheading}>Complete all cleaning tasks and upload at least 3 photos per category to ensure quality assurance.</Text> 
                 <View style={styles.message}>
                   <View style={styles.iconContainer}>
                     <MaterialIcons name="warning" size={24} color="#FFA000" />
                   </View>
                   <Text style={styles.subheading}>
                   Great job completing the cleaning! To finish, it's mandatory to upload at least 3 photos per area. This ensures quality, provides proof of service, and helps maintain trust with the host.
                   </Text>
             </View>
                </>
              }
              ListFooterComponent={
                <TouchableOpacity 
                  title="Finish Cleaning" 
                  onPress={submitCompletion} 
                  style={styles.finishButton} 
                >
                <Text style={{color:COLORS.white}}>Finish Cleaning</Text>
                </TouchableOpacity>
              }
              initialNumToRender={2}
              maxToRenderPerBatch={4}
              windowSize={5}
              removeClippedSubviews
            />
          )}
        </View>
      ) : (
        <>
        <CameraView style={styles.camera} ref={cameraRef}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setCameraVisible(false)}>
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
          
          <View style={styles.spinnerContainer}>
            {isUploading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <TouchableOpacity style={styles.captureButton} onPress={() => takePicture(selectedTaskTitle)}>
                <Ionicons name="camera" size={70} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </CameraView>

          

        {/* Display thumbnails */}
          <View style={{height:200}}>
          <FlatList
            data={photos}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.thumbnailContainer}>
                <Image source={{ uri: item.file }} style={styles.preview} />
                <TouchableOpacity onPress={() => removePhoto(index)} style={styles.removeButton}>
                  <Ionicons name="trash" size={20} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            )}
            showsHorizontalScrollIndicator={false} // Hide scrollbar for cleaner UI
            contentContainerStyle={styles.previewContainer} // Maintain styling
          />
          
          {photos.length > 0 ? 
          <TouchableOpacity onPress={onSubmit} style={styles.buttonContainer1}>
            <View style={styles.buttonContent1}>
              <Ionicons name="arrow-up-circle-outline" size={24} color="white" />
              <Text style={styles.buttonText1}>Save Photos</Text>
            </View>
          </TouchableOpacity>
          :
            ""
          }
          </View>
          </>
      )}

      <Modal 
        isVisible={isBeforeModalVisible}
        style={styles.fullScreenModal}
        // onBackdropPress={() => setBeforeModalVisible(false)}


        onBackdropPress={() => {
          if (!isDragging) { // Add a state to track dragging
            setBeforeModalVisible(false);
          }
        }}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
          
          <View style={styles.imageContainer}>
            
          <ImageViewer
              imageUrls={currentImages}
              index={currentImageIndex}
              backgroundColor="black"
              enableSwipeDown
              enableImageZoom
              saveToLocalByLongPress={false}
              menuContext={{ saveToLocal: 'Save', cancel: 'Cancel' }}
              enablePreload={false}
              enableHorizontalBounce={false}
              pageAnimateTime={200}
              flipThreshold={100} // Make harder to accidentally trigger
              onSwipeDown={() => setBeforeModalVisible(false)}
              placeholder={require('../../assets/logo_loading.png')}
              onError={(error) => console.log('Image load error:', error)}
              onChange={(index) => {
                setCurrentImageIndex(index);
                pan.setValue({ x: 0, y: 0 });
                overlayOpacity.setValue(1);
              }}
              renderImage={(props) => (
                <Image
                  source={props.source}
                  style={styles.fullSizeImage}
                  contentFit="contain"
                  transition={300}
                  cachePolicy="memory-disk"
                />
              )}
              renderFooter={(currentIndex) => (
                <View style={styles.footerOverlay}>
                  <Text style={styles.imageCounter}>
                    {currentIndex + 1}/{currentImages.length}
                  </Text>
                </View>
              )}
            />

          
          </View>

        {currentImages[currentImageIndex]?.cleanliness && (() => {
          // // Extract cleanliness data from current image
          // const cleanlinessData = currentImages[currentImageIndex].cleanliness;
          
          // // Calculate derived values
          // const individualOverall = cleanlinessData.individual_overall || 0;
          // const invertedScore = invertPercentage(individualOverall);
          // const cleanlinessLabel = getCleanlinessLabel(invertedScore);
          // const cleanlinessColor = getCleanlinessColor(invertedScore);
          // const scores = cleanlinessData.scores || {};

          // console.log(cleanlinessData)

          // Individual image analysis
          const cleanlinessData = currentImages[currentImageIndex].cleanliness;
          const individualOverall = cleanlinessData.individual_overall || 0;
          const invertedIndividualScore = invertPercentage(individualOverall);
          
          // Category average analysis
          const category = currentImages[currentImageIndex].category;
          const categoryPhotos = selectedImages[category]?.photos || [];
          const categoryTotal = categoryPhotos.reduce((sum, photo) => 
            sum + (photo.cleanliness?.individual_overall || 0), 0);
          const categoryAverage = categoryPhotos.length > 0 ? 
            categoryTotal / categoryPhotos.length : 0;
          const invertedCategoryScore = invertPercentage(categoryAverage);

          
          

          return (
            <Animated.View 
          style={[styles.draggableContainer, { transform: [{ translateY: pan.y }] }]} 
          {...panResponder.panHandlers}
        >
          <View style={styles.dragHandle} />
          <View style={styles.cleanlinessDetails}>
            <Text style={styles.detailHeader}>CLEANLINESS ANALYSIS</Text>
            
            {/* Individual Score Section */}
            <View style={styles.scoreSection}>
              <Text style={styles.sectionTitle}>THIS PHOTO</Text>
              <View style={styles.scoreRow}>
                <View style={styles.scoreTextContainer}>
                  <Text style={styles.percentageText}>
                    {invertedIndividualScore.toFixed(0)}%
                  </Text>
                  <Text style={[styles.statusText, { 
                    color: getCleanlinessColor(invertedIndividualScore) 
                  }]}>
                    {getCleanlinessLabel(invertedIndividualScore)}
                  </Text>
                </View>
                <CircularProgress
                  value={invertedIndividualScore}
                  radius={40}
                  activeStrokeColor={getCleanlinessColor(invertedIndividualScore)}
                  inActiveStrokeColor="#2d2d2d"
                  maxValue={100}
                  duration={1000}
                  valueSuffix={'%'}
                />
              </View>
            </View>

           
            {/* Top Issues Section */}
            <Text style={styles.sectionTitle}>MAIN ISSUES</Text>
            <View style={styles.factorsContainer}>
              {Object.entries(cleanlinessData.scores || {})
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([factor, score]) => (
                  <View key={factor} style={styles.factorItem}>
                    <Text style={styles.factorName}>
                      {factor.replace(/_/g, ' ').toUpperCase()}
                    </Text>
                    <Text style={[styles.factorScore, { 
                      color: getCleanlinessColor(100 - (score * 10)) 
                    }]}>
                      {(100 - (score * 10)).toFixed(0)}%
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </Animated.View>
          //   <Animated.View 
          //     style={[styles.draggableContainer, { transform: [{ translateY: pan.y }] }]} 
          //     {...panResponder.panHandlers}
          //   >
          //   <View style={styles.dragHandle} />
          //   <View style={styles.cleanlinessDetails}>
          //     <Text style={styles.detailHeader}>CLEANLINESS ANALYSIS</Text>
          //     <View style={styles.scoreRow}>
          //       <View style={styles.scoreTextContainer}>
          //         <Text style={styles.percentageText}>
          //           {invertedScore.toFixed(0)}%
          //         </Text>
          //         <Text style={[styles.statusText, { color: cleanlinessColor }]}>
          //           {cleanlinessLabel}
          //         </Text>
          //       </View>
          //       <CircularProgress
          //         value={invertedScore}
          //         radius={40}
          //         activeStrokeColor={cleanlinessColor}
          //         inActiveStrokeColor="#2d2d2d"
          //         maxValue={100}
          //         duration={1000}
          //         valueSuffix={'%'}
          //       />
          //     </View>

          //     {/* Top Issues */}
          //       <Text style={styles.sectionTitle}>MAIN ISSUES</Text>
          //       <View style={styles.factorsContainer}>
          //         {Object.entries(scores)
          //           .sort(([,a], [,b]) => b - a)
          //           .slice(0, 3)
          //           .map(([factor, score]) => (
          //             <View key={factor} style={styles.factorItem}>
          //               <Text style={styles.factorName}>
          //                 {factor.replace(/_/g, ' ').toUpperCase()}
          //               </Text>
          //               <Text style={[styles.factorScore, { 
          //                 color: getCleanlinessColor(100 - (score * 10)) 
          //               }]}>
          //                 {(100 - (score * 10)).toFixed(0)}%
          //               </Text>
          //             </View>
          //           ))}
          //       </View>
          //   </View>

          //  </Animated.View>
          )

        })()}

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setBeforeModalVisible(false)}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};


// Keep your existing styles from previous version
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'black',
    // backgroundColor: COLORS.backgroundColor,
    // borderRadius:10
  },

fullScreenModal: {
    margin: 0,
    justifyContent: 'center',
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
    marginTop:5
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
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 0,
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
    marginLeft:5
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



  thumbnailContainer: {
    position: 'relative', // Ensure overlay is positioned correctly
    marginRight: 10,
  },
  percentageOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  percentageText1: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },

  cleanlinessDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  detailHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    color: '#cccccc',
    fontSize: 14,
    marginVertical: 5,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
 

  closeModalButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
  percentageOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },





  cleanlinessDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  detailHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  percentageText: {
    color: 'white',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoLabel: {
    color: '#a0a0a0',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  infoValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  factorsContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 8,
  },
  factorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  // factorName: {
  //   color: 'white',
  //   fontSize: 14,
  //   flex: 2,
  // },
  factorScore: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  closeButton: {
    position: 'absolute',
    top: 28,
    right: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  circularTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },

  
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '100%',
    width:'100%',
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 3, // Takes 3/4 of available space
  },
  detailsContainer: {
    flex: 1, // Takes 1/4 of available space
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  footerOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 8,
  },
  imageCounter: {
    color: 'white',
    fontSize: 14,
  },
  // Keep previous cleanliness details styles but move them under detailsContainer
  detailHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  draggableContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  cleanlinessDetails: {
    maxHeight: 400,
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  // Update the draggableContainer styles
// draggableContainer: {
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   right: 0,
//   backgroundColor: 'rgba(0,0,0,0.85)',
//   borderTopLeftRadius: 24,
//   borderTopRightRadius: 24,
//   padding: 16,
//   maxHeight: '80%', // Limit maximum height
//   minHeight: 50, // Ensure handle remains visible
// },
// dragHandle: {
//   width: 40,
//   height: 6,
//   backgroundColor: 'rgba(255,255,255,0.6)',
//   borderRadius: 3,
//   alignSelf: 'center',
//   marginBottom: 16,
//   position: 'absolute',
//   top: 8,
//   zIndex: 1,
// },





  warningIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    padding: 2,
  },
  factorsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 8,
    marginTop: 12,
  },
  factorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  factorName: {
    color: 'white',
    fontSize: 14,
    flex: 2,
  },
  factorScore: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  finishButton:{
    backgroundColor:COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Arrange icon and text horizontally
    borderRadius:50
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 15,
  },
});

export default TaskChecklistTest;



















// import React, { useEffect, useContext,useCallback, useState, useRef } from 'react';
// import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image, FlatList, ScrollView } from 'react-native';
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; 
// import COLORS from '../../constants/colors'; // Your predefined color constants
// import userService from '../../services/userService';
// import { AuthContext } from '../../context/AuthContext';
// import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
// import CardNoPrimary from '../../components/CardNoPrimary';
// import { Checkbox } from 'react-native-paper';
// // import { checklist } from '../../utils/tasks_photo';
// import ImageViewer from 'react-native-image-zoom-viewer';
// import Modal from 'react-native-modal';
// import { sendExpoPushNotification, sendPushNotification, sendPushNotifications } from '../../utils/sendPushNotification';
// import ROUTES from '../../constants/routes';
// import axios from 'axios';
// import CircularProgress from 'react-native-circular-progress-indicator';
// import { PanResponder, Animated } from 'react-native';
// import FastImage from 'react-native-fast-image';




// const TaskChecklistTest = ({ scheduleId, tasksList, hostId }) => {

// // Add these animated values at the top of your component
// const pan = useRef(new Animated.ValueXY()).current;
// const overlayOpacity = useRef(new Animated.Value(1)).current;

// // Then add the pan responder
// const panResponder = useRef(
//   PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderMove: Animated.event(
//       [null, { dy: pan.y }],
//       { useNativeDriver: false }
//     ),
//     onPanResponderRelease: (e, gesture) => {
//       if (gesture.dy > 50) {
//         Animated.timing(pan, {
//           toValue: { x: 0, y: 300 },
//           duration: 300,
//           useNativeDriver: true
//         }).start();
//         Animated.timing(overlayOpacity, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true
//         }).start();
//       } else {
//         Animated.spring(pan, {
//           toValue: { x: 0, y: 0 },
//           useNativeDriver: true
//         }).start();
//         Animated.spring(overlayOpacity, {
//           toValue: 1,
//           useNativeDriver: true
//         }).start();
//       }
//     }

//   })
// ).current;
  

// // Add these helper functions at the top of your component
// const invertPercentage = (score) => 100 - (score * 10);

// const getCleanlinessLabel = (score) => {
//   if (score >= 65) return 'Needs Deep Cleaning';
//   if (score >= 35) return 'Requires Attention';
//   return 'Very Clean';
// };

// const getCleanlinessColor = (score) => {
//   if (score >= 65) return '#e74c3c'; // Red
//   if (score >= 35) return '#f1c40f'; // Yellow
//   return '#2ecc71'; // Green
// };


//   const {currentUserId, currentUser} = useContext(AuthContext)

//   // Use a ref to store the camera reference
//   const cameraRef = useRef(null);

//   const MAX_IMAGES_UPLOAD = 5
  
//   const[tasks, setTasks] = useState([]);
//   const[isLoading, setIsLoading] = useState(false);
//   const[selectedImages, setSelectedImages] = React.useState({})

//   const [isUploading, setIsUploading] = useState(false); // Spinner for uploading state
//   const [tasksByCategory, setTasksByCategory] = useState();
//   const [selectedTaskTitle, setSelectedTaskTitle] = useState('');

//   const[facing, setFacing] = useState('back');
//   const[permission, requestPermission] = useCameraPermissions();
//   const[photos, setPhotos] = useState([]);
//   const[cameraVisible, setCameraVisible] = useState(false); // New state to control camera visibility
//   const[images, setImages] = useState([])

//   const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [currentImages, setCurrentImages] = useState([]);
//   const[hostTokens, setHostPushToken] = useState([])
  


//   const fetchImages = async () => {
//     // Fetch images from the database
//     setIsLoading(true);
//       setTimeout(async () => {
//     await userService.getUpdatedImageUrls(scheduleId)
//     .then(response => {
//       const res = response.data.data
//       console.log("sooooooooooooooooon")
//       console.log(JSON.stringify(res.checklist, null, 2))
//       console.log("sooooooooooooooooon")
      
//       // Update checklist 
//       // const data = {
//       //   scheduleId:scheduleId,
//       //   checklist: checklist
//       // }
//       // userService.updateChecklist(data)
//       // .then(response=> {
//       //   // const res = response.data.data
//       // })
//       // Update state with the fetched images
//       setSelectedImages(res.checklist);
        
      

//       setTasks(res.checklist)
//       setIsLoading(false);
//     })
//   }, 2000); // Add a 2-second delay
    
//   };

//   const fetchHostPushTokens = async() => {
//     await userService.getUserPushTokens(hostId)
//     .then(response => {
//         const res = response.data.tokens
//         setHostPushToken(res)
//         console.log("User tokens", res)
//     })
//   }

//   // Execute fetchImages when the screen comes into focuss
//   useFocusEffect(
//     useCallback(() => {
//       fetchImages();
//       fetchHostPushTokens()
//     }, [])
//   );
  
//   useEffect(() => {
//     if (permission && !permission.granted) {
//       requestPermission();
//     }
//   }, [permission]);

//   // Add this useEffect to handle index changes
//   useEffect(() => {
//     if (currentImages[currentImageIndex]?.cleanliness) {
//       // Reset animations when image changes
//       pan.setValue({ x: 0, y: 0 });
//       overlayOpacity.setValue(1);
//     }
//   }, [currentImageIndex]);
  
//   if (permission === null) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return <Text>No access to camera</Text>;
//   }

//   const toggleCameraFacing = () => {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   };

  
  

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

  

//   const removePhoto = (index) => {
//     setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
//   };


//   // const onSubmit = async () => {
//   //   // Check if the number of photos exceeds the limit
//   //   if (photos.length > MAX_IMAGES_UPLOAD) {
//   //     Alert.alert(
//   //       'Upload Limit Exceeded',
//   //       `You can only upload up to ${MAX_IMAGES_UPLOAD} images at a time. Please remove some images before uploading.`
//   //     );
//   //     return;
//   //   }

//   //   setIsUploading(true); // Start spinner for upload
//   //   const data = {
//   //     photo_type: 'before_photos',
//   //     scheduleId,
//   //     images: photos,
//   //     currentUserId,
//   //     task_title: selectedTaskTitle,
//   //     updated_tasks: selectedImages,
//   //   };

//   //   try {
//   //     await userService.uploadTaskPhotos(data);
//   //     fetchImages();

//   //   } catch (err) {
//   //     console.error('Error uploading photos:', err);
//   //   } finally {
//   //     setIsUploading(false); // Stop spinner
//   //     setCameraVisible(false);
//   //     setPhotos([]);
//   //   }
//   // };


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
  
//     const formData = new FormData();
  
//     // Append each image to the FormData object
//     // photos.forEach((photo, index) => {
//     //   formData.append('images[]', {
//     //     uri: photo.uri,
//     //     type: 'image/jpeg', // Adjust type if needed
//     //     name: `task_photo_${index + 1}.jpg`, // Unique name for each photo
//     //   });
//     // });
  
//     // formData.append('photo_type', 'before_photos');
//     // formData.append('scheduleId', scheduleId);
//     // formData.append('currentUserId', currentUserId);
//     // formData.append('images', photos);
//     // formData.append('task_title', selectedTaskTitle);
//     // formData.append('updated_tasks', selectedImages);
 
//     // console.log(formData.images)
   
//     const data = {
//       photo_type: 'before_photos',
//       scheduleId: scheduleId,
//       images: photos,
//       currentUserId: currentUserId,
//       task_title: selectedTaskTitle,
//       updated_tasks: selectedImages,
//     };
//     console.log(data.updated_tasks)
//     try {
//       const response = await axios.put('https://www.freshsweeper.com/api2/upload_task_photos', data, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
  
//       // Handle the response, you can check status or success message
//       if (response.status === 200) {
//         Alert.alert('Upload Successful', 'Your photos have been uploaded successfully!');
//         fetchImages(); // Refresh the list of images if necessary
//       }
//     } catch (err) {
//       console.error('Error uploading photos:', err);
//       Alert.alert('Upload Failed', 'An error occurred while uploading your photos.');
//     } finally {
//       setIsUploading(false); // Stop spinner
//       setCameraVisible(false);
//       setPhotos([]);
//     }
//   };
 
  
  




// const validateTasks = () => {
//   let invalidCategories = []; // To store categories with incomplete tasks
//   let insufficientImagesCategories = []; // To store categories with fewer than 3 images

//   // Log selectedImages to verify its structure
//   console.log("Validating Tasks. Selected Images:", selectedImages);

//   // Check if `selectedImages` is empty or undefined
//   if (!selectedImages || Object.keys(selectedImages).length === 0) {
//     Alert.alert("Validation Error", "No tasks or images found for validation.");
//     return false;
//   }

//   // Loop through each category in `selectedImages`
//   Object.keys(selectedImages).forEach((category) => {
//     const categoryData = selectedImages[category];

//     // Handle missing or malformed category data
//     if (!categoryData || !categoryData.tasks || !Array.isArray(categoryData.tasks)) {
//       console.warn(`Invalid data for category: ${category}`);
//       return; // Skip this category
//     }

//     const { tasks, photos } = categoryData;

//     // Check if all tasks are marked as completed (value: true)
//     const allTasksCompleted = tasks.every((task) => task.value === true);

//     // Add category to invalid list if not all tasks are completed
//     if (!allTasksCompleted) invalidCategories.push(category);

//     // Check if photos exist and ensure at least 3 images are uploaded
//     if (!photos || photos.length < 3) insufficientImagesCategories.push(category);
//   });

//   // Construct validation error message
//   if (invalidCategories.length > 0 || insufficientImagesCategories.length > 0) {
//     let errorMessage = "";

//     if (invalidCategories.length > 0) {
//       errorMessage += `Incomplete tasks in: ${invalidCategories.join(", ")}.\n`;
//     }
//     if (insufficientImagesCategories.length > 0) {
//       errorMessage += `Insufficient images in: ${insufficientImagesCategories.join(", ")}.`;
//     }

//     Alert.alert("Validation Error", errorMessage);
//     return false; // Validation failed
//   }

//   // All tasks completed and sufficient images uploaded
//   return true;
// };
  

  


//   const submitCompletion = async () => {
//     console.log("Starting task submission...");
  
//     if (!validateTasks()) {
//       console.warn("Task validation failed. Submission aborted.");
//       return;
//     }
  
//     setIsLoading(true);
  
//     setTimeout(async () => {
//       const jobCompletionData = {
//         scheduleId,
//         completed_tasks: selectedImages,
//         completionTime: new Date(),
//       };
  
//       try {
//         // console.log("Submitting completion data:", jobCompletionData);
//         const response = await userService.finishCleaning(jobCompletionData);
//         fetchImages(); // Refresh images after successful completion
//         console.log("Task submission response:", response.data);
  
//         const notificationMsg = `${currentUser.firstname} ${currentUser.lastname} has completed the cleaning.`;
//         Alert.alert("Success", notificationMsg);
//         // sendPushNotifications(
//         //   hostPushToken,
//         //   "Cleaner Clocked In!",
//         //   "The cleaner has successfully clocked in and started cleaning for Schedule. We'll notify you once the cleaning is completed. Sit back and relax!",
//         //   {
//         //     screen: ROUTES.host_task_progress,
//         //     params: {
//         //         scheduleId: schedule._id, 
//         //     },
//         //   }
  
//         // );

//         sendPushNotifications(
//           hostTokens,
//           `${currentUser.firstname} ${currentUser.lastname}`,
//           notificationMsg,
//           {
//             screen: ROUTES.host_task_progress,
//             params: { scheduleId },
//           }
//         );
//       } catch (err) {
//         console.error("Error during task submission:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 2000);
//   };


//   const onCloseCamera = () => {
//     setCameraVisible(false)
//     setPhotos([]); // Empty the photos array
//   }

  
// // Function to handle the checkbox toggle
// const handleTaskToggle1 = (category, taskId) => {
//     const updatedImages = { ...selectedImages };

//     // Find the task and toggle its value
//     const tasks = updatedImages[category].tasks.map((task) => {
//       if (task.id === taskId) {
//         return { ...task, value: !task.value };
//       }
//       return task;
//     });

//     updatedImages[category].tasks = tasks;

//     // Update the state with the new tasks
//     setSelectedImages(updatedImages);
//     console.log(JSON.stringify(updatedImages,null, 2))

//     ///////////////////////////////////////////


//     // const updatedTasks = { ...tasksByCategory };

//     // updatedTasks[category].tasks = updatedTasks[category].tasks.map(task => 
//     //   task.id === taskId ? { ...task, value: !task.value } : task
//     // );

//     // setTasksByCategory(updatedTasks);
  
    
//   };

//   const updateChecklistInBackend = async (updatedChecklist) => {
//     try {
//       const data = {
//         scheduleId: scheduleId,
//         checklist: updatedChecklist,
//       };
  
//       await userService.updateChecklist(data); // Make sure this API is correctly implemented
//       console.log("Checklist updated successfully in backend");
//     } catch (err) {
//       console.error("Error updating checklist:", err);
//     }
//   };

//   const handleTaskToggle = async (category, taskId) => {
//     setSelectedImages((prevSelectedImages) => {
//       // Clone the existing state
//       const updatedImages = { ...prevSelectedImages };
  
//       if (!updatedImages[category]) return prevSelectedImages; // Ensure category exists
  
//       // Find the task and toggle its value
//       updatedImages[category].tasks = updatedImages[category].tasks.map((task) =>
//         task.id === taskId ? { ...task, value: !task.value } : task
//       );
  
//       // Send updated checklist to backend
//       updateChecklistInBackend(updatedImages);
  
//       return updatedImages;
//     });
//   };

//   // Render task checkbox with label
//   const renderTask = ({ item }, category) => (
   
//     <View style={styles.taskContainer}>
//       <Checkbox
//         status={item.value ? 'checked' : 'unchecked'}
//         onPress={() => handleTaskToggle(category, item.id)} // Call toggle function
//       />
//       <Text>{item.label}</Text>
//     </View>
//   );

//   // Open modal and set images for the selected task title
//   // const openImageViewer = (images, index) => {
//   //   // const formattedImages = images.map(photo => ({ url: photo.img_url }));
//   //   const formattedImages = images.map(photo => ({ url: photo.cleanliness.heatmap_url }));
//   //   setCurrentImages(formattedImages);
//   //   setCurrentImageIndex(index);
//   //   setBeforeModalVisible(true);
//   // };

//   // const openImageViewer = (images, index) => {
//   //   pan.setValue({ x: 0, y: 0 });
//   //   overlayOpacity.setValue(1)
//   //   // Preserve all cleanliness data when formatting images
//   //   const formattedImages = images.map(photo => ({
//   //     url: photo.img_url,       // Original image URL
//   //     heatmap: photo.cleanliness?.heatmap_url || '',  // Heatmap URL
//   //     cleanliness: photo.cleanliness  // Full cleanliness data
      
//   //   }));
    
//   //   setCurrentImages(formattedImages);
//   //   setCurrentImageIndex(index);
//   //   setBeforeModalVisible(true);
//   // };

//   const openImageViewer = (images, index) => {
//     pan.setValue({ x: 0, y: 0 });
//     overlayOpacity.setValue(1);
    
//     const formattedImages = images.map(photo => {
//       const score = invertPercentage(photo.cleanliness?.individual_overall || 0);
//       const status = getCleanlinessLabel(score);
      
//       return {
//         url: status === "Very Clean" ? photo.img_url : photo.cleanliness?.heatmap_url || photo.img_url,
//         cleanliness: photo.cleanliness,
//         props: {
//           source: { uri: status === "Very Clean" ? photo.img_url : photo.cleanliness?.heatmap_url }
//         }
//       };
//     });
  
//     setCurrentImages(formattedImages);
//     setCurrentImageIndex(index);
//     setBeforeModalVisible(true);
//   };


//   const getCleanlinessPercentage = (category) => {
//     if (!selectedImages[category] || !selectedImages[category].tasks) return 0;
  
//     const tasks = selectedImages[category].tasks;
//     const totalTasks = tasks.length;
//     const completedTasks = tasks.filter(task => task.value).length;
  
//     return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
//   };

//   return (
//     <View style={styles.container}>

//       {/* Button to trigger camera visibility */}
//       {!cameraVisible && (
//         <View>
//           {isLoading && (
      
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color={COLORS.primary} />
//               <Text>Loading...</Text>
//             </View>
//       )}
//           {!isLoading && (
//             <ScrollView>
//             {/* <Text style={styles.headline}>Cleaning Checklist and Photo Upload</Text>
//             <Text style={styles.subheading}>Complete all cleaning tasks and upload at least 3 photos per category to ensure quality assurance.</Text> */}
//             <Text style={styles.headline}>Showcase Your Work</Text>
//             <View style={styles.message}>
//               <View style={styles.iconContainer}>
//                 <MaterialIcons name="warning" size={24} color="#FFA000" />
//               </View>
//               <Text style={styles.subheading}>
//               Great job completing the cleaning! To finish, it’s mandatory to upload at least 3 photos per area. This ensures quality, provides proof of service, and helps maintain trust with the host.
//               </Text>
//             </View>
//             {Object.keys(selectedImages).map(taskTitle => {
//   // Calculate cleanliness data


//   // Update your cleanliness data access to use currentImageIndex
// const cleanlinessData = currentImages[currentImageIndex]?.cleanliness || {};
// const individualOverall = cleanlinessData?.individual_overall || 0;

// const spotCount = cleanlinessData?.spot_count || 0;
// const scores = cleanlinessData?.scores || {};




//   // Calculate average cleanliness score for this category
  
  
  
//   // Convert to percentage
  
  





//   const categoryPhotos = selectedImages[taskTitle].photos;
//   const totalScore = categoryPhotos.reduce((sum, photo) => 
//     sum + (photo.cleanliness?.individual_overall || 0), 0);
//   const averageScore = categoryPhotos.length > 0 
//     ? totalScore / categoryPhotos.length 
//     : 0;
//     const cleanlinessColor = getCleanlinessColor(invertedScore);
//     const invertedScore = invertPercentage(averageScore);

//     // const totalScore = categoryPhotos.reduce((sum, photo) => sum + (photo.cleanliness?.individual_overall || 0), 0);
//   // const averageScore = categoryPhotos.length > 0 ? totalScore / categoryPhotos.length : 0;

//   // const cleanlinessColor = getCleanlinessColor(invertedScore);

//   // For percentage display
// // const invertedScore = invertPercentage(individualOverall);








//   return (
//     <CardNoPrimary key={taskTitle}>
//       <View style={{marginBottom: 20}}>
//         <View style={styles.categoryHeader}>
//           <Text style={styles.roomTitle}>{taskTitle}</Text>
            
//           <CircularProgress
//             value={invertedScore}
//             radius={30}
//             duration={1000}
//             progressValueColor={cleanlinessColor}
//             activeStrokeColor={cleanlinessColor}
//             inActiveStrokeColor="#e0e0e0"
//             maxValue={100}
//             valueSuffix={'%'}
//             titleStyle={{color: cleanlinessColor, fontSize: 12}}
//           />
//         </View>

//         {/* Rest of your existing content */}
//         {/* <ScrollView horizontal style={styles.previewContainer}>
//           {categoryPhotos.map((photo, index) => {
//             const photoScore = invertPercentage(photo.cleanliness?.individual_overall || 0);
//             return (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => openImageViewer(categoryPhotos, index)}
//                 style={styles.thumbnailContainer}
//               >
//                 <Image source={{ uri: photo.img_url }} style={styles.preview} />
//                 <View style={[styles.percentageOverlay, {backgroundColor: getCleanlinessColor(photoScore)}]}>
//                   <Text style={styles.percentageText1}>{photoScore.toFixed(0)}%</Text>
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView> */}

//         <ScrollView horizontal style={styles.previewContainer}>
//           {categoryPhotos.map((photo, index) => {
//             const photoScore = invertPercentage(photo.cleanliness?.individual_overall || 0);
//             const isProblemPhoto = photoScore < 35;
            
//             return (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => openImageViewer(categoryPhotos, index)}
//                 style={styles.thumbnailContainer}
//               >
//                 <Image 
//                   source={{ uri: photo.img_url }} 
//                   style={[
//                     styles.preview,
//                     isProblemPhoto && { borderWidth: 2, borderColor: '#e74c3c' }
//                   ]} 
//                 />
//                 <View style={[
//                   styles.percentageOverlay, 
//                   { backgroundColor: getCleanlinessColor(photoScore) }
//                 ]}>
//                   <Text style={styles.percentageText1}>{photoScore.toFixed(0)}%</Text>
//                 </View>
//                 {isProblemPhoto && (
//                   <MaterialIcons 
//                     name="warning" 
//                     size={20} 
//                     color="#e74c3c" 
//                     style={styles.warningIcon}
//                   />
//                 )}
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>

//                   <FlatList
//                       data={selectedImages[taskTitle]["tasks"]}
//                       // renderItem={renderTask}
//                       renderItem={(item) => renderTask(item, taskTitle)} // Pass taskTi
//                       keyExtractor={item => item.id.toString()}
//                       numColumns={2} // Make 2 columns
//                       columnWrapperStyle={styles.columnWrapper} // Style the column wrapper
//                   />
        
//                     <View style={styles.horizontalLine} />

//                     <View style={{alignItems:'center'}}>
//                         {/* <Text onPress={() => takePicture()} style={{color:COLORS.primary}}>Upload Photos</Text> */}
//                         <TouchableOpacity style={styles.sendButton} onPress={() => takePicture(taskTitle)} >
//                             <View style={styles.sendButtonContent}>
//                                 <Ionicons name="cloud-upload" size={24} color="gray" />
//                                 <Text style={styles.addButtonText}>Add photo to {taskTitle}</Text>
//                             </View>
//                         </TouchableOpacity>
//                     </View>
//                     {/* <Button
//                         // title={item.afterPhoto ? "Change Photo" : "Upload Photo2"}
//                         title="Upload Photo2"
//                         onPress={() => takePicture()}
//                     />
//                     <Button
//                         // title={item.completed ? "Undo" : "Complete"}
//                         title="Complete"
//                         // onPress={() => toggleTaskCompletion(item.id)}
//                         // color={item.completed ? COLORS.success : COLORS.primary}
//                         color={COLORS.primary}
//                     /> */}
//                  </View>

//         {/* Rest of your task rendering */}
    
//     </CardNoPrimary>
//   );
// })}
//              {/* Finish Cleaning Button */}
//               <Button title="Finish Cleaning" onPress={submitCompletion} color={COLORS.success} />
//              </ScrollView>
//              )}
//         </View>
        
//       )}

//       {cameraVisible && (
//         <CameraView style={styles.camera} ref={cameraRef}>
//           <TouchableOpacity style={styles.closeButton} onPress={onCloseCamera}>
//             <Ionicons name="close-circle" size={32} color="white" />
//           </TouchableOpacity>
//           <View style={styles.spinnerContainer}>
//             {isUploading ? ( // Show spinner when uploading
//                 <ActivityIndicator size="large" color={COLORS.primary} />
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
//       <View style={{height:200}}>
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
//           <TouchableOpacity onPress={onSubmit} style={styles.buttonContainer1}>
//             <View style={styles.buttonContent1}>
//               <Ionicons name="arrow-up-circle-outline" size={24} color="white" />
//               <Text style={styles.buttonText1}>Save Photos</Text>
//             </View>
//           </TouchableOpacity>
//           :
//             ""
//           }
//           </View>
        
        

//       {/* Modal with ImageViewer */}
    

//     <Modal
//       isVisible={isBeforeModalVisible}
//       style={styles.fullScreenModal}
//       onBackdropPress={() => setBeforeModalVisible(false)}
//     >
//       {/* Semi-transparent overlay */}
      
//       <View style={styles.modalContainer}>
//       <Animated.View 
//           style={[styles.overlay, { opacity: overlayOpacity }]}
//         />
      
//       <View style={styles.imageContainer}>
//           <ImageViewer
//             imageUrls={currentImages}
//             index={currentImageIndex}
//             backgroundColor="black"
//             renderFooter={(currentIndex) => (
//               <View style={styles.footerOverlay}>
//                 <Text style={styles.imageCounter}>
//                   {currentIndex + 1}/{currentImages.length}
//                 </Text>
//               </View>
//             )}
//             renderImage={(props) => (
//               <Image
//                 {...props}
//                 // style={styles.fullSizeImage}
//                 resizeMode="contain"
//                 source={currentImages[currentImageIndex]?.props?.source}
//               />
//             )}
//             onChange={(index) => {
//               // Reset animation values when image changes
//               pan.setValue({ x: 0, y: 0 });
//               overlayOpacity.setValue(1);
//               setCurrentImageIndex(index);
//             }}
//           />
//         </View>
        
        
//         {currentImages[currentImageIndex]?.cleanliness && (() => {
//           // Extract cleanliness data from current image
//           const cleanlinessData = currentImages[currentImageIndex].cleanliness;
          
//           // Calculate derived values
//           const individualOverall = cleanlinessData.individual_overall || 0;
//           const invertedScore = invertPercentage(individualOverall);
//           const cleanlinessLabel = getCleanlinessLabel(invertedScore);
//           const cleanlinessColor = getCleanlinessColor(invertedScore);
//           const scores = cleanlinessData.scores || {};

//           return (
//             <Animated.View 
//               style={[styles.draggableContainer, { transform: [{ translateY: pan.y }] }]} 
//               {...panResponder.panHandlers}
//             >
//             <View style={styles.dragHandle} />
//             <View style={styles.cleanlinessDetails}>
//               <Text style={styles.detailHeader}>CLEANLINESS ANALYSIS</Text>
//               <View style={styles.scoreRow}>
//                 <View style={styles.scoreTextContainer}>
//                   <Text style={styles.percentageText}>
//                     {invertedScore}%
//                   </Text>
//                   <Text style={[styles.statusText, { color: cleanlinessColor }]}>
//                     {cleanlinessLabel}
//                   </Text>
//                 </View>
//                 <CircularProgress
//                   value={invertedScore}
//                   radius={40}
//                   activeStrokeColor={cleanlinessColor}
//                   inActiveStrokeColor="#2d2d2d"
//                   maxValue={100}
//                   duration={1000}
//                   valueSuffix={'%'}
//                 />
//               </View>

//               {/* Top Issues */}
//                 <Text style={styles.sectionTitle}>MAIN ISSUES</Text>
//                 <View style={styles.factorsContainer}>
//                   {Object.entries(scores)
//                     .sort(([,a], [,b]) => b - a)
//                     .slice(0, 3)
//                     .map(([factor, score]) => (
//                       <View key={factor} style={styles.factorItem}>
//                         <Text style={styles.factorName}>
//                           {factor.replace(/_/g, ' ').toUpperCase()}
//                         </Text>
//                         <Text style={[styles.factorScore, { 
//                           color: getCleanlinessColor(100 - (score * 10)) 
//                         }]}>
//                           {(100 - (score * 10)).toFixed(1)}%
//                         </Text>
//                       </View>
//                     ))}
//                 </View>
//             </View>

//            </Animated.View>
//           )

//         })()}

//         <TouchableOpacity
//           style={styles.closeButton}
//           onPress={() => setBeforeModalVisible(false)}
//         >
//           <Ionicons name="close" size={28} color="white" />
//         </TouchableOpacity>
//       </View>
//     </Modal>
// </View>
//   );
// };




// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: 'black',
//     // backgroundColor: COLORS.backgroundColor,
//     borderRadius:10
//   },
  
//   openCameraButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#007aff',
//     borderRadius: 10,
//     margin: 20,
//   },
//   openCameraText: {
//     color: 'white',
//     fontSize: 18,
//     marginTop: 10,
//   },
//   camera: {
//     flex: 20, // Adjusted to take more than half the screen
//     borderRadius:10,
//     overflow: 'hidden', // Ensure content respects borderRadius
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   button: {
//     alignItems: 'center',
//   },
//   captureButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     borderRadius: 35,
//     padding: 10,
//   },
//   sendButton: {
//     alignItems: 'center',
//   },
//   sendButtonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   sendButtonText: {
//     color: 'white',
//     fontSize: 16,
//     marginLeft: 5,
//   },
//   addButtonText: {
//     color: 'black',
//     fontSize: 14,
//     marginLeft: 5,
//   },
//   previewContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   thumbnailContainer: {
//     position: 'relative',
//     marginRight: 10,
//     marginTop:5
//   },
//   preview: {
//     width: 100,
//     height: 100,
//     borderRadius:5
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'white',
//     borderRadius: 50,
//     padding: 5,
//   },
//   roomContainer: {
//     marginVertical: 20,
//   },
//   roomTitle: {
//     fontSize: 18,
//     fontWeight: '500',
//     marginBottom: 0,
//   },
//   imageContainer: {
//     marginRight: 10,
//   },
//   image: {
//     width: 100,
//     height: 100,
//   },

//   taskContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 0,
//     flex: 1,
//   },
//   taskText: {
//     marginLeft: -5,
//     fontSize: 14,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between', // Create space between columns
//   },
//   horizontalLine: {
//     borderBottomColor: COLORS.light_gray_1,
//     borderBottomWidth: 1,
//     marginVertical: 10,
//   },
//   headline: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 0,
//     marginLeft:5
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



//   thumbnailContainer: {
//     position: 'relative', // Ensure overlay is positioned correctly
//     marginRight: 10,
//   },
//   percentageOverlay: {
//     position: 'absolute',
//     bottom: 5,
//     right: 5,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 10,
//   },
//   percentageText1: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },



//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   cleanlinessDetails: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 20,
//   },
//   detailHeader: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   scoreRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   detailLabel: {
//     color: '#cccccc',
//     fontSize: 14,
//     marginVertical: 5,
//   },
//   detailValue: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   factorRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 3,
//   },
//   factorName: {
//     color: 'white',
//     fontSize: 12,
//     flex:2
//   },
//   // factorScore: {
//   //   color: '#e74c3c',
//   //   fontSize: 12,
//   //   fontWeight: '500',
//   // },
//   closeModalButton: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     padding: 10,
//   },
//   percentageOverlay: {
//     position: 'absolute',
//     bottom: 5,
//     right: 5,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 10,
//   },

//   categoryHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   roomTitle: {
//     fontSize: 18,
//     fontWeight: '500',
//     flex: 1,
//     marginRight: 10,
//   },





//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   cleanlinessDetails: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.85)',
//     padding: 24,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//   },
//   detailHeader: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: '800',
//     marginBottom: 24,
//     textAlign: 'center',
//     letterSpacing: 0.5,
//   },
//   scoreRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   scoreTextContainer: {
//     flex: 1,
//     marginRight: 16,
//   },
//   percentageText: {
//     color: 'white',
//     fontSize: 36,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   statusText: {
//     fontSize: 18,
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   infoBox: {
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//   },
//   infoLabel: {
//     color: '#a0a0a0',
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 8,
//   },
//   infoValue: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: '700',
//   },
//   sectionTitle: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '700',
//     marginBottom: 16,
//     letterSpacing: 0.5,
//   },
//   factorsContainer: {
//     backgroundColor: 'rgba(255,255,255,0.05)',
//     borderRadius: 12,
//     padding: 8,
//   },
//   factorItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 3,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.1)',
//   },
//   // factorName: {
//   //   color: 'white',
//   //   fontSize: 14,
//   //   flex: 2,
//   // },
//   factorScore: {
//     fontSize: 14,
//     fontWeight: '600',
//     flex: 1,
//     textAlign: 'right',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 28,
//     right: 24,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   circularTitle: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: '700',
//   },

  
//   modal: {
//     margin: 0,
//     justifyContent: 'flex-end',
//   },
//   modalContainer: {
//     height: '100%',
//     width:'100%',
//     backgroundColor: 'black',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     overflow: 'hidden',
//   },
//   imageContainer: {
//     flex: 3, // Takes 3/4 of available space
//   },
//   detailsContainer: {
//     flex: 1, // Takes 1/4 of available space
//     padding: 16,
//     backgroundColor: 'rgba(0,0,0,0.85)',
//   },
//   footerOverlay: {
//     position: 'absolute',
//     bottom: 16,
//     right: 16,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 8,
//     borderRadius: 8,
//   },
//   imageCounter: {
//     color: 'white',
//     fontSize: 14,
//   },
//   // Keep previous cleanliness details styles but move them under detailsContainer
//   detailHeader: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   scoreRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   draggableContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.85)',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 16,
//     paddingBottom: 40,
//   },
//   dragHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.4)',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
//   cleanlinessDetails: {
//     maxHeight: 400,
//   },
//   fullSizeImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   // Update the draggableContainer styles
// // draggableContainer: {
// //   position: 'absolute',
// //   bottom: 0,
// //   left: 0,
// //   right: 0,
// //   backgroundColor: 'rgba(0,0,0,0.85)',
// //   borderTopLeftRadius: 24,
// //   borderTopRightRadius: 24,
// //   padding: 16,
// //   maxHeight: '80%', // Limit maximum height
// //   minHeight: 50, // Ensure handle remains visible
// // },
// // dragHandle: {
// //   width: 40,
// //   height: 6,
// //   backgroundColor: 'rgba(255,255,255,0.6)',
// //   borderRadius: 3,
// //   alignSelf: 'center',
// //   marginBottom: 16,
// //   position: 'absolute',
// //   top: 8,
// //   zIndex: 1,
// // },





// warningIcon: {
//   position: 'absolute',
//   top: 5,
//   left: 5,
//   backgroundColor: 'rgba(255,255,255,0.8)',
//   borderRadius: 10,
//   padding: 2,
// },
// factorsContainer: {
//   backgroundColor: 'rgba(255,255,255,0.1)',
//   borderRadius: 12,
//   padding: 8,
//   marginTop: 12,
// },
// factorItem: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   paddingVertical: 8,
//   borderBottomWidth: 1,
//   borderBottomColor: 'rgba(255,255,255,0.1)',
// },
// factorName: {
//   color: 'white',
//   fontSize: 14,
//   flex: 2,
// },
// factorScore: {
//   fontSize: 14,
//   fontWeight: '600',
//   flex: 1,
//   textAlign: 'right',
// },
// });

// export default TaskChecklistTest;







































// import React, { useEffect, useContext,useCallback, useState, useRef } from 'react';
// import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image, FlatList, ScrollView } from 'react-native';
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
// import COLORS from '../../constants/colors'; // Your predefined color constants
// import userService from '../../services/userService';
// import { AuthContext } from '../../context/AuthContext';
// import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
// import CardNoPrimary from '../../components/CardNoPrimary';
// import { Checkbox } from 'react-native-paper';
// // import { checklist } from '../../utils/tasks_photo';
// import ImageViewer from 'react-native-image-zoom-viewer';
// import Modal from 'react-native-modal';
// import { sendExpoPushNotification, sendPushNotification, sendPushNotifications } from '../../utils/sendPushNotification';
// import ROUTES from '../../constants/routes';

// const TaskChecklistTest = ({ scheduleId, tasksList, hostId }) => {
     
//   const {currentUserId, currentUser} = useContext(AuthContext)

//   // Use a ref to store the camera reference
//   const cameraRef = useRef(null);

  
//   const[tasks, setTasks] = useState([]);
//   const[isLoading, setIsLoading] = useState(false);
//   const[selected_images, setSelectedImages] = React.useState({})
//   const[selected_task_title, setSelectedTaskTitle] = React.useState("")

//   const [tasksByCategory, setTasksByCategory] = useState();

//   const[facing, setFacing] = useState('back');
//   const[permission, requestPermission] = useCameraPermissions();
//   const[photos, setPhotos] = useState([]);
//   const[cameraVisible, setCameraVisible] = useState(false); // New state to control camera visibility
//   const[images, setImages] = useState([])

//   const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [currentImages, setCurrentImages] = useState([]);
//   const[host_tokens, setHostPushToken] = useState([])


//   const fetchImages = async () => {
//     // Fetch images from the database
//     setIsLoading(true);
//       setTimeout(async () => {
//     await userService.getUpdatedImageUrls(scheduleId)
//     .then(response => {
//       const res = response.data.data
//       console.log("sooooooooooooooooon")
//       console.log(JSON.stringify(res.checklist, null, 2))
//       console.log("sooooooooooooooooon")
      
//       // Update checklist 
//       // const data = {
//       //   scheduleId:scheduleId,
//       //   checklist: checklist
//       // }
//       // userService.updateChecklist(data)
//       // .then(response=> {
//       //   // const res = response.data.data
//       // })
//       // Update state with the fetched images
//       setSelectedImages(res.checklist);
        
      

//       setTasks(res.checklist)
//       setIsLoading(false);
//     })
//   }, 2000); // Add a 2-second delay
    
//   };

//   const fetchCleanerPushTokens = async() => {
//     await userService.getUserPushTokens(hostId)
//     .then(response => {
//         const res = response.data.tokens
//         setHostPushToken(res)
//         console.log("User tokens", res)
//     })
//   }

//   // Execute fetchImages when the screen comes into focuss
//   useFocusEffect(
//     useCallback(() => {
//       fetchImages();
//       fetchCleanerPushTokens()
//     }, [])
//   );
  
//   useEffect(() => {
//     if (permission && !permission.granted) {
//       requestPermission();
//     }
//   }, [permission]);

  
//   if (permission === null) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return <Text>No access to camera</Text>;
//   }

//   const toggleCameraFacing = () => {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   };

  
//   const takePicture = async (taskTitle) => {
//     console.log("weeeeoeoeoeoeoeoeooeoeoes")
//     alert(taskTitle)
//     setSelectedTaskTitle(taskTitle)
//     setCameraVisible(true);
  
//     if (cameraRef.current) {
//       const options = { quality: 1, base64: true };
//       const newPhoto = await cameraRef.current.takePictureAsync(options);
  
//       // Update the photos state (immutably)
//       setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
  
//     //   // Avoid mutating existing images array, use a new array
//     //   const images = [];
  
//       // Add new photos to the updated images array
//       photos.forEach((i) => {
//         let imgSrc = "data:image/png;base64," + i.base64;
//         images.push({
//           filename: i.uri.replace(
//             'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540flavoursoft%252Ffresh-sweeper-1/Camera/',
//             ''
//           ),
//           file: imgSrc
//         });
//       });
  
//       // Avoid logging entire object with circular references
//       try {
//         console.log("Updated Images:", JSON.stringify(images));  // Safely log the updated images
//       } catch (error) {
//         console.error("Error logging updatedImages:", error.message);
//       }
//     }
//   };

  

//   const removePhoto = (index) => {
//     setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
//   };

  
  


//   const validateTasks = () => {
//     let invalidCategories = [];  // To store categories that are not validated
//     let categoriesWithInsufficientImages = [];  // To store categories with fewer than 3 images

//     // Loop through each category in the selected_images object
//     Object.keys(selected_images).forEach((category) => {
//         const tasks = selected_images[category].tasks;
//         const photos = selected_images[category].photos;

//         // Check if all tasks in this category are completed (i.e., value is true)
//         const allTasksCompleted = tasks.every(task => task.value === true);

//         // If any task is incomplete, mark this category as invalid
//         if (!allTasksCompleted) {
//             invalidCategories.push(category);  // Add the category to the invalid list
//         }

//         // Check if at least 3 images are uploaded for this category
//         if (photos.length < 3) {
//             categoriesWithInsufficientImages.push(category);  // Add the category with insufficient images
//         }
//     });

//     // Create alert messages based on the validation checks
//     if (invalidCategories.length > 0 || categoriesWithInsufficientImages.length > 0) {
//         let errorMessage = '';

//         if (invalidCategories.length > 0) {
//             errorMessage += `The following categories have incomplete tasks: ${invalidCategories.join(', ')}.\n`;
//         }

//         if (categoriesWithInsufficientImages.length > 0) {
//             errorMessage += `The following categories have fewer than 3 images: ${categoriesWithInsufficientImages.join(', ')}.`;
//         }

//         // Show the alert with appropriate error messages
//         alert(errorMessage);

//         // Return false since validation failed
//         return false;
//     }

//     // If all tasks are completed and at least 3 images are uploaded, return true
//     return true;
// };

//   const onSubmit1 = async() => {
//     setIsLoading(true);  // Show loading while uploading
//     if (validateTasks()) {
//         // Proceed with form submission or next action
//         console.log("All tasks are validated and sufficient images uploaded. Proceeding...");
//     } else {
//         console.log("Validation failed.");
//     }
  
//     console.log("l..........................l")
//         alert(selected_task_title)
//         console.log("l..........................l")

//         // console.log(images.substring(0, 100))
//         const data = {
//           photo_type:"after_photos",
//           scheduleId:scheduleId,
//           images:images,
//           currentUserId:currentUserId,
//           task_title:selected_task_title
//         }
    
//         await userService.uploadTaskPhotos(data)
//         .then(response => {
//           const res = response.data;
//           setIsLoading(false);  // Show loading while uploading
//           fetchImages();
//           console.log("Weeeeeeeeeeeeeep")
//           console.log(res)
//           console.log("Weeeeeeeeeeeeeep")
//           onCloseCamera()
//         }).catch((err) => {
//           console.log(err)
//         })
        
//       }


//       const onSubmit = async () => {
        
        
//           setIsLoading(true);
//           setTimeout(async () => {
//             const data = {
//               photo_type: "after_photos",
//               scheduleId: scheduleId,
//               images: images,
//               currentUserId: currentUserId,
//               task_title: selected_task_title,
//               updated_tasks: selected_images
//             };
    
//             try {
//               const response = await userService.uploadTaskPhotos(data);
//               fetchImages();
//               console.log("Upload Response:", response.data);
//             } catch (err) {
//               console.error(err);
//             } finally {
//               setIsLoading(false);
//               onCloseCamera();
//             }
//           }, 2000); // Add a 2-second delay
        
//       };

//       // Validate and complete cleaning
//       const completeCleaning = () => {
//           const allTasksComplete = tasks.every(task => task.completed && task.afterPhoto);

//           if (!allTasksComplete) {
//           Alert.alert("Incomplete Tasks", "Please complete all tasks and upload photos before finishing.");
//           return;
//           }

//           submitCompletion();
//       };

//   // Simulate completion submission
//   const submitCompletion = async() => {

//     if (validateTasks()) {
//       setIsLoading(true);
//       setTimeout(async () => {

//       const jobCompletionData = {
//         scheduleId: scheduleId,
//         completed_tasks: selected_images,
//         completionTime: new Date(),
//       };

//       try {
//         const response = await userService.finishCleaning(jobCompletionData);
//         fetchImages();
//         // console.log("Upload Response:", response.data);
        
//         const notificationMsg =`${currentUser.firstname} ${currentUser.lastname} has completed the cleaning`
//         alert(notificationMsg)
//         sendPushNotifications(
//           host_tokens, // Replace with a valid Expo Push Token
//           currentUser.firstname+" "+currentUser.lastname,
//           notificationMsg,
//               {
//                 screen: ROUTES.host_dashboard,
//                 params: {
//                     scheduleId:scheduleId,
//                 },
//               }
  
//         );
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
    
//     }, 2000); // Add a 2-second delay
//    }
    
//   };


// //   const toggleCheckbox = (id, rooname) => {
// //     const updatedTasks = checklist[rooname].map(task =>
// //       task.id === id ? { ...task, checked: !task.checked } : task
// //     );
// //     setMicroTasks(updatedTasks);
// //   };

//   const onCloseCamera = () => {
//     setCameraVisible(false)
//   }

  
// // Function to handle the checkbox toggle
// const handleTaskToggle = (category, taskId) => {
//     const updatedImages = { ...selected_images };

//     // Find the task and toggle its value
//     const tasks = updatedImages[category].tasks.map((task) => {
//       if (task.id === taskId) {
//         return { ...task, value: !task.value };
//       }
//       return task;
//     });

//     updatedImages[category].tasks = tasks;

//     // Update the state with the new tasks
//     setSelectedImages(updatedImages);
//     console.log(JSON.stringify(updatedImages,null, 2))

//     ///////////////////////////////////////////


//     // const updatedTasks = { ...tasksByCategory };

//     // updatedTasks[category].tasks = updatedTasks[category].tasks.map(task => 
//     //   task.id === taskId ? { ...task, value: !task.value } : task
//     // );

//     // setTasksByCategory(updatedTasks);
  
    
//   };

//   // Render task checkbox with label
//   const renderTask = ({ item }, category) => (
   
//     <View style={styles.taskContainer}>
//       <Checkbox
//         status={item.value ? 'checked' : 'unchecked'}
//         onPress={() => handleTaskToggle(category, item.id)} // Call toggle function
//       />
//       <Text>{item.label}</Text>
//     </View>
//   );

//   // Open modal and set images for the selected task title
//   const openImageViewer = (images, index) => {
//     const formattedImages = images.map(photo => ({ url: photo.img_url }));
//     setCurrentImages(formattedImages);
//     setCurrentImageIndex(index);
//     setBeforeModalVisible(true);
//   };

//   return (
//     <View style={styles.container}>

//       {/* Button to trigger camera visibility */}
//       {!cameraVisible && (
//         <View>
//           {isLoading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={COLORS.primary} />
//           <Text>Uploading...</Text>
//         </View>
//       )}
//           {!isLoading && (
//             <ScrollView>
//             <Text style={styles.headline}>Cleaning Checklist and Photo Upload</Text>
//             <Text style={styles.subheading}>Complete all cleaning tasks and upload at least 3 photos per category to ensure quality assurance.</Text>

//             {Object.keys(selected_images).map(taskTitle => (
//                 <CardNoPrimary>
//                  <View key={taskTitle} style={{marginBottom:20}}>
                     
//                      <Text style={styles.roomTitle}>
//                         {taskTitle}
//                      </Text>
                     
//                      <ScrollView horizontal style={styles.previewContainer}>
//                         {selected_images[taskTitle]["photos"].map((photo, index) => (
//                         <View key={index} style={styles.thumbnailContainer}>
//                             <TouchableOpacity
//                             key={index}
//                             onPress={() => openImageViewer(selected_images[taskTitle]["photos"], index)}
//                             style={styles.thumbnailContainer}
//                           >
//                             <Image source={{ uri: photo.img_url }} style={styles.preview} />
//                           </TouchableOpacity>
                            
//                         </View>
//                         ))}
//                     </ScrollView>
                    

                    
//                         <FlatList
//                             data={selected_images[taskTitle]["tasks"]}
//                             // renderItem={renderTask}
//                             renderItem={(item) => renderTask(item, taskTitle)} // Pass taskTi
//                             keyExtractor={item => item.id.toString()}
//                             numColumns={2} // Make 2 columns
//                             columnWrapperStyle={styles.columnWrapper} // Style the column wrapper
//                         />
        
//                     <View style={styles.horizontalLine} />

//                     <View style={{alignItems:'center'}}>
//                         {/* <Text onPress={() => takePicture()} style={{color:COLORS.primary}}>Upload Photos</Text> */}
//                         <TouchableOpacity style={styles.sendButton} onPress={() => takePicture(taskTitle)} >
//                             <View style={styles.sendButtonContent}>
//                                 <Ionicons name="cloud-upload" size={24} color="gray" />
//                                 <Text style={styles.addButtonText}>Add photo to {taskTitle}</Text>
//                             </View>
//                         </TouchableOpacity>
//                     </View>
//                     {/* <Button
//                         // title={item.afterPhoto ? "Change Photo" : "Upload Photo2"}
//                         title="Upload Photo2"
//                         onPress={() => takePicture()}
//                     />
//                     <Button
//                         // title={item.completed ? "Undo" : "Complete"}
//                         title="Complete"
//                         // onPress={() => toggleTaskCompletion(item.id)}
//                         // color={item.completed ? COLORS.success : COLORS.primary}
//                         color={COLORS.primary}
//                     /> */}
//                  </View>
//                  </CardNoPrimary>
//              ))}
//              {/* Finish Cleaning Button */}
//               <Button title="Finish Cleaning" onPress={submitCompletion} color={COLORS.success} />
//              </ScrollView>
//              )}
//         </View>
        
//       )}

//       {/* Conditionally render the CameraView */}

//       {cameraVisible && (
//         <CameraView 
//           style={styles.camera} 
//           facing={facing}
//           ref={cameraRef}
//         >

//             {/* Close Button */}
//         <TouchableOpacity style={styles.closeButton} onPress={onCloseCamera} >
//           <Ionicons name="close-circle" size={32} color="white" />
//         </TouchableOpacity>

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//               <Ionicons name="camera-reverse" size={40} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
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

//       {/* Display thumbnails */}
//       <ScrollView horizontal style={styles.previewContainer}>
//         {photos.map((photo, index) => (
//           <View key={index} style={styles.thumbnailContainer}>
//             <Image source={{ uri: photo.uri }} style={styles.preview} />
//             <TouchableOpacity onPress={() => removePhoto(index)} style={styles.removeButton}>
//               <Ionicons name="trash" size={24} color="red" />
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Modal with ImageViewer */}
//       <Modal
//           isVisible={isBeforeModalVisible}
//           style={styles.fullScreenModal}
//           onBackdropPress={() => setBeforeModalVisible(false)}
//         >
//           {/* <View style={styles.imageViewerContainer}> */}
//           <ImageViewer
//             imageUrls={currentImages}
//             index={currentImageIndex}
//             onClick={() => setBeforeModalVisible(false)}
//             enableSwipeDown
//             onSwipeDown={() => setBeforeModalVisible(false)}
//             backgroundColor="black"
//           />
          
//         {/* </View> */}
//         </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: 'black',
//     // backgroundColor: COLORS.backgroundColor,
//     borderRadius:10
//   },
 
//   openCameraButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#007aff',
//     borderRadius: 10,
//     margin: 20,
//   },
//   openCameraText: {
//     color: 'white',
//     fontSize: 18,
//     marginTop: 10,
//   },
//   camera: {
//     flex: 20, // Adjusted to take more than half the screen
//     borderRadius:10,
//     overflow: 'hidden', // Ensure content respects borderRadius
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 1, // Make sure the button is above the camera view
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   button: {
//     alignItems: 'center',
//   },
//   captureButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     borderRadius: 35,
//     padding: 10,
//   },
//   sendButton: {
//     alignItems: 'center',
//   },
//   sendButtonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   sendButtonText: {
//     color: 'white',
//     fontSize: 16,
//     marginLeft: 5,
//   },
//   addButtonText: {
//     color: 'black',
//     fontSize: 14,
//     marginLeft: 5,
//   },
//   previewContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   thumbnailContainer: {
//     position: 'relative',
//     marginRight: 10,
//     marginTop:10
//   },
//   preview: {
//     width: 100,
//     height: 100,
//     borderRadius:5
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'white',
//     borderRadius: 50,
//     padding: 5,
//   },
//   roomContainer: {
//     marginVertical: 20,
//   },
//   roomTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   imageContainer: {
//     marginRight: 10,
//   },
//   image: {
//     width: 100,
//     height: 100,
//   },

//   taskContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 0,
//     flex: 1,
//   },
//   taskText: {
//     marginLeft: -5,
//     fontSize: 14,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between', // Create space between columns
//   },
//   horizontalLine: {
//     borderBottomColor: COLORS.light_gray_1,
//     borderBottomWidth: 1,
//     marginVertical: 10,
//   },
//   headline: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 0,
//   },
//   subheading: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 22,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default TaskChecklistTest;









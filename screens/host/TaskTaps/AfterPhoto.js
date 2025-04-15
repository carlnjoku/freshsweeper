import React, { useContext, useCallback, useEffect,useState, useRef } from 'react';
// import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar,CheckBox, Linking, FlatList, ScrollView, View, TouchableOpacity, PanResponder, Animated, ActivityIndicator } from 'react-native';
import COLORS from '../../../constants/colors';
import userService from '../../../services/userService';
import { AuthContext } from '../../../context/AuthContext';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome} from '@expo/vector-icons'; 

import * as Animatable from 'react-native-animatable';
import { task_checklist } from '../../../data';
import Checklist from '../../../components/Checklist';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
import { Text } from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import CardColored from '../../../components/CardColored';
import CardNoPrimary from '../../../components/CardNoPrimary';
// import {Icon,MaterialIcons} from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome'; // For FontAwesome's minus icon
import CircularProgress from 'react-native-circular-progress-indicator';
import { Image } from 'expo-image'; 

export default function AfterPhoto({scheduleId}) {


  const[isLoading, setIsLoading] = useState(false);
  const[isBeforeModalVisible, setBeforeModalVisible] = useState(false);
  const[currentImageIndex, setCurrentImageIndex] = useState(0);
  const[currentImages, setCurrentImages] = useState([]);
  const[selected_images, setSelectedImages] = React.useState([])
  const[isDragging, setIsDragging] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);


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
        Animated.spring(pan, {
          toValue: { x: 0, y: 300 },
          useNativeDriver: false
        }).start();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    }
  })
).current;



  // Execute fetchImages when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchImages();
    }, [])
  );

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getUpdatedImageUrls(scheduleId);
      const res = response.data.data;
      setSelectedImages(res.checklist);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal and set images for the selected task title
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

  // const openImageViewer = useCallback((images, index) => {
  //   const formattedImages = images.map(photo => ({
  //     url: photo.img_url, // Always use original image
  //     props: {
  //       // Optional: Add heatmap overlay if needed
  //       overlay: photo.cleanliness?.heatmap_url ? (
  //         <Image 
  //           source={{ uri: photo.cleanliness.heatmap_url }}
  //           style={styles.heatmapOverlay}
  //           resizeMode="contain"
  //         />
  //       ) : null
  //     },
  //     cleanliness: photo.cleanliness,
  //     category: photo.category
  //   }));
  
  //   setCurrentImages(formattedImages);
  //   setCurrentImageIndex(index);
  //   setBeforeModalVisible(true);
  // }, []);


  // Render task checkbox with labels
  const renderTask = ({item}) => (
    <View style={styles.taskContainer}>
      <Text key={item.id} style={styles.taskText}>
       <Icon name= {item.value ? "check" : "minus"}  size={10} color={item.value ? "green" : "gray"} />  {item.label}
      </Text>
    </View>
  );

  const invertPercentage = (score) => 100 - (score * 10);

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
  const getCleanlinessIcon = (invertedScore) => {
    if (invertedScore <= 35) return 'times';  // Red
    if (invertedScore <= 40) return 'exclamation'; // Yellow
    return 'check';                           // Green
  };
    
  return (
    <SafeAreaView
          style={{
            flex:1,
            backgroundColor:COLORS.white,
            marginBottom:0,

          }}
        >
          <ScrollView>
        <Animatable.View animation="fadeIn" duration={550}>
        {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
            ) : (
            <View style={styles.photosContainer}>
              {Object.keys(selected_images).map(taskTitle => (
                <CardNoPrimary>
                 <View key={taskTitle} style={{marginBottom:20}}>
                     
                    <Text style={styles.roomTitle}>
                      {taskTitle}
                    </Text>
                     
                    <ScrollView horizontal style={styles.previewContainer}>
                        {selected_images[taskTitle]["photos"].map((photo, index) => {
                          
                          const invertedIndividualScore = invertPercentage(photo.cleanliness.individual_overall);

                          return(
                          <View>
                            <View key={index} style={styles.thumbnailContainer}>
                              <TouchableOpacity
                                key={index}
                                onPress={() => openImageViewer(selected_images[taskTitle]["photos"], index)}
                                style={styles.thumbnailContainer}
                              >
                                
                                <Image 
                                  source={{ uri: photo.img_url }} 
                                  style={styles.preview} 
                                  cachePolicy="memory-disk"
                                  transition={300}
                                />
                              </TouchableOpacity>
                              <View style={[styles.warningIcon, { backgroundColor: getCleanlinessColor(invertedIndividualScore) }]}>
                                <FontAwesome 
                                  name={getCleanlinessIcon(invertedIndividualScore)} 
                                  size={18}  // Reduce size slightly for better fit
                                  color="white" 
                                />
                              </View>
                            </View>
                        </View>
                        )
                    })}
                    </ScrollView>
                        
                    <FlatList
                        data={selected_images[taskTitle]["tasks"]}
                        renderItem={(item) => renderTask(item, taskTitle)} // Pass taskTi
                        keyExtractor={item => item.id.toString()}
                        numColumns={2} // Make 2 columns
                        columnWrapperStyle={styles.columnWrapper} // Style the column wrapper
                    />

            
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
                      
    
                        <View style={styles.imageViewerWrapper}>
                        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
                          
                        <View style={styles.modalContainer}>
                          {/* <ImageViewer
                            imageUrls={currentImages}
                            index={currentImageIndex}
                            onClick={() => setBeforeModalVisible(false)}
                            enableSwipeDown
                            onSwipeDown={() => setBeforeModalVisible(false)}
                            backgroundColor="black"
                          /> */}
                          


                          <ImageViewer
                            imageUrls={currentImages}
                            index={currentImageIndex}
                            backgroundColor="black"
                            enableSwipeDown
                            enableImageZoom
                            onCancel={() => setBeforeModalVisible(false)}
                            
                            // renderImage={(props) => (
                            //   <Image
                            //     {...props}
                            //     style={styles.fullSizeImage}
                            //     resizeMode="contain"
                            //   />
                            // )}

                            renderImage={(props) => (
                                <Image
                                  {...props}
                                  style={styles.fullSizeImage}
                                  resizeMode="contain"
                                  transition={400}
                                  cachePolicy="memory-disk"
                            
                                />
                            )}
                            
                            onChange={(index) => {
                              setCurrentImageIndex(index);
                              setIsImageLoading(true); // Show loader when changing images
                              pan.setValue({ x: 0, y: 0 });
                            }}
                            renderHeader={() => (
                              <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setBeforeModalVisible(false)}
                              >
                                <Ionicons name="close" size={28} color="white" />
                              </TouchableOpacity>
                            )}
                          />

                          
                          </View>

                        {currentImages[currentImageIndex]?.cleanliness && (() => {
                          

                          // Individual image analysis
                          const cleanlinessData = currentImages[currentImageIndex].cleanliness;
                          const individualOverall = cleanlinessData.individual_overall || 0;
                          const invertedIndividualScore = invertPercentage(individualOverall);
                          
                          // Category average analysis
                          const category = currentImages[currentImageIndex].category;
                          const categoryPhotos = selected_images[category]?.photos || [];
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
                          
                          )

                        })()}

                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => setBeforeModalVisible(false)}
                        >
                          <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>
                        </View>
                        </View>
                      </Modal>
                     
                    
                 </View>
                 </CardNoPrimary>
             ))}
              </View>
          )}

        </Animatable.View>

      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  photosContainer: {
    marginLeft: 5,
    marginRight:5
  },
  thumbnails:{
    width: 102,
    height:102,
    borderRadius:5,
    margin:5
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 5,
    marginTop:5
  },
  previewContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  roomContainer: {
    marginVertical: 20,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 0,
  },

  warningIcon: {
    position: 'absolute',
    top: 70,
    left: 65,
    width: 30,
    height: 30,
    borderRadius: 15, // Make it a perfect circle
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    display: 'flex',
  },

  preview: {
    width: 100,
    height: 100,
    borderRadius:5
  },
  columnWrapper: {
    justifyContent: 'space-between', // Create space between columns
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    flex: 1,
  },
  taskText: {
    marginLeft: 0,
    fontSize: 12,
    color:COLORS.gray
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
factorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  fullScreenModal: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageViewerWrapper: {
    flex: 1,
    zIndex: 1,
  },
  draggableContainer: {
    position: 'absolute',
    bottom: -40, // Start slightly hidden
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingBottom: 40,
    zIndex: 2, // Ensure it's above image viewer
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
    gap: 20,
  },
  heatmapOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
    zIndex: 2,
  },
  imageContainer: {
    flex: 1, // Add this
    // Remove marginRight
  },
  fullSizeImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  factorsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 8,
    marginTop: 12,
  },
})

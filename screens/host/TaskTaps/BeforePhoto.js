import React, { useContext, useCallback, useEffect,useState } from 'react';
import Text from '../../../components/Text';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
import { SafeAreaView,StyleSheet, StatusBar, useWindowDimensions, Linking, FlatList, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import COLORS from '../../../constants/colors';
import userService from '../../../services/userService';

import { AuthContext } from '../../../context/AuthContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import TaskImages from '../../../components/TaskImages';
import * as Animatable from 'react-native-animatable';
import { HomeSkeleton } from '../../../components/skeleton/HomeSkeleton';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import CardNoPrimary from '../../../components/CardNoPrimary';
import { Avatar} from 'react-native-paper';
import { Image } from 'expo-image'; 






  const BeforePhoto = ({scheduleId, schedule}) => {

    

    const genericArray = new Array(9).fill(null);
    const {currentUserId} = useContext(AuthContext)

    const[isLoading, setIsLoading] = useState(false);
    const[firstname, setFirstname] = useState("")
    const[lastname, setLastname] = useState("")
    const[username, setUsername] = useState("")
    const[avatar, setAvatar] = useState("")
    const[isOpenImages, setIsOpenImages] = useState(false);
    const[images, setImages] = React.useState([])
    const[selected_images, setSelectedImages] = React.useState([])

    const { width } = useWindowDimensions();
    const numColumns = 3;
    const columnWidth = width / numColumns - 26; // Adjusted width to accommodate margins
    
    const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentImages, setCurrentImages] = useState([]);

    useEffect(() => {
      fetchUser()
    },[])

    // Execute fetchImages when the screen comes into focus
    useFocusEffect(
      useCallback(() => {
        fetchImages();
      }, [])
    );

    useFocusEffect(
      useCallback(() => {
        let isMounted = true; // Track if component is mounted
    
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const response = await userService.getUpdatedImageUrls(scheduleId);
            if (isMounted) { // Only update state if mounted
              const res = response.data.data;
              setSelectedImages(res.before_photos);
            }
          } catch (error) {
            console.log(error);
          } finally {
            if (isMounted) { // Only update state if mounted
              setIsLoading(false);
            }
          }
        };
    
        fetchData();
    
        return () => { // Cleanup function when component unmounts
          isMounted = false;
        };
      }, [scheduleId]) // Add dependencies if needed
    );

    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await userService.getUpdatedImageUrls(scheduleId);
        const res = response.data.data;
        setSelectedImages(res.before_photos);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    

    // Function to open the Before Photos modal
    const openBeforeModal = (startIndex) => {
      // Convert before photos array to the format required by ImageViewer
      const formattedBeforePhotos = selected_images.map(photo => ({ url: photo.img_url }));
      setImages(formattedBeforePhotos);
      setCurrentImageIndex(startIndex);
      setBeforeModalVisible(true);
    };

    

    const renderThumbnails = ({ item, drag, isActive, index }) => (
      <TouchableOpacity
        disabled={isActive}
        style={[
          styles.rowItem,
          { backgroundColor: isActive ? COLORS.gray : item.backgroundColor },
        ]}
        onPress={() => openBeforeModal(index)}
        
      >
        
        {/* <Image 
          source={{uri:item.img_url}} 
          style={styles.thumbnails} 
          resizeMode="cover" 
        /> */}
      </TouchableOpacity>
    
      
    )
    const renderThumbnails1 = ({ item, drag, isActive }) => (
      <TouchableOpacity
        disabled={isActive}
        style={[
          styles.rowItem,
          { backgroundColor: isActive ? COLORS.gray : item.backgroundColor },
        ]}
      >
        <HomeSkeleton width={110} height={110} />
      </TouchableOpacity>
    
      
    )
    
    const fetchUser = async () => {
      try {
        
        // setLoading(true)
        
        await userService.getUser(currentUserId)
        .then(response=> {
          const res = response.data
          console.log(res.firstname)
          setUsername(res.username)
          setFirstname(res.firstname)
          setLastname(res.lastname)
        })
    
        // setLoading(false)
  
      } catch(e) {
        // error reading value
        console.log(e)
      }
    }

    // Open modal and set images for the selected task title
    // const openImageViewer = (images, index) => {
    //   const formattedImages = images.map(photo => ({
    //     url: photo.img_url,
    //     props: {
    //       source: { uri: photo.img_url }
    //     }
    //   }));
    //   setCurrentImages(formattedImages);
    //   setCurrentImageIndex(index);
    //   setBeforeModalVisible(true);
    // };

    // const openImageViewer = (images, index) => {
    //   console.log("photos to display", images)
    //   const formattedImages = images.map(photo => ({
    //     url: photo.img_url,  // ImageViewer expects direct "url" property
    //     // Remove the nested props since we're using url directly
    //   }));
    //   console.log("photos to display", formattedImages)
    //   setCurrentImages(formattedImages);
    //   setCurrentImageIndex(index);
    //   setBeforeModalVisible(true);
    // };

    const openImageViewer = (images, index) => {
      console.log("Original photos:", images);
      const formattedImages = images.map(photo => {
        console.log("Photo URL validation:", photo.img_url); // Verify URL format
        return { url: photo.img_url };
      });
      console.log("Formatted images:", formattedImages);
      setCurrentImages(formattedImages);
      setCurrentImageIndex(index);
      setBeforeModalVisible(true);
    };

  return (
    <SafeAreaView
          style={{
            flex:1,
            backgroundColor:COLORS.white,
            // justifyContent:"center",
            // alignItems:"center",
            marginBottom:0,

          }}
        >
          
          <ScrollView>

          <Animatable.View animation="fadeIn" duration={550}>
          <View style={styles.container}>
          <View>
            <View style={{marginLeft:0}}>
      
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
                        {selected_images[taskTitle]?.photos?.map((photo, index) => (
                          <TouchableOpacity
                            key={`${taskTitle}-${index}`}
                            // onPress={() => openImageViewer(selected_images[taskTitle].photos, index)}
                            onPress={() => {
                              console.log('Image URLs:', photo.img_url);
                              openImageViewer(selected_images[taskTitle].photos, index);
                            }}
                            style={styles.thumbnailContainer}
                          >
                            <Image 
                              source={{ uri: photo.img_url }} 
                              style={styles.preview} 
                              transition={300}
                            />
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                    
                 </View>
                 </CardNoPrimary>
             ))}
              </View>
          )}
            </View>
          </View>
        


          <View style={{marginLeft:5}}>
    
              <FlatList 
                data = {selected_images}
                renderItem = {renderThumbnails}
                keyExtractor={(item, index)=> item.index} 
                numColumns={numColumns}
                key={numColumns}
                showsVerticalScrollIndicator={true}
              />
            
          </View>
        </View>
        </Animatable.View>

        
        </ScrollView>
       
        {/* Modal with ImageViewer */}
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
                onCancel={() => setBeforeModalVisible(false)}
                renderHeader={() => (
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setBeforeModalVisible(false)}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="white" />
                  </TouchableOpacity>
                )}
                renderImage={(props) => (
                  <Image
                    {...props}
                    source={props.source} // Correctly use the source from ImageViewer
                    style={styles.fullSizeImage}
                    contentFit="contain"
                    transition={300}
                  />
                )}
              />
            </View>
          </Modal>
    </SafeAreaView>
    
   
  )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal: 0,
    marginVertical:20
  },
  uploadButton:{
      width:'100%',
      alignSelf:'center',
      marginTop:0,
      marginBottom:10,
      padding:20,
      height:80, 
      backgroundColor: COLORS.primary_light_1,  
      borderStyle:'dashed',
      borderWidth:2,
      borderColor:COLORS.primary,
      borderRadius:8, 
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center'
    },
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
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 0,
    },
    imageContainer: {
      marginRight: 10,
    },
    preview: {
      width: 100,
      height: 100,
      borderRadius:5
    },
    loader:{
      flex:1,justifyContent:'center',
      alignItems:'center',
      marginTop:100
    },
    
    fullScreenModal: {
      margin: 0,
      justifyContent: 'center',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'black',
    },
    fullSizeImage: {
      width: '100%',
      height: '100%',
    },

    closeButton: {
      position: 'absolute',
      backgroundColor: 'rgba(255,255,255,0.2)',
      top: 40,
      right: 20,
      borderRadius: 20,
      zIndex: 1,
      padding: 10,
    }
    
})

export default BeforePhoto



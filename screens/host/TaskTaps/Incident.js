import React, { useContext, useCallback, useEffect,useState } from 'react';
import Text from '../../../components/Text';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
import { SafeAreaView,StyleSheet, StatusBar, useWindowDimensions, Linking, FlatList, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import COLORS from '../../../constants/colors';
import userService from '../../../services/userService';
import { AuthContext } from '../../../context/AuthContext';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { HomeSkeleton } from '../../../components/skeleton/HomeSkeleton';
import CardNoPrimary from '../../../components/CardNoPrimary';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Image } from 'expo-image'; 





  const Incident = ({scheduleId, schedule}) => {


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
    
    const [viewerVisible, setViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentImages, setCurrentImages] = useState([]);
    const [incidents, setIncidents] = useState([]);
    
    
    
  // Data fetching
  const fetchIncidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userService.getIncidents(scheduleId);
      const res = response.data.data;
      setIncidents(res.incidents);
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId]);

    useEffect(() => {
      fetchIncidents()
      fetchUser()
    },[])

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
        setSelectedImages(res.before_photos);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    

  // const openImageViewer = (images, index) => {
  //   console.log("Brownnnnnn", images)
  //   setCurrentImages(images);
  //   setCurrentImageIndex(index);
  //   setViewerVisible(true);
  // };

  const openImageViewer = (images, index) => {
    console.log("Images data:", images); // Verify image data structure
    setCurrentImages(images.map(img => ({ url: img.url }))); // Ensure proper format
    setCurrentImageIndex(index);
    setViewerVisible(true);
  };

    
    
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
          <View style={styles.container}>

  

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <View>
            <FlatList
              data={incidents}
              keyExtractor={(item) => item.reported_at}
              renderItem={({ item }) => (
                
                  <View style={styles.photosContainer}>
                    <CardNoPrimary>
                      <FlatList
                        horizontal
                        data={item.photos}
                        keyExtractor={(photo, index) => `${index}`}
                        renderItem={({ item: photo, index }) => (
                          <View style={styles.imageContainer}>
                            <TouchableOpacity 
                              onPress={() => openImageViewer(item.photos, index)}
                            >
                              <Image 
                                source={{ uri: photo.url }} 
                                style={styles.incidentImage}
                                transition={300}
                                cachePolicy="memory-disk" 
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                      <Text style={styles.incidentDescription}>{item.description}</Text>
                    </CardNoPrimary>
                  </View>
           
             
            )}
          />
      </View>
    )}


          {/* <View style={{marginLeft:5}}>
    
              <FlatList 
                data = {selected_images}
                renderItem = {renderThumbnails}
                keyExtractor={(item, index)=> item.index} 
                numColumns={numColumns}
                key={numColumns}
                showsVerticalScrollIndicator={true}
              />
            
          </View> */}
        </View>
        </Animatable.View>

        
        </ScrollView>

        
        <Modal 
          isVisible={viewerVisible}
          style={styles.fullScreenModal} 
          onBackdropPress={() => setViewerVisible(false)}
        >
            <View style={styles.imageViewerContainer}>
              <ImageViewer
                imageUrls={currentImages}
                index={currentImageIndex}
                enableSwipeDown
                onSwipeDown={() => setViewerVisible(false)}
                backgroundColor="black"
                renderImage={(props) => (
                  <Image
                    source={{ uri: props.source.uri }}
                    style={styles.fullSizeImage}
                    contentFit="contain"
                    transition={300}
                    cachePolicy="memory-disk"
                  />
                )}
                renderHeader={() => (
                  <TouchableOpacity
                    style={styles.viewerCloseButton}
                    onPress={() => setViewerVisible(false)}
                  >
                    <Ionicons name="close" size={28} color="white" />
                  </TouchableOpacity>
                )}
              />
            </View>
        </Modal>
    </SafeAreaView>
    
   
  )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal:0,
    marginVertical:0
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
    thumbnails:{
      width: 102,
      height:102,
      borderRadius:5,
      margin:5
    },
    container0: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
        marginVertical: 10,
      },
      cleanersContainer: {
        flexDirection: 'row',
        marginBottom: 20,
      },
      estimatedTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      startTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      timeLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.black,
      },
      timeText: {
        fontSize: 14,
        color: COLORS.gray,
      },
      fullScreenModal: {
        margin: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
      },
      imageViewerContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
      },
      fullSizeImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
      },
      incidentContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      photosContainer:{
        marginHorizontal:5
      },
      imageContainer: {
        position: 'relative',
        marginRight: 12,
        marginBottom: 12,
      },
      incidentImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
      },


      incidentDescription: {
        fontSize: 14,
        color: COLORS.darkGray,
        lineHeight: 20,
      },

      // imageViewerContainer: {
      //   flex: 1,
      //   backgroundColor: 'black',
      // },
      viewerCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 8,
      },
      
      loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      emptyText: {
        fontSize: 16,
        color: COLORS.gray,
        marginTop: 16,
        textAlign: 'center',
      },
    
})

export default Incident

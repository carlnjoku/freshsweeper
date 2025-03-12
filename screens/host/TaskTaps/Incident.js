import React, { useContext, useCallback, useEffect,useState } from 'react';
import Text from '../../../components/Text';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
import { SafeAreaView,StyleSheet, StatusBar, useWindowDimensions, Linking, FlatList, ScrollView, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
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
    
    const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      fetchUser()
    },[])

    // Execute fetchImages when the screen comes into focus
    useFocusEffect(
      useCallback(() => {
        fetchImages();
      }, [])
    );

    console.log("schedule..................")
    // console.log(schedule)
    console.log("schedule..................")

      const estimatedTime = '10:54'
      const startTime = '10:54'
    // const fetchImages = async () => {
    //   // Fetch images from the database
    //   setIsLoading(true);
    //   await userService.getUpdatedImageUrls(scheduleId)
    //   .then(response => {
    //     const res = response.data.data
    //     console.log(res.after_task_photos)
    //     // Update state with the fetched images
    //     setSelectedImages(res.after_task_photos);
    //     setIsLoading(false);
    //   })
    // };
    

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
        
        <Image 
          source={{uri:item.img_url}} 
          style={styles.thumbnails} 
          resizeMode="cover" 
        />
        
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

            <Text bold style={{fontSize:16, marginBottom:5 }}>Incident Reports</Text>
            <Text style={{fontSize:14, marginBottom:15, color:COLORS.gray}}>
              Coming soon.
            </Text>
            
          
          {isLoading && (
          <View>
            <View style={{marginLeft:5}}>
              <FlatList 
                data = {selected_images}
                renderItem = {renderThumbnails1}
                keyExtractor={(item, index)=> item.key} 
                numColumns={numColumns}
                key={numColumns}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
          )}


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
        <Modal isVisible={isBeforeModalVisible} style={styles.fullScreenModal} onBackdropPress={() => setBeforeModalVisible(false)}>
            <ImageViewer
                imageUrls={images}
                index={currentImageIndex}
                onClick={() => setBeforeModalVisible(false)}
                enableSwipeDown
                onSwipeDown={() => setBeforeModalVisible(false)}
                backgroundColor="black"
            />
        </Modal>
    </SafeAreaView>
    
   
  )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal:10,
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
        margin: 0, // Removes any default margin
        justifyContent: 'center', // Centers content vertically
        alignItems: 'center',     // Centers content horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Adds a semi-transparent background
      },
    
})

export default Incident

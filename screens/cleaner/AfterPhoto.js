import React, { useContext, useCallback, useEffect,useState } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, useWindowDimensions, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TaskImages from '../../components/TaskImages';
import * as Animatable from 'react-native-animatable';
import { HomeSkeleton } from '../../components/skeleton/HomeSkeleton';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';




export default function AfterPhoto({scheduleId}) {

    const {currentUserId} = useContext(AuthContext)
    const genericArray = new Array(9).fill(null);

    const[isLoading, setIsLoading] = useState(false);
    const[firstname, setFirstname] = useState("")
    const[lastname, setLastname] = useState("")
    const[username, setUsername] = useState("")
    const[avatar, setAvatar] = useState("")
    const[isOpenImages, setIsOpenImages] = useState(false);
    const[images, setImages] = React.useState([])
    const[selected_images, setSelectedImages] = React.useState([])

    const [isAfterModalVisible, setAfterModalVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { width } = useWindowDimensions();
    const numColumns = 3;
    const columnWidth = width / numColumns - 26; // Adjusted width to accommodate margins
    


    useEffect(() => {
      fetchUser()
    },[])
    

    // Execute fetchImages when the screen comes into focus
    useFocusEffect(
      useCallback(() => {
        fetchImages();
      }, [])
    );
      
    const fetchImages = async () => {
      // Fetch images from the database
      await userService.getUpdatedImageUrls(scheduleId)
      .then(response => {
        const res = response.data.data
        console.log("sooooooooooooooooon")
        console.log(res.after_task_photos)
        console.log("sooooooooooooooooon")
        // Update state with the fetched images
        setSelectedImages(res.after_task_photos);
        setIsLoading(false);
      })
      
    };

    const onSubmit = async() => {
      const data = {
        photo_type:"after_photos",
        scheduleId:scheduleId,
        images:images,
        currentUserId:currentUserId,
        task_title:""
      }

      await userService.uploadTaskPhotos(data)
      .then(response => {
        const res = response.data;
        fetchImages();
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    }

    // Function to open the After Photos modal
    const openAfterModal = (startIndex) => {
        // Convert after photos array to the format required by ImageViewer
        const formattedAfterPhotos = selected_images.map(photo => ({ url: photo.img_url }));
        setImages(formattedAfterPhotos);
        setCurrentImageIndex(startIndex);
        setAfterModalVisible(true);
    };

    const renderThumbnails = ({ item, drag, isActive, index }) => (
      <TouchableOpacity
        disabled={isActive}
        style={[
          styles.rowItem,
          { backgroundColor: isActive ? COLORS.gray : item.backgroundColor },
        ]}
        onPress={() => openAfterModal(index)}
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
        
        <HomeSkeleton width={102} height={102} />
      </TouchableOpacity>
    
      
    )

  const pickImage = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection:true,
      mediaType: 'photo',
      base64: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
    
      let new_results = result.assets
    
      // console.log(new_results)
      new_results.forEach((i) => {

        let imgSrc = "data:image/png;base64," + i.base64;
        images.push({filename:i.uri.replace('file:///data/user/0/host.exp.exponent/cache/ImagePicker/', ''), file:imgSrc })
        
      })

      // setImageErrors("")
      setIsOpenImages(true)
      onSubmit()
    }
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
            // justifyContent:"center",
            // alignItems:"center",
            marginBottom:0,

          }}
        >
          <Animatable.View animation="slideInRight" duration={550}>
          <View style={styles.container}>
      
            <Text bold style={{fontSize:16, marginBottom:5 }}>After Pictures</Text>
            <Text style={{fontSize:14, marginBottom:15, color:COLORS.gray}}>
              Remember to upload the after photos before you clock-out.
            </Text>
            
          <TouchableOpacity onPress={pickImage("Bedroom")}>
              <View style={styles.uploadButton}>
              
                <MaterialCommunityIcons name="cloud" style={{fontSize:40, color:COLORS.primary}} />
                <Text style={{color:COLORS.secondary}}>Upload photos</Text>
              
              </View>
          </TouchableOpacity>

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

        {/* Modal for After Photos */}
        <Modal isVisible={isAfterModalVisible} style={styles.fullScreenModal} onBackdropPress={() => setAfterModalVisible(false)}>
            <ImageViewer
                imageUrls={images}
                index={currentImageIndex}
                onClick={() => setAfterModalVisible(false)}
                enableSwipeDown
                onSwipeDown={() => setAfterModalVisible(false)}
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
      width:100,
      height:100,
      borderRadius:5,
      margin:5
    },
    fullScreenModal: {
      margin: 0,
  },
    
})



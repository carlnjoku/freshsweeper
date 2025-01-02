import React from 'react';
import { SafeAreaView,StyleSheet, Text, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Chip } from 'react-native-paper';
import COLORS from '../../../constants/colors';
import JobCard from '../../../components/cleaner/JobCard';
import ImageViewer from 'react-native-image-zoom-viewer';

export default function Completed({schedules}) {

    const [selectedFilter, setSelectedFilter] = React.useState("All");
    const [isImageViewerVisible, setIsImageViewerVisible] = React.useState(false);
    const [images, setImages] = React.useState([]);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  
    const filters = ["All", "last 7 days", "last 30 days", "Custom"];

    const openImageViewer = (imagesArray, index) => {
      console.log(imagesArray)
      const formattedImages = imagesArray.map((img) => ({ url: img.url }));
      setImages(formattedImages);
      setCurrentImageIndex(index);
      setIsImageViewerVisible(true);
    };
  
    return (
      <View style={styles.container}>
        <Animatable.View animation="fadeIn" duration={550}>
        <View style={styles.filterContainer}>
          {filters.map((filter, index) => (
            <Chip
              key={index}
              mode="flat"
              style={selectedFilter === filter ? styles.activeChip : styles.chip}
              textStyle={selectedFilter === filter ? styles.activeText : styles.text}
              onPress={() => setSelectedFilter(filter)}
            >
              {filter}
            </Chip>
          ))}
        </View>
        
        <FlatList
          data={schedules}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <JobCard 
              schedules={item} 
              onImagePress={(imagesArray, index) => openImageViewer(imagesArray, index)} 
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No completed jobs found</Text>}
        />

        {/* Modal for ImageViewer */}
        <Modal
          visible={isImageViewerVisible}
          transparent={true}
          onRequestClose={() => setIsImageViewerVisible(false)}
        >
          <ImageViewer
            imageUrls={images}
            index={currentImageIndex}
            onSwipeDown={() => setIsImageViewerVisible(false)}
            enableSwipeDown
            backgroundColor="black"
          />
        </Modal>
        </Animatable.View>
      </View>
    );
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#f9f9f9',
      paddingTop: 10,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    chip: {
      backgroundColor: COLORS.light_gray_1,
      // borderColor:COLORS.primary
      borderRadius:50
    },
    activeChip: {
      backgroundColor: COLORS.primary_light_1,
      borderRadius:50
      // borderColor:COLORS.black,
    },
    list: {
      paddingBottom: 20,
    },
    emptyText: {
      color: '#888',
      textAlign: 'center',
      marginTop: 20,
    },
    text: {
      fontSize: 12,
      color: '#000',
    },
    activeText: {
      fontSize: 12,
      // fontWeight: 'bold',
      color: COLORS.black,
    },
  });

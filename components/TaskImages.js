import React, { useState } from 'react';
import { View, FlatList, Modal, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { Swipeable, PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const data = [
  { id: 1, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/skoodee-chat-app.appspot.com/o/product_images%2F85d0978f-9684-4efe-b0fb-ebed7079fe55.jpeg?alt=media' },
  { id: 2, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/skoodee-chat-app.appspot.com/o/product_images%2F097debcc-bd32-4793-9947-07413abc5738.jpeg?alt=media' },
  { id: 3, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/skoodee-chat-app.appspot.com/o/product_images%2F097debcc-bd32-4793-9947-07413abc5738.jpeg?alt=media' },
  // Add more image data as needed
];

const TaskImages = ({images}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });


  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const handleSwipeRight = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleSwipeLeft = () => {
    if (selectedImageIndex < data.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleGestureEvent = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      setDragOffset({ x: dragOffset.x + nativeEvent.translationX, y: dragOffset.y + nativeEvent.translationY });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item, index)=> item.key} 
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleImagePress(index)}>
            <Image 
                source={{ uri: item.file }}
                style={styles.thumbnail} />
          </TouchableOpacity>
       
        )}
        numColumns={3}
      />

      

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <Swipeable onSwipeRight={handleSwipeRight} onSwipeLeft={handleSwipeLeft}>
            <PanGestureHandler onGestureEvent={handleGestureEvent}>
              <View style={styles.modalContent}>
                <Image
                  source={{ uri: data[selectedImageIndex]?.imageUrl }}
                  style={[styles.expandedImage, { transform: [{ translateX: dragOffset.x }, { translateY: dragOffset.y }] }]}
                />
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </PanGestureHandler>
          </Swipeable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  thumbnail: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    margin: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: width - 40,
    height: height - 80,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  expandedImage: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TaskImages;

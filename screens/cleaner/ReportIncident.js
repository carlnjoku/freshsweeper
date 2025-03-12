import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import userService from '../../services/userService';
import axios from 'axios';
import FormData from 'form-data';
import * as FileSystem from 'expo-file-system';

const ReportIncident = ({scheduleId}) => {

  const cameraRef = useRef(null);

  const [hasPermission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [incidentImages, setIncidentImages] = useState([]);
  
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidents, setIncidents] = useState([]);
  const[facing, setFacing] = useState('back');

   
  const uploadIncident = async (scheduleId, description, incidentImages) => {
    // const formData = new FormData();
  

// const parts = [
//     ["scheduleId", scheduleId],
//     ["description", description],
//     ...incidentImages.map(image => ["files", image]),
//   ];

//   const formData = new FormData();
//   formData.append("parts", JSON.stringify(parts));


  const formData = new FormData();

//   // Append Schedule ID and Description
//   formData.append('scheduleId', scheduleId);
//   formData.append('description', description);

//   // Append Files
//   for (const uri of incidentImages) {
//     const fileName = uri.split('/').pop();
//     const fileType = 'image/jpeg'; // Adjust fileType if necessary

//     formData.append('files', {
//       uri, // Raw URI
//       name: fileName,
//       type: fileType,
//     });
//   }

formData.append('scheduleId', scheduleId);
formData.append('description', description);

for (const uri of incidentImages) {
  const fileName = uri.split('/').pop();
  const fileType = 'image/jpeg'; // Adjust based on file type
  const fileData = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  formData.append('files', {
    uri: uri,
    name: fileName,
    type: fileType,
  });
}

console.log('FormData:', formData);

    try {
      
        // Send POST request to the API endpoint
        // const response = await axios.post(
        //     "http://rnvjn-67-80-224-161.a.free.pinggy.link/task_photos/upload-incident-photos",
        //     formData,
        //     {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     },
        //     }
        // );
  
      console.log(JSON.stringify(formData, null, 2))
      
      const response = await userService.uploadPhotosIncidentPhotos(formData)
      console.log('Upload Response:', response.data);
    } catch (error) {
      console.error('Upload Error:', error.response?.data || error.message);
    }
  };
  

  const handleAddIncident = () => {

    uploadIncident(scheduleId, incidentDescription, incidentImages)
    const newIncident = {
      id: Date.now(),
      images: incidentImages,
      description: incidentDescription,
    };
    setIncidents([...incidents, newIncident]);
    setIncidentImages([]);
    setIncidentDescription('');
    setModalVisible(false);
  };

  const openCamera = async () => {
    if (!hasPermission) {
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    setCameraVisible(true);
  };

  const handleTakePhoto = (photoUri) => {
    setIncidentImages([...incidentImages, photoUri]);
    setCameraVisible(false);
  };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
//       setIncidentImages((prevImages) => [...prevImages, photo.uri]);
//       setCameraVisible(false);
//     }
//   };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      console.log(photo)
      setIncidentImages((prevImages) => [...prevImages, photo.uri]);
      setCameraVisible(false);
    }
  };
  const uploadPhotosIncidentPhotos = async (images) => {
    const formData = new FormData();
  
    images.forEach((image, index) => {
      formData.append('files', {
        uri: image.uri,
        name: `image_${index}.jpg`,
        type: 'image/jpeg',
      });
    });
  
    try {
      const response = await userService.uploadPhotosIncidentPhotos(formData)
      
      const result = await response.json();
      console.log('Upload successful:', result);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  

  const removePhoto = (index) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.incidentCard}>
            <FlatList
              horizontal
              data={item.images}
              keyExtractor={(uri, index) => `${item.id}-${index}`}
              renderItem={({ item: uri }) => (
                <Image source={{ uri }} style={styles.incidentImage} />
              )}
            />
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No incidents reported yet.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Incident</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Report Incident</Text>
          <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
            <Text style={styles.cameraButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <FlatList
            horizontal
            data={incidentImages}
            keyExtractor={(uri, index) => `${uri}-${index}`}
            renderItem={({ item }) => <Image source={{ uri: item }} style={styles.previewImage} />}
          />
          
          <TextInput
            style={styles.textarea}
            placeholder="Describe the incident...."
            multiline
            value={incidentDescription}
            onChangeText={setIncidentDescription}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddIncident}>
            <Text style={styles.saveButtonText}>Save Incident</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* {cameraVisible && (
        <Modal visible={cameraVisible} transparent>
          <CameraView
            style={styles.cameraView}
            // type={CameraType.back}
            // onPictureSaved={(photo) => handleTakePhoto(photo.uri)}
            facing={facing}
            ref={cameraRef}
          />


          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Ionicons name="camera" size={70} color="white" />
            </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => setCameraVisible(false)}
          >
            <Text style={styles.captureButtonText}>Close Camera</Text>
          </TouchableOpacity>
        </Modal>
      )} */}

{cameraVisible && (
  <Modal visible={cameraVisible} transparent>
    <CameraView
      style={styles.cameraView}
      type={facing}
      ref={cameraRef}
    >
      <TouchableOpacity
        style={styles.captureButton}
        onPress={takePicture}
      >
        <Ionicons name="camera" size={70} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.captureButton, { bottom: 100 }]}
        onPress={() => setCameraVisible(false)}
      >
        <Text style={styles.captureButtonText}>Close Camera</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.captureButton, { bottom: 170 }]}
        // onPress={toggleFacing}
      >
        <Text style={styles.captureButtonText}>Switch Camera</Text>
      </TouchableOpacity>
      
    </CameraView>

    
  </Modal>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  addButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  incidentCard: { marginBottom: 16, backgroundColor: '#fff', padding: 10, borderRadius: 10 },
  incidentImage: { width: 80, height: 80, borderRadius: 10, marginRight: 5 },
  description: { marginTop: 10, fontSize: 14 },
  modalContainer: { flex: 1, backgroundColor: 'white', padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  cameraButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  cameraButtonText: { color: 'white', fontWeight: 'bold' },
  previewImage: { width: 60, height: 60, margin: 5 },
  textarea: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, height: 80, marginBottom: 10 },
  saveButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  cancelButtonText: { color: 'white', fontWeight: 'bold' },
  cameraView: { flex: 1 },
  captureButton: { backgroundColor: 'black', padding: 10, position: 'absolute', bottom: 30, left: '50%', marginLeft: -50 },
  captureButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#777' },
});

export default ReportIncident;
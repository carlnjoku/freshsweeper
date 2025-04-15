import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons, AntDesign, MaterialIcons } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import userService from '../../services/userService';
import { Modal as PaperModal, Portal, Button, useTheme } from 'react-native-paper';
import COLORS from '../../constants/colors';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';

const ReportIncident = ({ scheduleId }) => {
  const theme = useTheme();
  const cameraRef = useRef(null);
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [openModal, setOpenModal] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [incidentImages, setIncidentImages] = useState([]);
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [facing, setFacing] = useState('back');
  const [isLoading, setIsLoading] = useState(false);
  const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // const isEditingAny = incidents.some(inc => inc.isEditing);
  const isEditingAny = (incidents || []).some(inc => inc?.isEditing);


  

  // const openImageViewer = (images, index) => {
  //   setCurrentImages(images);
  //   setCurrentImageIndex(index);
  //   setViewerVisible(true);
  // };

  // const uploadIncident = async () => {
  //   const formData = new FormData();
  //   formData.append('scheduleId', scheduleId);
  //   formData.append('description', incidentDescription);


  //   incidentImages.forEach((uri, index) => {
  //     formData.append('files', {
  //       uri,
  //       name: `image_${index}.jpg`,
  //       type: 'image/jpeg',
  //     });
  //   });


  //   try {
  //     const response = await userService.uploadPhotosIncidentPhotos(formData);
  //     console.log('Upload Responses:', response.data);
      
  //     const newIncident = {
  //       id: Date.now(),
  //       images: incidentImages,
  //       description: incidentDescription,
  //     };
  //     setIncidents([...incidents, newIncident]);
  //     setIncidentImages([]);
  //     setIncidentDescription('');
  //     setOpenModal(false);
  //   } catch (error) {
  //     console.error('Upload Error:', error.response?.data || error.message);
  //   }
  // };

  
// Data fetching
  const fetchIncidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userService.getIncidents(scheduleId);
      const res = response.data.data;
      setIncidents(res.incidents || []); // Ensure array fallback
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
  
      const fetchData = async () => {
        try {
          await fetchIncidents();
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
    }, [fetchIncidents])
  );


  const openCamera = async () => {
    if (!hasPermission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    setCameraVisible(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      setIncidentImages(prev => [...prev, photo.uri]);
      setCameraVisible(false);
    }
  };

  const EmptyPlaceholder = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="error-outline" size={48} color={COLORS.gray} />
      <Text style={styles.emptyText}>No incidents reported yet</Text>
    </View>
  );

  const removePhoto = (index) => {
    setIncidentImages(prev => prev.filter((_, i) => i !== index));
  };


  // Fix 3: Correct text input handling
  const handleDescriptionChange = (text, incident) => {
    setIncidents(prev => 
      prev.map(inc => 
        inc.reported_at === incident.reported_at
          ? { ...inc, description: text }
          : inc
      )
    );
  };


// Update incidents for the entire schedule
const updateIncidents = async () => {
  try {
    // Prepare the payload with schedule ID and full incidents array
    const payload = {
      scheduleId,
      incidents: incidents.map(incident => ({
        // Maintain existing backend-generated fields
        ...incident,
        // Map frontend-specific fields to backend expectations
        photos: incident.photos.map(photo => ({
          url: photo.url,
          content_type: photo.content_type,
          original_name: photo.original_name
        }))
      }))
    };
   
    console.log("payloooooooooooood")
    console.log(payload)
    console.log("payloooooooooooood")
    // Send to backend
    const response = await userService.updateScheduleIncidents(payload);
    
    // Update local state with validated backend response
    setIncidents(response.data.incidents);

  } catch (error) {
    console.error('Update failed:', error);
    
    // Rollback strategy - reload from server
    const freshData = await userService.getIncidents(scheduleId);
    setIncidents(freshData.data);
    
    Alert.alert('Sync Error', 'Could not save changes. Reverting to latest version.');
  }
};

// Updated service method
// In userService.js
// const updateScheduleIncidents = (payload) => {
//   return axios.put(`/schedules/${payload.scheduleId}/incidents`, {
//     incidents: payload.incidents
//   });
// };

  // Update incidents
  // const updateIncident = async() => {
   
  //   const data = {
  //     scheduleId:scheduleId,
  //     incident: incidents
  //   }
  //   await userService.updateIncident(data).
  //   then(response => {
  //     const res = response.data
  //     alert(res)
  //   })
  // }
  // // Delete Image from Incident
  // const deleteImage = (incident, imageUrl) => {
  //   setIncidents((prevIncidents) =>
  //     prevIncidents.map((inc) =>
  //       inc.reported_at === incident.reported_at
  //         ? { ...inc, photos: inc.photos.filter((photo) => photo.url !== imageUrl) }
  //         : inc
  //     )
  //   );
  // };

  // Toggle Editing Mode for a Specific Incident
  const toggleEdit = (incident) => {
    setIncidents((prevIncidents) =>
      prevIncidents.map((inc) =>
        inc.reported_at === incident.reported_at
          ? { ...inc, isEditing: !inc.isEditing, tempDescription: inc.description }
          : inc
      )
    );
    
  };

  // // Save Edited Description
  // const saveEdit = (incident) => {
  //   setIncidents((prevIncidents) =>
  //     prevIncidents.map((inc) =>
  //       inc.reported_at === incident.reported_at
  //         ? { ...inc, description: inc.tempDescription, isEditing: false }
  //         : inc
  //     )
  //   );
  //   updateIncident()
  // };



  // After any local modification (add/edit/delete image or text)
// const handleIncidentChange = (updatedIncidents) => {
//   // 1. Optimistic UI update
//   setIncidents(updatedIncidents);
  
//   // 2. Persist to backend
//   updateIncidents(); 
// };

// Fix 5: Update handleIncidentChange
const handleIncidentChange = (updatedIncidents) => {
  setIncidents(updatedIncidents);
  updateIncidents().catch(error => {
    console.error('Update failed:', error);
    Alert.alert('Error', 'Failed to save changes');
  });
};


  // Example delete image handler
  const deleteImage = (incidentIndex, imageIndex) => {
    const updated = [...incidents];
    updated[incidentIndex].photos.splice(imageIndex, 1);
    handleIncidentChange(updated);
  };

  // Example edit description handler
  // const saveDescription = (incidentIndex, newDesc) => {
  //   console.log("indeeeeeeex")
  //   console.log([incidentIndex].description)
  //   console.log("indeeeeeeex")
  //   const updated = [...incidents];
  //   updated[incidentIndex].description = newDesc;
  //   handleIncidentChange(updated);
  // };

  // const saveDescription = (incidentIndex, newDesc) => {
  //   // Always validate array index first
  //   if (incidentIndex < 0 || incidentIndex >= incidents.length) {
  //     console.error('Invalid incident index:', incidentIndex);
  //     return;
  //   }
  
  //   // Create a safe copy with map instead of spread
  //   const updated = incidents.map((incident, index) => {
  //     if (index === incidentIndex) {
  //       return { ...incident, description: newDesc };
  //     }
  //     return incident;
  //   });
  
  //   handleIncidentChange(updated);
  // };

  const saveEdit = (incident) => {
    setIncidents(prev => 
      prev.map(inc => 
        inc.reported_at === incident.reported_at
          ? {
              ...inc,
              description: inc.tempDescription,
              isEditing: false,
              tempDescription: ''
            }
          : inc
      )
    );
    updateIncidents();
  };

  // console.log("This are the incidencies", incidents)














  const openImageViewer = (images, index) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  const uploadIncident = async () => {
    const formData = new FormData();
    formData.append('scheduleId', scheduleId);
    formData.append('description', incidentDescription);

    incidentImages.forEach((uri, index) => {
      formData.append('files', {
        uri,
        name: `image_${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      const response = await userService.uploadPhotosIncidentPhotos(formData);
      const newIncident = {
        ...response.data, // Use server-generated data
        photos: response.data.uploaded_files || []
      };
      
      setIncidents(prev => [...prev, newIncident]);
      setIncidentImages([]);
      setIncidentDescription('');
      setIncidentModalOpen(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload incident');
      console.error('Upload Error:', error.response?.data || error.message);
    }
  };


  const handleToggleEdit = (incident) => {
    setIncidents(prev => prev.map(inc => 
      inc.reported_at === incident.reported_at
        ? { ...inc, isEditing: !inc.isEditing, tempDescription: inc.description }
        : inc
    ));
  };

  const handleSaveEdit = (incident) => {
    const updatedIncidents = incidents.map(inc => 
      inc.reported_at === incident.reported_at
        ? { ...inc, 
            description: inc.tempDescription, 
            isEditing: false,
            tempDescription: ''
          }
        : inc
    );
    
    handleIncidentUpdate(updatedIncidents);
  };

  // const handleIncidentUpdate = async (updatedIncidents) => {
  //   try {
  //     setIncidents(updatedIncidents);
  //     await userService.updateScheduleIncidents({
  //       scheduleId,
  //       incidents: updatedIncidents.map(({ isEditing, tempDescription, ...incident }) => ({
  //         ...incident,
  //         photos: incident.photos.map(photo => ({
  //           url: photo.url,
  //           content_type: photo.content_type,
  //           original_name: photo.original_name
  //         }))
  //       })
  //     });
  //   } catch (error) {
  //     const freshData = await userService.getIncidents(scheduleId);
  //     setIncidents(freshData.data?.incidents || []);
  //     Alert.alert('Error', 'Failed to save changes');
  //   }
  // };

  const handleIncidentUpdate = async (updatedIncidents) => {
    try {
        setIncidents(updatedIncidents);
        await userService.updateScheduleIncidents({
            scheduleId,
            incidents: updatedIncidents.map(({ isEditing, tempDescription, ...incident }) => ({
                ...incident,
                photos: incident.photos.map(photo => ({
                    url: photo.url,
                    content_type: photo.content_type,
                    original_name: photo.original_name
                }))
            }))
        }); 
    } catch (error) {
        const freshData = await userService.getIncidents(scheduleId);
        setIncidents(freshData.data?.incidents || []);
        Alert.alert('Error', 'Failed to save changes');
    }
  };

  const handleDeleteImage = (incidentId, imageUrl) => {
    const updatedIncidents = incidents.map(inc => 
      inc.reported_at === incidentId
        ? { ...inc, photos: inc.photos.filter(photo => photo.url !== imageUrl) }
        : inc
    );
    handleIncidentUpdate(updatedIncidents);
  };


  const cameraModalStyles = {
    modal: {
      backgroundColor: theme.colors.background,
      padding: 20,
      margin: 20,
      borderRadius: 8,
    },
    button: {
      // backgroundColor: COLORS.primary,
      marginVertical: 8,
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>

      <Modal
        isVisible={viewerVisible}
        style={styles.fullScreenModal}
        onBackdropPress={() => setViewerVisible(false)}
      >
        <ImageViewer
          imageUrls={currentImages.map(img => ({ url: img.url }))}
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
      </Modal>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.reported_at}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Incident Reports</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.incidentContainer}>
            

            {/* Incident Images with Delete Option */}
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
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(item, photo.url)}>
                    <AntDesign name="closecircle" size={20} color="red" />
                  </TouchableOpacity>

                  </TouchableOpacity>
                </View>
              )}
            />

             {/* Edit Button at the Top of the Description */}
             <View style={styles.editRow}>
              <Text style={styles.descriptionLabel}>Incident Description</Text>
              <TouchableOpacity onPress={() => toggleEdit(item)} style={styles.editIcon}>
                <MaterialIcons name="edit" size={18} color={COLORS.deepBlue} />
              </TouchableOpacity>
            </View>

            {/* Description Below Images */}
            {item.isEditing ? (
              <View>
                <TextInput
                  label="Describe the incident..."
                  placeholder="Describe the incident..."
                  mode="outlined"
                  multiline
                  outlineColor="#D8D8D8"
                  activeOutlineColor={COLORS.primary}
                  style={{ marginBottom: 10, fontSize: 14, width: '100%', minHeight:100, backgroundColor: '#fff' }}    
                  // value={item.tempDescription}
                  // onChangeText={(text) =>
                  //   setIncidents((prevIncidents) =>
                  //     prevIncidents.map((inc) =>
                  //       inc.reported_at === item.reported_at ? { ...inc, tempDescription: text } : inc
                  //     )
                  //   )
                  // }

                  value={item.description || ''} // Ensure fallback for undefined
                  onChangeText={(text) => handleDescriptionChange(text, item)}
                  
                />
                <TouchableOpacity style={styles.saveButton} onPress={() => saveEdit(item)}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.incidentDescription}>{item.description}</Text>
            )}
          </View>
        )}
      />

    )}
      
      {/* {!isEditingAny && (
        <Button 
          mode="contained" 
          onPress={() => setOpenModal(true)}
          style={styles.addButton}>
          Add Incident
        </Button>
      )} */}

      {!isEditingAny && (incidents || []).length > 0 && (
        <Button 
          mode="contained" 
          onPress={() => setOpenModal(true)}
          style={styles.addButton}
        >
          Add Incident
        </Button>
      )}

      <Portal>
        {/* Main Incident Report Modal */}
        <PaperModal
          visible={openModal}
          onDismiss={() => setOpenModal(false)}
          contentContainerStyle={cameraModalStyles.modal}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Report Incident
          </Text>
          
          <Button 
            mode="contained" 
            onPress={openCamera}
            style={cameraModalStyles.button}>
            Take Photo
          </Button>

          <FlatList
            horizontal
            data={incidentImages}
            keyExtractor={(uri, index) => `${uri}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.previewImage} />
                <Button 
                  icon="close" 
                  onPress={() => removePhoto(index)}
                  style={styles.removeButton}
                />
              </View>
            )}
          />


          <TextInput
            label="Edit incident..."
            placeholder="Edit the incident..."
            mode="outlined"
            multiline
            outlineColor="#D8D8D8"
            activeOutlineColor={COLORS.primary}
            value={incidentDescription}
            onChangeText={setIncidentDescription}
            style={{ marginBottom: 10, fontSize: 14, width: '100%', minHeight:100, backgroundColor: '#fff' }}    
          />

          <View style={styles.buttonRow}>
            
            <Button 
              mode="outlined" 
              onPress={() => setOpenModal(false)}
              style={cameraModalStyles.button}
              >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={uploadIncident}
              style={cameraModalStyles.button}>
              Save Incident
            </Button>
            
          </View>
        </PaperModal>

        {/* Camera Modal */}
        <Modal
          visible={cameraVisible}
          onDismiss={() => setCameraVisible(false)}
          contentContainerStyle={styles.cameraModal}>
          <CameraView
            style={styles.cameraView}
            facing={facing}
            ref={cameraRef}>
            
            <View style={styles.cameraControls}>
              
              <Button 
                icon="close" 
                mode="outlined" 
                onPress={() => setCameraVisible(false)}
                style={cameraModalStyles.button}
              />
              <Button 
                icon="camera" 
                mode="contained" 
                onPress={takePicture}
                style={cameraModalStyles.button}
              />
              <Button 
                icon="camera-flip" 
                mode="outlined" 
                onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
                style={cameraModalStyles.button}
              />
              
            </View>
          </CameraView>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: COLORS.white,
  },
  addButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
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
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 4,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  incidentDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: COLORS.dark,
  },
  textarea: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  cameraModal: {
    flex: 1,
    margin: 0,
    backgroundColor: 'black',
  },
  cameraView: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 4,
  },
  editIcon: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
fullScreenModal: {
  margin: 0,
  justifyContent: 'center',
},
imageViewerContainer: {
  flex: 1,
  backgroundColor: 'black',
},
viewerCloseButton: {
  position: 'absolute',
  top: 40,
  right: 20,
  zIndex: 1,
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: 20,
  padding: 8,
},
fullSizeImage: {
  flex: 1,
  width: '100%',
  height: '100%',
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
sectionTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginVertical: 16,
  marginHorizontal: 8,
  color: COLORS.dark
}
});

export default ReportIncident;

// {"description": "Tjis has somethinsomething to do with the cleaner not paying attention ", "isEditing": true, 
// "photos": [{"content_type": "image/jpeg", "original_name": "image_0.jpg", "url": "https://freshsweeper.nyc3.digitaloceanspaces.com/incidents/67c003e3c405dc6c27b97978/93ea2060-a81e-45c0-bd49-d08ab923990a.jpg"}, 
// {"content_type": "image/jpeg", "original_name": "image_1.jpg", "url": "https://freshsweeper.nyc3.digitaloceanspaces.com/incidents/67c003e3c405dc6c27b97978/fd34f3e1-d882-423f-8795-95756339818e.jpg"}, 
// {"content_type": "image/jpeg", "original_name": "image_2.jpg", "url": "https://freshsweeper.nyc3.digitaloceanspaces.com/incidents/67c003e3c405dc6c27b97978/d14fd210-1a8b-43d2-b456-4b6bd12b5707.jpg"}], 
// "reported_at": "2025-03-17T08:17:29.273000",
// "status": "reported", 
// "tempDescription": "Tjis has somethinsomething to do with the cleaner not paying attention tqhh"}
//  LOG  indeeeeeeex

















// import React, { useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import userService from '../../services/userService';
// import axios from 'axios';
// import FormData from 'form-data';
// import * as FileSystem from 'expo-file-system';
// // import Modal from 'react-native-modal';
// import { Modal, Portal, Button, useTheme, RadioButton } from 'react-native-paper';

// const ReportIncident = ({scheduleId}) => {

//   const cameraRef = useRef(null);

//   const [hasPermission, requestPermission] = useCameraPermissions();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [incidentImages, setIncidentImages] = useState([]);
  
//   const [incidentDescription, setIncidentDescription] = useState('');
//   const [incidents, setIncidents] = useState([]);
//   const[facing, setFacing] = useState('back');
//   const[openModal, setOpenModal] = useState(false)

   
//   const uploadIncident = async (scheduleId, description, incidentImages) => {
//     // const formData = new FormData();
  

// // const parts = [
// //     ["scheduleId", scheduleId],
// //     ["description", description],
// //     ...incidentImages.map(image => ["files", image]),
// //   ];

// //   const formData = new FormData();
// //   formData.append("parts", JSON.stringify(parts));


//   const formData = new FormData();

// //   // Append Schedule ID and Description
// //   formData.append('scheduleId', scheduleId);
// //   formData.append('description', description);

// //   // Append Files
// //   for (const uri of incidentImages) {
// //     const fileName = uri.split('/').pop();
// //     const fileType = 'image/jpeg'; // Adjust fileType if necessary

// //     formData.append('files', {
// //       uri, // Raw URI
// //       name: fileName,
// //       type: fileType,
// //     });
// //   }

// formData.append('scheduleId', scheduleId);
// formData.append('description', description);

// for (const uri of incidentImages) {
//   const fileName = uri.split('/').pop();
//   const fileType = 'image/jpeg'; // Adjust based on file type
//   const fileData = await FileSystem.readAsStringAsync(uri, {
//     encoding: FileSystem.EncodingType.Base64,
//   });

//   formData.append('files', {
//     uri: uri,
//     name: fileName,
//     type: fileType,
//   });
// }

// console.log('FormData:', formData);

//     try {
      
//         // Send POST request to the API endpoint
//         // const response = await axios.post(
//         //     "http://rnvjn-67-80-224-161.a.free.pinggy.link/task_photos/upload-incident-photos",
//         //     formData,
//         //     {
//         //     headers: {
//         //         "Content-Type": "multipart/form-data",
//         //     },
//         //     }
//         // );
  
//       console.log(JSON.stringify(formData, null, 2))
      
//       const response = await userService.uploadPhotosIncidentPhotos(formData)
//       console.log('Upload Response:', response.data);
//     } catch (error) {
//       console.error('Upload Error:', error.response?.data || error.message);
//     }
//   };
  

//   const handleAddIncident = () => {

//     uploadIncident(scheduleId, incidentDescription, incidentImages)
//     const newIncident = {
//       id: Date.now(),
//       images: incidentImages,
//       description: incidentDescription,
//     };
//     setIncidents([...incidents, newIncident]);
//     setIncidentImages([]);
//     setIncidentDescription('');
//     setModalVisible(false);
//   };

//   const openCamera = async () => {
//     if (!hasPermission) {
//       const { granted } = await requestPermission();
//       if (!granted) return;
//     }
//     setCameraVisible(true);
//   };

//   const handleTakePhoto = (photoUri) => {
//     setIncidentImages([...incidentImages, photoUri]);
//     setCameraVisible(false);
//   };

// //   const takePicture = async () => {
// //     if (cameraRef.current) {
// //       const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
// //       setIncidentImages((prevImages) => [...prevImages, photo.uri]);
// //       setCameraVisible(false);
// //     }
// //   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
//       console.log(photo)
//       setIncidentImages((prevImages) => [...prevImages, photo.uri]);
//       setCameraVisible(false);
//     }
//   };
//   const uploadPhotosIncidentPhotos = async (images) => {
//     const formData = new FormData();
  
//     images.forEach((image, index) => {
//       formData.append('files', {
//         uri: image.uri,
//         name: `image_${index}.jpg`,
//         type: 'image/jpeg',
//       });
//     });
  
//     try {
//       const response = await userService.uploadPhotosIncidentPhotos(formData)
      
//       const result = await response.json();
//       console.log('Upload successful:', result);
//     } catch (error) {
//       console.error('Error uploading images:', error);
//     }
//   };

  

//   const removePhoto = (index) => {
//     setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
//   };

//   const onClose = ()=> {
//     setModalVisible(false)
//   }


//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={incidents}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.incidentCard}>
//             <FlatList
//               horizontal
//               data={item.images}
//               keyExtractor={(uri, index) => `${item.id}-${index}`}
//               renderItem={({ item: uri }) => (
//                 <Image source={{ uri }} style={styles.incidentImage} />
//               )}
//             />
//             <Text style={styles.description}>{item.description}</Text>
//           </View>
//         )}
//         ListEmptyComponent={<Text style={styles.emptyText}>No incidents reported yet.</Text>}
//       />
//       <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
//         <Text style={styles.addButtonText}>Add Incident</Text>
//       </TouchableOpacity>

//       {/* <Modal visible={modalVisible} animationType="slide" transparent> */}
//       <Portal>
//       <Modal 
//           visible={openModal} 
//           onDismiss={onClose} 
//           contentContainerStyle={styles.modalContainer}
//       >


  

//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Report Incident</Text>
//           <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
//             <Text style={styles.cameraButtonText}>Take Photo</Text>
//           </TouchableOpacity>
//           <FlatList
//             horizontal
//             data={incidentImages}
//             keyExtractor={(uri, index) => `${uri}-${index}`}
//             renderItem={({ item }) => <Image source={{ uri: item }} style={styles.previewImage} />}
//           />
          
//           <TextInput
//             style={styles.textarea}
//             placeholder="Describe the incident...."
//             multiline
//             value={incidentDescription}
//             onChangeText={setIncidentDescription}
//           />
//           <TouchableOpacity style={styles.saveButton} onPress={handleAddIncident}>
//             <Text style={styles.saveButtonText}>Save Incident</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//       </Portal>
//       {/* {cameraVisible && (
//         <Modal visible={cameraVisible} transparent>
//           <CameraView
//             style={styles.cameraView}
//             // type={CameraType.back}
//             // onPictureSaved={(photo) => handleTakePhoto(photo.uri)}
//             facing={facing}
//             ref={cameraRef}
//           />


//           <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
//               <Ionicons name="camera" size={70} color="white" />
//             </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.captureButton}
//             onPress={() => setCameraVisible(false)}
//           >
//             <Text style={styles.captureButtonText}>Close Camera</Text>
//           </TouchableOpacity>
//         </Modal>
//       )} */}

// {cameraVisible && (
//   <Modal visible={cameraVisible} transparent>
//     <CameraView
//       style={styles.cameraView}
//       type={facing}
//       ref={cameraRef}
//     >
//       <TouchableOpacity
//         style={styles.captureButton}
//         onPress={takePicture}
//       >
//         <Ionicons name="camera" size={70} color="white" />
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[styles.captureButton, { bottom: 100 }]}
//         onPress={() => setCameraVisible(false)}
//       >
//         <Text style={styles.captureButtonText}>Close Camera</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity
//         style={[styles.captureButton, { bottom: 170 }]}
//         // onPress={toggleFacing}
//       >
//         <Text style={styles.captureButtonText}>Switch Camera</Text>
//       </TouchableOpacity>
      
//     </CameraView>

    
//   </Modal>
// )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
//   addButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 16 },
//   addButtonText: { color: 'white', fontWeight: 'bold' },
//   incidentCard: { marginBottom: 16, backgroundColor: '#fff', padding: 10, borderRadius: 10 },
//   incidentImage: { width: 80, height: 80, borderRadius: 10, marginRight: 5 },
//   description: { marginTop: 10, fontSize: 14 },
//   modalContainer: { flex: 1, backgroundColor: 'white', padding: 20 },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   cameraButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
//   cameraButtonText: { color: 'white', fontWeight: 'bold' },
//   previewImage: { width: 60, height: 60, margin: 5 },
//   textarea: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, height: 80, marginBottom: 10 },
//   saveButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, alignItems: 'center' },
//   saveButtonText: { color: 'white', fontWeight: 'bold' },
//   cancelButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
//   cancelButtonText: { color: 'white', fontWeight: 'bold' },
//   cameraView: { flex: 1 },
//   captureButton: { backgroundColor: 'black', padding: 10, position: 'absolute', bottom: 30, left: '50%', marginLeft: -50 },
//   captureButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
//   emptyText: { textAlign: 'center', marginTop: 20, color: '#777' },
// });

// export default ReportIncident;
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Modal, Portal, Button, useTheme, RadioButton } from 'react-native-paper';
import FloatingLabelPickerFull from '../../components/FloatingLabelPickerFull';
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import FloatingLabelPicker from '../../components/FloatingLabelPicker';

const AddICalModal = ({ visible, onClose, onSave, cleaners, aptId }) => {
    const [icalUrl, setIcalUrl] = useState('https://www.airbnb.com/calendar/ical/1116988851402360259.ics?s=5c58f3db04c66596500f27e98f6e4ce2');
    const [selectedType, setSelectedType] = useState('airbnb');
    const [selectedCleaner, setSelectedCleaner] = useState("");
    
    console.log("cleaners", cleaners)
    const theme = useTheme();


    const handleSave = async() => {
        if (icalUrl.trim() && selectedCleaner) {
            const data = {
                aptId:aptId,
                ical_url:icalUrl.trim(),
                platform:selectedType,
                cleanerId:selectedCleaner.cleanerId,
                cleaner:selectedCleaner,
                enabled:true
            }
           
            onSave(data);
        }
        onClose();
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
                <Text style={styles.title}>Sync Calendar</Text>

                {/* iCal URL Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter iCal URL"
                    value={icalUrl}
                    onChangeText={setIcalUrl}
                    autoCapitalize="none"
                    keyboardType="url"
                    placeholderTextColor="#999"
                />

                {/* iCal Type Selection */}
                <Text style={styles.label}>Select Platform</Text>
               
                <RadioButton.Group onValueChange={setSelectedType} value={selectedType}>
                <View style={styles.radioGroup}>
                    <RadioButton.Item 
                    label="Airbnb" 
                    value="Airbnb" 
                    color={COLORS.primary}
                    labelStyle={styles.label}
                    style={styles.radioItem} 
                    />
                    <RadioButton.Item 
                    label="Booking.com" 
                    value="Booking.com" 
                    color={COLORS.primary}
                    labelStyle={styles.label}
                    style={styles.radioItem}  
                    />
                    <RadioButton.Item 
                    label="Vrbo" 
                    value="Vrbo"
                    color={COLORS.primary}
                    labelStyle={styles.label}
                    style={styles.radioItem}  
                    />
                </View>
                </RadioButton.Group>

                {/* Assign Cleaner */}
                <Text style={styles.label}>Assign Cleaner</Text>
                
                {/* Select Cleaner (if any) */}
            {cleaners.length > 0 ? (
                
                <FloatingLabelPicker
                    title="Select Cleaner"
                    selectedValue={selectedCleaner}
                    onValueChange={(value) => {
                        setSelectedCleaner(value); // Store cleanerId
                    }}
                    options={cleaners.map((cleaner) => ({
                        label: `${cleaner.firstname} ${cleaner.lastname}`, 
                        value: cleaner // Use cleaner as value
                    }))}
                    labelKey="label"
                    valueKey="value"
                />
            )
            :
            
            (
                <Text style={styles.warningText}>No cleaners available. Assign later.</Text>
            )}

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <Button mode="outlined" onPress={onClose} style={styles.cancelButton} textColor={theme.colors.error}>
                        Cancel
                    </Button>
                    <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                        Save
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    radioGroup: {
        flexDirection: 'column',
        marginBottom: 15,
        
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:10
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
    },
    saveButton: {
        flex: 1,
        backgroundColor:COLORS.primary
    },
    warningText:{
        marginBottom:20
    },
    radioItem:{
        marginVertical:-5
    }
});

export default AddICalModal;
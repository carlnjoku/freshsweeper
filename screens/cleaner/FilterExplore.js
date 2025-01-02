import React, {useState} from 'react';
import { View, Text, StyleSheet, Switch, StatusBar, Pressable, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import Slider from '@react-native-community/slider';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import TextInputContainer from '../../components/TextInputContainer';


  

export default function FilterExplore({close_modal, filter_strings}) {

    const[isBeforeSave, setIsBeforeSave] = useState(true)
    // const [distance, setDistance] = useState(3);
    // const [price, setPrice] = useState(50);
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())
    const [clean_date, setCleanDate] = useState()
    const [show_picker, setShowPicker] = useState(false)
    const [show_time_picker, setShowTimePicker] = useState(false)
    const [value, setValue] = useState('first');

    const [filters, setFilterStrings] = useState({
        lowest_cleaning_fee: 30,
        highest_cleaning_fee: '',
        cleaning_date: '',
        distance: 4,
      });

    console.log(filters)
    const handleCloseModal = () => {
        close_modal(false)
    }
    const onClose = () => {
        close_modal(false)
    }

    const handleApplyFilter = (val) => {
        alert(val)
    }

    
    
      const updateLowestCleaningFee = (text) => {
        setFilterStrings({ ...filters, lowest_cleaning_fee: text });
      };
      const updateHighestCleaningFee = (text) => {
        setFilterStrings({ ...filters, highest_cleaning_fee: text });
      };
    
      const updateCleaningDate = (event, selectedDate) => {

        console.log(selectedDate)
        const currentDate = selectedDate || filters.cleaning_date;
        setFilterStrings({ ...filters, cleaning_date: currentDate.toISOString() });
      };
    
      const updateDistance = (value) => {
        setFilterStrings({ ...filters, distance: value });
      };


    //   const updateCleaningDate = (event, selectedDate) => {
    //     const currentDate = selectedDate || filter_strings.cleaning_date;
    //     setFilterStrings({ ...filter_strings, cleaning_date: currentDate.toISOString() });
    //   };

    const toggleDatePicker = () => {
        setShowPicker(!show_picker)
      }
      const onChangeDatePicker = ({type}, selectedDate) => {
        if(type=="set"){
            const currentDate = selectedDate
            setDate(currentDate)
            if(Platform.OS==="android"){
                toggleDatePicker()
                setCleanDate(currentDate.toDateString())
                // setFilterStrings((prevFormData) => ({
                //     ...prevFormData,
                //     cleaning_date: currentDate.toDateString(),
                //   }));
               
            }
            // getCleanDate(currentDate.toDateString(), 'cleaning_date')
            
            

            //   const updateCleaningDate = (event, selectedDate) => {
            //     const currentDate = selectedDate || filter_strings.cleaning_date;
            //     setFilterStrings({ ...filter_strings, cleaning_date: currentDate.toISOString() });
            //   };

        }else{
            toggleDatePicker()
        }
      }
    
      const applyFilter = (fil) => {
        filter_strings(fil)
      }
      
  return (
    <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                {/* <StatusBar translucent backgroundColor="transparent" /> */}

                <View style={styles.close_button}>
                    {isBeforeSave && <MaterialCommunityIcons name="close" color={COLORS.gray} size={24} onPress={handleCloseModal} />}
                    {!isBeforeSave && <MaterialCommunityIcons name="close" color={COLORS.gray} size={24} onPress={onClose} />}
                </View>

                {isBeforeSave && 
                    <View>
                        <Text style={styles.heading}>Refine Your Search</Text>

                        {/* Address input with Google Autocomplete */}
                        

                        {/* Mobile phone input */}
                        <Text style={styles.label}>Distance: {filters.distance} miles</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={1}
                            maximumValue={20}
                            step={1}
                            value={filters.distance}
                            onValueChange={(sliderValue) => updateDistance(sliderValue)}
                            minimumTrackTintColor={COLORS.primary}
                            maximumTrackTintColor="#d3d3d3"
                            thumbTintColor={COLORS.primary}
                        />

                        <Text style={styles.label}>Choose Price Range </Text>
                        
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <TextInput
                            label="Lowest Price"
                            placeholder="Lowest Price"
                            mode="outlined"
                            outlineColor="#D8D8D8"
                            activeOutlineColor={COLORS.primary}
                            value={filters.lowest_cleaning_fee}
                            onChangeText={text => updateLowestCleaningFee(text)}
                            keyboardType="phone-pad"
                            style={{ marginBottom: 10, fontSize: 14, width: '50%', backgroundColor: '#fff' }}
                           
                        />
                        <TextInput
                            label="Highest Price"
                            placeholder="Highest Price"
                            mode="outlined"
                            outlineColor="#D8D8D8"
                            activeOutlineColor={COLORS.primary}
                            value={filters.highest_cleaning_fee}
                            onChangeText={text => updateHighestCleaningFee(text)}
                            keyboardType="phone-pad"
                            style={{ marginBottom: 10, fontSize: 14, width: '49%', backgroundColor: '#fff' }}

                        />
                        
                        </View>
                        
                        <Text style={styles.label}>Select a date </Text>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <View>
                        {show_picker && (
                        <DateTimePicker 
                            mode="date"
                            display="spinner"
                            value={date}
                            // value={new Date(filters.cleaning_date) || new Date()}
                            onChange={onChangeDatePicker}
                        />
                        )}
                
                            <Pressable
                                onPress={toggleDatePicker}
                            >
                               
                                <TextInputContainer iconName="calendar" label="Select Date">
                                    <TextInput
                                        mode="outlined"
                                        placeholderTextColor={COLORS.darkGray}
                                        outlineColor="transparent"
                                        value={date.toDateString()}
                                        activeOutlineColor="transparent"
                                        style={{marginBottom:5, fontSize:16, height:36, backgroundColor:"#fff"}}
                                        onChangeText={setCleanDate}
                                        // onFocus={() => handleError(null, 'apt_name')}
                                        // error={errors.date}
                                        editable={false}
                                    />
                                </TextInputContainer>
                            </Pressable>
                        </View>

                        {/* <View>
                            {show_time_picker && (
                                <DateTimePicker 
                                    mode="time"
                                    display="spinner"
                                    value={time}
                                    onChange={onChangeTimePicker}
                                />
                            )}
                            <Pressable
                                onPress={toggleTimePicker}
                            >
                                <TextInputContainer iconName="clock-outline" label="Select Time">
                                    <TextInput
                                        mode="outlined"
                                        placeholderTextColor={COLORS.darkGray}
                                        outlineColor="transparent"
                                        // value={time.toLocaleTimeString()}
                                        activeOutlineColor="transparent"
                                        style={{marginBottom:5, fontSize:16, height:36,  backgroundColor:"#fff"}}
                                        // onChangeText={setCleanTime}
                                        // onFocus={() => handleError(null, 'apt_name')}
                                        iconName="email-outline"
                                        // error={errors.date}
                                        editable={false}
                                    />
                                </TextInputContainer>   
                            </Pressable>
                            </View> */}


                        </View>

                        <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                            <View style={styles.radioItem}>
                            <RadioButton value="morning" color={COLORS.primary} />
                            <Text style={styles.label_radio}>Morning</Text>
                            </View>
                            <View style={styles.radioItem}>
                            <RadioButton value="afternoon" color={COLORS.primary} />
                            <Text style={styles.label_radio}>Afternoon</Text>
                            </View>
                            <View style={styles.radioItem}>
                            <RadioButton value="evening" color={COLORS.primary} />
                            <Text style={styles.label_radio}>Evening</Text>
                            </View>
                            <View style={styles.radioItem}>
                            <RadioButton value="anytime" color={COLORS.primary} />
                            <Text style={styles.label_radio}>Anytime</Text>
                            </View>
                        </RadioButton.Group>
                      

                        <TouchableOpacity style={styles.button} onPress={() => applyFilter(filters)}>
                            <Text bold style={styles.button_text}> Apply Filter</Text>
                        </TouchableOpacity>
                    </View>
                }

                {!isBeforeSave &&
                    <View style={styles.success_response}>
                        <MaterialCommunityIcons name="check-circle" size={56} color="green" />
                        <Text style={{fontSize:19, fontWeight:'500', textAlign:'center'}}>{responseMessage}</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text bold style={styles.button_text} onPress={onClose}> Continue</Text>
                        </TouchableOpacity>
                    </View>
                }

                
            </View>
        </View>
  )
}


const windowHeight = Dimensions.get('window').height;
const modalHeight = windowHeight * 1.0;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundColor,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    detailsContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 0,
    },
    // label: {
    //     fontSize: 20,
    //     textAlign: 'center',
    //     marginBottom: 10,
    //   },
      slider: {
        width: '100%',
        height: 20,
        marginLeft:-14,
        marginBottom:20,
      },
      
    details: {
        fontSize: 16,
    },
    button: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 20,
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 50
    },
    button_text: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500'
    },
    modalContainer: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        elevation: 5,
        height: modalHeight,
        width: '100%',
    },
    close_button: {
        alignItems: 'flex-end'
    },
    success_response:{
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center', // Align items vertically centered
        marginBottom: 10,
      },
      label_radio: {
        marginLeft: 8, // Add some space between the radio button and the text
      },
});





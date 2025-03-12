import React, { useContext, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { useBookingContext } from '../../context/BookingContext';
import HeaderWithStatusBarAndClose from '../../components/HeaderWithStatusBarAndClose';
import StepsIndicator from '../../components/StepsIndicator';
import * as Animatable from 'react-native-animatable';
import PropertyDetails from './CreateBookingContents.js/PropertyDetails';
import Duration from './CreateBookingContents.js/Duration';
import CleaningTask from './CreateBookingContents.js/CleaningTask';
import {AntDesign } from '@expo/vector-icons';
import Review from './CreateBookingContents.js/Review';
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import calculateTotalPrice from '../../utils/calculateTotalPrice';
import { calculateCleaningTimeByTasks } from '../../utils/calculateCleaningTimeByTasks';

const NewBooking = ({ close_modal }) => {
  const { currency, currentUser } = useContext(AuthContext);
  const { formData, setFormData } = useBookingContext();
  const [extras, setExtras] = useState([]);

  const [step, setStep] = useState(1);
  const [isValid, setIsValid] = useState(false);

  // Memoize task times as they don't change
  const taskTimes = useMemo(() => ({
      "Window Washing":20,
      "Inside Cabinets":15,
      "Carpet Cleaning":30,
      "Upholstery Cleaning":20,
      "Tile & Grout Cleaning":50,
      "Hardwood Floor Refinishing":50,
      "Inside Fridge":5,
      "Inside Oven":30,
      "Pet Cleanup":20,
      "Dishwasher":30,
      "Laundry":30,
      "Exterior":120, 
  }), []);

  
  const totalCleaningTime = useMemo(() => {
    // Calculate total cleaning time based on formData
    return formData.extra
      ? calculateCleaningTimeByTasks(formData.extra, taskTimes)
      : 0;
  }, [formData.extra, taskTimes]);

  // const totalCleaningFee = useMemo(() => {
  //   // Calculate total fee using formData
  //   return calculateTotalPrice(formData.extra, currency);
  // }, [formData.extra, currency]);

  const validateForm = (isFormValid) => {
    setIsValid(isFormValid);
  };

  const handleNextStep = () => {
    if (isValid) setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleClose = () => {
    close_modal(false);
    setFormData({});
  };

  const handleOnCleaningTime = (text, input) => {
    setFormData(prevState => ({...prevState, [input]: text}))
  }

  const handleOnCleaningDate = (text, input) => {
    setFormData(prevState => ({...prevState, [input]: text}))
  }

  const handleCleanignExtraSelection = (selectedExtras) => {
    setExtras(selectedExtras);
    console.log(selectedExtras);
  };

  const handleExtraTaskTime = (extra_task, input) => {
    const extraCleaningTime = calculateCleaningTimeByTasks(extra_task, taskTimes)
    console.log("showwwwwwwing")
    console.log(extraCleaningTime)
    setFormData(prevState => ({...prevState, [input]: extraCleaningTime}))
  }

  const handleTotalTaskTime = (totalTime, input) => {
    setFormData(prevState => ({...prevState, [input]: totalTime}))
  }

  const handleBedroomBathroom = (text, input) => {
    setFormData(prevState => ({...prevState, [input]: text}))
    console.log(formData)
  }

  const createTaskChecklist = () => {
  
    if(formData.extra.length > 0 ){
      // Create default / regular task_checklist from extra
      // Convert the array of extras to the task_checklist format

      const formattedExtras = formData.extra.map((item, index) => ({
        id: index + 1,
        label: item.label,
        value: item
      }));

      // Remove icon and price from formattedExtra
      const cleanedArray = formattedExtras.map(service => {
        // Destructure value object and remove icon and price
        const { icon, price, ...valueWithoutIconAndPrice } = service.value;
        
        // Return new object with modified value
        return {
          ...service,
          value: valueWithoutIconAndPrice
        };
      });
      
      // console.log(cleanedArray);

      const formattedRegular = formData.regular_cleaning.map((item, index) => ({
        id: index + 1,
        label: item.label,
        value: item
      }));

      const updatedChecklist = [...cleanedArray, ...formattedRegular];

      console.log("checklist..................")
      // console.log(JSON.stringify(updatedChecklist, null, 2))
      console.log("checklist..................")
      setUpdatedTaskChecklist(updatedChecklist)
    }else{
      console.log(formattedRegular)
      setUpdatedTaskChecklist(formattedRegular)
    }
  }

  const handleSubmit = async () => {
    const data = {
      hostInfo: currentUser,
      schedule: formData,
      checklist: [], // Define checklist based on your logic
    };

    console.log("formData.....................")
    // console.log(JSON.stringify(data, null, 2))
    console.log("formData.....................")
    
    try {
      const response = await userService.createSchedule(data);
      if (response.status === 200) {
        console.log('Schedule created successfully');
      } else {
        console.error('Failed to create schedule');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  console.log("Collected Data", formData)
  

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="white" />
      <HeaderWithStatusBarAndClose title="Create Schedule" onClose={handleClose} />
      <StepsIndicator step={step} />

      <View style={styles.form}>
        {step === 1 && (
          <Animatable.View animation="slideInRight" duration={550}>
            <PropertyDetails
              formData={formData}
              setFormData={setFormData}
              validateForm={validateForm}
            />
          </Animatable.View>
        )}
        {step === 2 && (
          <Animatable.View animation="slideInRight" duration={600}>
            <Duration
              getCleanTime={handleOnCleaningTime}
              getCleanDate={handleOnCleaningDate}
              formData={formData}
              setFormData={setFormData}
              validateForm={validateForm}
            />
          </Animatable.View>
        )}
        {step === 3 && (
          <Animatable.View animation="slideInRight" duration={600}>
            <CleaningTask  
              onExtraSelect={handleCleanignExtraSelection} 
              extraTasks={handleExtraTaskTime}
              totalTaskTime={handleTotalTaskTime}
              roomBathChange ={handleBedroomBathroom}
              formData={formData} 
              setFormData={setFormData}   
              extras= {extras}
              validateForm={validateForm}
            />
          </Animatable.View>
        )}
        {step > 3 && (
          <Animatable.View animation="slideInRight" duration={600}>
            <Review
              formData={formData}
              setFormData={setFormData}
              validateForm={validateForm}
              step={setStep}
            />
          </Animatable.View>
        )}
      </View>

      <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View>
              <Text style={styles.priceText}>Estimated Fee {currency}{formData.total_cleaning_fee}</Text>
            </View>
        </View>

        <View style={styles.buttonContainer}>
        
        
        {step > 1 && (
          <TouchableOpacity style={styles.previous_button}  onPress={handlePrevStep}>
            <View style={styles.previous_icon}>
              <AntDesign name="caretleft" size={20} color={COLORS.gray} />
              <Text style={styles.previous_buttonText}> Previous</Text>
             
            </View>
          </TouchableOpacity>
        )}
        {/* <View><Text style={{fontSize:20}}>$40</Text></View> */}
        <View style={{ flex: 1, alignItems: 'center' }}>

          
        </View>
        <View style={{ flex: 1 }} /> 
        
        
        {step < 4 ? (
          
         
          <TouchableOpacity 
            // style={styles.button} onPress={handleNextStep}
            style={ [styles.nextButton, isValid ? styles.validButton : styles.invalidButton]}
            onPress={handleNextStep}
            disabled={!isValid} // Disable the button if the form is not valid
            >
              
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button}>
            <Text onPress={handleSubmit} style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        )}
  
      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:20,
    paddingVertical:5,
    borderTopWidth:1,
    borderColor:COLORS.light_gray_1,
    marginTop:2
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  previous_button: {
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  previous_buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight:'bold'
  },
  previous_icon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    backgroundColor: '#ddd',
    height: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 0,
  },
  progressIndicator: {
    backgroundColor: COLORS.primary,
    height: '100%',
    borderRadius: 5,
  },
  close_button:{
    marginTop:10,
    marginLeft:10
  },
  priceText: {
    fontSize: 16,
    marginLeft:20,
    color:COLORS.deepBlue,
    fontWeight:'600'
  },

  nextButton: {
    backgroundColor: 'gray',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  validButton: {
    backgroundColor: 'green', // Example: change color if form is valid
  },
  invalidButton: {
    backgroundColor: 'gray', // Keep it gray if form is invalid
  },
  headerContainer: {
    flexDirection:'row',
    height: 60, // Height of the header below the status bar
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Ensures layout elements are positioned relative to the parent
    // Remove shadow from the top
    shadowColor: '#000', 
   
  },

  
});


export default NewBooking;
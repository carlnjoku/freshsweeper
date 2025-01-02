import React, { useContext, useEffect, useState, useRef } from 'react';
import Text from '../../components/Text';
import { View, TextInput, Button, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import PropertyDetails from './CreateBookingContents.js/PropertyDetails';
import { AuthContext } from '../../context/AuthContext';
import Duration from './CreateBookingContents.js/Duration';
import CleaningTask from './CreateBookingContents.js/CleaningTask';
import Review from './CreateBookingContents.js/Review';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import * as Animatable from 'react-native-animatable';
import { useBookingContext } from '../../context/BookingContext';
import { useNavigation } from '@react-navigation/native'
import userService from '../../services/userService';
import calculateTotalPrice from '../../utils/calculateTotalPrice';
import { calculateCleaningTimeByTasks } from '../../utils/calculateCleaningTimeByTasks';
import ROUTES from '../../constants/routes';
import { task_checklist } from '../../data';
import TimeConversion from '../../utils/TimeConversion';
import StepsIndicator from '../../components/StepsIndicator';
import { before_photos, checklist } from '../../utils/tasks_photo';




const NewBooking = ({close_modal}) => {

  const {currency, currentUser, currentUserId} = useContext(AuthContext)
  const navigation = useNavigation()

  const [currentStep, setCurrentStep] = React.useState(2); // Example: Step 2 is active
  
  const {formData, setFormData } = useBookingContext();
  const [step, setStep] = useState(1);
  const [extras, setExtras] = useState([]);
  const [checkList, setChecklist] = useState([]);
  const [updated_task_checklist, setUpdatedTaskChecklist] = useState([]);
  const [isValid, setIsValid] = useState(false);

  
  
  
  

  const taskTimes =  
        {
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
        }

  // const ProgressBar = () => {
  //   return (
  //     <View style={styles.progressBar}>
  //       <View style={[styles.progressIndicator, { width: `${(step / 4) * 100}%` }]} />
  //     </View>
  //   );
  // };

  


  // Your validation logic here
  const validateForm = (isFormValid) => {
    // alert(isFormValid+" parent")
    // Example validation logic: Check if the form is valid
    // const isFormValid = true; // Replace with your validation logic
    setIsValid(isFormValid);
    // onValidationChange()
  };

  
  
  const handleOnCleaningTime = (text, input) => {
    setFormData(prevState => ({...prevState, [input]: text}))
  }

  const handleOnCleaningDate = (text, input) => {
    setFormData(prevState => ({...prevState, [input]: text}))
  }
  const handleSelectedProperty = (text, input) => {
    setFormData(prevState => ({...prevState, [input]: text}))
    console.log(formData)
  }

  // const handleCleanignExtraSelection = (text) => {
  //   setFormData((prevState) => ({ ...prevState, extra: text }));
  //   console.log(formData);
  // };

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
  
  const handleNextStep = () => {
    // validateForm();
    if (isValid) {
      setStep(step + 1);
    }
    setStep(step + 1);
  };
  

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleEditStep = (stp) => {
    alert(stp)
    setStep(stp)
  }
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onClose = () => {
    close_modal(false)
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
      
      console.log(cleanedArray);

      const formattedRegular = formData.regular_cleaning.map((item, index) => ({
        id: index + 1,
        label: item.label,
        value: item
      }));

      const updatedChecklist = [...cleanedArray, ...formattedRegular];

      console.log("checklist..................")
      console.log(JSON.stringify(updatedChecklist, null, 2))
      console.log("checklist..................")
      setUpdatedTaskChecklist(updatedChecklist)
    }else{
      console.log(formattedRegular)
      setUpdatedTaskChecklist(formattedRegular)
    }
  }

  const handleSubmit = async () => {
    // Submit form data
        console.log("looooo.............................")
        // console.log(JSON.stringify(updated_task_checklist, null, 2))
        console.log("looooo.............................")
        // createTaskChecklist()
        const data = {
          hostInfo:currentUser,
          schedule: formData,
          // check_list: updated_task_checklist,
          checklist: checklist,
          before_photos: before_photos
        }        
        
        await userService.createSchedule(data)
        .then(response => {
          console.log(response.status)
          if(response.status === 200){
            const res = response.data.data
            console.log(res)
            // navigation.navigate(ROUTES.host_recommended_cleaners, {
            //   'scheduleId':res._id,
            //   // 'schedule' : formData,
            //   'schedule' : res,
            //   'hostId': currentUserId,
            //   'hostFname': currentUser.firstname,
            //   'hostLname': currentUser.lastname
            // })
            // Redirect to list
          }else {
            console.log("could not verify")
          //   Alert.alert('Error', "Either username or password incorrect");
          }  
        }).catch((err)=> {
          console.log(err)
            setErrMsg(true)
            console.log("Either username or password incorrect")
            Alert.alert('Error', "Something went wrong, please try again");
        })
  };

  console.log("formData.....................")
  console.log(JSON.stringify(formData, null, 2))
  console.log("formData.....................")

  return (
    
 
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.close_button}><MaterialCommunityIcons name="close" color={COLORS.gray} size={24} onPress={onClose} /></View>
      
      {/* <ProgressBar /> */}

      <StepsIndicator step={step} />
      
    
      <View style={styles.form}>
        {step === 1 && 
          <Animatable.View animation="slideInRight" duration={550}>
            <PropertyDetails
              selectedProperty = {handleSelectedProperty}
              formData={formData} 
              setFormData={setFormData} 
              validateForm={validateForm}
            />
          </Animatable.View>
        }
        {step === 2 && 
        <Animatable.View animation="slideInRight" duration={600}>
          <Duration 
            getCleanTime={handleOnCleaningTime}
            getCleanDate={handleOnCleaningDate}
            formData={formData}
            setFormData={setFormData}
            validateForm={validateForm}
          />
        </Animatable.View>
      }
        {step === 3 && 
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
        }
        {step > 3 && 
        <Animatable.View animation="slideInRight" duration={600}>
          <Review  
            onExtraSelect={handleCleanignExtraSelection} 
            
            formData={formData} 
            setFormData={setFormData}   
            extras= {extras}
            validateForm={validateForm}
            step={handleEditStep}
          />
        </Animatable.View>
        }

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

          <View style={{flexDirection:'row', width:100}}>
            <Text style={styles.priceText}>Est. Fee {currency}{formData.total_cleaning_fee}</Text>
          </View>
          
          <View style={{flexDirection:'row', width:100}}>
            <Text style={styles.priceText}><TimeConversion minutes={formData.total_cleaning_time} /></Text>
          </View>

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
    backgroundColor:COLORS.backgroundColor,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  previous_button: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
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
    fontSize: 11,
    marginLeft:20
  },

  nextButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  validButton: {
    backgroundColor: 'green', // Example: change color if form is valid
  },
  invalidButton: {
    backgroundColor: 'gray', // Keep it gray if form is invalid
  },

  
});


export default NewBooking;











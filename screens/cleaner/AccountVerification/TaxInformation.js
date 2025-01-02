import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput, Button } from 'react-native-paper';
// import { TextInput as PaperTextInput } from 'react-native-paper';
import COLORS from '../../../constants/colors';
import MaskedTextInput from '../../../components/MaskedTextInput';
import FloatingLabelPicker from '../../../components/FloatingLabelPicker';
import { us_states } from '../../../data';
import { entities } from '../../../data';
import userService from '../../../services/userService';

const TaxInformation = ({route, label, mask, value, onChangeText, ...props }) => {

  const {email, location, stripe_account_id} = route.params
  
  // console.log(location)
  const [focused, setFocused] = useState(false);
  
  const [entityType, setEntityType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname:'',
    businessName: '',
    ein: '',
    ssn: '',
    email: email,
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country:location.country_code
  });

  const[errors, setErrors]=useState("")

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // console.log("formData", formData)

  // Handle SSN change and masking
  const handleSSNChange = (text) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, '');

    // Match the SSN pattern (XXX-XX-XXXX)
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);

    if (match) {
        // Mask the SSN, showing only the last four digits
        setInputs(prevState => ({ ...prevState, ssn: `***-**-${match[3]}` }));
    } else {
        // Allow user to input text
        setInputs(prevState => ({ ...prevState, ssn: text }));
    }
  };
  

  const handleSubmit = async() => {
    const newErrors = {};

    // Validate entity type
    if (!entityType || entityType === "null") {
      newErrors.entityType = "Entity type is required";
    }
    // Validate state
    if (!selectedState || selectedState === "null") {
      newErrors.selectedState = "State type is required";
    }
  
    // Validate common fields
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    // if (!formData.state.trim()) {
    //   newErrors.state = 'State is required';
    // }
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Postal code is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
  
    // Validate type-specific fields
    // if (entityType === 'individual') {
    //   if (!formData.ssn.trim() || !/^\d{9}$/.test(formData.ssn)) {
    //     newErrors.ssn = 'Valid 9-digit SSN is required';
    //   }
    // } else {
    //   if (!formData.businessName.trim()) {
    //     newErrors.businessName = 'Business name is required';
    //   }
    //   if (!formData.ein.trim() || !/^\d{9}$/.test(formData.ein)) {
    //     newErrors.ein = 'Valid 9-digit EIN is required';
    //   }
    // }
  
    // Set errors or proceed with submission
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // console.log('Form Submitted:', formData);
      // Proceed with API call or further logic
      
      

      const data = entityType === "individual"
      ? 
          {
            account_id: stripe_account_id,
            email: formData.email,
            business_type: "individual",
            individual_details: {
              first_name: formData.firstname,
              last_name: formData.lastname,
              ssn_last_4: formData.ssn,
              address: {
                line1: formData.address,
                city: formData.city,
                state: selectedState,
                postal_code: formData.postal_code,
                country: location.country_code
              }
            },
            tax_details: {
              line1: formData.address,
              city: formData.city,
              state: selectedState,
              postal_code: formData.postal_code,
              country: location.country_code
            }
          }
         :
        
        {
          account_id: stripe_account_id,
          email: email,
          business_type: "company",
          company_details: {
            name: formData.businessName,
            tax_id: formData.ein,
            address: {
              line1: formData.address,
              city: formData.city,
              state: selectedState,
              postal_code: formData.postal_code,
              country: location.country_code
            }
          },
          tax_details: {
            line1: formData.address,
            city: formData.city,
            state: selectedState,
            postal_code: formData.postal_code,
            country: location.country_code
          }
        }
    
    console.log("New data", data)

    try {
      
      const response = await userService.updateTaxInfomation(data);
   
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
      
      
    }
  };



  


  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Complete Your Tax Information</Text>
      <Text style={styles.message}>
        To ensure compliance with legal and tax requirements, we need your basic information, such as your TIN or SSN. This helps us generate accurate tax documents like Form 1099, required for your earnings on Freshsweeper.
      </Text>

      {/* User Type Picker */}
      

      {/* Common Fields */}

      <FloatingLabelPicker
        // label1="Select entity"
        title="Select entity"
        selectedValue={entityType}
        onValueChange={(value) => setEntityType(value)}
        options={entities}
        labelKey="label"
        valueKey="value"
      />
      {errors.entityType && <Text style={styles.errorText}>{errors.entityType}</Text>}
     

      {entityType === 'individual' && (
        <>
      <TextInput
        style={styles.input}
        label="First name"
        placeholder="Enter full name"
        onChangeText={(value) => handleChange('firstname', value)}
        value={formData.firstname}
        mode="outlined"
        placeholderTextColor={COLORS.darkGray}
        outlineColor="#CCC"
        activeOutlineColor={COLORS.primary}
  
        // onFocus={() => handleError(null, 'apt_name')}
        // iconName="email-outline"
        error={errors.firstname}
      />
      {errors.firstname && <Text style={styles.errorText}>{errors.firstname}</Text>} 
      
      <TextInput
        style={styles.input}
        label="Last name"
        placeholder="Enter last name"
        onChangeText={(value) => handleChange('lastname', value)}
        value={formData.lastname}
        mode="outlined"
        placeholderTextColor={COLORS.darkGray}
        outlineColor="#CCC"
        activeOutlineColor={COLORS.primary}
  
        // onFocus={() => handleError(null, 'apt_name')}
        // iconName="email-outline"
        error={errors.name}
      />
      {errors.lastname && <Text style={styles.errorText}>{errors.lastname}</Text>} 
      </>
  )}
      {['llc', 'ccorporation', 'scorporation', 'partnership', 'sole_proprietorship'].includes(entityType) && (
        <>
          
          <TextInput
            style={styles.input}
            label="Business Name"
            placeholder="Enter business name"
            onChangeText={(value) => handleChange('businessName', value)}
            value={formData.businessName}
            mode="outlined"
            placeholderTextColor={COLORS.darkGray}
            outlineColor="#CCC"
            activeOutlineColor={COLORS.primary}
            error={!!errors.businessName}
          />
          {errors.businessName && <Text style={styles.errorText}>{errors.businessName}</Text>}
        </>
      )}

      
      {/* <TextInput
        style={styles.input}
        label={`${userType === 'individual' ? 'SSN' : 'EIN'}`}
        placeholder={`Enter ${userType === 'individual' ? 'SSN' : 'EIN'}`}
        // onChangeText={(value) => handleChange(userType === 'individual' ? 'ssn' : 'tin', value)}
        value={userType === 'individual' ? formData.ssn : formData.ein}
        mode="outlined"
        placeholderTextColor={COLORS.darkGray}
        outlineColor="#CCC"
        activeOutlineColor={COLORS.primary}

        onChangeText={value => handleSSNChange(userType === 'individual' ? 'ssn' : 'tin', value)}
        // onFocus={() => handleError(null, 'ssn')}
        keyboardType="phone-pad"
        error={errors.ssn}
      />
      {errors.ssn && <Text style={styles.errorText}>{errors.ssn}</Text>} */}

      
      <MaskedTextInput
        label={`${entityType === 'individual' ? 'SSN' : 'EIN'}`}
        value={entityType === 'individual' ? formData.ssn : formData.ein}
        mask={entityType === 'individual' ?
          [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
          :
          [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }
        onChangeText={(value) => handleChange(entityType === 'individual' ? 'ssn' : 'ein', value)}
        placeholder={`Enter ${entityType === 'individual' ? 'SSN' : 'EIN'}`}

      />
      {errors.ssn && <Text style={styles.errorText}>{errors.ssn}</Text>}

      
      <TextInput
        style={styles.input}
        label="Email"
        placeholder="Enter email"
        autoCapitalize="none"
        onChangeText={(value) => handleChange('email', value)}
        value={formData.email}
        mode="outlined"
        placeholderTextColor={COLORS.darkGray}
        outlineColor="#CCC"
        activeOutlineColor={COLORS.primary}
      />
      <TextInput
        label="Street address"
        style={styles.input}
        placeholder="Enter address"
        onChangeText={(value) => handleChange('address', value)}
        value={formData.address}
        mode="outlined"
        placeholderTextColor={COLORS.darkGray}
        outlineColor="#CCC"
        activeOutlineColor={COLORS.primary}
      />
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
      <TextInput
        // style={[styles.input]}
        style={{width:'62%', backgroundColor:"#fff"}}
        label="City"
        placeholder="Enter city"
        onChangeText={(value) => handleChange('city', value)}
        value={formData.city}
        mode="outlined"
        placeholderTextColor={COLORS.darkGray}
        outlineColor="#CCC"
        activeOutlineColor={COLORS.primary}
      />

      <TextInput
        style={{width:'35%', backgroundColor:"#fff"}}
        label="Post Code"
        placeholder="Post code"
        onChangeText={(value) => handleChange('postal_code', value)}
        value={formData.postal_code}
        mode="outlined"
        placeholderTextColor={COLORS.darkGray}
        outlineColor="#CCC"
        activeOutlineColor={COLORS.primary}
        keyboardType="numeric"
        maxLength={10} // Optional: Limit input length
      />
      </View>
      
      {/* <View style={{flexDirection:'row', justifyContent:'space-between'}}> */}
      {/* <TextInput
        style={{width:'62%', backgroundColor:"#fff"}}
        label="State"
        placeholder="Enter state"
        onChangeText={(value) => handleChange('state', value)}
        value={formData.state}
        mode="outlined"
        placeholderTextColor={COLORS.darkGray}
        outlineColor="#CCC"
        activeOutlineColor={COLORS.primary}
      /> */}
      
      <FloatingLabelPicker
        // label="Select State"
        style={{width:'62%', backgroundColor:"#fff"}}
        title="Select State"
        selectedValue={selectedState}
        onValueChange={(value) => setSelectedState(value)}
        options={us_states}
        labelKey="name"  // Key in us_states for display text
        valueKey="abbreviation" // Key in us_states for value
      />
      {errors.selectedState && <Text style={styles.errorText}>{errors.selectedState}</Text>}
      
      {/* </View> */}
      
      
  
      
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.label}
        onPress={handleSubmit}
      >
        Submit Tax Info
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:"#fff"
  },
  message: {
    marginBottom: 20,
    fontSize: 14,
    color: COLORS.gray,
    // textAlign: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    marginBottom:10, 
    fontSize:14, 
    backgroundColor:"#fff"
  },
  picker: {
    marginBottom: 5,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius:5,
  },
  pickerStyle: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  paperInput: {
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    margin: 0,
    backgroundColor:'#fff',
    marginBottom:5
  },
  focused: {
    borderColor: '#6200ee',
  },
  button: {
    backgroundColor: COLORS.deepBlue, // Custom background color
    borderRadius: 50,           // Rounded corners
    paddingVertical: 2,        // Vertical padding
    paddingHorizontal: 16,     // Horizontal padding
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',          // Label color
    fontWeight: 'bold',        // Bold text
  },
});

export default TaxInformation;
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import CreateBooking from '../screens/host/CreateBooking';

const ProgressiveForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const renderStep1 = () => (
    <View>
      {/* <TextInput
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(text) => handleInputChange('firstName', text)}
      />
      <TextInput
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={(text) => handleInputChange('lastName', text)}
      /> */}
      <CreateBooking />
      
      <Button title="Next" onPress={handleNextStep} />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleInputChange('password', text)}
      />
      <Button title="Previous" onPress={handlePreviousStep} />
      <Button title="Next" onPress={handleNextStep} />
    </View>
  );

  const renderStep3 = () => (
    <View>
      {/* Step 3 form fields */}
      <Button title="Previous" onPress={handlePreviousStep} />
      <Button title="Next" onPress={handleNextStep} />
    </View>
  );

  const renderStep4 = () => (
    <View>
      {/* Step 4 form fields */}
      <Button title="Previous" onPress={handlePreviousStep} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );

  const handleSubmit = () => {
    // Submit form data
    // console.log(formData);
  };

  return (
    <View style={styles.container}>
      <Text>Step {step}</Text>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProgressiveForm;

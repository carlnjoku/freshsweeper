import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import userService from '../../services/userService';

const ResetPassword = ({ route, navigation }) => {
  const { token } = route.params || {};
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!token) {
      Alert.alert('Invalid Link', 'The reset link is missing or expired.');
      navigation.navigate('Home');
    }
  }, [token]);

  const handleResetPassword = () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    userService.resetPassword(data)
    .then((res) => res.json())
      .then((data) => {
        Alert.alert('Success', 'Your password has been reset!');
        navigation.navigate('Home');
      })
      .catch(() => Alert.alert('Error', 'Something went wrong.'));
  };

  return (
    <View>
      <Text>Enter New Password</Text>
      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

export default ResetPassword;
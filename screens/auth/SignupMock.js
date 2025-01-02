import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import ROUTES from "../../constants/routes";
const SignupMock = ({navigation}) => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAddUser = () => {
    const newUser = {
      firstname,
      lastname,
      email,
      userType,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`, // Generate a random avatar
    };

    fetch("https://674b117b71933a4e88544c58.mockapi.io/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to add user.");
        }
      })
      .then((data) => {
        Alert.alert("Success", `User ${data.firstname} added!`);
        navigation.navigate(ROUTES.signin_mock, {"email":data.email});
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={firstname}
        onChangeText={(text) => setFirstName(text)}
      />
       <Text style={styles.label}>Last Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={lastname}
        onChangeText={(text) => setLastName(text)}
      />
      <Text style={styles.label}>User Type:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={userType}
        onChangeText={(text) => setUserType(text)}
      />
      

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        keyboardType="password"
      />

      <Button title="Add User" onPress={handleAddUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: "bold", marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
});

export default SignupMock;
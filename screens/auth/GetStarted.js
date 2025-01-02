import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import ROUTES from '../../constants/routes';
import COLORS from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const GetStarted = ({navigation}) => {
    const {userToken} = useContext(AuthContext)

    const handleHostPress = () => {
      // Navigate to the host registration screen
      navigation.navigate(ROUTES.signup, {userType:"host"});
      // navigation.navigate(ROUTES.signup_mock, {userType:"host"});
    };
  
    const handleCleanerPress = () => {
      // Navigate to the cleaner registration screen
      navigation.navigate(ROUTES.signup, {userType:"cleaner"});
      // navigation.navigate(ROUTES.signup_mock, {userType:"cleaner"});
    };

  return (
    
    <View style={styles.container}>
        {/* <TouchableOpacity style={styles.categoryBtn} onPress={() => navigation.navigate(ROUTES.getting_started, {
            userId:"1234",
            })
        }>
            <Text>Send data {userToken}</Text>
        </TouchableOpacity> */}
<Animatable.View 
            animation="slideInRight"
            style={[styles.footer, {
                backgroundColor: COLORS.white
            }]}
        >
      
        <TouchableOpacity style={styles.button} onPress={handleHostPress}>
          <Text style={styles.buttonText}>
            <MaterialCommunityIcons name="home-account" size={32} color={COLORS.gray} /> Become a Host</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCleanerPress}>
          <Text style={styles.buttonText}>
          <MaterialCommunityIcons name="broom" size={32} color={COLORS.gray} />
            Become a Cleaner
          </Text>
        </TouchableOpacity>
    
        </Animatable.View>
    </View>

  )
}

export default GetStarted

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryBtn:{
      width:'30%',
      marginHorizontal:0,
      alignSelf:'center',
      backgroundColor:COLORS.primary
    },
    button: {
      backgroundColor: 'transparent',
      color:'#000',
      padding: 10,
      borderRadius: 10,
      borderWidth:1,
      borderColor:COLORS.gray,
      marginVertical: 10,
      height:60,
      width: 300,
      justifyContent:'center'
    },
    buttonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
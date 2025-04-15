import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import React, { useContext } from 'react';
import ROUTES from '../../constants/routes';
import COLORS from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import RoleSelection from '../../components/RoleSelection';

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


    const handleRoleContinue = (selectedRole) => {
      // Handle navigation based on selected role
      navigation.navigate(ROUTES.signup, { 
        userType: selectedRole 
      });
    };

  return (
    
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
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
    

        <RoleSelection 
          onContinue={handleRoleContinue}
        />
    
        </Animatable.View>
    </View>

  )
}

export default GetStarted

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      // alignItems: 'center',
      justifyContent: 'center',
      padding:20
  
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
    card: {
      backgroundColor: COLORS.white,
      borderColor: COLORS.primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 2,
      // borderColor: 'transparent',
    },
    selectedCard: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primaryLight,
    },
    itemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.dark,
    },
  });
  
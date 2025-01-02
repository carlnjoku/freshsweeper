import React from 'react';
import Text from '../../components/Text';
import { View, TouchableOpacity, StatusBar, Image,ImageBackground, useWindowDimensions, StyleSheet } from 'react-native';
import ROUTES from '../../constants/routes';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import Constants from 'expo-constants';
import DarkOverlay from '../../components/DarkOverlay';
import COLORS from '../../constants/colors';
import Button2 from '../../components/Button2';
import * as Animatable from 'react-native-animatable';


const Onboarding = ({ navigation }) => {
  const handleHostPress = () => {
    // Navigate to the host registration screen
    navigation.navigate(ROUTES.signup, {userType:"host"});
  };

  const handleCleanerPress = () => {
    // Navigate to the cleaner registration screen
    navigation.navigate(ROUTES.getting_started, {userType:"cleaner"});
  };

  const { width, height } = useWindowDimensions();

  const handleLogin = () => {
    // Navigate to the host registration screen
    navigation.navigate(ROUTES.signin, {userType:"host"});
  };

  return (
    <View style={styles.container}>

      <StatusBar translucent backgroundColor="transparent" />

      
      <Animatable.View 
            animation="slideInRight"
            style={[styles.footer, {
                backgroundColor: COLORS.white
            }]}
        >
      <Swiper autoplay={true}>
        {/* <View style={styles.slide}>
        <Image
            source={require('../../assets/onboarding.png')}
            style={{ width: width, height: height }}
            resizeMode="cover"
          />
          <View style={styles.slider_box}>
            <Text  style = {{padding:20, textAlign:'center', fontSize:20, color:"white"}}>Congratulations! Your cleaning appointment with CleanHost is confirmed</Text>
          </View>
        </View> */}
        <View style={styles.slide}>
          <ImageBackground
            source={require('../../assets/onboarding-host2.jpg')}
            style={{flex:1, width: width, height: height }}
            resizeMode="cover"
          />
        
          <View style={styles.slider_box}>
            <Text style = {{padding:20, fontSize:20, textAlign: 'center', color:"white"}}>Your Trusted Partner for Sparkling Airbnb Spaces</Text>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', bottom:5}}>
              <Button2 title="Get Started" size="100%" onPress={handleCleanerPress} />
            </View>
            <Text style={styles.login_question}>Already have an account ? </Text>
            <Text onPress={handleLogin} style={styles.login_text}>Login </Text>
          </View>
        </View>
        <View style={styles.slide}>
          <ImageBackground
            source={require('../../assets/onboarding3.jpg')}
            style={{flex:1, width: width, height: height }}
            // resizeMode="cover"
          />
          <View style={styles.slider_box}>
            <Text style = {{ padding:20, fontSize:20, textAlign: 'center', color:"white"}}>Cleaning Opportunities for Cleaners</Text>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', bottom:5}}>
              <Button2 title="Get Started" size="100%" onPress={handleCleanerPress} />
            </View>
            <Text style={styles.login_question}>Already have an account ? </Text>
            <Text onPress={handleLogin} style={styles.login_text}>Login </Text>
          </View>
        </View>
        
      </Swiper>
      
      
      </Animatable.View>
      
      
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop:-20,
    marginBottom:-20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
    image: {
      // width: width,
      // height: height,
    },
    slide:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slider_box: {
      flexDirection:'column', justifyContent:'center', alignItems:'center',
      position:'absolute',
      bottom:80, 
      // borderTopLeftRadius:20, 
      // borderTopRightRadius:20, 
      width:300, 
      height:300, 
      borderRadius:150,
      opacity:0.8, 
      backgroundColor:'#00394c'
    }, 
    login:{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center'
    },
    login_question:{
      fontSize:14,
      color:COLORS.light_gray
    },
    login_text:{
      fontSize:14,
      color:COLORS.primary
    }
    
  
});

export default Onboarding;





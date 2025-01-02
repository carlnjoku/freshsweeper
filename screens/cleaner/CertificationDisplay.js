import React from 'react';
import { SafeAreaView,Text, StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import CardNoPrimary from '../../components/CardNoPrimary';
import CircleIconNoLabel from '../../components/CirecleIconNoLabel';
import COLORS from '../../constants/colors';

export default function CertificationDisplay({certification, handleOpenCertification, mode}) {
  return (
    <CardNoPrimary>
              <View style={styles.titleContainer}>
                <Text bold style={styles.title}>Certification or License</Text> 
                  
                {mode==="edit" && 
                  <View style={styles.actions}>
                
                  <CircleIconNoLabel 
                    iconName="pencil"
                    buttonSize={30}
                    radiusSise={15}
                    iconSize={16}
                    onPress={handleOpenCertification}
                  /> 
                  <CircleIconNoLabel 
                    iconName="plus"
                    buttonSize={30}
                    radiusSise={15}
                    iconSize={22}
                    onPress={handleOpenCertification}
                  /> 
                  
                  </View>
                }
                </View> 
              <View style={styles.line}></View>
              <View>
                {certification < 0 && <Text>Add Certification</Text>}
                
                
                {certification?.map((item, index) => (
                    <View style={{marginVertical:10}}>
                    <Text style={{fontSize:14, fontWeight:'600'}}>{item?.name}</Text>
                    <Text>{item?.institution_name}</Text>
                    <Text style={styles.url_text}>{item?.credentialUrl}</Text>
                    {/* <Text>{item?.startDate}</Text>
                    <Text>{item?.entDate}</Text>
                    <Text>{item?.expiryDate}</Text> */}
                    
                    </View>
                ))}
              </View>
            </CardNoPrimary>
  )
}


const styles = StyleSheet.create({
    header:{
      margin:0
    },
    name:{
      color:COLORS.white,
      fontSize:18,
    },
    location:{
      color:COLORS.white
    },
    container:{
      margin:10
    },
    avatar_background:{
      paddingTop:80,
      paddingBottom:10,
      minHeighteight:200,
      backgroundColor:COLORS.primary,
      justifyContent:'center',
      alignItems:'center'
    },
    line:{
      borderBottomWidth:0.8,
      borderColor:COLORS.light_gray_1,
      marginVertical:5,
      height:4
    },
    titleContainer:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginTop:0
    },
    title:{
      fontSize:16,
      fontWeight:'bold'
      
    },
    content:{
      flexDirection:'row',
      justifyContent:'space-between',
      marginVertical:5
    },
    actions:{
      flexDirection:'row',
  
    },
    address:{
        color:COLORS.gray,
        fontSize:14
    },
    url_text:{
        color:COLORS.primary
    }
  })
  
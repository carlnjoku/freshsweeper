import React from 'react';
import { SafeAreaView,Text, StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import CardNoPrimary from '../../components/CardNoPrimary';
import CircleIconNoLabel from '../../components/CirecleIconNoLabel';
import COLORS from '../../constants/colors';

const AvailabilityDisplay = ({availability, handleOpenAvailability, mode }) => {
    console.log("availability_________")
    console.log(availability)
    console.log("availability_________1")
    return (
      
        <CardNoPrimary>
            <View style={styles.titleContainer}>
              <Text bold style={styles.title}>Availability</Text> 

              {mode==="edit" && 
                <View style={styles.actions}>
                    <CircleIconNoLabel 
                        iconName="pencil"
                        buttonSize={30}
                        radiusSise={15}
                        iconSize={16}
                        onPress={handleOpenAvailability}
                    /> 
                </View>
              }
              

            </View>
            <View style={styles.line}></View>
              <View style={styles.content}>
              <View style={styles.container}>

              <ScrollView>
                { availability.length > 0 ? 
                    <View>
                    {availability?.map((item, index) => (
                        <View key={index} style={styles.availabilityItem}>
                            <View>
                            <Text style={styles.day}>{item.day}</Text>
                            </View>
                            <View>
                            {item.timeRange ? (
                                <Text style={styles.timeRange}>{item.timeRange}</Text>
                            ) : (
                                <Text style={styles.unavailable}>Not Available</Text>
                            )}
                            </View>
                        </View>
                    ))}
                    </View>
                    : 
                    
                    <View style={styles.empty}>
                        <Text>Set availability</Text>
                    </View>
                }

</ScrollView>
              </View>

              </View>
              
            </CardNoPrimary>
            
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 16,
        // backgroundColor: '#f9f9f9',
        
        borderRadius: 8,
        width:'100%'
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    availabilityItem: {
        flexDirection: 'row',
        marginBottom: 4,
        justifyContent:'space-between',
        alignItems:'center'
    },
    day: {
        fontWeight: '400',
        marginRight: 8,
    },
    timeRange: {
        flex: 1,
        color:COLORS.gray,
        fontSize:12
    },
    unavailable: {
        color: 'red', // Customize the color or style as needed
        flex: 1,
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
      empty:{
        justifyContent:'center',
        alignItems:'center',
        height:120
      }
});

export default AvailabilityDisplay;


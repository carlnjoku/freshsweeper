import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { verification_items } from '../../../data';
import VerificationListItem from '../../../components/cleaner/VerificationListItem';
import { Avatar } from 'react-native-paper';
import COLORS from '../../../constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function VerificationList({route}) {

    

    const {verifyItem} = route.params

    console.log("verification list")
    console.log(verifyItem)
    const renderItem = ({ item }) => (
        
            <VerificationListItem
                icon={item.icon}
                label={item.label}
                description={item.description}
                type= {item.type}
                status={item.status}
                email={item.email}
                location={item.location}
                stripe_account_id={item.stripe_account_id}
                
                // verifyItem={verifyItem}
            />
 
    );
  return (
    <View style={styles.container}>
        <View style={styles.profileItem}>
            <Avatar.Icon
                size={110}
                // source={{uri:item.avatar}}
                style={{ backgroundColor: COLORS.light_gray_1,  marginBottom:0 }}
                icon={({ size, color }) => (
                    <MaterialCommunityIcons name="account" size={80} color={color} />
                )}
            />
            <Text style={styles.name}>Carl Njoku</Text>
            <Text style={styles.location}>Newark, New Jersy</Text>
        </View>


        <FlatList
            data={verifyItem}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
        />
    </View>
  )
}


// Styles
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    profileItem: {
        alignItems: "center",
        marginHorizontal: 16,
        marginVertical: 40,
        padding: 12,
        backgroundColor: "#FFFFFF",
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        minHeight:200,
        justifyContent:'center',
        alignItems:'center'
     },
     location:{
        color:COLORS.gray
     }
    
});


import React, { useState, useEffect, useContext } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import userService from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import COLORS from '../../constants/colors';
import * as Animatable from 'react-native-animatable';
import ApplicationListItem from '../../components/host/ApplicationListItem';
import CardNoPrimary from '../../components/CardNoPrimary';

export default function Application({navigation}) {

  const{currentUserId, currentUser} = useContext(AuthContext)

  const[applications, setApplications]=useState([])
  const[openModal, setOpenModal] = useState(false)
  
  const fetchApplications = async() => {

    const response = await userService.getAllHostApplications(currentUserId);
    const res = response.data;
    const status = response.status

    setApplications(res)

    console.log("application................")
    // console.log(JSON.stringify(res, null, 2))
    console.log("application................1")
  }



useEffect(()=> {
  
  const unsubscribe = navigation.addListener('focus', () => {
    // Refresh data or reset state here
    fetchApplications()
    
});

fetchApplications()
return unsubscribe; // Cleanup subscription

},[])

const singleItem = ( {item, index} ) => (

  <CardNoPrimary>
      <ApplicationListItem
          item={item}
          currentUser={currentUser}
          currentUserId={currentUserId}
      />
  </CardNoPrimary>
)

  return (

    <SafeAreaView style={{flex:1, margin:0, marginTop:0, backgroundColor:COLORS.backgroundColor}}>
      
      <StatusBar translucent backgroundColor="transparent" />
      



      <View style={styles.container2}>
       
      <Animatable.View animation="slideInRight" duration={550}>
        <FlatList 
            data = {applications}
            renderItem = {singleItem}
            ListHeaderComponentStyle={styles.list_header}
            // ListEmptyComponent= {emptyListing}
            // ItemSeparatorComponent={itemSeparator}
            keyExtractor={(item, index)=> item.label}
            numColumns={1}
            showsVerticalScrollIndicator={false}
        />
        </Animatable.View>

      {/* <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 1 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(1)}>
          <MaterialCommunityIcons name="folder-network" size={24} color={currentStep === 1 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Pending </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 2 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(2)}>
          <MaterialCommunityIcons name="progress-clock" size={24} color={currentStep === 2 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Accepted</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 3 ? COLORS.primary :"#f0f0f0"}]} onPress={() => setCurrentStep(3)}>
          <MaterialCommunityIcons name="progress-check" size={24} color={currentStep === 3 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Rejected</Text>
        </TouchableOpacity>
      </View> */}



        {/* <View style={styles.container}>
          {currentStep === 1 && <Pending currentUser={currentUser} pending_applications = {pending} get_applicationId={handleRemoveItem}  />} 
          {currentStep === 2 && <Accepted schedules= {accepted} />}
          {currentStep === 3 && <Rejected schedules= {rejected} />}
        </View> */}
      </View>

        

        <Modal 
            visible={openModal}
            animationType="slide" 
            // onRequestClose={onClose} // Handle hardware back button on Android
          >
         
          </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
      flex:1, 
      backgroundColor:COLORS.backgroundColor,
      padding:10
    },
    container2:{
      flex: 1,
      margin:0
    },
    colorcode:{
      marginBottom:20
  },
  item_separator : {
    marginTop:5,
    marginBottom:5,
    height:1,
    width:"100%",
    backgroundColor:"#E4E4E4",
    },
  empty_listing: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop:'50%'
  },
  button:{
    padding:10,
    borderRadius:50,
    backgroundColor:COLORS.primary,
    marginTop:20
  },
  add_apartment_text:{
    color:COLORS.white
  },
  tabsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    borderBottomColor: "#e9e9e9",
    elevation:2
  },
  tab:{
    borderBottomWidth:3,
    borderBottomColor: COLORS.primary,
    alignItems:'center',
    marginTop:10,
    paddingHorizontal:26
  },
  tab_text:{
    marginBottom:5,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  arrowButton: {
    padding: 10,
  }, 
})

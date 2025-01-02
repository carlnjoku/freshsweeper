import React, { useContext, useEffect, useState } from 'react';
import Text from '../../../components/Text';
import COLORS from '../../../constants/colors';
import { TextInput, Checkbox, RadioButton, Card, Title, Subheading, Paragraph } from 'react-native-paper';
import { View, Button, StyleSheet, Pressable, FlatList, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import GoogleMapComponent from '../../../components/GoogleMap';
import { Picker } from '@react-native-picker/picker';
import userService from '../../../services/userService';
import TextInputContainer from '../../../components/TextInputContainer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CircleIconButton1 from '../../../components/CircleButton1';
import BoxWithIcon3 from '../../../components/BoxWithIcon3';
import CardNoPrimary from '../../../components/CardNoPrimary';

export default function Review({formData, step}) {

  const regular_cleaning = [
    {
        "label":"Sweeping and Mopping",
        "value":"Sweeping and Mopping",
    },
    {
        "label":"Vacuuming",
        "value":"Vacuuming"
    },
    {
        "label":"Kitchen Cleaning",
        "value":"Kitchen"
    },
    {
        "label":"Bathroom Cleaning",
        "value":"Bathroom "
    },
    {
        "label":"Dishwashing",
        "value":"Dishwashing"
    },
    {
        "label":"Trash Removal",
        "value":"Trash Removal"
    },
    {
        "label":"Room Cleaning",
        "value":"Room Cleaning"
    },
    {
        "label":"Livingroom",
        "value":"Livingroom"
    },
    {
        "label":"Window Cleaning",
        "value":"Window Cleaning"
    },
    {
        "label":"Air Freshening",
        "value":"Air Freshening"
    },
    {
        "label":"Appliance Cleaning",
        "value":"Appliance Cleaning"
    },
    {
        "label":"Final Inspection",
        "value":"Final Inspection"
    },
    {
        "label":"Dusting",
        "value":"Dusting"
    },
    
    
]

const { width } = useWindowDimensions();
    const numColumns = 3;
    const numColumns2 = 2
    const columnWidth = width / numColumns - 28; // Adjusted width to accommodate margins
    const columnWidth2 = width / numColumns2 - 10; // Adjusted width to accommodate margins


const taskItem = ( {item,index} ) => (
  <View style={[styles.tasks, { width: columnWidth2 }]}>
      <Text style={{fontSize:13}}>{item.label} </Text>
  </View>
  
)

const singleItem = ( {item,index} ) => (
  <BoxWithIcon3 
      item={item}
      iconName={item.icon}
      price={item.price}
      color="primary"
      columnWidth={columnWidth}
      
  />
)

const handleEditStep = (sp) => {
  step(sp)
}
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View>
      <Text bold style={{fontSize:24, }}>Review Schedule</Text>
      <Text style={{fontSize:14, marginBottom:20, color:COLORS.gray}}>Outline Specific Tasks and Instructions for the Cleaner</Text>
       {/* <Card style={{backgroundColor:COLORS.primary_light_1, marginVertical:20, padding:10, minHeight:200}}>
            <Text>{formData.address}</Text>
       </Card> 
       <Card style={{backgroundColor:COLORS.primary_light_1, padding:10, minHeight:200}}>
            <Text>Other content</Text>
       </Card>  */}
       <CardNoPrimary style={styles.card}>
        {/* <Card.Content> */}
          <View style={styles.title_edit}>
            <Text style={styles.title}>Apartment Details</Text>
            <MaterialCommunityIcons onPress={() => handleEditStep(1)} name='pencil' size={20} color={COLORS.primary} />
          </View>
          <Text bold style={{fontSize:14}}>{formData.apartment_name}</Text>
          <Paragraph style={styles.paragraph}><MaterialCommunityIcons name="map-marker" size={14} color={COLORS.primary} />{formData.address}</Paragraph>
          <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginTop:5}}>
          <Text style={{fontSize:14}}><MaterialCommunityIcons name="bed-empty" color={COLORS.gray} size={16} /> {formData.bedroom} Bedrooms</Text>
          <Text style={{fontSize:14, marginLeft:40}}><MaterialCommunityIcons name="shower-head" color={COLORS.gray} size={16} /> {formData.bathroom} Bathrooms</Text>
          </View>
          {/* <View style={styles.bed_bath}>
            <View style={styles.bedroom}>
            <View>
                <CircleIconButton1 iconName="bed" iconSize={24}/>
              </View>
              <View>
                <Text bold style={{marginLeft:10}}>Bedrooms</Text>
                <Text style={{textAlign:'left', marginLeft:10}}>{formData.bedroom}</Text>
              </View>
            </View>
            <View style={styles.bathroom}>
              <View>
                <CircleIconButton1 iconName="bathtub" iconSize={24}/>
              </View>
              <View>
                <Text bold style={{marginLeft:10}}>Bathrooms</Text>
                <Text style={{textAlign:'left.', marginLeft:10}}>{formData.bathroom}</Text>
              </View>

              
            </View>
          </View> */}
        {/* </Card.Content> */}
      </CardNoPrimary>


      <CardNoPrimary style={styles.card}>
        {/* <Card.Content> */}
        <View style={styles.title_edit}>
          <Text style={styles.title}>Schedule Date & time</Text>
          <MaterialCommunityIcons onPress={() => handleEditStep(2)} name='pencil' size={20} color={COLORS.primary} />
        </View>
         
         
          <View style={styles.bed_bath}>
            <View style={styles.bedroom}>
              <View>
                <CircleIconButton1 iconName="calendar" iconSize={24}/>
              </View>
              <View>
                <Text bold style={{marginLeft:10}}>Date</Text>
                <Text style={{textAlign:'left', marginLeft:10, fontSize:13, color:COLORS.gray}}>{formData.cleaning_date}</Text>
              </View>
            </View>
            <View style={styles.bathroom}>
              <View>
                <CircleIconButton1 iconName="clock-outline" iconSize={24}/>
              </View>
              <View>
                <Text bold style={{marginLeft:10}}>Time</Text>
                <Text style={{textAlign:'left.', marginLeft:10, fontSize:13, color:COLORS.gray}}>{formData.cleaning_time}</Text>
              </View>
            </View>
          </View>
        {/* </Card.Content> */}
      </CardNoPrimary>



      <CardNoPrimary style={styles.card}>
          <View style={styles.title_edit}>
            <Text style={styles.title}>Base Cleaning Services</Text>
            <MaterialCommunityIcons onPress={() => handleEditStep(3)} name='pencil' size={20} color={COLORS.primary} />
          </View>
         
          <View style={styles.bed_bath}>
          <FlatList
              data={regular_cleaning}
              renderItem = {taskItem}
                  ListHeaderComponentStyle={styles.list_header}
                  keyExtractor={(item, index)=> item.label}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
          />
          </View>
      </CardNoPrimary>

      {formData.extra.length > 0 &&
      
        (
          <CardNoPrimary style={styles.card}>
            {/* <Card.Content> */}
              <View style={styles.title_edit}>
                <Text style={styles.title}>Extra Cleaning Services</Text>
                <MaterialCommunityIcons onPress={() => handleEditStep(3)} name='pencil' size={20} color={COLORS.primary} />
              </View>
            
              <View>
              <FlatList 
                    data = {formData.extra}
                    renderItem = {singleItem}
                    ListHeaderComponentStyle={styles.list_header}
                    // ListEmptyComponent= {emptyListing}
                    // ItemSeparatorComponent={itemSeparator}
                    keyExtractor={(item, index)=> item.value}
                    numColumns={numColumns}
                    key={numColumns}
                    showsVerticalScrollIndicator={false}
                />
              </View>
            {/* </Card.Content> */}
          </CardNoPrimary>
        )
      }

    </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  card: {
    // width: '80%', // Customize width as needed
    // elevation: 5, // Customize elevation (shadow)
    // marginBottom: 10, // Customize margin bottom
    // // Add more styles as needed
    // backgroundColor:COLORS.white,
    // elevation:5,
    // shadowColor: "#99e5ff",
    // shadowOpacity: 0.2,
    // shadowOffset: { width: 0, height: 2},

    // alignSelf:'center',
    marginTop:15,
    padding:5,
    minHeight:90,
    borderRadius:10,
    backgroundColor:COLORS.white,
    elevation:5,
    shadowColor: "#cccccc",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2},
  },
  title: {
    fontSize: 16, // Customize title font size
    fontWeight: 'bold', // Customize title font weight
    marginBottom:5
    // Add more title styles as needed
  },
  subtitle: {
    fontSize: 13, // Customize title font size
    // fontWeight: 'bold', // Customize title font weight
    // Add more title styles as needed
  },

  paragraph: {
    fontSize: 14, // Customize paragraph font size
    color:COLORS.gray
    // Add more paragraph styles as needed
  },
  bed_bath:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:0
  },
  bedroom:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    marginTop:-15
  },
  bathroom:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:-15
  },
  title_edit:{
    flexDirection:'row',
    justifyContent:'space-between',
    
  }
})
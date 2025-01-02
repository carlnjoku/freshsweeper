


import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';
import { Avatar } from 'react-native-paper';
import COLORS from '../constants/colors';
import moment from 'moment';
import { calculateOverallRating } from '../utils/calculate_overall_rating';
import StarRating from 'react-native-star-rating-widget';


const Reviews = ({ratings, cleanerId}) => {



  React.useEffect(()=> {
    // fetchCleanerFeedbacks()
  },[])
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Icon
        key={i}
        name={i < rating ? 'star' : 'star-o'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  
  const renderItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      {/* <Image source={{ uri: item.avatar }} style={styles.avatar} /> */}
      {item.schedule_info.hostInfo.avatar ? 
          <Avatar.Image 
              source={{uri:item.schedule_info.hostInfo.firstname}}
              size={40}
              style={styles.avatar}
          />
          :

          <Avatar.Icon 
            size={40} 
            icon="account" // Default icon
            style={styles.avatarIcon}
          />
      }
              
      <View style={styles.reviewContent}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.username}>{item.schedule_info.hostInfo.firstname} {item.schedule_info.hostInfo.lastname}</Text>
          <Text style={styles.created_on}>{moment(item.created_on).fromNow()}</Text>
        </View>
        <View style={styles.rating}>
          <StarRating
            rating={item.averageRating.toFixed(1)}
            onChange={() => {}} // No-op function to disable interaction
            maxStars={5} // Maximum stars
            starSize={18} // Size of the stars
            starStyle={{ marginHorizontal: 0 }} // Customize star spacing
          />
          <Text style={{marginLeft:5}}>{item.averageRating.toFixed(1)}</Text>
        </View>

        
        <Text style={styles.reviewText}>{item.comment}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <FlatList
        data={ratings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        // showsVerticalScrollIndicator={true}
        // nestedScrollEnabled={true} // Allow nested scrolling
        horizontal={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
    width:'100%',
    borderRadius: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  list: {
    paddingBottom: 16,
  },
  reviewContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#ddd',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    marginRight:5
  },
  reviewContent: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rating: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
  },
  avatarIcon:{
    marginRight:5,
    backgroundColor:COLORS.gray
  },
  created_on:{
    fontSize:12,
  },
  rating:{
    flexDirection:'row',
    // justifyContent:'center',
    alignItems:'center'
  },
});

export default Reviews;


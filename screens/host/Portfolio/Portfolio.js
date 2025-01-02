import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import JobCard from './JobCard';

const Portfolio = ({ portfolio, portfolio2 }) => {

    console.log("pooooooooorto")
    console.log(portfolio2)
    console.log("pooooooooorto")
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cleaner Portfolio</Text>
      <FlatList
        // data={portfolio.jobs}
        data={portfolio2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <JobCard job={item} />
        )}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.listContent} // Optional: styling for list content
      
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    
  },
  header: {
    fontSize:16,
    fontWeight:'bold',
    marginTop:10,
    marginBottom:10
  },
  listContent:{
    paddingVertical: 10,
    
  }
});

export default Portfolio;

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton, Card, Text as PaperText } from 'react-native-paper';
import CardIcon from './CardIcon';
import COLORS from '../../constants/colors';

export default function SavedCards({savedCards, selectedCard, onSelectCard}) {

  const cardList = [
    ...savedCards,
    { id: '', last4: '****', brand: 'Add New Card' } // "New Card" item
  ]


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pay with</Text>
      {/* <FlatList
        data={savedCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Brand: {item.card.brand}</Text>
            <Text>Last 4 digits: **** **** **** {item.card.last4}</Text>
            <Text>Expiry: {item.card.exp_month}/{item.card.exp_year}</Text>
          </View>
        )}
      /> */}

        {cardList.map((card) => (
        <View key={card.card?.id} >
          <TouchableOpacity style={styles.paymentCard}>
            

                  <CardIcon brand={card.card?.brand} />
                  <Text style={styles.cardText}>
                    
                    {card.card?.first4} 
                    {card?.id ==="" ? ' Add new card':' **** **** **** ending in ' } 
                    {card.card?.last4}
                  </Text>

                  <RadioButton
                    value={card.card?.id}
                    status={selectedCard === card.id ? 'checked' : 'unchecked'}
                    onPress={() => onSelectCard(card.id)} // Update selected card
                    color={COLORS.primary} // Change the color of the RadioButton
                    size={18} // Change the size of the RadioButton
                  /> 
              
            
          </TouchableOpacity>

          
          
          
          
          {/* {card.id==="" &&
          <Text style={styles.cardText}>
            Add a new card
            </Text>
          } */}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius:5
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  // card: {
  //   padding: 15,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 8,
  //   marginVertical: 5,
  // },
  card: {
    marginVertical: 5,
    borderRadius: 10, // Rounded corners
    elevation: 1, // Shadow on Android
    backgroundColor: '#f8f9fa', // Light background
  },
  paymentCard: {
    backgroundColor: '#f8f9f9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});





// import React, { useEffect, useState } from 'react';
// import { View, Text, RadioButton, StyleSheet } from 'react-native';

// const SavedCards = ({ savedCards, selectedCard, onSelectCard }) => {
//   return (
//     <View style={styles.cardListContainer}>
//         <Text>Hello</Text>
//       {savedCards.map((card) => (
//         <View key={card.id} style={styles.cardItem}>
//           <RadioButton
//             value={card.id}
//             status={selectedCard === card.id ? 'checked' : 'unchecked'}
//             onPress={() => onSelectCard(card.id)} // Update selected card
//           />
//           <Text style={styles.cardText}>
//             {card.card.brand.toUpperCase()} ending in {card.card.last4}
//           </Text>
//         </View>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   cardListContainer: {
//     padding: 10,
//     marginVertical: 20,
//   },
//   cardItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   cardText: {
//     marginLeft: 10,
//     fontSize: 16,
//   },
// });

// export default SavedCards;



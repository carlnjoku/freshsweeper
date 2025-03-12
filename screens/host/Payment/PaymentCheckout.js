import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import StripePaymentButton from '../../../components/StripePaymentButton';
import userService from '../../../services/userService';
import mockPaymentData from '../../../utils/mockPaymentData';
import COLORS from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../../context/AuthContext';
import SavedCards from '../../../components/stripe/SavedCards';
import { ScrollView } from 'react-native-gesture-handler';

const PaymentCheckout = ({ route, navigation }) => {

  const {currentUser} = useContext(AuthContext)

  const { selectedPayments } = route.params;
  const [clientSecret, setClientSecret] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [saved_cards, setSavedCards] = useState([]);
  const [customerId, setCustomerId] = useState(currentUser.stripe_customer?.stripe_customer_id)
  const [selectedCard, setSelectedCard] = useState(null); // State to track selected card

  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = selectedPayments.reduce((acc, paymentId) => {
        const payment = mockPaymentData.find(p => p.id === paymentId);
        return payment ? acc + payment.amount : acc;
      }, 0);
      setTotalAmount(total);
      return total;
    };

    const fetchClientSecret = async () => {
      const total = calculateTotalAmount();
      if (total > 0) {
        try {
        //   const data = { amount: total };
          const data = { 
            amount: total, 
            customerId: customerId, 
            platformFeeAmount: 150, 
            // cleanerAccountId: 'cleaner-stripe-account-id'
        };
          const response = await userService.fetchPaymentIntentClientSecret(data);
          setClientSecret(response.data.clientSecret);
        } catch (error) {
          Alert.alert("Error", "Failed to get payment intent.");
        }
      }
    };
    
    const fetchSavedCards = async () => {
        try {
          const custData = {customerId:customerId}
          const response = await userService.fetchCustomerPaymentMethods(custData)

          // console.log(response.data.payment_methods)
          setSavedCards(response.data.payment_methods);
        } catch (error) {
          console.error("Failed to fetch saved cards:", error);
        }
      };
  
    fetchSavedCards();

    fetchClientSecret();
  }, [selectedPayments]);

  const handleCardSelection = (cardId) => {
    setSelectedCard(cardId);
  };

  return (
    <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Centered Checkout Icon */}
      <Icon name="shopping-cart" size={48} color="#4CAF50" style={styles.icon} />
      <Text style={styles.header}>Payment Checkouts</Text>
      {saved_cards.length > 0 ? (
        <SavedCards savedCards={saved_cards} selectedCard={selectedCard} onSelectCard={handleCardSelection} />
      ) : (
        // <Text style={{ textAlign: 'center', fontSize: 12 }}>Loading saved cards...</Text>
        <Text style={{ textAlign: 'center', fontSize: 12 }}></Text>
      )}
      
      {clientSecret && totalAmount > 0 ? (
        <View style={styles.paymentButtonContainer}>
            
          <View style={{marginTop:10}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Text style={{marginLeft:15, color:COLORS.gray}}>Total Amount</Text>
                <Text style={styles.totalText}>{`$${totalAmount.toFixed(2)}`}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Text style={{marginLeft:15, color:COLORS.gray}}>Date</Text>
                <Text style={styles.totalText}>12-11-2024</Text>
            </View>
          </View>
          <StripePaymentButton clientSecret={clientSecret} totalAmount={totalAmount} selectedCard={selectedCard} />
        </View>
      ) : (
        <Text style={{textAlign:'center', fontSize:12}}>Loading payment information...</Text>
      )}

    </ScrollView> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin:10,
    justifyContent: 'center',
    alignItems: 'stretch', // Stretch to full width
  },
  icon: {
    marginBottom: 20,  // Add space below the icon
    textAlign: 'center', // Center-align header text
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // Center header text
    marginBottom: 20,
  },
  totalText: {
    fontSize: 13,
    textAlign: 'center', // Center total amount text
    marginVertical: 0,
    paddingRight:15,
    fontWeight:'bold'
  },
  paymentButtonContainer: {
    backgroundColor: '#FFFFFF',
    // padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginTop:20,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    width: '100%', // Full width for payment button
    // alignItems: 'center', // Center content within the payment button container
  },
});

export default PaymentCheckout;



// import React, { useState, useContext, useEffect } from 'react';
// import { View, Text, Alert, StyleSheet } from 'react-native';
// import StripePaymentButton from '../../../components/StripePaymentButton';

// import userService from '../../../services/userService';
// import mockPaymentData from '../../../utils/mockPaymentData';
// import COLORS from '../../../constants/colors';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SavedCards } from '../../../components/stripe/SavedCards';
// import { AuthContext } from '../../../context/AuthContext';


// const PaymentCheckout = ({ route, navigation }) => {
//   const {currentUser} = useContext(AuthContext)
//   const { selectedPayments } = route.params;
  
//   const [clientSecret, setClientSecret] = useState(null);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [savedCards, setSavedCards] = useState([]); // To hold saved cards
//   const [selectedCard, setSelectedCard] = useState(null); // State to track selected card
//   const [customerId, setCustomerId] = useState(currentUser.stripe_customer?.stripe_customer_id)
  
//   useEffect(() => {
//     const calculateTotalAmount = () => {
//       const total = selectedPayments.reduce((acc, paymentId) => {
//         const payment = mockPaymentData.find(p => p.id === paymentId);
//         return payment ? acc + payment.amount : acc;
//       }, 0);
//       setTotalAmount(total);
//       return total;
//     };

//     const fetchClientSecret = async () => {
//       const total = calculateTotalAmount();
//       if (total > 0) {
//         try {
//             const data = { 
//                 amount: total, 
//                 customerId: 'cus_RC5lPrQwpeqkB2', 
//                 platformFeeAmount: 150, 
//                 // cleanerAccountId: 'cleaner-stripe-account-id'
//             };   
//           const response = await userService.fetchPaymentIntentClientSecret(data);
//           setClientSecret(response.data.clientSecret);
//           console.log('clientIntent',response.data.clientSecret);
          
//         } catch (error) {
//           Alert.alert("Error", "Failed to get payment intent.");
//         }
//       }
//     };

//     const fetchSavedCards = async () => {
//       try {
//         const custData = {customerId:customerId}
//         const response = await userService.fetchCustomerPaymentMethods(custData); // Assuming a service to fetch saved cards
//         setSavedCards(response.data.payment_methods);
//       } catch (error) {
//         console.error("Error fetching saved cards:", error);
//       }
//     };

//     fetchClientSecret();
//     fetchSavedCards();
//   }, [selectedPayments]);

//   const handleCardSelection = (cardId) => {
//     setSelectedCard(cardId);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Centered Checkout Icon */}
//       <Icon name="shopping-cart" size={48} color="#4CAF50" style={styles.icon} />
//       <Text style={styles.header}>Payment Checkout</Text>
      
//       {savedCards.length > 0 ? (
//         <SavedCards savedCards={savedCards} selectedCard={selectedCard} onSelectCard={handleCardSelection} />
//       ) : (
//         <Text style={{ textAlign: 'center', fontSize: 12 }}>Loading saved cards...</Text>
//       )}

//       {clientSecret && totalAmount > 0 ? (
//         <View style={styles.paymentButtonContainer}>
//           <Text style={styles.totalText}>{`Total Amounts: $${totalAmount.toFixed(2)}`}</Text>
//           <StripePaymentButton
//             clientSecret={clientSecret}
//             totalAmount={totalAmount}
//             // selectedCard={selectedCard} // Pass selected card to payment button
//           />
//         </View>
//       ) : (
//         <Text style={{ textAlign: 'center', fontSize: 12 }}>Loading payment information...</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 0,
//     margin: 10,
//     justifyContent: 'center',
//     alignItems: 'stretch', // Stretch to full width
//   },
//   icon: {
//     marginBottom: 20,  // Add space below the icon
//     textAlign: 'center', // Center-align header text
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center', // Center header text
//     marginBottom: 20,
//   },
//   totalText: {
//     fontSize: 16,
//     textAlign: 'center', // Center total amount text
//     marginVertical: 10,
//     paddingRight: 15,
//   },
//   paymentButtonContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     marginVertical: 8,
//     shadowColor: COLORS.gray,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//     width: '100%', // Full width for payment button
//   },
// });

// export default PaymentCheckout;


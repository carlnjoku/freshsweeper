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
import { PUBLISHABLE_KEY } from '../../../secret';
import PaymentDetails from './PaymentDetails';
import onAddFriend from '../../../utils/createNewChatFriend';

const PaymentSingleCheckout = ({ route, navigation }) => {

  const {currentUser, currentUserId, fbaseUser} = useContext(AuthContext)

  const { cleaning_fee, scheduleId, schedule, host_expo_token, cleaner_expo_token, cleanerId, 
  cleaner_firstname, cleaner_lastname, cleaner_avatar } = route.params;
  
  // Calculate Service Fee (10% of cleaning service fee)
  const serviceFee = cleaning_fee * 0.1;

  // Calculate Total
  const total = cleaning_fee + serviceFee

  const [clientSecret, setClientSecret] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [saved_cards, setSavedCards] = useState([]);
  const [customerId, setCustomerId] = useState(currentUser.stripe_customer?.stripe_customer_id)
  const [selectedCard, setSelectedCard] = useState(null); // State to track selected card
  const [total_fee, setTotalFee] = useState(total); // State to track selected card

  const[cleaner_tokens, setCleanerTokens]=useState([])
  const[host_tokens, setHostPushToken]=useState([])
    alert("payment")
  


  useEffect(() => {
    

    const fetchClientSecret = async () => {
    
      
      if (total > 0) {
        try {
        //   const data = { amount: total };
          const data = { 
            amount: total, 
            customerId: customerId, 
            metadata:{
                scheduleId: scheduleId,
                cleanerId:cleanerId,
                cleaner_firstname:cleaner_firstname,
                cleaner_lastname:cleaner_lastname,
                cleaner_avatar:cleaner_avatar
            },
            platformFeeAmount: 150, 
            // cleanerAccountId: 'cleaner-stripe-account-id'
        };
          const response = await userService.fetchSinglePaymentIntentClientSecret(data);
          setClientSecret(response.data.clientSecret);
          fetchCleanerPushTokens()
        } catch (error) {
          Alert.alert("Error", "Failed to get payment intent.");
        }
      }
    };

    const fetchCleanerPushTokens = async() => {
      await userService.getUserPushTokens(cleanerId)
      .then(response => {
          const res = response.data.tokens
          setCleanerTokens(res)
          console.log("User tokens", res)
      })
  
      await userService.getUserPushTokens(currentUserId)
      .then(response => {
          const res = response.data.tokens
          setHostPushToken(res)
          console.log("User tokens", res)
      })
    }


    
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
  }, [cleaning_fee]);

  const handleCardSelection = (cardId) => {
    setSelectedCard(cardId);
  };

  // New component
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePaymentSuccess = (result) => {
    setPaymentStatus(result.status);
    
    
    // send push notification to cleaner
    Alert.alert('Payment Success', `Payment of $${result.totalAmount} was successful!`);

    // Create chat room and friend
    onAddFriend(cleanerId, fbaseUser, schedule, scheduleId, cleaner_expo_token,
      host_expo_token)
    };

  const handlePaymentError = (error) => {
    setPaymentStatus(error.status);
    Alert.alert('Payment Error', error.message);
  };


  return (
    <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Centered Checkout Icon */}
      <Icon name="shopping-cart" size={48} color="#4CAF50" style={styles.icon} />
      <Text style={styles.header}>Payment Checkout </Text>

      {/* {saved_cards.length > 0 ? (
        <SavedCards savedCards={saved_cards} selectedCard={selectedCard} onSelectCard={handleCardSelection} />
      ) : (
        // <Text style={{ textAlign: 'center', fontSize: 12 }}>Loading saved cards...</Text>
        <Text style={{ textAlign: 'center', fontSize: 12 }}></Text>
      )} */}
      
      {clientSecret && cleaning_fee > 0 ? (
        <View style={styles.paymentButtonContainer}>
            
          <PaymentDetails 
            cleaningServiceFee={cleaning_fee} 
          />
          <StripePaymentButton 
            // publishableKey={PUBLISHABLE_KEY}
            clientSecret={clientSecret} 
            totalAmount={total_fee} 
            selectedCard={selectedCard} 
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            fbaseUser={fbaseUser} 
            scheduleId = {scheduleId}
            customerId={customerId}
            schedule={schedule}
            cleanerId={cleanerId}
            cleaner_expo_tokens={cleaner_tokens}
            host_expo_tokens={host_tokens}
          />
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
    fontWeight:'400'
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

export default PaymentSingleCheckout;



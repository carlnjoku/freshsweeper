import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import userService from '../services/userService';

const PaymentScreen = ({amount, currency}) => {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);

  const body =  JSON.stringify({ amount: amount, currency: currency })


//   const handlePayPress = async () => {
//     try {
//       // Call your backend to create a PaymentIntent and get the clientSecret
//       const response = await userService.createPayment(body);
      
//       if (!response.ok) {
//         throw new Error('Failed to create PaymentIntent');
//       }
  
//       const { clientSecret } = await response.json();
//       console.log("_____.........______")
//       console.log(clientSecret)
//       console.log("_____.........______")
  
//       // Confirm payment using Stripe's confirmPayment function
//       const { error, paymentIntent } = await confirmPayment(clientSecret, {
//         type: 'Card',
//         billingDetails: { 
//           name: 'John Doe',  // Example, you can pass actual billing details here
//           email: 'johndoe@example.com',
//         },
//       });
  
//       console.log("Payment Intent..............................");
//       console.log("Payment Intent:", paymentIntent);
//       console.log("Payment Intent..............................");
  
//       if (error) {
//         Alert.alert(`Payment failed: ${error.message}`);
//       } else if (paymentIntent) {
//         Alert.alert('Payment successful!');
//       }
      
//     } catch (err) {
//       // Catch any errors from the API call or Stripe confirmPayment
//       Alert.alert(`An error occurred: ${err.message}`);
//     }
//   };

// const handlePayPress = async () => {
//     try {
//       // Call your backend to create a PaymentIntent and get the clientSecret
//       const response = await userService.createPayment(body);
  
//       if (!response.ok) {
//         // If response is not okay, we attempt to parse the response as JSON and throw an error
//         const errorData = await response.json();
//         throw new Error(`Failed to create PaymentIntent: ${errorData.detail || 'Unknown error'}`);
//       }
  
//       // Parse the response as JSON and get the clientSecret
//       const { clientSecret } = await response.json();
  
//       console.log("ClientSecret received from backend:", clientSecret);
  
//       // Confirm payment using Stripe's confirmPayment
//       const { error, paymentIntent } = await confirmPayment(clientSecret, {
//         paymentMethodType: 'Card',
//         billingDetails: {
//           name: 'John Doe',  // Example details, replace with actual billing info
//           email: 'johndoe@example.com',
//         },
//       });
  
//       console.log("Stripe PaymentIntent:", paymentIntent);
  
//       if (error) {
//         Alert.alert(`Payment failed: ${error.message}`);
//       } else if (paymentIntent) {
//         Alert.alert('Payment successful!');
//       }
//     } catch (err) {
//       console.error("Error during payment:", err.message);
//       Alert.alert(`An error occurred: ${err.message}`);
//     }
//   };

  const handlePayPress = async () => {
    // Call your backend to create a PaymentIntent and get the clientSecret
    const response = await fetch('http://rndbs-67-80-224-161.a.free.pinggy.link/payments/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body, // Amount in cents
    });
    const { clientSecret } = await response.json();

    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card', 
      billingDetails: {
        name: 'John Doe',  // Example details, replace with actual billing info
        email: 'johndoe@example.com',
      },
    });

    if (error) {
      Alert.alert(`Payment failed: ${error.message}`);
    } else if (paymentIntent) {
      Alert.alert('Payment successful!');
    }
  };
  
  return (
    <View style={{ padding: 16 }}>
      <CardField
        postalCodeEnabled={true}
        placeholders={{ number: '4242 4242 4242 4242' }}
        cardStyle={{
          borderWidth: 1,
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
        }}
        style={{ width: '100%', height: 50, marginVertical: 30 }}
        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
      />
      <Button onPress={handlePayPress} title="Pay Now" disabled={!cardDetails?.complete} />
    </View>
  );
};

export default PaymentScreen;



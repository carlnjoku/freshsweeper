import React from 'react';
import { Button, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';

const StripePaymentButton = ({ clientSecret, totalAmount }) => {
  const { confirmPayment } = useStripe();

  const handlePayment = async () => {
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails: { name: 'Host Name' },
    });

    if (error) {
      Alert.alert('Payment Error', error.message);
    } else if (paymentIntent) {
      Alert.alert('Payment Successful', `Amount of $${totalAmount.toFixed(2)} has been paid.`);
    }
  };

  return <Button title="Pay with Stripe" onPress={handlePayment} />;
};

export default StripePaymentButton;
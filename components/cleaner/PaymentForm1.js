import React from 'react';
import { View, Button, Alert } from 'react-native';
import { CardField, useConfirmSetupIntent, StripeProvider } from '@stripe/stripe-react-native';

const PaymentForm = ({client_secret}) => {

    const { confirmSetupIntent } = useConfirmSetupIntent();

    const handleSubmit = async () => {
        // Obtain clientSecret from your backend
        // const clientSecret = '{CLIENT_SECRET_FROM_SERVER}'; // Replace with actual value
        const clientSecret = client_secret; // Replace with actual value

        const { error, setupIntent } = await confirmSetupIntent(clientSecret, {
            paymentMethodType: 'Card',
            billingDetails: {
                email: 'host@example.com',
            },
        });

        if (error) {
            Alert.alert("Error", error.message);
        } else if (setupIntent) {
            Alert.alert("Success", `Payment method saved: ${setupIntent.paymentMethod}`);
        }
    };

    return (
        <View>
            <CardField
                postalCodeEnabled={false}
                placeholder={{ number: '4242 4242 4242 4242' }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                }}
                style={{
                    width: '100%',
                    height: 50,
                    marginVertical: 30,
                }}
            />
            <Button title="Save Payment Method" onPress={handleSubmit} />
        </View>
    );
};

export default PaymentForm

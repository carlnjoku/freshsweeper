// import React, { useState } from 'react';
// import { View, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { TextInput, Button } from 'react-native-paper'; // Import TextInput from react-native-paper
// import { useStripe, CardField } from '@stripe/stripe-react-native';
// import COLORS from '../constants/colors';
// import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
// import Modal from 'react-native-modal';
// import ThankYou from './stripe/ThankYou';



// const StripePaymentButton = ({ clientSecret, totalAmount }) => {

//   const { confirmPayment } = useStripe();
//   const [cardDetails, setCardDetails] = useState(null);
//   const [cardholderName, setCardholderName] = useState('');
//   const [isBeforeModalVisible, setBeforeModalVisible] = useState(true);
  
//   const paymentDetails = {
//     invoiceNumber: 'INV12345',
//     paymentDate: '2024-11-11',
//     amount: 99.99,
//     paymentMethod: 'Credit Card',
//     billingAddress: '123 Main St, Springfield, IL',
//   };

//   const handlePayment = async () => {
//     if (!cardDetails?.complete) {
//       Alert.alert('Error', 'Please complete the card details.');
//       return;
//     }

//     const { error, paymentIntent } = await confirmPayment(clientSecret, {
//       paymentMethodType: 'Card',
//       paymentMethodData: {
//         billingDetails: {
//           name: cardholderName, // Optional billing details
//         },
//       },
//     });

//     if (error) {
//       Alert.alert('Payment Error', error.message);
//     } else if (paymentIntent) {
//       Alert.alert('Payment Successful', `Amount of $${(totalAmount / 100).toFixed(2)} has been paid.`);
//       setBeforeModalVisible(true)
//     }
//   };

//   return (
    
//     <View style={{ padding: 0 }}>
    
//         <TextInput
//         // label="Name on Card"
//         placeholder='Name on Card'
//         placeholderTextColor="#A3A3A3" 
//         value={cardholderName}
//         onChangeText={setCardholderName}
//         mode="outlined" // Outlined style for better visibility
//         outlineColor="#E0E0E0"          // Customized border color for default state
//         activeOutlineColor="#E0E0E0"    // Customized border color for active (focused) state
//         style={[styles.input, { borderWidth: 0, marginBottom:0, height:50, borderRadius:5 }]}
        
//       />

//   <CardField
//     postalCodeEnabled={false}
//     placeholders={{
//       number: 'Card number',
//     }}
//     cardStyle={{
//       backgroundColor: '#F7F8FA',
//       borderRadius: 5,
//       borderWidth: 1,
//       borderColor: '#E0E0E0',
//       textColor: '#000000',
//       fontSize: 14,
//       placeholderColor: '#A3A3A3',
//       fontFamily: 'System',
//     }}
//     style={{
//     //   width: '100%',
//       height: 50,
//       marginVertical: 15,
//     }}
//     onCardChange={(details) => setCardDetails(details)}
//   />
//   {/* <Button color={COLORS.deepBlue} style={{borderRadius:10}} title="Pay with Stripe" onPress={handlePayment} /> */}
//   <TouchableOpacity onPress={handlePayment} style={styles.button}>
//         <Text style={styles.buttonText}>Pay  -   ${totalAmount}</Text>
//       </TouchableOpacity>

//       <Modal
//           isVisible={isBeforeModalVisible}
//           style={styles.fullScreenModal}
//           onBackdropPress={() => setBeforeModalVisible(false)}
//         >
//          <ThankYou paymentDetails= {paymentDetails} />
//         </Modal>
// </View>

//   );
// };

// // Custom theme for PaperProvider
// const theme = {
//     ...DefaultTheme,
//     colors: {
//       ...DefaultTheme.colors,
//       primary: '#4CAF50', // Active outline color
//     },
//   };
  
// const styles = StyleSheet.create({
//     input: {
//         width: '100%',
//         marginVertical: 0,
//         fontSize: 14,
//         backgroundColor:'#F7F8FA',
//       },
//       button: {
//         backgroundColor: COLORS.deepBlue, // deep blue background
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 50, // Rounded corners
//         elevation: 3, // Shadow on Android
//         shadowColor: '#000', // Shadow for iOS
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.8,
//         shadowRadius: 2,
//       },
//       buttonText: {
//         color: '#fff', // White text color
//         fontSize: 18,
//         fontWeight: 'bold',
//         textAlign: 'center',
//       },
// })
// export default StripePaymentButton;


// import React, { useState } from 'react';
// import { View, Alert, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
// import { TextInput } from 'react-native-paper';
// import { useStripe, CardField } from '@stripe/stripe-react-native';
// import COLORS from '../constants/colors';
// import Modal from 'react-native-modal';
// import ThankYou from './stripe/ThankYou';
// import Toast from 'react-native-toast-message';


// const StripePaymentButton = ({ clientSecret, totalAmount }) => {
//   const { confirmPayment } = useStripe();
//   const [cardDetails, setCardDetails] = useState(null);
//   const [cardholderName, setCardholderName] = useState('');
//   const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
  
  

//   const paymentDetails = {
//     invoiceNumber: 'INV12345',
//     paymentDate: '2024-11-11',
//     amount: totalAmount,
//     paymentMethod: 'Credit Card',
//     billingAddress: '123 Main St, Springfield, IL',
//   };

//   const handlePayment = async () => {
//     if (!cardDetails?.complete) {
//       Alert.alert('Error', 'Please complete the card details.');
//       return;
//     }

    

//     const { error, paymentIntent } = await confirmPayment(clientSecret, {
//       paymentMethodType: 'Card',
//       paymentMethodData: {
//         billingDetails: {
//           name: cardholderName,
//         },
//       },
//     });

    

//     if (error) {
//       Alert.alert('Payment Error', error.message);
//     } else if (paymentIntent) {
//     //   Alert.alert('Payment Successful', `Amount of $${(totalAmount / 100).toFixed(2)} has been paid.`);
//       setBeforeModalVisible(true);
    
//     }
//   };

//   return (
//     <View style={{ padding: 15 }}>

     
        
//       <TextInput
//         placeholder="Name on Card"
//         placeholderTextColor="#A3A3A3"
//         value={cardholderName}
//         onChangeText={setCardholderName}
//         mode="outlined"
//         outlineColor="#E0E0E0"
//         activeOutlineColor="#E0E0E0"
//         style={[styles.input, { marginBottom: 0, height: 50, borderRadius: 5 }]}
//       />
//       <CardField
//         postalCodeEnabled={false}
//         placeholders={{ number: 'Card number' }}
//         cardStyle={{
//           backgroundColor: '#F7F8FA',
//           borderRadius: 5,
//           borderWidth: 1,
//           borderColor: '#E0E0E0',
//           textColor: '#000000',
//           fontSize: 14,
//           placeholderColor: '#A3A3A3',
//           fontFamily: 'System',
//         }}
//         style={{ height: 50, marginVertical: 15 }}
//         onCardChange={(details) => setCardDetails(details)}
//       />
//       <TouchableOpacity onPress={handlePayment} style={styles.button}>
//         <Text style={styles.buttonText}>Pay - ${totalAmount}</Text>
//       </TouchableOpacity>

//       <Modal
//         isVisible={isBeforeModalVisible}
//         style={styles.fullScreenModal}
//         onBackdropPress={() => setBeforeModalVisible(true)}
//         backdropOpacity={0.3}
//       >
//         <View style={styles.modalContent}>
//           <ThankYou paymentDetails={paymentDetails} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     width: '100%',
//     fontSize: 14,
//     backgroundColor: '#F7F8FA',
//   },
//   button: {
//     backgroundColor: COLORS.deepBlue,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 50,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   fullScreenModal: {
//     margin: 0,
//     justifyContent: 'flex-end',  // Align the modal at the bottom of the screen
//   },
//   modalContent: {
//     height: '55%',  // Set modal content to take 65% of screen height
//     backgroundColor: 'white',
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
// });

// export default StripePaymentButton;




import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import COLORS from '../constants/colors';
import Modal from 'react-native-modal';
import ThankYou from './stripe/ThankYou';
import { StripeProvider } from '@stripe/stripe-react-native';
import { sendPushNotifications, successfullPaymentPushNotification } from '../utils/sendPushNotification';
import ROUTES from '../constants/routes';


const StripePaymentButton = (
  { clientSecret, 
    totalAmount, 
    selectedCard, 
    onSuccess, onError,
    schedule, 
    customerId, cleaner_expo_tokens, host_expo_tokens }) => {
  
  const { confirmPayment, initPaymentSheet, presentPaymentSheet } = useStripe();
  // const [cardDetails, setCardDetails] = useState(null);
  // const [cardholderName, setCardholderName] = useState('');
  // const [isBeforeModalVisible, setBeforeModalVisible] = useState(false);
  
  // const paymentDetails = {
  //   invoiceNumber: 'INV12345',
  //   paymentDate: '2024-11-11',
  //   amount: totalAmount,
  //   paymentMethod: 'Credit Card',
  //   billingAddress: '123 Main St, Springfield, IL',
  // };

  // const handlePayment = async () => {
  //   if (!cardDetails?.complete && !selectedCard) {
  //     Alert.alert('Error', 'Please complete the card details or select a saved card.');
  //     return;
  //   }

  //   const paymentMethodData = selectedCard ? {
  //     paymentMethodId: selectedCard,
  //   } : {
  //     billingDetails: {
  //       name: cardholderName,
  //     },
  //   };

  //   const { error, paymentIntent } = await confirmPayment(clientSecret, {
  //     paymentMethodType: 'Card',
  //     paymentMethodData,
  //   });

  //   if (error) {
  //     Alert.alert('Payment Error', error.message);
  //   } else if (paymentIntent) {
  //     setBeforeModalVisible(true);
  //   }

  

  




 
  const handlePayment = async () => {
    try {
      // Initialize the payment sheet
      // const initResponse = await initPaymentSheet({
      //   paymentIntentClientSecret: clientSecret,
      //   merchantDisplayName: 'Your Business Name',
      // });

    
      // Initialize the payment sheet
      const initResponse = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Your Business Name',
        customer: {
          email: 'flavoursoft@gmail.com',
          name: 'Host Name',
        },
        // metadata: {
        //   selectedScheduleId,
        //   cleanerId: cleanerMetadata.cleanerId,
        //   cleanerName: `${cleanerMetadata.firstname} ${cleanerMetadata.lastname}`,
        //   scheduleId: selectedScheduleId
        // },
      });

      if (initResponse.error) {
        throw new Error(initResponse.error.message);
      }

      // Present the payment sheet to the user
      const paymentResult = await presentPaymentSheet();

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      // Payment successful, notify the parent
      const paymentDetails = { status: 'success', totalAmount };
      onSuccess(paymentDetails);

      // Send push notification to cleaner 
      // Send invoice after successful payment
      // await sendInvoice(paymentDetails);

      // const schedule = selectedSchedule;

      

      // console.log("My schedule", JSON.stringify(schedule, null, 2))
      // await successfullPaymentPushNotification(
      await sendPushNotifications(
        cleaner_expo_tokens,
        'Payment Successful',
        `Your payment of $${totalAmount} has been processed successfully.`,
        {
          screen: 'PaymentSuccess', // Target screen name
          params: { totalAmount, schedule }, // Data to pass to the screen
        }
      );
      

      await sendPushNotifications(
        host_expo_tokens,
        'New Cleaning Job Assigned',
        'A cleaning job has been successfully paid and assigned to you.',
        {
          screen: ROUTES.cleaner_schedule_details_view, // Target screen name
          params: { 
            item:schedule
          }, // Dynamic route parameter
        }
      );

    } catch (error) {
      // Handle errors and notify the parent
      onError({ status: 'error', message: error.message });
    }
  };

  

  return (
    <TouchableOpacity style={styles.button} onPress={handlePayment}>
      <Text style={styles.buttonText}>Pay Now</Text>
    </TouchableOpacity>
  );

    
  

  return (
    <View style={{ padding: 15 }}>
      {!selectedCard && (
        <>
          <TextInput
            placeholder="Name on Card"
            placeholderTextColor="#A3A3A3"
            value={cardholderName}
            onChangeText={setCardholderName}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor="#E0E0E0"
            style={[styles.input, { marginBottom: 0, height: 50, borderRadius: 5 }]}
          />
          <StripeProvider
            publishableKey="pk_test_EFN6niSZSH7zAp3qWMHKcRWw" // Replace with your Stripe publishable key
          >
          <CardField
            postalCodeEnabled={false}
            placeholders={{ number: 'Card number' }}
            cardStyle={{
              backgroundColor: '#F7F8FA',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#E0E0E0',
              textColor: '#000000',
              fontSize: 14,
              placeholderColor: '#A3A3A3',
              fontFamily: 'System',
            }}
            style={{ height: 50, marginVertical: 15 }}
            onCardChange={(details) => setCardDetails(details)}
          />
          </StripeProvider>
        </>
      )}

      <TouchableOpacity onPress={handlePayment} style={styles.button}>
        <Text style={styles.buttonText}>Pay - ${totalAmount}</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isBeforeModalVisible}
        style={styles.fullScreenModal}
        onBackdropPress={() => setBeforeModalVisible(true)}
        backdropOpacity={0.3}
      >
        <View style={styles.modalContent}>
          <ThankYou paymentDetails={paymentDetails} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    fontSize: 14,
    backgroundColor: '#F7F8FA',
  },
  button: {
    backgroundColor: COLORS.deepBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fullScreenModal: {
    margin: 0,
    justifyContent: 'flex-end',  // Align the modal at the bottom of the screen
  },
  modalContent: {
    height: '55%',  // Set modal content to take 65% of screen height
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});


export default StripePaymentButton;
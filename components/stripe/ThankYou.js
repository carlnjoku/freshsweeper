import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';

const ThankYou = ({ paymentDetails }) => {
    const navigation = useNavigation();
    const handleGoHome = () => {
        navigation.navigate('Home'); // Change 'Home' to your actual home screen route name
      };
  return (
    <View style={styles.container}>
      {/* Thank You Icon */}
      <Icon name="check-circle" size={80} color="#4CAF50" style={styles.icon} />

      <Text style={styles.thankYouText}>Thank You!</Text>
      <Text style={styles.message}>Your payment was successful.</Text>

      {/* Optional payment details */}
      <Text style={styles.details}>
        Invoice: {paymentDetails.invoiceNumber}{'\n'}
        Date: {paymentDetails.paymentDate}{'\n'}
        Amount: ${paymentDetails.amount.toFixed(2)}
      </Text>

      {/* Go Home Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleGoHome} style={styles.goHomeButton}>
          <Text style={styles.goHomeButtonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // Center content vertically
    alignItems: 'center',      // Center content horizontally
    padding: 20,
    backgroundColor: '#fff',
  },
  icon: {
    marginBottom: 20,
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  details: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  goHomeButton: {
    backgroundColor: COLORS.deepBlue,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop:20
  },
  goHomeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ThankYou;
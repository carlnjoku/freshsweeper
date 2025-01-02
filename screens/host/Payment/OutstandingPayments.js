// import React, { useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
// // import PaymentEntry from '../../components/PaymentEntry'; // Assumes PaymentEntry component already exists
// import PaymentEntry from '../../../components/PaymentEntry';
// // import mockPaymentData from '../../utils/mockPaymentData';
// import mockPaymentData from '../../../utils/mockPaymentData';
// import { useNavigation } from '@react-navigation/native';

// const OutstandingPayments = () => {
//   const [selectedPayments, setSelectedPayments] = useState([]);
//   const navigation = useNavigation();

//   const handlePaymentSelection = (paymentId) => {
//     setSelectedPayments((prev) =>
//       prev.includes(paymentId)
//         ? prev.filter((id) => id !== paymentId)
//         : [...prev, paymentId]
//     );
//   };

//   const handleProceedToCheckout = () => {
//     if (selectedPayments.length > 0) {
//       navigation.navigate('PaymentCheckout', { selectedPayments });
//     } else {
//       alert("Please select at least one payment to proceed.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Outstanding Payments</Text>
//       <FlatList
//         data={mockPaymentData}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <PaymentEntry
//             payment={item}
//             isSelected={selectedPayments.includes(item.id)}
//             onSelect={() => handlePaymentSelection(item.id)}
//           />
//         )}
//       />
//       <View style={styles.footer}>
//         <Button title="Proceed to Checkout" onPress={handleProceedToCheckout} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   footer: {
//     marginTop: 20,
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//     alignItems: 'center',
//   },
// });

// export default OutstandingPayments;




import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import PaymentEntry from '../../../components/PaymentEntry';
import FilterBar from '../../../components/FilterBar'; // Assuming FilterBar component exists for cleaner selection
import mockPaymentData from '../../../utils/mockPaymentData';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../../constants/routes';
import COLORS from '../../../constants/colors';


const OutstandingPayments = () => {
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const navigation = useNavigation();

  // Handle cleaner change: clear selected payments when cleaner is changed
  const handleCleanerChange = (cleanerId) => {
    setSelectedCleaner(cleanerId);
    setSelectedPayments([]); // Clear selected payments when the cleaner changes
  };

  // Filter payments based on selected cleaner
  const filteredPayments = mockPaymentData.filter(
    (payment) => !selectedCleaner || payment.cleanerId === selectedCleaner
  );

  // Handle payment selection/deselection
  const handlePaymentSelection = (paymentId) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  // Calculate the total amount of selected payments
  const selectedTotal = selectedPayments.reduce((total, paymentId) => {
    const payment = mockPaymentData.find((payment) => payment.id === paymentId);
    return total + (payment ? payment.amount : 0);
  }, 0);

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    console.log(selectedPayments)
    if (selectedPayments.length > 0) {
      navigation.navigate(ROUTES.host_checkout, { selectedPayments });
    } else {
      alert("Please select at least one payment to proceed.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Outstanding Payments</Text>
      
      {/* Filter Bar Component */}
      <FilterBar 
        selectedCleaner={selectedCleaner} 
        setSelectedCleaner={handleCleanerChange} // Use the handler for cleaner change
        paymentsData={mockPaymentData}
      />

      {/* Filtered Payment List */}
      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PaymentEntry
            payment={item}
            isSelected={selectedPayments.includes(item.id)}
            onSelect={() => handlePaymentSelection(item.id)}
          />
        )}
      />

      {/* Display Total Amount */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${selectedTotal.toFixed(2)}</Text>
      </View>
      
      {/* Checkout Button */}
      <View style={styles.footer}>
        
        <TouchableOpacity onPress={handleProceedToCheckout} style={styles.button}>
        <Text style={styles.buttonText}>Proceed to Checkout</Text>
      </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  totalContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
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
});

export default OutstandingPayments;
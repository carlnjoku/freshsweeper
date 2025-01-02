


// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, Alert } from 'react-native';
// import FilterBar from '../../components/FilterBar';
// import PaymentSummaryCard from '../../components/PaymentSummaryCard';
// import PaymentEntry from '../../components/PaymentEntry';
// import mockPaymentData from '../../utils/mockPaymentData';
// import StripePaymentButton from '../../components/StripePaymentButton'; // New component for Stripe payment
// import userService from '../../services/userService';

// const PaymentScreen = () => {
//   const [selectedCleaner, setSelectedCleaner] = useState(null);
//   const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
//   const [selectedPayments, setSelectedPayments] = useState([]);
//   const [clientSecret, setClientSecret] = useState(null);

//   // Filter payments based on selected cleaner and timeframe
//   const filteredPayments = mockPaymentData.filter(payment =>
//     (!selectedCleaner || payment.cleanerId === selectedCleaner) &&
//     (payment.timeframe === selectedTimeframe)
//   );

//   // Fetch client secret whenever selectedPayments changes
//   useEffect(() => {
//     const fetchClientSecret = async () => {
//       if (!selectedPayments || selectedPayments.length === 0) {
//         console.warn("selectedPayments is empty or undefined.");
//         return;
//       }
  
//       // Calculate total amount based on selected payment IDs
//       const totalAmount = selectedPayments.reduce((acc, paymentId) => {
//         const payment = filteredPayments.find(p => p.id === paymentId);
//         return payment ? acc + payment.amount : acc;
//       }, 0);
  
//       console.log("Calculated totalAmount:", totalAmount);
  
//       if (totalAmount > 0) {
//         try {
//           const data = { amount: totalAmount };
//           const response = await userService.fetchPaymentIntentClientSecret(data);
//           const res = response.data;
//           console.log("Stripe client secret response:", res);
//           setClientSecret(res.clientSecret);
//         } catch (error) {
//           console.error("Error fetching client secret:", error);
//         }
//       } else {
//         console.warn("Total amount is zero, client secret fetch will not proceed.");
//       }
//     };
  
//     fetchClientSecret();
//   }, [selectedPayments]);

//   // Handle selection or deselection of payment
//   const handlePaymentSelection = (paymentId) => {
//     setSelectedPayments((prev) =>
//       prev.includes(paymentId)
//         ? prev.filter((id) => id !== paymentId)
//         : [...prev, paymentId]
//     );
//   };

//   // Calculate totalAmount directly in the main component
//   const totalAmount = selectedPayments.reduce(
//     (acc, paymentId) => {
//       const payment = filteredPayments.find(p => p.id === paymentId);
//       return payment ? acc + payment.amount : acc;
//     },
//     0
//   );

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Outstanding Payments</Text>
//       <FilterBar
//         selectedCleaner={selectedCleaner}
//         setSelectedCleaner={setSelectedCleaner}
//         selectedTimeframe={selectedTimeframe}
//         setSelectedTimeframe={setSelectedTimeframe}
//       />
      
//       <FlatList
//         data={filteredPayments}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <PaymentEntry
//             payment={item}
//             isSelected={selectedPayments.includes(item.id)}
//             onSelect={() => handlePaymentSelection(item.id)}
//           />
//         )}
//       />
      
//       <Text>{`Total Amount: $${totalAmount}`}</Text>
//       <PaymentSummaryCard totalAmount={totalAmount} />
//       {clientSecret && totalAmount > 0 && (
//         <StripePaymentButton clientSecret={clientSecret} totalAmount={totalAmount} />
//       )}
//     </View>
//   );
// };

// export default PaymentScreen;




// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
// import FilterBar from '../../components/FilterBar';
// import PaymentSummaryCard from '../../components/PaymentSummaryCard';
// import PaymentEntry from '../../components/PaymentEntry';
// import mockPaymentData from '../../utils/mockPaymentData';
// import StripePaymentButton from '../../components/StripePaymentButton';
// import userService from '../../services/userService';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const PaymentScreen = () => {
//   const [selectedCleaner, setSelectedCleaner] = useState(null);
//   const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
//   const [selectedPayments, setSelectedPayments] = useState([]);
//   const [clientSecret, setClientSecret] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const filteredPayments = mockPaymentData.filter(payment =>
//     (!selectedCleaner || payment.cleanerId === selectedCleaner) &&
//     (payment.timeframe === selectedTimeframe)
//   );

//   useEffect(() => {
//     const fetchClientSecret = async () => {
//       if (!selectedPayments || selectedPayments.length === 0) return;

//       setLoading(true);
//       const totalAmount = selectedPayments.reduce((acc, paymentId) => {
//         const payment = filteredPayments.find(p => p.id === paymentId);
//         return payment ? acc + payment.amount : acc;
//       }, 0);

//       if (totalAmount > 0) {
//         try {
//           const data = { amount: totalAmount };
//           const response = await userService.fetchPaymentIntentClientSecret(data);
//           const res = response.data;
//           setClientSecret(res.clientSecret);
//         } catch (error) {
//           console.error("Error fetching client secret:", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     fetchClientSecret();
//   }, [selectedPayments]);

//   const handlePaymentSelection = (paymentId) => {
//     setSelectedPayments((prev) =>
//       prev.includes(paymentId)
//         ? prev.filter((id) => id !== paymentId)
//         : [...prev, paymentId]
//     );
//   };

//   const totalAmount = selectedPayments.reduce(
//     (acc, paymentId) => {
//       const payment = filteredPayments.find(p => p.id === paymentId);
//       return payment ? acc + payment.amount : acc;
//     },
//     0
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.headerText}>Outstanding Payments</Text>
//       <FilterBar
//         selectedCleaner={selectedCleaner}
//         setSelectedCleaner={setSelectedCleaner}
//         selectedTimeframe={selectedTimeframe}
//         setSelectedTimeframe={setSelectedTimeframe}
//       />

//       <FlatList
//         data={filteredPayments}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <PaymentEntry
//             payment={item}
//             isSelected={selectedPayments.includes(item.id)}
//             onSelect={() => handlePaymentSelection(item.id)}
//           />
//         )}
//         contentContainerStyle={styles.flatList}
//       />

//       <PaymentSummaryCard totalAmount={totalAmount} />

//       {loading ? (
//         <ActivityIndicator size="large" color="#3498db" />
//       ) : (
//         clientSecret && totalAmount > 0 && (
//           <StripePaymentButton clientSecret={clientSecret} totalAmount={totalAmount} />
//         )
//       )}
      
//       <TouchableOpacity style={styles.payButton} onPress={() => Alert.alert("Proceeding to payment")}>
//         <Text style={styles.payButtonText}>Pay Now: ${totalAmount}</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#F9F9F9',
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#2D2D2D',
//     marginBottom: 10,
//   },
//   flatList: {
//     paddingBottom: 20,
//   },
//   payButton: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   payButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// export default PaymentScreen;



import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StatusBar, ScrollView, StyleSheet } from 'react-native';
import FilterBar from '../../components/FilterBar';
import PaymentSummaryCard from '../../components/PaymentSummaryCard';
import PaymentEntry from '../../components/PaymentEntry';
import mockPaymentData from '../../utils/mockPaymentData';
import StripePaymentButton from '../../components/StripePaymentButton';
import userService from '../../services/userService';


const PaymentScreen = () => {
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);

  const filteredPayments = mockPaymentData.filter(payment =>
    (!selectedCleaner || payment.cleanerId === selectedCleaner) &&
    (payment.timeframe === selectedTimeframe)
  );

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (!selectedPayments || selectedPayments.length === 0) {
        console.warn("selectedPayments is empty or undefined.");
        return;
      }
  
      const totalAmount = selectedPayments.reduce((acc, paymentId) => {
        const payment = filteredPayments.find(p => p.id === paymentId);
        return payment ? acc + payment.amount : acc;
      }, 0);
  
      if (totalAmount > 0) {
        try {
          const data = { amount: totalAmount };
          const response = await userService.fetchPaymentIntentClientSecret(data);
          const res = response.data;
          setClientSecret(res.clientSecret);
        } catch (error) {
          console.error("Error fetching client secret:", error);
        }
      }
    };
  
    fetchClientSecret();
  }, [selectedPayments]);

  const handlePaymentSelection = (paymentId) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const totalAmount = selectedPayments.reduce(
    (acc, paymentId) => {
      const payment = filteredPayments.find(p => p.id === paymentId);
      return payment ? acc + payment.amount : acc;
    },
    0
  );

  return (
    <View>
    <StatusBar translucent backgroundColor="transparent" />
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Outstanding Payments</Text>
      <FilterBar
        selectedCleaner={selectedCleaner}
        setSelectedCleaner={setSelectedCleaner}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
      />

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
        ListFooterComponent={
          <>
            <Text style={styles.totalAmountText}>{`Total Amount: $${totalAmount}`}</Text>
            {/* <PaymentSummaryCard totalAmount={totalAmount} /> */}
                {clientSecret && totalAmount > 0 && (
              <StripePaymentButton clientSecret={clientSecret} totalAmount={totalAmount} />
            )}
          </>
        }
      />
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  totalAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    alignSelf:'flex-end'
  },
});

export default PaymentScreen;
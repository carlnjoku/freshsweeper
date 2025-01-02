// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const PaymentSummaryCard = ({ filteredPayments }) => {
//   const totalOutstanding = filteredPayments.reduce((acc, payment) => acc + payment.amount, 0);

//   return (
//     <View style={styles.card}>
//       <Text style={styles.title}>Total Outstanding Payments</Text>
//       <Text style={styles.amount}>${totalOutstanding.toFixed(2)}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: { padding: 16, borderRadius: 8, backgroundColor: '#f0f0f0', marginBottom: 16 },
//   title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//   amount: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
// });

// export default PaymentSummaryCard;



import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentSummaryCard = ({ totalAmount = 0 }) => (
  <View style={styles.container}>
    <Text style={styles.label}>Total Outstanding Amount:</Text>
    <Text style={styles.amount}>${totalAmount.toFixed(2)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', borderRadius: 8, marginVertical: 8 },
  label: { fontSize: 16, fontWeight: '600' },
  amount: { fontSize: 20, fontWeight: 'bold', color: '#3a9' },
});

export default PaymentSummaryCard
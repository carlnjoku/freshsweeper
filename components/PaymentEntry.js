// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const PaymentEntry = ({ payment }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.cleaner}>Cleaner: {payment.cleanerName}</Text>
//       <Text style={styles.date}>Date: {payment.date}</Text>
//       <Text style={styles.amount}>Amount Due: ${payment.amount.toFixed(2)}</Text>
//       <Text style={styles.status}>Status: {payment.status}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 16, borderBottomWidth: 1, borderColor: '#ddd' },
//   cleaner: { fontSize: 16, fontWeight: 'bold' },
//   date: { fontSize: 14, color: '#666' },
//   amount: { fontSize: 16, color: '#007bff' },
//   status: { fontSize: 14, color: '#888' },
// });

// export default PaymentEntry;



// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import COLORS from '../constants/colors';

// const PaymentEntry = ({ payment, isSelected, onSelect }) => {
//   return (
//     <View style={styles.paymentCard}>
//       <View style={styles.paymentInfo}>
//         <Text style={styles.paymentText}>{payment.cleanerName}</Text>
//         <Text style={styles.amountText}>Amount: ${payment.amount.toFixed(2)}</Text>
//       </View>
//       <TouchableOpacity
//         style={[styles.selectButton, isSelected && styles.selectedButton]}
//         onPress={onSelect}
//       >
//         <Text style={styles.buttonText}>{isSelected ? 'Selected' : 'Select'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   paymentCard: {
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     borderRadius: 8,
//     marginVertical: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     shadowColor: COLORS.gray,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   paymentInfo: {
//     flex: 1,
//   },
//   paymentText: {
//     fontSize: 16,
//     color: '#333333',
//     marginBottom: 4,
//   },
//   amountText: {
//     fontSize: 14,
//     color: '#666666',
//   },
//   selectButton: {
//     backgroundColor: '#3498db',
//     paddingVertical: 4,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     shadowColor: '#3498db',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   selectedButton: {
//     backgroundColor: '#2ecc71',
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

// export default PaymentEntry;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const PaymentEntry = ({ payment, isSelected, onSelect }) => {
  return (
    <View style={styles.paymentCard}>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentText}>{payment.cleanerName}</Text>
        <Text style={styles.amountText}>Amount: ${payment.amount.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={[styles.selectButton, isSelected && styles.selectedButton]}
        onPress={onSelect}
      >
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]} />
          <Text style={styles.buttonText}>{isSelected ? 'Selected' : 'Select'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 14,
    color: '#666666',
  },
  selectButton: {
    backgroundColor: '#3498db',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedButton: {
    backgroundColor: '#2ecc71',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderRadius: 4,
  },
  checkboxSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#2ecc71',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    // fontWeight: 'bold',
  },
});

export default PaymentEntry;
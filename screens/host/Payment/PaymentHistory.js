// import React, { useEffect, useState, useContext } from 'react';
// import { View, FlatList } from 'react-native';
// import { Text, Card, Avatar, Chip, ActivityIndicator } from 'react-native-paper';
// import COLORS from '../../../constants/colors';
// import { AuthContext } from '../../../context/AuthContext';
// import userService from '../../../services/userService';
// // import { format } from 'date-fns';

// const PaymentHistory = () => {

//     const {currentUserId, currentUser, currency} = useContext(AuthContext)
    
//     const [payments, setPayments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const[customer_id] = useState(currentUser.stripe_customer.stripe_customer_id)

//     useEffect(() => {
//         fetchPendingPayments();
//     }, []);

//     console.log("current user")
//     console.log(JSON.stringify(currentUser, null, 2))
//     const fetchPendingPayments = async () => {
//         try {
//             // Assuming userService.getPendingPayments fetches the pending payments from the API
//             const response = await userService.getPaymentsByStripeCustomerId(customer_id);
//             setPayments(response.data.payments);
//             console.log(JSON.stringify(response.data, null, 2))
//         } catch (error) {
//             console.log(error);
//             alert('Error fetching pending paymentss');
//         } finally {
//             setLoading(false);
//         }
//     };

//   const getStatusChip = (status) => {
//     switch (status) {
//       case 'succeeded':
//         return <Chip style={{ backgroundColor: '#4CAF50', color: '#fff' }}>Paid</Chip>;
//       case 'requires_payment_method':
//         return <Chip style={{ backgroundColor: '#FF9800', color: '#fff' }}>Pending</Chip>;
//       case 'Failed':
//         return <Chip style={{ backgroundColor: '#F44336', color: '#fff' }}>Failed</Chip>;
//       default:
//         return <Chip>Unknown</Chip>;
//     }
//   };

//   const getPaymentIcon = (method) => {
//     switch (method) {
//       case 'Credit Card':
//         return 'credit-card-outline';
//       case 'PayPal':
//         return 'paypal';
//       case 'Bank Transfer':
//         return 'bank';
//       default:
//         return 'cash';
//     }
//   };

//   return (
//     <View style={{ flex: 1, padding: 16, backgroundColor: '#F5F5F5' }}>
//       <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>
//         Payment History
//       </Text>

//       {loading ? (
//         <ActivityIndicator animating={true} size="large" />
//       ) : (
//         <FlatList
//           data={payments}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <Card style={{ marginBottom: 12, borderRadius: 10, elevation: 3 }}>
//               <Card.Title
//                 title={`$${item?.amount}`}
//                 // subtitle={format(new Date(item.date), 'MMMM dd, yyyy')}
//                 left={(props) => <Avatar.Icon {...props} icon={getPaymentIcon(item?.method)} />}
//               />
//               <Card.Content>
//                 <Text variant="bodyMedium">Payment Method: {item?.payment_method_types["0"]} {item.payment_method_details?.network}</Text>
//                 <View style={{ marginTop: 10 }}>{getStatusChip(item?.status)}</View>
//               </Card.Content>
//             </Card>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// export default PaymentHistory;



import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, Chip, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '../../../constants/colors';
import { AuthContext } from '../../../context/AuthContext';
import userService from '../../../services/userService';
import { Avatar, List, Divider } from 'react-native-paper';
import moment from 'moment';




const PaymentHistory = () => {
    const { currentUserId, currentUser, currency } = useContext(AuthContext);
    
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customer_id] = useState(currentUser.stripe_customer.stripe_customer_id);

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const getStatusChip = (status) => {
        switch (status) {
            case 'succeeded':
                return <Chip style={{ backgroundColor: '#4CAF50', color: '#fff' }}>Paid</Chip>;
            case 'requires_payment_method':
                return <Chip style={{ backgroundColor: '#FF9800', color: '#fff' }}>Pending</Chip>;
            case 'Failed':
                return <Chip style={{ backgroundColor: '#F44336', color: '#fff' }}>Failed</Chip>;
            default:
                return <Chip>Unknown</Chip>;
        }
    };

    const renderItem = ({ item }) => (
        <>
        <List.Item
          title={item?.description}
          description={<View>
            <Text style={{color:COLORS.gray}}>{moment.unix(item?.created).format('MMMM Do YYYY')}</Text>

            </View>}
          left={(props) => <List.Icon {...props} icon={getPaymentIcon(item?.method)} size={64}  />}
          right={() => (
            <>
 
            <Text>${item?.amount}</Text>
            
            {/* <View>{getStatusChip(item?.status)}</View> */}
            </>
            
          )}
        //   right={() => getStatusChip(item?.status)}
          onPress={() => console.log(`Pressed ${item.amount}`)}
        />
        <Divider />
        </>
      );

    const fetchPendingPayments = async () => {
        try {
            const response = await userService.getPaymentsByStripeCustomerId(customer_id);
            console.log(JSON.stringify(response.data.payments, null, 2))
            setPayments(response.data.payments);
        } catch (error) {
            console.log(error);
            alert('Error fetching pending payments');
        } finally {
            setLoading(false);
        }
    };

    


    

    const getPaymentIcon = (method) => {
        switch (method) {
            case 'Credit Card':
                return 'credit-card-outline';
            case 'PayPal':
                return 'paypal';
            case 'Bank Transfer':
                return 'bank';
            default:
                return 'cash';
        }
    };

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: '#F5F5F5' }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 16 }}>Payment History</Text>

            {loading ? (
                <ActivityIndicator animating={true} size="large" />
            ) : (
                <FlatList
                    data={payments}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    // renderItem={({ item }) => (
                    //     <View style={{ marginBottom: 12, padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }}>
                    //         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    
                    //             <Avatar.Icon icon={getPaymentIcon(item?.method)} size={40} />
                    //             <Text style={{ marginLeft: 12, fontWeight: 'bold' }}>${item?.amount}</Text>
                    //         </View>
                    //         <Text>Payment Method: {item?.payment_method_types["0"]} </Text>
                    //         {/* <View style={{ marginTop: 10 }}>{getStatusChip(item?.status)}</View> */}
                    //     </View>

                        
                    // )}
                />
                // <Text>Willing</Text>
            )}
        </View>
    );
};

export default PaymentHistory;
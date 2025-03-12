import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Card, Avatar, Chip, ActivityIndicator } from 'react-native-paper';
import COLORS from '../../constants/colors'; // Assuming you have a colors constant file
import userService from '../../services/userService'; // Service to fetch the pending payments
import { AuthContext } from '../../context/AuthContext';
// import { format } from 'date-fns';

const PaymentHistory = () => {

    const {currentUserId, stripe_customer, currency} = useContext(AuthContext)
    
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        try {
            // Assuming userService.getPendingPayments fetches the pending payments from the API
            const response = await userService.getPaymentsByStripeCustomerId(stripe_customer.stripe_customer_id);
            setPayments(response.data);
            // console.log(response.data)
        } catch (error) {
            console.log(error);
            alert('Error fetching pending payments');
        } finally {
            setLoading(false);
        }
    };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Paid':
        return <Chip style={{ backgroundColor: '#4CAF50', color: '#fff' }}>Paid</Chip>;
      case 'Pending':
        return <Chip style={{ backgroundColor: '#FF9800', color: '#fff' }}>Pending</Chip>;
      case 'Failed':
        return <Chip style={{ backgroundColor: '#F44336', color: '#fff' }}>Failed</Chip>;
      default:
        return <Chip>Unknown</Chip>;
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
      <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>
        Payment Historys
      </Text>

      {loading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 12, borderRadius: 10, elevation: 3 }}>
              <Card.Title
                title={`$${item?.amount}`}
                // subtitle={format(new Date(item.date), 'MMMM dd, yyyy')}
                left={(props) => <Avatar.Icon {...props} icon={getPaymentIcon(item?.method)} />}
              />
              <Card.Content>
                <Text variant="bodyMedium">Payment Method: {item?.method}</Text>
                <View style={{ marginTop: 10 }}>{getStatusChip(item?.status)}</View>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

export default PaymentHistory;
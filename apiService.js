import axios from 'axios';

export const fetchPaymentIntentClientSecret = async (amount) => {
  try {
    const response = await axios.post('http://your-backend-url.com/create-payment-intent/', {
      amount,
    });
    return response.data.clientSecret;
  } catch (error) {
    console.error('Error fetching client secret:', error);
    return null;
  }
};
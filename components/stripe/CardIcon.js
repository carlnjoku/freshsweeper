import Icon from 'react-native-vector-icons/FontAwesome';

const CardIcon = ({ brand }) => {
  switch (brand) {
    case 'visa':
      return <Icon name="cc-visa" size={30} color="#1a1f71" />;
    case 'mastercard':
      return <Icon name="cc-mastercard" size={30} color="#666" />;
    case 'amex':
      return <Icon name="cc-amex" size={30} color="#2e77bb" />;
    case 'discover':
      return <Icon name="cc-discover" size={30} color="#ff6000" />;
    case 'Diners Club':
      return <Icon name="cc-diners-club" size={30} color="#0061a8" />;
    case 'JCB':
      return <Icon name="cc-jcb" size={30} color="#3e7aab" />;
    case 'unionpay':
      return <Icon name="credit-card-alt" size={30} color="#d81e06" />; // No specific icon for UnionPay, using a general one
    default:
      return <Icon name="credit-card" size={30} color="#666" />;
  }
};

export default CardIcon
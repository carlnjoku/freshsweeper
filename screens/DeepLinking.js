// import * as Linking from 'expo-linking';

// export default {
//   prefixes: ['flavoursoft1://'], // The custom scheme
//   config: {
//     screens: {
//       Home: 'home',
//       VerificationSuccess: 'verification-success',
//     },
//   },
// };



import React from 'react';
import { Linking } from 'react-native';
import { navigationRef } from '../hooks/navigationService';

const DeepLinking = () => {

  // Function to handle URL deep linking
  const handleDeepLink = ({ url }) => {
    const { path, queryParams } = Linking.parse(url);
    console.log('Deep Link Path:', path);
    console.log('Query Params:', queryParams);

    // Navigate to a specific screen based on the path or params
    navigationRef.current?.navigate(path, queryParams);
  };

  // Setup listener for deep links
  React.useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  return null;
};

export default DeepLinking;
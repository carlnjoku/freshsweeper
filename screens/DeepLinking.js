

// import React from 'react';
// import { Linking } from 'react-native';
// import { navigationRef } from '../hooks/navigationService';

// const DeepLinking = () => {

//   // Function to handle URL deep linking
//   const handleDeepLink = ({ url }) => {
//     const { path, queryParams } = Linking.parse(url);
//     console.log('Deep Link Path:', path);
//     console.log('Query Params:', queryParams);

//     // Navigate to a specific screen based on the path or params
//     navigationRef.current?.navigate(path, queryParams);

//     // Navigate to the Reset Password screen
//     if (path === 'reset-password' && queryParams.token) {
//       navigationRef.current?.navigate('ResetPassword', { token: queryParams.token });
//     }
//   };

//   // Setup listener for deep links
//   React.useEffect(() => {
//     const subscription = Linking.addEventListener('url', handleDeepLink);

//     return () => {
//       Linking.removeEventListener('url', handleDeepLink);
//     };
//   }, []);

//   return null;
// };

// export default DeepLinking;





// import React, { useEffect } from 'react';
// import { Linking } from 'react-native';
// import { navigationRef } from '../hooks/navigationService';

// const DeepLinking = () => {
//   useEffect(() => {
//     const handleDeepLink = async (event) => {
//       const url = event.url;
//       if (url) {
//         const { path, queryParams } = Linking.parse(url);
//         console.log('Deep Link Path:', path);
//         console.log('Query Params:', queryParams);

//         // Define navigation mapping
//         const navigationMap = {
//           'reset-password': { screen: 'ResetPassword', params: { token: queryParams.token } },
//           'verify-email': { screen: 'VerifyEmail', params: { email: queryParams.email, code: queryParams.code } },
//           'onboarding': { screen: 'Onboarding' },
//           'profile': { screen: 'Profile', params: { userId: queryParams.userId } },
//         };

//         if (navigationMap[path]) {
//           const { screen, params } = navigationMap[path];
//           navigationRef.current?.navigate(screen, params);
//         } else {
//           console.warn('Unhandled deep link:', url);
//         }
//       }
//     };

//     // Handle app opening via deep link
//     Linking.getInitialURL().then((url) => {
//       if (url) handleDeepLink({ url });
//     });

//     // Listen for deep link events
//     const subscription = Linking.addEventListener('change', handleDeepLink);

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   return null;
// };

// export default DeepLinking;



import { Linking } from 'react-native';
import ROUTES from '../constants/routes';

const linking = {
  prefixes: ['freshsweeper1://', 'https://freshsweeper.com'], // Both app and web deep links
  config: {
    screens: {
      ResetPassword: ROUTES.reset_password,  // yourapp://reset-password?token=abc123
      VerifyEmail: 'verify-email',      // yourapp://verify-email?email=test@example.com&code=6789
      Profile: 'profile',               // yourapp://profile?userId=12345
      Onboarding: 'onboarding',         // yourapp://onboarding
      Dashboard: 'Dashboard',         // yourapp://dashboard
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    return url;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }) => listener(url);
    const subscription = Linking.addEventListener('url', onReceiveURL);
    return () => subscription.remove();
  },
};

export default linking;
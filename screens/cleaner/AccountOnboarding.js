// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, Linking, ActivityIndicator, Alert, StyleSheet } from 'react-native';
// import userService from '../../services/userService';
// import COLORS from '../../constants/colors';

// const AccountOnboarding = ({ cleanerEmail }) => {
//     const [accountId, setAccountId] = useState(null);
//     const [onboardingUrl, setOnboardingUrl] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [accountStatus, setAccountStatus] = useState('Not Onboarded');

//     const openLink = async (url) => {
//         try {
//             const supported = await Linking.canOpenURL(url);
//             if (supported) {
//                 await Linking.openURL(url);
//             } else {
//                 console.log("Cannot open URI:", url);
//             }
//         } catch (error) {
//             console.error("Error opening link:", error);
//         }
//     };

//     useEffect(() => {

//         if (accountId && accountStatus === 'Onboarding in Progress') {
//             // Check account status or open the onboarding link if status is appropriate
//             openOnboardingLink();
//         }
//     }, [accountId, accountStatus]);

//     const onboardCleaner = async () => {
//         setLoading(true);
//         try {
//             // Start onboarding only if not onboarded
//             if (accountStatus === 'Not Onboarded') {
//                 const response = await userService.createStripeConnectAccount({ email: cleanerEmail });
//                 setAccountId(response.data.account_id);
//                 // alert(response.data.account_id)

//                 const linkResponse = await userService.createLinkUrl(response.data.account_id);
                
//                 setOnboardingUrl(linkResponse.data.account_link_url);
//                 setAccountStatus('Onboarding in Progress');
//             }
//         } catch (error) {
//             console.error("Onboarding error:", error);
//             Alert.alert("Onboarding error", error.response?.data || "Could not start onboarding. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchAccountStatus = async (accountId) => {
//         try {
//             const response = await userService.getStatus(accountId);
//             setAccountStatus(response.data.status);
//         } catch (error) {
//             console.error("Error fetching account status:", error);
//             Alert.alert("Error", "Could not check account status.");
//         }
//     };

//     const openOnboardingLink = () => {
//         if (onboardingUrl) {
//             Linking.openURL(onboardingUrl).catch(err => console.error("Couldn't load page", err));
//         } else {
//             Alert.alert("Onboarding Not Started", "Please initiate onboarding first.");
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Stripe Connect Onboarding</Text>
//             <Text>{onboardingUrl}</Text>
//             <Text>Status: {accountStatus}</Text>

//             {loading && <ActivityIndicator size="large" color="#0000ff" />}

//             {accountStatus === 'Not Onboarded' && (
//                 <Button
//                     title="Start Onboarding"
//                     onPress={onboardCleaner}
//                     disabled={loading}
//                 />
//             )}

//             {accountStatus === 'Onboarding in Progress' && onboardingUrl && (
//                 <Button
//                     title="Complete Onboarding"
//                     onPress={openOnboardingLink}
//                 />
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//         backgroundColor:COLORS.backgroundColor,
//         borderRadius:20
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
// });

// export default AccountOnboarding;





// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, Linking, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using react-native-vector-icons
// import userService from '../../services/userService';
// import COLORS from '../../constants/colors';

// const AccountOnboarding = ({ cleanerEmail }) => {
//     const [accountId, setAccountId] = useState(null);
//     const [onboardingUrl, setOnboardingUrl] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [accountStatus, setAccountStatus] = useState('Not Onboarded');

//     const openLink = async (url) => {
//         try {
//             const supported = await Linking.canOpenURL(url);
//             if (supported) {
//                 await Linking.openURL(url);
//             } else {
//                 console.log("Cannot open URI:", url);
//             }
//         } catch (error) {
//             console.error("Error opening link:", error);
//         }
//     };

//     useEffect(() => {
//         if (accountId && accountStatus === 'Onboarding in Progress') {
//             openOnboardingLink();
//         }
//     }, [accountId, accountStatus]);

//     const onboardCleaner = async () => {
//         setLoading(true);
//         try {
//             if (accountStatus === 'Not Onboarded') {
//                 const response = await userService.createStripeConnectAccount({ email: cleanerEmail });
//                 setAccountId(response.data.account_id);
//                 const linkResponse = await userService.createLinkUrl(response.data.account_id);
//                 setOnboardingUrl(linkResponse.data.account_link_url);
//                 setAccountStatus('Onboarding in Progress');
//             }
//         } catch (error) {
//             console.error("Onboarding error:", error);
//             Alert.alert("Onboarding error", error.response?.data || "Could not start onboarding. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchAccountStatus = async (accountId) => {
//         try {
//             const response = await userService.getStatus(accountId);
//             setAccountStatus(response.data.status);
//         } catch (error) {
//             console.error("Error fetching account status:", error);
//             Alert.alert("Error", "Could not check account status.");
//         }
//     };

//     const openOnboardingLink = () => {
//         if (onboardingUrl) {
//             Linking.openURL(onboardingUrl).catch(err => console.error("Couldn't load page", err));
//         } else {
//             Alert.alert("Onboarding Not Started", "Please initiate onboarding first.");
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Stripe Connect Onboarding</Text>
            
//             <View style={styles.statusContainer}>
//                 <Icon name="information-circle-outline" size={28} color={COLORS.primary} />
//                 <Text style={styles.statusText}>
//                     Status: <Text style={styles.statusHighlight}>{accountStatus}</Text>
//                 </Text>
//             </View>

//             {loading && <ActivityIndicator size="large" color={COLORS.primary} />}

//             {!loading && (
//                 <View style={styles.actionContainer}>
//                     {accountStatus === 'Not Onboarded' && (
//                         <TouchableOpacity style={styles.button} onPress={onboardCleaner}>
//                             <Icon name="log-in-outline" size={20} color="#fff" />
//                             <Text style={styles.buttonText}>Start Onboarding</Text>
//                         </TouchableOpacity>
//                     )}

//                     {accountStatus === 'Onboarding in Progress' && onboardingUrl && (
//                         <TouchableOpacity style={styles.button} onPress={openOnboardingLink}>
//                             <Icon name="arrow-forward-circle-outline" size={20} color="#fff" />
//                             <Text style={styles.buttonText}>Complete Onboarding</Text>
//                         </TouchableOpacity>
//                     )}

//                     {accountStatus === 'Onboarded' && (
//                         <View style={styles.completedContainer}>
//                             <Icon name="checkmark-circle-outline" size={40} color={COLORS.success} />
//                             <Text style={styles.completedText}>Onboarding Complete!</Text>
//                         </View>
//                     )}
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//         backgroundColor: COLORS.backgroundColor,
//         borderRadius: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: COLORS.primary,
//         marginBottom: 20,
//     },
//     statusContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//         backgroundColor: COLORS.secondary,
//         padding: 10,
//         borderRadius: 10,
//     },
//     statusText: {
//         fontSize: 18,
//         color: COLORS.textColor,
//         marginLeft: 10,
//     },
//     statusHighlight: {
//         fontWeight: 'bold',
//         color: COLORS.highlight,
//     },
//     actionContainer: {
//         alignItems: 'center',
//     },
//     button: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.primary,
//         padding: 15,
//         borderRadius: 10,
//         marginVertical: 10,
//         width: 200,
//         justifyContent: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginLeft: 8,
//     },
//     completedContainer: {
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     completedText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: COLORS.success,
//         marginTop: 10,
//     },
// });

// export default AccountOnboarding;





import React, { useState, useEffect } from 'react';
import { View, Text, Button, Linking, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using react-native-vector-icons
import userService from '../../services/userService';
import COLORS from '../../constants/colors';

const AccountOnboarding = ({ route }) => {

    const {email} = route.params
    
    const cleanerEmail = email

    const [accountId, setAccountId] = useState(null);
    const [onboardingUrl, setOnboardingUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [accountStatus, setAccountStatus] = useState('Not Onboarded');

    

    useEffect(() => {
        if (accountId && accountStatus === 'Onboarding in Progress') {
            openOnboardingLink();
        }
    }, [accountId, accountStatus]);

    const onboardCleaner = async () => {
        setLoading(true);
        try {
            if (accountStatus === 'Not Onboarded') {
                const response = await userService.createStripeConnectAccount({ email: cleanerEmail });
                setAccountId(response.data.account_id);
                const linkResponse = await userService.createLinkUrl(response.data.account_id);
                setOnboardingUrl(linkResponse.data.account_link_url);
                setAccountStatus('Onboarding in Progress');
            }
        } catch (error) {
            console.error("Onboarding error:", error);
            Alert.alert("Onboarding error", error.response?.data || "Could not start onboarding. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAccountStatus = async (accountId) => {
        try {
            const response = await userService.getStatus(accountId);
            setAccountStatus(response.data.status);
        } catch (error) {
            console.error("Error fetching account status:", error);
            Alert.alert("Error", "Could not check account status.");
        }
    };

    const openOnboardingLink = () => {
        if (onboardingUrl) {
            Linking.openURL(onboardingUrl).catch(err => console.error("Couldn't load page", err));
        } else {
            Alert.alert("Onboarding Not Started", "Please initiate onboarding first.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Set Up Your Account & Start Earning!</Text>
            <Text style={styles.subTitle}>
                You’re just one step away from unlocking secure payments. Complete your account setup now 
                to start receiving payments directly for every cleaning.
            </Text>
            
            

            {/* <View style={[styles.statusContainer, styles[accountStatus]]}>
                <Icon name="information-circle-outline" size={28} color={COLORS.white} />
                <Text style={styles.statusText}>
                    Status: <Text style={styles.statusHighlight}>{accountStatus}</Text>
                </Text>
            </View> */}

            {loading && <ActivityIndicator size="large" color={COLORS.primary} />}

            {!loading && (
                <View style={styles.actionContainer}>
                    {accountStatus === 'Not Onboarded' && (
                        <TouchableOpacity style={styles.button} onPress={onboardCleaner}>
                            <Icon name="log-in-outline" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Start Setup</Text>
                        </TouchableOpacity>
                    )}

                    {accountStatus === 'Onboarding in Progress' && onboardingUrl && (
                        <TouchableOpacity style={styles.button} onPress={openOnboardingLink}>
                            <Icon name="arrow-forward-circle-outline" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Complete Setup</Text>
                        </TouchableOpacity>
                    )}

                    {accountStatus === 'Onboarded' && (
                        <View style={styles.completedContainer}>
                            <Icon name="checkmark-circle-outline" size={40} color={COLORS.success} />
                            <Text style={styles.completedText}>Account Ready!</Text>
                            <Text style={styles.successText}>
                                Your account is now set up to receive payments. Start earning today!
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: COLORS.backgroundColor,
        borderTopLeftRadius:20,
        borderTopRightRadius:20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.deepBlue,
        marginBottom: 10,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: COLORS.primary_light,
        padding: 10,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 18,
        color: COLORS.white,
        marginLeft: 10,
    },
    statusHighlight: {
        fontWeight: 'bold',
        color: COLORS.white,
    },
    NotOnboarded: {
        backgroundColor: COLORS.warning,
    },
    actionContainer: {
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 50,
        marginVertical: 10,
        width: 200,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    completedContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    completedText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.success,
        marginTop: 10,
    },
    successText: {
        fontSize: 16,
        color: COLORS.textColor,
        textAlign: 'center',
        marginTop: 5,
    },
});

export default AccountOnboarding;
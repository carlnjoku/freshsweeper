import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from "../../constants/colors";
import CircleIconButton2 from "../CircleIconButton2";
import ROUTES from "../../constants/routes";
import { useNavigation } from '@react-navigation/native';




const VerificationListItem = ({ icon, label, description, type, email, status, location, stripe_account_id }) => {

    
    const getVerificationIcon = () => {
        if (type==="ID_verify" && status === "verified") {
          // First condition: Verified
          return {
            iconName: "check-circle",
            title_color: COLORS.deepBlue,
          };
        }
      
        // if (verifyItem.stripe_account_id && verifyItem.stripe_account_id.trim() !== "") {
        if (type==="payment_onboarding" && status === "account exists") {
          // Second condition: Account exists
          return {
            iconName: "check-circle",
            title_color: COLORS.light_gray,
          };
        }
      
        if (type==="payment_onboarding" && status === "account exists") {
          // Third condition: Onboarded
          return {
            iconName: "check-circle",
            title_color: COLORS.light_gray,
          };
        }
      
        // Default: Not verified
        return {
          iconName: "circle",
          title_color: COLORS.warning,
        };
      };
    
    
   
    const navigation = useNavigation();
    const handleIDCapture = () => {
        // navigation.navigate(ROUTES.cleaner_id_capture)
    }
    const handleOnboarding = () => {
        navigation.navigate(ROUTES.cleaner_payment_onboarding)
    }
    // const handleEvent = (event_type) => {
      
    //     if(event_type === "ID_verify"){
    //         navigation.navigate(ROUTES.cleaner_id_capture)
    //     }else if(event_type === "payment_onboarding"){
    //         navigation.navigate(ROUTES.cleaner_payment_onboarding, {
    //             email:verifyItem.email
    //         })
    //     }else if(event_type === "tax_info"){
    //         navigation.navigate(ROUTES.cleaner_tax_information)
    //     }
    // }


    const handleEvent = (event_type) => {
        if (event_type === "ID_verify") {
          navigation.navigate(ROUTES.cleaner_id_verification);
        } else if (event_type === "payment_onboarding") {
          navigation.navigate(ROUTES.cleaner_payment_onboarding, { email: email });
        } else if (event_type === "tax_info") {
          navigation.navigate(ROUTES.cleaner_tax_information,{
            email: email,
            location: location,
            stripe_account_id:stripe_account_id
          });
        }
      };
    
      // Get icon details based on verification status
      const { iconName, title_color } = getVerificationIcon();

  return (
    <View>
    
    <TouchableOpacity style={styles.listItem} onPress={() => handleEvent(type)}>
        {/* Icon Section */}
        <MaterialCommunityIcons name={icon} size={30} color={COLORS.primary} style={styles.icon} />

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Circle Icon */}
        <CircleIconButton2
          iconName={iconName}
          buttonSize={45}
          radiusSise={25}
          iconSize={26}
          title_color={title_color}
        />
    </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // Divide the container into horizontal sections
  },
  section: {
    justifyContent: "center",
    alignItems: "center",
  },
  leftSection: {
    flex: 1, // 1 part of the width
    backgroundColor: "#f8b400",
  },
  middleSection: {
    flex: 2, // 2 parts of the width (widest)
    backgroundColor: "#4caf50",
  },
  rightSection: {
    flex: 1, // 1 part of the width
    backgroundColor: "#2196f3",
  },
  text: {
    color: "white",
    fontSize: 16,
  },


  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
 },
  
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333333",
    },
    description: {
        fontSize: 13,
        color: "#666666",
    },
    
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
});

export default VerificationListItem;








import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const RoleSelection = ({ onContinue }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole && onContinue) {
      onContinue(selectedRole);
    }
  };

  return (
    <View>
      {/* Host Card */}
      <Text style={styles.title}>Choose Your Role</Text>
      <TouchableOpacity 
        style={[
          styles.card,
          selectedRole === 'host' && styles.selectedCard
        ]} 
        onPress={() => setSelectedRole('host')}
      >
        {selectedRole === 'host' && (
          <View style={styles.checkBadge}>
            <MaterialCommunityIcons name="check" size={16} color="white" />
          </View>
        )}
        
        <View style={styles.itemContent}>
          <View style={{ marginRight: 10 }}>
            <MaterialCommunityIcons name="home-account" size={40} color={COLORS.gray} />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.cardTitle}>I need cleaners</Text>
            <Text>Keep your rental spotless with trusted professionals.</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Cleaner Card */}
      <TouchableOpacity 
        style={[
          styles.card,
          selectedRole === 'cleaner' && styles.selectedCard
        ]} 
        onPress={() => setSelectedRole('cleaner')}
      >
        {selectedRole === 'cleaner' && (
          <View style={styles.checkBadge}>
            <MaterialCommunityIcons name="check" size={16} color="white" />
          </View>
        )}
        
        <View style={styles.itemContent}>
          <View style={{ marginRight: 10 }}>
            <MaterialCommunityIcons name="broom" size={40} color={COLORS.gray} />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.cardTitle}>I am a cleaner</Text>
            <Text>Earn money cleaning homes and apartments in your area</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Continue Button */}
      {selectedRole && (
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      )}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    
  },
  card: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative', // Needed for absolute positioning of check badge
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  checkBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    padding: 11,
    alignItems: 'center',
    marginTop: 40,
    borderRadius:50,
  
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  title:{
    fontSize:22,
    alignSelf:'center',
    fontWeight:'600',
    marginBottom:20
  }
});

export default RoleSelection;
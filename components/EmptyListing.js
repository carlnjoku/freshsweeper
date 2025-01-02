import React from 'react';
import { SafeAreaView, StyleSheet, View, FlatList,Text, Image, TouchableOpacity } from 'react-native';
import ROUTES from '../constants/routes';
import COLORS from '../constants/colors';

export default function EmptyListing({heading, subtitle, action_text}) {
  return (

        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>{heading}</Text>
          <Text style={styles.emptyStateSubtitle}>{subtitle}</Text>
          {action_text ? 
            <TouchableOpacity 
              style={styles.action_button}
              onPress = {() => navigation.navigate(ROUTES.host_add_apt)}
            >
              <Text style={styles.action_button_color}>{action_text}</Text>
            </TouchableOpacity>
            : 
            ""
          }
        </View>
      
  )
}

const styles = StyleSheet.create({
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop:'50%'
      },
      emptyStateText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 10,
      },
      emptyStateSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
      },
})
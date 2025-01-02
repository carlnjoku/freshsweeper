import React from 'react';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function Conversations() {
  return (
    <SafeAreaView
          style={{
            flex:1,
            backgroundColor:COLORS.backgroundColor,
            justifyContent:"center",
            // alignItems:"center",
            marginBottom:0
          }}
        >
    <View>
    <Text>Conversations</Text>
    </View>
    </SafeAreaView>
  )
}

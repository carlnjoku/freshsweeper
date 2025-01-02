import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const Loader = ({ isLoading }) => (
  isLoading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : null
);

export default Loader;

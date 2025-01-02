import React from 'react';
import { SystemMessage } from 'react-native-gifted-chat';
import { Image, StyleSheet, View } from 'react-native';

const CustomSystemMessage = ({ currentMessage }) => {

    console.log(currentMessage)
  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={{uri:"https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=mail@ashallendesign.co.uk"}} /> 
      <SystemMessage {...currentMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
});

export default CustomSystemMessage;

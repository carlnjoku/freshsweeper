import React from 'react';
import { View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';

const ChecklistItem = ({ item, isChecked, onChange }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 0 }}>
      <Checkbox.Android status={isChecked ? 'checked' : 'unchecked'} onPress={onChange} />
      <Text style={{ marginLeft: 10 }}>{item.label}</Text>
    </View>
  );
};

export default ChecklistItem;


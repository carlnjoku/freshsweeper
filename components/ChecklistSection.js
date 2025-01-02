import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import ChecklistItem from './ChecklistItem';

const ChecklistSection = ({ section }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleItemChange = (itemId, isChecked) => {
    console.log(itemId)
    setCheckedItems(prevState => ({
      ...prevState,
      [itemId]: isChecked,
    }));
  };

  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>{section.title}</Text>
      <FlatList
        data={section.value}
        renderItem={({ item }) => (
          <ChecklistItem
            item={item}
            isChecked={checkedItems[item.id]}
            onChange={isChecked => handleItemChange(item.id, isChecked)}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default ChecklistSection;

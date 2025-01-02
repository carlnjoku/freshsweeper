import React from 'react';
import { FlatList, View } from 'react-native';
import ChecklistSection from './ChecklistSection';

const Checklist = ({ checklist }) => {
  return (
    <FlatList
      data={checklist}
      renderItem={({ item }) => <ChecklistSection section={item} />}
      keyExtractor={item => item.id.toString()}
    />
  );
};

export default Checklist;

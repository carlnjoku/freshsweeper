import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import JobCard from '../../../components/cleaner/JobCard';
import COLORS from '../../../constants/colors';

const CompletedJobsList = ({ schedules }) => {
  const [selectedFilter, setSelectedFilter] = React.useState("All");

  const filters = ["All", "Last 7 days", "Last 30 days", "Custom Range"];

  return (
    <View style={styles.container}>
      {schedules.length > 0 ?
      <View style={styles.filterContainer}>
        {filters.map((filter, index) => (
          <Chip
            key={index}
            mode="outlined"
            style={selectedFilter === filter ? styles.activeChip : styles.chip}
            onPress={() => setSelectedFilter(filter)}
          >
            {filter}
          </Chip>
        ))}
      </View>
      :
      ""
      }
      
      <FlatList
        data={schedules}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <JobCard schedules={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No completed jobs found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#e0e0e0',
    borderColor:COLORS.light_gray
  },
  activeChip: {
    backgroundColor: COLORS.black,
    borderColor:COLORS.black,
    color: '#ffffff',
  },
  list: {
    paddingBottom: 20,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CompletedJobsList;

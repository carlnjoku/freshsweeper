import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TextInputContainer from './TextInputContainer';

const FilterBar = ({ selectedCleaner, setSelectedCleaner, selectedTimeframe, setSelectedTimeframe }) => {
  return (
    <View style={styles.container}>
      {/* Cleaner ID Picker */}
      {/* <TextInputContainer iconName="home-variant-outline" label="Select Property"> */}
      <Picker
        selectedValue={selectedCleaner}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCleaner(itemValue)}
      >
        <Picker.Item label="All Cleaners" value={null} />
        <Picker.Item label="Cleaner 1" value="cleaner1" />
        <Picker.Item label="Cleaner 2" value="cleaner2" />
        {/* Add more cleaners as needed */}
      </Picker>
      {/* </TextInputContainer> */}

      {/* Timeframe Picker */}
      <Picker
        selectedValue={selectedTimeframe}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedTimeframe(itemValue)}
      >
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Biweekly" value="biweekly" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>


      
            {/* <TextInputContainer iconName="home-variant-outline" label="Select Property">
      
                <Picker
                    selectedValue={selected_apartment._id}
                    onValueChange={handleApartmentChange}
                    
                    mode="dropdown"
                    // style={{ height: 20, width: 150 }}
                    // itemStyle={{ height: 20 }} // Set the height of the items
                    // {...props}
                >
                    <Picker.Item label="Select Property" value="#" />
                    {owner_apartments.map((item, index) => (
                    <Picker.Item key={index} label={item.apt_name} value={item} />
                    ))}
                </Picker>
       
      </TextInputContainer> */}


    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  picker: { flex: 1, height: 50 },
});

export default FilterBar;



// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const FilterBar = ({ selectedCleaner, setSelectedCleaner, paymentsData }) => {
//   // Extract unique cleaners from payments data
//   const uniqueCleaners = Array.from(
//     new Set(paymentsData.map((payment) => payment.cleanerId))
//   ).map((cleanerId) => {
//     const cleaner = paymentsData.find((payment) => payment.cleanerId === cleanerId);
//     return { cleanerId, cleanerName: cleaner.cleanerName };
//   });

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Filter by Cleaner:</Text>
//       <Picker
//         selectedValue={selectedCleaner}
//         style={styles.picker}
//         onValueChange={(itemValue) => setSelectedCleaner(itemValue)}
//       >
//         <Picker.Item label="All Cleaners" value={null} />
//         {uniqueCleaners.map((cleaner) => (
//           <Picker.Item key={cleaner.cleanerId} label={cleaner.cleanerName} value={cleaner.cleanerId} />
//         ))}
//       </Picker>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   label: {
//     marginRight: 10,
//     fontSize: 16,
//   },
//   picker: {
//     height: 50,
//     flex: 1,
//   },
// });

// export default FilterBar;
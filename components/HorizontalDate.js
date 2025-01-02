import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HorizontalDateList = () => {
    // State for the current date
    const [currentDate, setCurrentDate] = useState(new Date());

    // State for the list of dates
    const [dates, setDates] = useState([]);

    // State for the selected date (we'll store it as a string in the desired format)
    const [selectedDate, setSelectedDate] = useState(null);

    // Function to generate dates for the current month
    const generateDates = (date) => {
        const dateArray = [];
        const startDate = new Date(date);
        startDate.setDate(1); // Set the date to the first of the current month

        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1); // Move to the next month
        endDate.setDate(0); // Set date to the last day of the current month

        while (startDate <= endDate) {
            dateArray.push({ id: startDate.toISOString(), date: new Date(startDate) });
            startDate.setDate(startDate.getDate() + 1);
        }

        setDates(dateArray);
    };

    // Effect to generate dates when the component mounts and when currentDate changes
    useEffect(() => {
        generateDates(currentDate);
    }, [currentDate]);

    // Function to format a date in the desired format (e.g., "Mon Jan 5")
    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            weekday: 'short', // e.g., Mon, Tue
            month: 'short',   // e.g., Jan, Feb
            day: 'numeric'    // e.g., 1, 5
        });
    };

    // Function to handle the selection of a date
    const handleDateSelect = (date) => {
        // Store the formatted date string in the selectedDate state
        setSelectedDate(formatDate(date));
    };

    // Function to handle moving to the previous month
    const handlePreviousMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    // Function to handle moving to the next month
    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    // Render a date item in the list
    const renderItem = ({ item }) => {
        // Format the date as "Day Month Date" (e.g., "Mon Jan 5")
        const formattedDate = formatDate(item.date);

        // Check if the item date is the selected date
        const isSelectedDate = formattedDate === selectedDate;

        // Apply different background color based on whether the date is selected
        const backgroundColor = isSelectedDate ? 'lightgreen' : 'white';

        return (
            <TouchableOpacity
                style={[
                    styles.dateContainer,
                    { backgroundColor }
                ]}
                onPress={() => handleDateSelect(item.date)}
            >
                <Text style={styles.dateText}>{formattedDate}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Navigation buttons */}
            <View style={styles.navigationButtons}>
                {/* Previous button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handlePreviousMonth}
                    disabled={currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()} // Disable if in the current month
                >
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>

                {/* Next button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNextMonth}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>

            {/* FlatList to display the list of dates */}
            <FlatList
                data={dates}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />

            {/* Display the selected date */}
            <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDateText}>
                    Selected Date: {selectedDate || 'None'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    dateContainer: {
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    selectedDateContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    selectedDateText: {
        fontSize: 16,
        color: '#333',
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 14,
        color: '#333',
    },
});

export default HorizontalDateList;




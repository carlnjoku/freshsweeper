import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';

const { width } = Dimensions.get('window');

const FeedbackModal = ({ onSubmit, onClose, feedbackTo }) => {
  const [ratings, setRatings] = useState({
    promptness: 0,
    cleanliness: 0,
    professionalism: 0,
    efficiency: 0,
    attentionToDetail: 0,
    overall: 0,
  });

  const [comment, setComment] = useState('');

  const [rating1, setRating1] = useState(4);

  // Rating labels based on value
  const ratingLabels = [
    "Bad", // 1
    "Poor", // 2
    "Okay", // 3
    "Good", // 4
    "Great", // 5
  ];

  // Calculate average rating
  const calculateAverageRating = () => {
    const totalRatings = Object.values(ratings).reduce((sum, value) => sum + value, 0);
    const count = Object.keys(ratings).length;
    return count > 0 ? (totalRatings / count).toFixed(2) : "0.00"; // Returns average as a string with 2 decimals
  };


  // Update rating for each category
  const handleRatingChange = (field, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [field]: value,
    }));
  };



  // Handle input changes for basic fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  // Submit feedback
  const handleSubmit = () => {
    // Ensure all categories are rated
    if (Object.values(ratings).some((value) => value === 0)) {
      alert('Please provide ratings for all categories.');
      return;
    }

    const averageRating = calculateAverageRating();

    // Submit the feedback to the parent component
    onSubmit({ ratings, comment, averageRating });
    // onClose();
  };



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Feedback for {feedbackTo}</Text>

        

        {Object.keys(ratings).map((field, index) => (
          <View key={index} style={styles.ratingContainer}>
            <Text style={styles.label}>
              {field.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase())}
            </Text>
            <AirbnbRating
              count={5}
              defaultRating={ratings[field]}
              showRating={false} // Hide the default rating labels
              size={width > 400 ? 20 : 15}
              onFinishRating={(value) => handleRatingChange(field, value)}
              // rating={rating1}
              // starContainerStyle={styles.starContainer}
              // ratingTextStyle={styles.ratingText}  // Customizing the rating label text
            />
            {/* Manually render the rating text */}
            {/* <Text style={[styles.ratingText, { fontSize: 14 }]}>
              {ratingLabels[rating1 - 0]} 
            </Text> */}
          </View>
        ))}

        <Text style={styles.label}>Additional Comments</Text>
        {/* <TextInput
          style={styles.input}
          placeholder="Write your feedback here..."
          multiline
          value={comment}
          onChangeText={setComment}
        /> */}

        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width > 400 ? 30 : 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: width > 400 ? 22 : 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  starContainer: {
    flexDirection: 'row',   // Align stars horizontally
    justifyContent: 'center', // Center the stars in the container
    alignItems: 'center',   // Align items in the center vertically
  },
  ratingText: {
    fontSize: 16,   // Adjust this value to customize the size of "Bad", "Good", etc.
    color: 'black',  // Customize the text color as needed
  },
  
  label: {
    fontSize: width > 400 ? 16 : 14,
    marginBottom: 5,
  },
  starContainer: {
    justifyContent: 'flex-start',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default FeedbackModal;
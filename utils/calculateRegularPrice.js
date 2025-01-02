// priceCalculator.js

// Function to calculate the price based on form data
// const calculateRegularPrice = (formData) => {
//     let calculatedPrice = 15; // Initialize price to 0
//     // Example: calculate price based on number of bedrooms and bathrooms
//     if (parseInt(formData.bedroom) && parseInt(formData.bathroom)) {
//       calculatedPrice = formData.bedroom * 15 + formData.bathroom * 10; // Example calculation
//     }

//     return calculatedPrice;
//   };
  
//   export default calculateRegularPrice;
  




  // Function to calculate total cleaning price
export const calculateCleaningPrice = (rooms) => {
  // Prices for cleaning based on room size
const cleaningPrices = {
  "Small": 10,
  "Medium": 13,
  "Large": 16
};

  const totalPrice = rooms.reduce((total, room) => {
    const { size_range, number } = room;
    const roomPrice = cleaningPrices[size_range] || 0; // Get price for room size or default to 0
    return total + (roomPrice * number); // Multiply price by number of rooms of that size
  }, 0);

  console.log("eeeeeeeee....eeeeee")
  console.log(totalPrice)
  console.log("eeeeeeeee....eeeeee")
  return totalPrice;
};

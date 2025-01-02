// priceCalculator.js

// Function to calculate the price based on form data
const calculateExtraPrice = (formData) => {
    let calculatedPrice = 0; // Initialize price to 0
    
    // Example: add extra services to the price calculation
    if (formData.extra) {
          formData.extra.forEach((extr) => {
          calculatedPrice += extr.price; // Add the price of each extra service
        });
    }
    return calculatedPrice;
  };
  
  export default calculateExtraPrice;
  
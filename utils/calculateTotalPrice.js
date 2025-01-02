// priceCalculator.js

// Function to calculate the price based on form data
const calculateTotalPrice = (formData) => {
    let calculatedPrice = 15; // Initialize price to 0
    // Example: calculate price based on number of bedrooms and bathrooms
    if (parseInt(formData.bedroom) && parseInt(formData.bathroom)) {
      calculatedPrice = formData.bedroom * 10 + formData.bathroom * 5; // Example calculation
    }

    // Example: add extra services to the price calculation
    if (formData.extra) {
        formData.extra.forEach((extr) => {
        calculatedPrice += extr.price; // Add the price of each extra service
        
        });
    }
    return calculatedPrice;
  };
  
  export default calculateTotalPrice;
  
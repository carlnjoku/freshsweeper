export const formatDate = (dateString) => {
    // Parse the date string using moment.js
    const date = moment(dateString, 'ddd MMM DD YYYY HH:mm:ss A');
  
    // Format the date as desired
    const formattedDate = date.format('ddd DD h:mm A');
  
    return formattedDate;
  };
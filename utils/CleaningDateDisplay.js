import React from 'react';
import moment from 'moment';

const CleaningDateDisplay = ({ cleaningDate, cleaningTime }) => {
  const today = moment().startOf('day'); // Start of today
  const tomorrow = moment().add(1, 'day').startOf('day'); // Start of tomorrow
  const cleaningMoment = moment(cleaningDate); // Cleaning date

  let displayDate;

  if (cleaningMoment.isSame(today, 'day')) {
    displayDate = `Today`;
  } else if (cleaningMoment.isSame(tomorrow, 'day')) {
    displayDate = `Tomorrow, ${moment(cleaningTime).format('h:mm A')}`;
  } else if (cleaningMoment.isAfter(today, 'day')) {
    displayDate = cleaningMoment.format('ddd MMM D'); // Future date format
  } else {
    displayDate = 'Invalid Date'; // Handle past dates if needed
  }
  return displayDate
//   return (
//     <div>
//       <p>{displayDate}</p>
//     </div>
//   );
};

export default CleaningDateDisplay;
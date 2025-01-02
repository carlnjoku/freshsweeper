import React from 'react';
import moment from 'moment';

const FutureDateTime = () => {
  // Get the future date and time (e.g., 15 minutes from now)
  const futureDateTime = moment().add(15, 'minutes');

  // Format the future date and time in the desired format
  const formattedDateTime = futureDateTime.format('ddd DD h:mm A');

  return (
    <div>
      <p>{formattedDateTime}</p>
    </div>
  );
};

export default FutureDateTime;

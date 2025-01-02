import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBookingContext = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    extra: [],
    apartment_name:'',
    address: '',
    apartment_latitude:'',
    apartment_longitude:'',
    cleaning_date:'',
    cleaning_time:'',
    regular_cleaning: [],
    bedroom: '0',
    bathroom:'0',
    totalPrice:'0'

  });
  
  

  // Define isSelectedList state and toggleSelected function
  const [isSelectedList, setIsSelectedList] = useState({});

  const toggleSelected = (value) => {
    setIsSelectedList((prevSelected) => ({
      ...prevSelected,
      [value]: !prevSelected[value],
    }));
    // console.log(value)
  };


  return (
    <BookingContext.Provider value={{ formData, setFormData, isSelectedList, toggleSelected}}>
      {children}
    </BookingContext.Provider>
  );
};

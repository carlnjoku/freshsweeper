import React, { createContext, useContext, useState } from 'react';
import { regular_cleaning } from '../data';

const BookingContext = createContext();

export const useBookingContext = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  // const [formData, setFormData] = useState({
  //   extra: [],
  //   apartment_name:'',
  //   address: '',
  //   apartment_latitude:'',
  //   apartment_longitude:'',
  //   cleaning_date:'',
  //   cleaning_time:'',
  //   regular_cleaning: regular_cleaning,
  //   bedroom: '0',
  //   bathroom:'0',
  //   totalPrice:'0',
  //   total_cleaning_fee:0

  // });

  const initialFormData = {
    extra: [],
    apartment_name: '',
    address: '',
    apartment_latitude: '',
    apartment_longitude: '',
    cleaning_date: '',
    cleaning_time: '',
    // cleaning_end_time:"",
    regular_cleaning: regular_cleaning,
    totalPrice: '0',
    total_cleaning_fee: 0
  };

  const [formData, setFormData] = useState(initialFormData);
  
  

  // Define isSelectedList state and toggleSelected function
  const [isSelectedList, setIsSelectedList] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEVisible, setModalEVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const toggleSelected = (value) => {
    setIsSelectedList((prevSelected) => ({
      ...prevSelected,
      [value]: !prevSelected[value],
    }));
    // console.log(value)
  };

  // Function to reset formData
  const resetFormData = () => {
    setFormData(initialFormData);
  };

  

    // const handleEdit = (schedule) => {
    //     setSelectedSchedule(schedule);
    //     setModalVisible(true);
    // };

    const handleEdit = (visible, schedule = null) => {
      console.log("handleEdit called withs: ", visible, schedule);
      setModalEVisible(visible);
      setSelectedSchedule(schedule);
      setFormData(schedule.schedule)

      if (!visible) {
        resetFormData(); // Reset form when modal closes
      }
  };

  const handleCreateSchedule = (value) => {
    setModalVisible(value);
  };
  const handleEditSchedule = (value) => {
    setModalEVisible(value);
  };
  

  return (
    <BookingContext.Provider value={{ formData, setFormData, isSelectedList, handleEdit,  modalVisible, modalEVisible, setModalVisible, setModalEVisible, selectedSchedule, openModal, handleCreateSchedule, handleEditSchedule, resetFormData, toggleSelected}}>
      {children}
    </BookingContext.Provider>
  );
};

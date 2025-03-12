import React, { createContext, useState, useEffect, useContext } from "react";

const CleaningTimerContext = createContext();

export const CleaningTimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [schedule, setSchedule] = useState(null); // Store schedule data

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const startTimer = (duration, scheduleData) => {
    setSchedule(scheduleData);
    setTimeLeft(duration);
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(null);
    setSchedule(null);
  };

  return (
    <CleaningTimerContext.Provider value={{ timeLeft, isActive, schedule, startTimer, stopTimer }}>
      {children}
    </CleaningTimerContext.Provider>
  );
};

export const useCleaningTimer = () => useContext(CleaningTimerContext);
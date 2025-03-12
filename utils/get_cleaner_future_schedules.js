export const get_clean_future_schedules = (schedules) => {
    // Get current date and time
    const now = new Date();
  
    // Format current date and time into a string for comparison
    const currentDate = now.toISOString().split('T')[0];  // Get the current date in YYYY-MM-DD format
    const currentTime = now.toTimeString().split(' ')[0];  // Get the current time in HH:mm:ss format
  
    // Combine current date and time into a single Date object
    const filterDateTime = new Date(`${currentDate}T${currentTime}`);
    
  
    // Filter schedules (schedules) for a cleaner
    const availableSchedules = schedules.filter(schedule => {
      const scheduleDateTime = new Date(`${schedule.schedule.cleaning_date}T${schedule.schedule.cleaning_time}`);
      // Check if the schedule time is after the current date/time
      alert(scheduleDateTime)
      return scheduleDateTime >= filterDateTime;
    });
  
    return availableSchedules;
  }
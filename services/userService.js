import http from './http-commons';
// import urlencode from 'urlencode';
class UserService {
  userLogin(data) {
    return http.post('/auth/login', data);
  }
  
    
    createUser(data) {
      return http.post('/users/', data);
    }
    getUser(id) {
      return http.get(`/users/${id}`);
    }
    getUsers() {
      return http.get('/users/');
    }

    updateCleanerContact(data){
      return http.put('/users/update_cleaner_contact', data)
    }
    updateCleanerAbout(data){
      return http.put('/users/update_cleaner_aboutme', data)
    }
    updateCleanerCertification(data){
      return http.put('/users/update_cleaner_certification', data)
    }
    updateAvailability(data){
      return http.put('/users/update_cleaner_availability', data)
    }
  
    logOut(data) {
      return http.put('/users/logout', data);
    }
  
    addApartment(data){
      return http.post('/apartments/add_apartment', data)
    }

    getApartment(userId){
      return http.get(`/apartments/get_host_apartments/${userId}`)
    }

    createSchedule(data){
      return http.post('/schedules/create_schedule', data)
    }

    // getSchedulesByHostId(hostId){
    //   return http.get(`/schedules/get_host_schedules/${hostId}`)
    // }
    getSchedulesByHostId(hostId){
      return http.get(`/schedules/get_host_upcoming_schedules/${hostId}`)
    }
    getSchedulesAssignedToCleaner(cleanerId){
      return http.get(`/schedules/get_schedules_assigned_to_cleaner/${cleanerId}`)
    }
    getUpcomingSchedulesByHostId(hostId){
      return http.get(`/schedules/get_host_upcoming_schedules/${hostId}`)
    }

    getPaymentsByHostId(hostId){
      return http.get(`/schedules/get_all_payment_history/${hostId}`)
    }
    approveSchedule(data){
      return http.put('/schedules/approve_schedule', data)
    }
    clockIn(data){
      return http.post('/schedules/clock_in', data)
    }
    getPendingPayments(apartmentId){
      return http.get(`/schedules/get_payments/${apartmentId}`)
    }

    getRecommendedCleaners(schedulId){
      return http.get(`/recommended_cleaners/get_recommended_cleaners/${schedulId}`)
    }
  
    getMyCleaningRequest(cleanerId){
      return http.get(`/schedules/get_cleaners_requests/${cleanerId}`);
    }
    getHostCleaningRequest(hostId){
      return http.get(`/schedules/get_host_requests/${hostId}`);
    }

    getCleanerChatReference(cleanerId, scheduleId){
      return http.get(`/schedules/get_cleaner_chat_reference/${cleanerId}/${scheduleId}`)
    }
    
    addApplication(data) {
      return http.post('/schedules/add_application', data);
    }

    deleteApplication(applicationId){
      return http.get(`/schedules/delete_application/${applicationId}`)
    }
    getAllHostApplications(hostId){
      return http.get(`/schedules/get_all_host_applications/${hostId}`)
    }

    getAllCleanerApplications(cleanerId){
      return http.get(`/schedules/get_all_cleaner_applications/${cleanerId}`)
    }
    updateApproved(data){
      return http.put('/schedules/approve_completion/', data)
    }
    // Profile 
    updateProfile(data) {
      return http.put('/users/update_profile', data);
    }
    // Profile 
    updateProfileAvatar(data) {
      return http.put('/users/update_profile_photo', data);
    }

    // Upload task photos
    uploadTaskPhotos(data){
      return http.put('/task_photos/upload_task_photos', data)
    }
    // Upload task photos
    uploadBeforeTaskPhotos(data){
      return http.put('/task_photos/upload_before_task_photos', data)
    }

    sendFeedback(data){
      return http.post('/feedbacks/submit_feedback', data)
    }
    getCleanerFeedbacks(cleanerId){
      return http.get(`/feedbacks/get_cleaner_feedbacks/${cleanerId}`)
    }

    

    // Stripe connect
    createStripeConnectAccount(data){
      return http.post('/stripes/create_connected_account', data)
    }
    getWeeklyEarning(cleanerId){
      return http.get(`/stripes/weekly-earnings/${cleanerId}`)
    }
    getWeeklyEarningToDate(cleanerId){
      return http.get(`/stripes/weekly-earnings-to-date/${cleanerId}`)
    }
  
    getClientSecret(){
      return http.post(`/stripes/create-setup-intent/`)
    }
    fetchSinglePaymentIntentClientSecret(data){
      return http.post('/stripes/create-setup-intent-single-payment/', data)
    }
    fetchPaymentIntentClientSecret(data){
      return http.post('/stripes/create-setup-intent-outstanding-payment/', data)
    }
    fetchCustomerPaymentMethods(data){
      return http.post('/stripes/retrieve-saved-payment-methods/', data)
    }

    createLinkUrl(accountId){
      return http.get(`/stripes/onboard_cleaner/${accountId}`)
    }
    getStatus(accountId){
      return http.get(`/stripes/check_account_status/${accountId}`)
    }
    
    // Card payment
    createPayment(data){
      return http.post('/payments/create-payment-intent', data)
    } 

    // Create verification session
    createVerificationSession(data){
      return http.post('/stripes/create-verification-session', data)
    }

    // Tax information 
    updateTaxInfomation(data){
      return http.post('/stripes/update-tax-info', data)
    }

    // Send push notitfication for cleaner request
    sendCleaningRequestPushNotification(data){
      return http.post('/push_notification/cleaning_request', data)
    }
    sendCleaningRequest(data){
      return http.post('/schedules/cleaning_request', data)
    }
    acceptCleaningRequest(scheduleId){
      return http.post(`/schedules/accept_cleaning_request/${scheduleId}`)
    }


    
    sendChatMessagePushNotification(data){
      return http.post('/push_notification/chat_messages', data)
    }
    // Update expo push token
    updateExpoPushToken(data){
      return http.put('/push_notification/update_expo_push_token', data)
    }

    // Redis push notifications
    // Validate token
    validateToken(data){
      return http.post("/redis/validate", data)
    }
    // Store token
    storeToken(data){
      return http.post("/redis/store-token", data)
    }

    getUserPushTokens(userId){
      return http.get(`/redis/get-tokens/${userId}`)
    }
    // Get updated images
    getUpdatedImageUrls(scheduleId){
      return http.get(`/task_photos/fetch_uploaded_images/${scheduleId}`)
    }

    updateChecklist(data){
      return http.put('/task_photos/update_checklist', data)
    }

    getICalendar(){
      return http.get(`/schedules/calendar`)
    }

    // Get cleaner's tasks upcoming, passed, completed and cancelled

    getMySchedules(cleanerId){
      return http.get(`/schedules/get_all_cleaning_schedules/${cleanerId}`)
    }
    getAllSchedules(){
      return http.get(`/schedules/get_all_cleaning_schedules`)
    }
    getScheduleById(scheduleId){
      return http.get(`/schedules/get_schedule_by_id/${scheduleId}`)
    }
    getUserCompletedJobs(cleanerId){
      return http.get(`/schedules/get_completed_schedules/${cleanerId}`)
    }
    updateSheduleWithChatroom(chatroom){
      return http.put('/schedules/add_chatroom_to_schedule', chatroom)
    }
    finishCleaning(data){
      return http.put('/schedules/finish_cleaning', data)
    }

    
  
    
    // Categories Components
    getCategories(){
      return http.get('/categories/')
    }
    getSubCategories(categoryId){
      return http.get(`/categories/get_sub_categories/${categoryId}`)
    }
  
    getFieldData(categoryId){
        return http.get(`/categories/get_fields_data_by_sub_category_name/${categoryId}` )
    }

    getFields(subcategory_name){
      return http.get(`/categories/get_fields/${subcategory_name}`)
    }
  
    getFieldDataBySubCategoryName(subcatname){
      return http.get(`/categories/get_fields_data_by_sub_category_name/${subcatname}` )
    }
    getAttributeFieldDataBySubCategoryName(subcatname){
      return http.get(`/categories/get_attribute_fields_data_by_sub_category_name/${subcatname}` )
    }

    getAttributeData(attr_name, child_field, sub_category_name){
        return http.get(`/categories/get_fields_attribute_data/${attr_name}/${child_field}/${sub_category_name}` )
      }

    

    // Post / Ads

    add_new_listing(data){
        return http.post('/posts/add_new_listing_mobile', data)
    }
    getAllPosts(){
        return http.get('/posts')
    }
    
    // getSimilarAds(data){
    //     return http.post(`/posts/get_similar_ads`, data)
    //   }
  
    // getSimilarAds(id){
    //     return http.get(`/posts/get_similar_ads/${id}`)
    // }
    getSimilarAds(data){
      return http.post('/posts/get_similar_ads', data)
    }
  
    // Locations
    getCountries(){
      return http.get('/get_countries')
    }

    // Reviews
    createReview(data){
      return http.post('/posts/create_review', data)
    }

    getReviews(ownerId){
      return http.get(`/posts/get_reviews/${ownerId}`)
    }
    getMyReviews(currentUsrId){
      return http.get(`/posts/get_my_reviews/${currentUsrId}`)
    }

    // getJobs(){
    //   return http.get('/jobs')
    // }
  
  }
  
  
  export default new UserService();
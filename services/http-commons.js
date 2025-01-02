import axios from 'axios';

// export default axios.create({
//   // baseURL: 'http://rntws-67-80-224-161.a.free.pinggy.link',
//   // baseURL: 'http://3.23.89.171:8000',
//   baseURL: 'http://18.191.219.237:8000',
//   headers: {
//     'Content-type': 'application/json',
//   },
// });



const api = axios.create({
  // Uncomment the appropriate base URL for your needs
  baseURL: 'http://rnoqu-67-80-224-161.a.free.pinggy.link',
  // baseURL: 'http://3.23.89.171:8000',
  // baseURL: 'http://18.191.219.237:8000',
  // baseURL: 'https://www.freshsweeper.com',
  headers: {
    'Content-type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use((config) => {
  console.log('Request:', config); // Log request details
  return config;
}, (error) => {
  console.error('Request Error:', error); // Log request error
  return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use((response) => {
  console.log('Response:', response); // Log response details
  return response;
}, (error) => {
  console.error('Response Error:', error); // Log response error
  return Promise.reject(error);
});

export default api;





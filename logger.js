// logger.js
import { Logger } from 'react-native-logs';

// Create a logger instance with desired settings
const logger = Logger.createLogger({
  severity: 'debug', // Set the logging level (info, warn, error, etc.)
  transport: async (msg) => {
    console.log(msg); // You can customize this to send logs to a server or other destinations
  },
});

export default logger;
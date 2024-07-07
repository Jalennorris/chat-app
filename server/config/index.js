import dbConfig from './dbConfig.js'
import authConfig from './authConfig.js'

const config = {
    dbConfig,
    authConfig,
    server: {
      port: process.env.PORT || 4000,
      host: process.env.HOST || 'localhost',
    },
    // Add other common configuration settings here
  };
  
  export default config;

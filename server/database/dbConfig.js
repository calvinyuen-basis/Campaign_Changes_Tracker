// Database configuration using environment variables
import dotenv from 'dotenv';
dotenv.config();

// Database configurations using environment variables
export const rentdb1Config = {
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306
  
};

// Ocient config (MySQL wire protocol)
export const OcientConfig = {
  host: process.env.OCIENT_HOST,
  user: process.env.OCIENT_USER,
  password: process.env.OCIENT_PASSWORD,
  database: process.env.OCIENT_DB,
  port: process.env.OCIENT_PORT || 8000,
};



// Database configuration using environment variables
import dotenv from 'dotenv';
dotenv.config();

export const rentdb1Config = {
  user: process.env.RENTDB_USERNAME,
  password: process.env.RENTDB_PASSWORD,
  host: process.env.RENTDB1_HOST,
  database: process.env.RENTDB1_DATABASE_NAME,
  port: process.env.RENTDB_PORT || 8000
  
};

export const ocientConfig = {
  user:process.env.OCIENT_USERNAME,
  password: process.env.OCIENT_PASSWORD,
  host: process.env.OCIENT_HOST,
  database: process.env.OCIENT_DATABASE_NAME,
  port: process.env.OCIENT_PORT || 4252,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};


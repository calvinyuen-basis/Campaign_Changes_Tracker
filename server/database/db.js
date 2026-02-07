import mysql from "mysql2/promise";
import odbc from "odbc";
import { rentdb1Config, ocientConfig } from "./dbConfig.js";

export const rentdb1 = mysql.createPool(rentdb1Config);

// // Build Ocient ODBC connection string with host and port
// const ocientConnectionString = `DSN=OcientDSN;UID=${ocientConfig.user};PWD=${ocientConfig.password};PORT=${ocientConfig.port};HOST=${ocientConfig.host};DATABASE=${ocientConfig.database}`;

// export async function getOcientConnection() {
// 	try {
// 		const connection = await odbc.connect(ocientConnectionString);
// 		return connection;
// 	} catch (err) {
// 		console.error("Failed to connect to Ocient via ODBC:", err.message);
// 		throw err;
// 	}
// }
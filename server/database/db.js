import mysql from "mysql2/promise";
import { rentdb1Config } from "./dbConfig.js";

let pool;
export async function getRentDB1Connection() {
  if (!pool) pool = mysql.createPool(rentdb1Config);
  return pool;
}

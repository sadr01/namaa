import mysql from "mysql2/promise"
import { query } from "./db.js"
import { tablesQueries } from "./createTablesQueries.js"

export const migration = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS namaa
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_persian_ci;`)
    console.log("Create Datebase!");

    await connection.end();

    for (const qry of tablesQueries) {
      try {
        await query(qry.query);
        console.log(`-->Create table <${qry.table}>`);
      } catch (err) {
        console.error(`-->Failed to create table <${qry.table}>:`, err.sqlMessage || err.message);
        break;
      }
    }
  } catch (err) {
    console.log("-->Error migration: ", err);
  }
};

migration()

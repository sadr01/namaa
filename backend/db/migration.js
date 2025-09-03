import mysql from "mysql2/promise"
import { query } from "./db.js"
import { tablesQueries } from "./createTablesQueries.js"

export const migration = async () => {
  try {
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

migration();

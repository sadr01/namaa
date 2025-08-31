import mysql from "mysql2/promise"
import dotenv from 'dotenv'
dotenv.config({ path: './.env', quiet: true });

export const pool = mysql.createPool({
  uri: process.env.DB_URI || "mysql://root:@localhost:3306/namaa",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  namedPlaceholders: true,
});

export const executeQuery = async (callback) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

export const query = async (queryText, params = {}) => {
  try {
    return await executeQuery(async (connection) => {
      const [result] = await connection.query(queryText, params)
      return result
    });
  } catch (err) {
    console.error(`--> DB Error in query:`, err);
    return null;
  }
}
import { pool } from "./db/db.js"
import { app } from "./app.js"
import dotenv from 'dotenv'
dotenv.config({ path: './.env', quiet: true });


const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("-> Database connected successfully.");
    connection.release();
    app.listen(process.env.PORT, () => {
      console.log(`-> Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("-> Error: Unable to connect to the database.", err);
  }
};
startServer();
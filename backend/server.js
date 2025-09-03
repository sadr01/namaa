import dotenv from 'dotenv';
dotenv.config();

const { pool } = await import("./db/db.js");
const { app } = await import("./app.js");

const startServer = async () => {
  const connection = await pool.getConnection();
  console.log("-> Database connected successfully.");
  connection.release();

  app.listen(process.env.PORT, () => {
    console.log(`-> Server running on port ${process.env.PORT}`);
  });
};

startServer();

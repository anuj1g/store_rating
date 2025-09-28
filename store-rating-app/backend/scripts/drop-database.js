require('dotenv').config();
const mysql = require('mysql2/promise');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function dropDatabase() {
  try {
    // Create connection to MySQL server
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    // Drop the database if it exists
    await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);
    console.log(`Database '${DB_NAME}' dropped successfully.`);
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error dropping database:', error);
    process.exit(1);
  }
}

dropDatabase();

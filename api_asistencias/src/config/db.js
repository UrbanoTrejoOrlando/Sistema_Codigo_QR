const mysql = require ("mysql2/promise");
const dotenv = require ("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'secundaria',
  password: 'secundaria0413',
  database: 'bd_clockin_limpia',
});

module.exports = pool;

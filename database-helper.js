const util = require('util')
const mysql = require('mysql')
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'cs101_ctf'
})

pool.getConnection((err, connection) => {
  if (err) throw new Error('Unable to connect to database!');
  if (connection) connection.release()
  return;
})

pool.query = util.promisify(pool.query)

module.exports = pool
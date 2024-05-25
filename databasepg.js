const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "root",
  port: 5432,
  database: "temp_db",
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
 

module.exports = client;

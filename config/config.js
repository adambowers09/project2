const Sequelize = require("sequelize");

// send config to .env to get the db connection variables
require("dotenv").config();

// use a variable that can be reassigned (ie let)
let sequelize;
// if statement to use Heroku JawsDB or local if not on Heroku
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW,
    {
      host: "localhost",
      // username: "root",
      // password: "password",
      // database: "project2_dev",
      dialect: "mysql",
      port: 3306,
    }
  );
}

module.exports = sequelize;
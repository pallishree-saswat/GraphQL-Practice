const Sequelize = require("sequelize");
const sequelize = new Sequelize("user-crud", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: true,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("db connceted");
  })
  .catch((e) => {
    console.log("error in db" + e);
  });


  module.exports = sequelize
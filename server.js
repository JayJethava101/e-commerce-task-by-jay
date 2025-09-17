const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const sequelize = require("./utils/db");

sequelize
  .authenticate()
  .then(() => {
    console.log("Database authenticated...");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

sequelize
  .sync({
    alter: true,
  })
  .then(() => {
    console.log("Database Connected...");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

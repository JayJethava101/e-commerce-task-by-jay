const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", require("./routes"));

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(error.status || 500).json({
    status: "error",
    message: error.message || "Something went wrong",
  });
});

module.exports = app;

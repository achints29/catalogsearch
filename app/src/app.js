const express = require("express");
const app = express();
const middleware = require("../src/routes");
app.use("/catalog", middleware);
app.get("/", (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send("Hello, World!");
});
module.exports = app;

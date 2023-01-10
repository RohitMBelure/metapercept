const express = require("express");
const { connection } = require("./Config/db");
const { userRouter } = require("./Routes/user.route");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("welcome to metapercept api");
});

app.use("/", userRouter);

app.listen(PORT, async (req, res) => {
  try {
    await connection;
    console.log("Connecting to db successful");
  } catch (err) {
    console.log("Error connectiong to db");
    console.log(err);
  }
  console.log(`Listening on PORT ${PORT}`);
});

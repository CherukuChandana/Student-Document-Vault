const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB CONNECTION ERROR: ", err);
  });

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use(morgan("dev"));
if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: `http://localhost:3000` }));
}
app.use(bodyParser.json());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/files", express.static("files"));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});

// if changes are made to .env file, then we need to restart the server by - npm start

/*
  Chandana - chandu
  Gayathri - gayathri
21B81A1214@cvr.ac.in
*/

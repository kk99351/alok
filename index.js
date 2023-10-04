const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = 8080;
const pdfMailer = require("./routes/PdfMailer");
const connectDB = require("./config/ConnectDB");

app.use(cors());
app.use(bodyParser.json());
app.use("/pdf", pdfMailer);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("db connection success!");
  } catch (err) {
    console.log("getting error", err);
  }
});

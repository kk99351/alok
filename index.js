const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8006;

const corsOptions = {
  origin: process.env.REACT_APP_DOMAIN_NAME,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

const cors = require("cors");
app.use(cors(corsOptions));

const pdfMailer = require("./routes/PdfMailer");
const connectDB = require("./config/ConnectDB");

app.use(bodyParser.json());
app.use("/pdf-mailer", pdfMailer);



app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("db connection success!");
  } catch (err) {
    console.log("getting error", err);
  }
});

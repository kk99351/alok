const express = require("express");
const app = express();

const cors = require('cors');

const allowedOrigins = ['http://localhost:3000', '*'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8006;
const pdfMailer = require("./routes/PdfMailer");
const connectDB = require("./config/ConnectDB");


app.use(bodyParser.json());
app.use("/", pdfMailer);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("db connection success!");
  } catch (err) {
    console.log("getting error", err);
  }
});

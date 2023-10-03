const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8006;

const cors = require("cors");

const corsOptions = {
  origin: "*", // Allow requests from all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specified HTTP methods
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept", // Allow specified headers
  optionsSuccessStatus: 204, // Set the response status for preflight requests
};

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

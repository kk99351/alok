const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./config/ConnectDB");
const bodyParser=require("body-parser");
const PdfMailer = require("./routes/PdfMailer");
const PORT = 8082;

app.use(cors());
app.use(bodyParser.json());
app.use("/pdf", PdfMailer);

app.get("/awt", async (req, res) => {
  res.send("hello everyone");
});

app.listen(PORT, async () => {
  console.log("app is running");
});

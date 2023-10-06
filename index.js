const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./config/ConnectDB");
const bodyParser=require("body-parser");
const PdfMailer = require("./routes/PdfMailer");


app.use(cors());
app.use(bodyParser.json());
app.use("/pdf", PdfMailer);

app.get("/awt", async (req, res) => {
  res.send("hello everyone");
});

app.listen(4000, async () => {
  console.log("app is running");
});
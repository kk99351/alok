const express = require("express");
const app = express();
require("./config/ConnectDB");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());

const pdfMailer = require("./routes/PdfMailer");

app.use(bodyParser.json());
app.use("/pdf", pdfMailer);

app.listen(8006, async () => {
  console.log("listening on port");
});

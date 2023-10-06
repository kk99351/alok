const express = require("express");
const app = express();
require("./config/ConnectDB");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3000
app.use(cors());

const pdfMailer = require("./routes/PdfMailer");

app.use(bodyParser.json());
app.use("/pdf", pdfMailer);

app.listen(port async () => {
  console.log("listening on port",port);
});

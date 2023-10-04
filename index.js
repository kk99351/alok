const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = 8081;
const pdfMailer = require("./routes/PdfMailer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const pdf = require("html-pdf");
const PdfTemplate = require("./helper/PdfTemplate");
const FormPdfmodel = require("./models/FormPdfmodel");
const connectDB = require("./config/ConnectDB");

app.use(cors());
app.use(bodyParser.json());
app.use("/", pdfMailer);

app.post('/pdf/pdf_veiw', async (req, res) => {
  
    const { name, phone, citizen, srcCountry, dstCountry, email, Type } = req.body;

    console.log("Request received:", name, phone, citizen, srcCountry, dstCountry, email);

    // Generate PDF
    const htmlContent = PdfTemplate(citizen, dstCountry, Type);
    const pdfOptions = {
      format: "Letter",
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    };

    const pdfPath = "generated.pdf"; // Path to save the generated PDF
    await new Promise((resolve, reject) => {
      pdf.create(htmlContent, pdfOptions).toFile(pdfPath, (err) => {
        if (err) {
          console.error("PDF generation error:", err);
          return reject(err);
        }
        resolve();
      });
    });

    // Read PDF file
    const pdfBytes = fs.readFileSync(pdfPath);

    //Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "eclecticatmsl23@gmail.com",
        pass: "okotejdvjinfjwff",
      },
      debug: true,
    });

    const mailOptions = {
      from: "eclecticatmsl23@gmail.com",
      to: email,
      subject: "Thank You for Submitting Your Visa Application Form",
      text: `Dear ${name},\n\n...`, // Your email content here
      attachments: [
        {
          filename: "generated.pdf",
          content: pdfBytes,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    
    const newUser = await FormPdfmodel.create({
      name,
      email,
      phone,
      citizen,
      srcCountry,
      dstCountry,
    });

    // Respond with success message
    res.status(200).json({ message: "Email sent successfully", user: newUser });
    
})

app.get('/awt', async (req, res) => {
  res.send("hello everyone")
})

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("db connection success!");
  } catch (err) {
    console.log("getting error", err);
  }
});

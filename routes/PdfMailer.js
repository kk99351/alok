const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const fs = require("fs");
const pdf = require("html-pdf");
const PdfTemplate = require("../helper/PdfTemplate");
const FormPdfmodel = require("../models/FormPdfmodel");

router.post("/", async (req, res) => {
  try {
    const { name, phone, citizen, srcCountry, dstCountry, email, Type } =
      req.body;
    console.log("ankit", name, phone, citizen, srcCountry, dstCountry, email);
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
    pdf
      .create(htmlContent, pdfOptions)
      .toFile("generated.pdf", (err, pdfPath) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to generate PDF" });
        }
        const pdfBytes = fs.readFileSync(pdfPath.filename);
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: "eclecticatmsl23@gmail.com",
            pass: "okotejdvjinfjwff",
          },
        });
        const mailOptions = {
          from: "eclecticatmsl23@gmail.com",
          to: email,
          subject: "Generated PDF",
          text: `<b>${name}</b>, Here is your generated PDF.`,
          attachments: [
            {
              filename: "generated.pdf",
              content: pdfBytes,
            },
          ],
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to send email" });
          }
        });
      });
    const newUser = await FormPdfmodel.create({
      name,
      email,
      phone,
      citizen,
      srcCountry,
      dstCountry,
    });

    res.status(200).json({ message: "Email sent successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

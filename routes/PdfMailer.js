const express = require("express");
const PdfMailer = express.Router();
const nodemailer = require("nodemailer");
const html_to_pdf = require("html-pdf-node");
const PdfTemplate = require("../helper/PdfTemplate");
const FormPdfmodel = require("../models/FormPdfmodel");
const fs = require("fs");

PdfMailer.post("/pdf-mailer", async (req, res) => {
  try {
    const { name, phone, citizen, srcCountry, dstCountry, email, Type } =
      req.body;

    console.log(
      "Request received:",
      name,
      phone,
      citizen,
      srcCountry,
      dstCountry,
      email
    );

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

    const pdfBytes = await new Promise((resolve, reject) => {
      html_to_pdf.generatePdf(
        { content: htmlContent },
        pdfOptions,
        (error, buffer) => {
          if (error) return reject(error);

          resolve(buffer);
        }
      );
    });

   

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
      text: `Dear`, // Your email content here
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
        res
          .status(200)
          .json({ message: "Email sent successfully", user: newUser })

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = PdfMailer;
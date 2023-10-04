const express = require("express");
const PdfMailer = express.Router();
const nodemailer = require("nodemailer");
const fs = require("fs");
const pdf = require("html-pdf");
const PdfTemplate = require("../helper/PdfTemplate");
const FormPdfmodel = require("../models/FormPdfmodel");

PdfMailer.post("/pdf-mailer", async (req, res) => {
  try {
    
    const { name, phone, citizen, srcCountry, dstCountry, email, Type } =
      req.body;
    console.log("harika", name, phone, citizen, srcCountry, dstCountry, email);
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
          debug: true,
        });
        const mailOptions = {
          from: "eclecticatmsl23@gmail.com",
          to: email,
          subject: "Thank You for Submitting Your Visa Application Form",
          text: ` Dear ${name},

We hope this message finds you well. We would like to express our gratitude for choosing World Visa Travel as your trusted partner in your visa application process. We understand that applying for a visa can be a complex and time-consuming task, and we appreciate the trust you have placed in us to assist you in this journey.

Your visa application form has been successfully received, and our team of experienced professionals is now diligently reviewing your information to ensure accuracy and completeness. We are committed to providing you with a smooth and efficient visa application process, and we will work tirelessly to facilitate your travel plans.

In the meantime, please find attached a confirmation of your submitted visa application form for your reference. This document serves as proof of your application submission.
If you have any questions or need further assistance regarding your application, please do not hesitate to contact our customer support team at support@worldvisatravel.com or by Telephone at 202-289-6251, 202-289-9295.
Attachment: Find the attachment below

Once again, thank you for choosing World Visa Travel. We look forward to helping you make your travel dreams a reality.

Safe travel!
Sincerely,

World Visa Travel
Customer Service Team
Email: support@worldvisatravel.com
Telephone: 202-289-6251, 202-289-9295`,
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

module.exports = PdfMailer;

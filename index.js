// app.js
const express = require("express");
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// Define your data
const userData = {
  
  name: "John Doe",
  content: "This is some sample content for the PDF.",
  // Add more data as needed
};

// Create a PDF using pdfkit
const PDFDocument = require("pdfkit");

app.get("/generate-pdf", (req, res) => {
  const doc = new PDFDocument();

  // Pipe the PDF content to the response
  doc.pipe(res);

  // Add content to the PDF
  doc.fontSize(20).text(`Name: ${userData.name}`, 100, 100);
  doc.fontSize(14).text(`Content: ${userData.content}`, 100, 150);

  // End the document
  doc.end();
});

// Set up Nodemailer to send the PDF via email
const nodemailer = require("nodemailer");

app.get("/send-email", async (req, res) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "eclecticatmsl23@gmail.com",
        pass: "okotejdvjinfjwff",
      },
    });

    // Define email options
    const mailOptions = {
      from: "eclecticatmsl23@gmail.com",
      to: "alokkumar11746@gmail.com",
      subject: "PDF Attachment",
      text: "Here is the PDF you requested.",
      attachments: [
        {
          filename: "output.pdf",
          path: "output.pdf",
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

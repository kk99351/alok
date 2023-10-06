const express = require('express');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

// Express route for generating and emailing the PDF
app.get('/generate-pdf-and-send-email', async (req, res) => {
  try {
    // Create a Puppeteer browser instance
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();

    // Generate your dynamic content and create a PDF
    await page.goto('https://example.com'); // Replace with your content URL
    const pdfBuffer = await page.pdf();

    // Close the Puppeteer browser
    await browser.close();

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "eclecticatmsl23@gmail.com",
        pass: "okotejdvjinfjwff",
      },
    });

    // Define email content
    const mailOptions = {
      from: 'eclecticatmsl23@gmail.com',
      to: 'alokkumar11746@gmail.com',
      subject: 'Dynamic PDF',
      text: 'Attached is the dynamic PDF.',
      attachments: [
        {
          filename: 'dynamic.pdf',
          content: pdfBuffer,
        },
      ],
    };

    // Send the email with the PDF attachment
    await transporter.sendMail(mailOptions);

    res.send('PDF generated and email sent successfully!');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while generating the PDF and sending the email.');
  }
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

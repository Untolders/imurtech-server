if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(cors({
  origin: ["https://imurtech.com"],
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));

app.use(bodyParser.json());

const port = process.env.PORT
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
});



app.post('/send-email', async (req, res) => {

    const { name, email, contactNumber, whatsapp, subject, queryType, message, recaptchaToken  } = req.body;
    
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Missing reCAPTCHA token' });
  }

  try {
      const captchaResponse = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify`,
          new URLSearchParams({
              secret: RECAPTCHA_SECRET,
              response: recaptchaToken,
          })
      );

      if (!captchaResponse.data.success) {
          return res.status(403).json({ error: 'reCAPTCHA verification failed' });
      }

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.RECEIVER_EMAIL,
        subject: `📩 New Inquiry: ${subject} - ${queryType}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center;">📩 New Contact Form Submission</h2>
          <hr style="border: 0; height: 1px; background: #ddd;">
          
          <p><strong>👤 Name:</strong> ${name}</p>
          <p><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
          <p><strong>📞 Contact Number:</strong> ${contactNumber}</p>
          <p><strong>📱 WhatsApp:</strong> <a href="https://wa.me/${whatsapp.replace(/\s+/g, '')}" style="color: #007bff;">${whatsapp}</a></p>
          <p><strong>📌 Query Type:</strong> ${queryType}</p>
          <p><strong>📜 Subject:</strong> ${subject}</p>
          
          <p><strong>📝 Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #007bff; font-style: italic;">${message}</blockquote>

          <hr style="border: 0; height: 1px; background: #ddd;">
          <p style="text-align: center; font-size: 12px; color: #777;">This email was sent from your website contact form.</p>
        </div>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('reCAPTCHA Error:', error);
    res.status(500).json({ error: 'Failed to verify reCAPTCHA' });
}
});

app.listen(port, () => console.log('Server running on port 5000'));

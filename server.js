const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS: allow only your website
app.use(cors({
  origin: 'https://your-chunchun-site.com'  // 🔁 Replace with your real domain
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for form submission
app.post('/join', upload.fields([
  { name: 'cv' },
  { name: 'cover-letter' },
  { name: 'publications' }
]), async (req, res) => {
  const { fullName, email, interest } = req.body;

  if (!req.body) {
    return res.status(400).json({ message: 'No form data received' });
  }

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,      // 👈 Set this in Render
      pass: process.env.EMAIL_PASS       // 👈 Set this in Render
    }
  });

  // Gather file attachments
  const attachments = [];

  if (req.files['cv']) {
    attachments.push({
      filename: req.files['cv'][0].originalname,
      content: req.files['cv'][0].buffer
    });
  }

  if (req.files['cover-letter']) {
    attachments.push({
      filename: req.files['cover-letter'][0].originalname,
      content: req.files['cover-letter'][0].buffer
    });
  }

  if (req.files['publications']) {
    attachments.push({
      filename: req.files['publications'][0].originalname,
      content: req.files['publications'][0].buffer
    });
  }

  const mailOptions = {
    from: `"Chunchun Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // You receive the emails
    subject: `New Join Submission from ${fullName}`,
    text: `Name: ${fullName}\nEmail: ${email}\nInterest:\n${interest}`,
    attachments: attachments
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'There was an error sending your application.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});

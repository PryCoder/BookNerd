const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',  // Or another email service
  auth: {
    user: 'priyanshugupta007007@gmail.com',  // Your email address
    pass: 'Priyanshu05134'   // Your email password (use app password if 2FA enabled)
  }
});

// Cloud Function to send welcome email
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const mailOptions = {
    from: 'priyanshugupta007007@gmail.com',
    to: user.email,
    subject: 'Welcome to Bookify!',
    html: `<p>Hello ${user.displayName || 'there'},</p>
           <p>Welcome to Bookify! We're excited to have you on board.</p>
           <p>Best Regards,<br>The Bookify Team</p>`
  };

  return transporter.sendMail(mailOptions)
    .then(() => console.log('Welcome email sent to:', user.email))
    .catch((error) => console.error('Error sending welcome email:', error));
});

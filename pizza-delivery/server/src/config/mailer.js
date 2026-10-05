import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  // Configured with standard SMTP credentials from environment
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Pizza Delivery" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
};
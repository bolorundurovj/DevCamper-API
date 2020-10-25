const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

const sendEmail = async (options) => {
  const transporter = await nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: htmlToText.fromString(options.message),
    html: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info);
};

module.exports = sendEmail;
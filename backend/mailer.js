const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (toEmail, otpCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Anime Hub - Mã xác nhận OTP',
    text: `Mã OTP của bạn là: ${otpCode}. Mã này có hiệu lực trong 10 phút.`
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
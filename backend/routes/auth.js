const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendOTP = require('../mailer');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
      email,
      password: hashedPassword,
      otp: otpCode,
      otpExpires: otpExpiration
    });

    await sendOTP(email, otpCode);

    res.status(200).json({ message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP.' });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    if (user.isVerified) return res.status(400).json({ error: 'Tài khoản đã được xác thực trước đó' });
    if (user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ error: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: 'Xác thực tài khoản thành công!' });
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
});

module.exports = router;
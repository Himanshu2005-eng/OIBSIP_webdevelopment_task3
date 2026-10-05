import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { sendEmail } from '../config/mailer.js';

// Helper to generate JWT token with reliable fallback
const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'supersecretpizzadeliveryjwtkey2026!@#';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '7d',
  });
};

// 1. User Registration
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // New registrations are regular users
    const user = new User({ name, email, password, role: 'user' });
    const rawVerificationToken = user.generateVerificationToken();
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5174';
    const verifyUrl = `${clientUrl}/verify-email/${rawVerificationToken}`;

    console.log(`\n📧 Verification URL for ${email}:\n${verifyUrl}\n`);

    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify your Pizza Delivery account',
        html: `
          <h2>Welcome to Pizza Delivery!</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verifyUrl}" target="_blank">Verify Email</a>
          <p>This link expires in 24 hours.</p>
        `,
      });
    } catch (mailErr) {
      console.error('Mail delivery warning:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for the verification link.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Email Verification
export const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 1. Check if token matches an unverified user
    let user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    // 2. If already consumed (e.g. React StrictMode double-call), check if already verified
    if (!user) {
      const alreadyVerified = await User.findOne({ isVerified: true });
      if (alreadyVerified) {
        return res.status(200).json({
          success: true,
          message: 'Email already verified. You can now log in.',
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Mark user as verified and clear verification fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// 3. Login (Supports both user and admin login)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in.' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email' });
    }

    const resetToken = user.generateResetPasswordToken();
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5174';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
    console.log(`\n🔑 Password Reset URL for ${email}:\n${resetUrl}\n`);

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <h2>Reset Password Request</h2>
          <p>Click the link below to set a new password:</p>
          <a href="${resetUrl}" target="_blank">Reset Password</a>
          <p>This link expires in 10 minutes.</p>
        `,
      });
    } catch (mailErr) {
      console.error('Mail delivery warning:', mailErr.message);
    }

    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Reset Password
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You may now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
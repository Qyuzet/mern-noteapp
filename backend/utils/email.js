// Temporary email utility (without nodemailer dependency)
// This is a simplified version for demonstration purposes

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate verification token
export const generateVerificationToken = () => {
  // Simple random string generator
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Mock email sending
export const sendEmail = async (options) => {
  console.log("Mock email sending:");
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Content: ${options.html.substring(0, 100)}...`);

  // In a real implementation, this would send an actual email
  return true;
};

// Send verification email
export const sendVerificationEmail = async (user, verificationUrl) => {
  const html = `
    <h1>Email Verification</h1>
    <p>Hello ${user.name},</p>
    <p>Please verify your email by clicking on the following link:</p>
    <a href="${verificationUrl}" target="_blank">Verify Email</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  console.log(`Mock verification email to ${user.email}`);
  console.log(`Verification URL: ${verificationUrl}`);

  // In a real implementation, this would send an actual email
  return true;
};

// Send OTP verification email
export const sendOTPVerificationEmail = async (user, otp) => {
  const html = `
    <h1>Email Verification</h1>
    <p>Hello ${user.name},</p>
    <p>Your verification code is:</p>
    <h2>${otp}</h2>
    <p>This code will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  console.log(`Mock OTP email to ${user.email}`);
  console.log(`OTP: ${otp}`);

  // In a real implementation, this would send an actual email
  return true;
};

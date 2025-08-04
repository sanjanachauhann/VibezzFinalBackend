// generateOtp.js
const crypto = require("crypto");
const SECRET = process.env.OTP_SECRET;

exports.generateOtpPayload = (phone) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const timestamp = Date.now();
  const data = `${phone}.${otp}.${timestamp}`;
  const hash = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return { otp, hash: `${hash}.${timestamp}` };
};

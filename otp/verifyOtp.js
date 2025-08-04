// verifyOtp.js
const crypto = require("crypto");
const SECRET = process.env.OTP_SECRET;

exports.verifyOtp = (phone, otp, hashWithTimestamp) => {
  const [hash, timestamp] = hashWithTimestamp.split(".");
  const now = Date.now();

  if (now - parseInt(timestamp) > 5 * 60 * 1000) {
    return { success: false, message: "OTP expired" };
  }

  const data = `${phone}.${otp}.${timestamp}`;
  const expectedHash = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("hex");

  if (expectedHash === hash) {
    return { success: true };
  } else {
    return { success: false, message: "Invalid OTP" };
  }
};

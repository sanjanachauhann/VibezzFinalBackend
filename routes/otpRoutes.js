const express = require("express");
const router = express.Router();
const { generateOtpPayload } = require("../otp/generateOtp");
const { sendOtpViaSMS } = require("../otp/sendOtp");
const { verifyOtp } = require("../otp/verifyOtp");

router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const { otp, hash } = generateOtpPayload(phone);
  try {
    await sendOtpViaSMS(phone, otp);
    return res.json({ hash, phone });
  } catch (err) {
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { phone, otp, hash } = req.body;
  const result = verifyOtp(phone, otp, hash);
  if (result.success) return res.json({ verified: true });
  return res.status(401).json({ verified: false, message: result.message });
});

module.exports = router;

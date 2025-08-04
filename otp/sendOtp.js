// sendOtp.js
const axios = require("axios");

exports.sendOtpViaSMS = async (phone, otp) => {
  const payload = {
    route: "otp", // or "dlt" if required
    sender_id: "FSTSMS", // your approved sender ID
    message: process.env.FAST2SMS_TEMPLATE_ID, // this is your DLT template ID
    variables_values: otp, // this is the actual OTP that replaces #var#
    numbers: phone,
  };

  await axios.post("https://www.fast2sms.com/dev/bulkV2", payload, {
    headers: {
      authorization: process.env.FAST2SMS_API_KEY,
      "Content-Type": "application/json",
    },
  });
};

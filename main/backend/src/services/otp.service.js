import nodemailer from "nodemailer";

const otpStore = new Map();

export async function sendOtp(userKey, keyType, ttlMs = 2 * 60 * 1000) {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + ttlMs;

  otpStore.set(userKey, { otp, expiresAt });

  setTimeout(() => otpStore.delete(userKey), ttlMs);

  if (keyType === "phone") {
    // await sendSms(userKey, otp);
  } else if (keyType === "email") {
    await sendEmail(userKey, otp);
  }
}

export function verifyOtp(userKey, otp) {
  const entry = otpStore.get(userKey);
  if (!entry) return false;

  const { otp: storedOtp, expiresAt } = entry;
  if (Date.now() > expiresAt) {
    otpStore.delete(userKey);
    return false;
  }

  const isValid = storedOtp === otp;
  if (isValid) otpStore.delete(userKey);
  return isValid;
}

async function sendEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  console.log("Reciever: " + to + " OTP : " + otp);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
  });
  console.log(`Email OTP sent to ${to}`);
}

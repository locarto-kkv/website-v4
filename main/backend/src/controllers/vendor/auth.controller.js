import bcrypt from "bcryptjs";
import logger from "../../lib/logger.js";
import { OAuth2Client } from "google-auth-library";
import { env } from "../../lib/env.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

import db from "../../lib/db.js";
import { generateToken } from "../../lib/utils.js";
import { sendOtp, verifyOtp } from "../../services/otp.service.js";

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = env.GOOGLE_VENDOR_REDIRECT_URI;
const FRONTEND_URL = env.FRONTEND_URL;

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

export const sendVerification = async (req, res) => {
  try {
    const { email = null, phone: phone_no = null } = req.body;

    if (email) {
      sendOtp(email, "email");
      res.status(200).json({ message: `OTP Sent to ${email}` });
    } else if (phone_no) {
      sendOtp(phone_no, "phone");
      res.status(200).json({ message: `OTP Sent to ${phone_no}` });
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "sendVerification",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { email = null, phone_no = null, otp } = req.body;

    const isValid = verifyOtp(email || phone_no, otp);

    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    const { data: user, error } = await db
      .from("vendors")
      .insert({ email, phone_no, status: "pending" })
      .select()
      .single();

    if (error) return res.status(400).json({ message: "User already exists" });

    generateToken(user.id, "vendor", res);
    res.status(201).json({ id: user.id, type: "vendor" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "signup",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const {
      email = null,
      phone_no = null,
      password = null,
      otp = null,
    } = req.body;

    if (!email && !phone_no) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data: user, error } = email
      ? await db.from("vendors").select().eq("email", email).limit(1).single()
      : await db
          .from("vendors")
          .select()
          .eq("phone_no", phone_no)
          .limit(1)
          .single();

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (otp) {
      const isValid = verifyOtp(email || phone_no, otp);
      if (!isValid) return res.status(400).json({ message: "Invalid OTP" });
    } else if (password) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken(user.id, "vendor", res);

    res.status(200).json({ id: user.id, type: "vendor" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "login",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "logout",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginGoogle = async (req, res) => {
  try {
    const { code = null } = req.query;

    if (!code) {
      const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["openid", "email", "profile"],
      });

      return res.redirect(url);
    }

    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userData = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
    };

    const { data: existingUser } = await db
      .from("vendors")
      .select()
      .eq("email", userData.email)
      .single();

    if (existingUser) {
      generateToken(existingUser.id, "vendor", res);
      return res.redirect(FRONTEND_URL + "/vendor/dashboard");
    }

    const { data: newUser, error } = await db
      .from("vendors")
      .insert({
        email: userData.email,
        name: userData.name,
      })
      .select()
      .single();

    if (error) {
      logger({
        level: "error",
        message: error.message,
        location: __filename,
        func: "loginGoogle",
      });

      return res.status(400).json({ message: "Signup failed" });
    }

    generateToken(newUser.id, "vendor", res);

    res.redirect(FRONTEND_URL + "/vendor/dashboard");
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "loginGoogle",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

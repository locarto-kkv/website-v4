import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

import db from "../../lib/db.js";
import { generateToken } from "../../lib/utils.js";
import { sendOtp, verifyOtp } from "../../services/consumer/otp.service.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

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
      return res.status(200).json({ message: `OTP Sent to ${email}` });
    } else if (phone_no) {
      sendOtp(phone_no, "phone");
      return res.status(200).json({ message: `OTP Sent to ${phone_no}` });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { email = null, phone_no = null, otp } = req.body;

    const isValid = verifyOtp(email || phone_no, otp);

    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    const { data: user, error } = await db
      .from("consumers")
      .insert({ email, phone_no })
      .select()
      .single();

    if (error) return res.status(400).json({ message: "User already exists" });

    generateToken(user.id, "consumer", res);

    return res.status(201).json({ id: user.id, type: "consumer" });
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
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
      ? await db.from("consumers").select().eq("email", email).limit(1).single()
      : await db
          .from("consumers")
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

    generateToken(user.id, "consumer", res);

    res.status(200).json({ id: user.id, type: "consumer" });
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginGoogle = async (req, res) => {
  try {
    console.log("Google");

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
      .from("consumers")
      .select()
      .eq("email", userData.email)
      .limit(1)
      .single();

    if (existingUser) {
      generateToken(existingUser.id, "consumer", res);
      console.log("User Logged In");

      return res.redirect(FRONTEND_URL + "/dashboard");
    }

    const { data: newUser, error } = await db
      .from("consumers")
      .insert({ email: userData.email, name: userData.name })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: "Signup failed" });
    }
    console.log("User Signed Up");

    generateToken(newUser.id, "consumer", res);
    return res.redirect(FRONTEND_URL + "/dashboard");
  } catch (error) {
    console.error("Error in loginGoogle controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

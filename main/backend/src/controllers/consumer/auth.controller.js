import bcrypt from "bcryptjs";
// passport-google-oauth2
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

import db from "../../lib/db.js";
import { generateToken } from "../../lib/utils.js";
import { sendOtp, verifyOtp } from "../../services/consumer/otp.service.js";

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

    return res.status(201).json({ user, type: "consumer" });
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { loginType } = req.body;

    if (loginType === "login-google") {
      const redirectUrl =
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${GOOGLE_REDIRECT_URI}` +
        `&response_type=code` +
        `&scope=openid%20email%20profile`;

      res.redirect(redirectUrl);
      return;
    }

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

    res.status(200).json({ user, type: "consumer" });
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginGoogle = (req, res) => {
  console.log("login-google controller");
  res.send("Google login callback received.");

  const code = req.query.code;

  // try {
  //   // Step 3: Exchange code for access token
  //   const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
  //     params: {
  //       code,
  //       client_id: GOOGLE_CLIENT_ID,
  //       client_secret: GOOGLE_CLIENT_SECRET,
  //       redirect_uri: GOOGLE_REDIRECT_URI,
  //       grant_type: 'authorization_code',
  //     },
  //   });

  //   const access_token = tokenResponse.data.access_token;

  //   // Step 4: Use token to get user info
  //   const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
  //     headers: { Authorization: `Bearer ${access_token}` },
  //   });

  //   const user = userInfoResponse.data;

  //   res.status(201).json(user);
  // } catch (error) {
  // console.log("Error in loginGoogle controller: ", error.message);
  // res.status(500).json({ message: "Internal Server Error" });
  // }
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

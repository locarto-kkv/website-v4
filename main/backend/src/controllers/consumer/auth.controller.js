import bcrypt from "bcryptjs";
// passport-google-oauth2
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

import db from "../../lib/db.js";
import { generateToken } from "../../lib/utils.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    const { data: user, error } = await db
      .from("consumers")
      .insert(newUser)
      .select()
      .single();

    if (error) return res.status(400).json({ message: "User already exists" });

    // fs.mkdirSync(`./uploads/documents/${user.id}`);

    generateToken(user.id, "consumer", res);

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
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

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data: user, error } = await db
      .from("consumers")
      .select()
      .eq("email", email)
      .limit(1)
      .single();

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    generateToken(user.id, "consumer", res);

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
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

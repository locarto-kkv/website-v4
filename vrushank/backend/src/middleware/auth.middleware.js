import jwt from "jsonwebtoken";

import db from "../lib/db.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // console.log(decoded);

    const { data: user, error } = await db
      .from(decoded.userType + "s")
      .select("id")
      .eq("id", decoded.userId)
      .single();

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    req.user = user;
    req.userType = decoded.userType;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

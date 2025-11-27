import jwt from "jsonwebtoken";
import db from "../lib/db.js";
import { exit } from "process";

export const protectRoute = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.jwt;

      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized - No Token Provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid Token" });
      }

      if (decoded.userType !== "admin") {
        if (!requiredRole) {
          exit;
        } else if (decoded.userType !== requiredRole) {
          return res.status(403).json({ message: "Unauthorized" });
        }
      }

      const { data: user, error } = await db
        .from(decoded.userType + "s")
        .select("id")
        .eq("id", decoded.userId)
        .single();

      if (!user || error) {
        return res.status(404).json({ message: "User Not Found" });
      }

      req.user = user;
      req.userType = decoded.userType;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ ...req.user, type: req.userType });
  } catch (error) {
    console.log("Error in checkAuth controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

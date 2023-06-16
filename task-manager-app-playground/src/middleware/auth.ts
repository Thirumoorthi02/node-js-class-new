import { NextFunction, Request, Response } from "express";
import { verifyAndSendDecodedToken } from "../encryption-tools/jwt";
import User from "../models/user";

export const auth = async (
  req: Request & { [key: string]: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const token = (req.header("Authorization") || "").replace("Bearer ", ""); //  to remove word Bearer from token
    const { _id } = verifyAndSendDecodedToken(token);
    const user = await User.findOne({ _id, "tokens.token": token });
    if (!user) {
      return res.status(401).send("Please Authenticate!");
    }
    req.user = user;
    req.token = token;
    next();
    // console.log(token); //
  } catch (error) {
    res.status(401).send("Please Authenticate!");
  }
};

export const adminAuth = async(req: any, res: Response, next: NextFunction) => {
  if (req.user?.admin) {
    return next();
  }

  res.status(401).send("Access Restricted.. Please Authenticate as admin!");
};

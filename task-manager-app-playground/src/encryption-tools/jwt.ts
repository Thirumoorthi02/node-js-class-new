import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
const secretOrPrivateKey: string = "MySecretKeyForJWT";

export const generateJWTAuthToken = (
  payload: string | object | Buffer
): string => {
  return jwt.sign(payload, secretOrPrivateKey, { expiresIn: "2 days" });
};

export const verifyAndSendDecodedToken = (token: string): { _id: string } => {
  return jwt.verify(token, secretOrPrivateKey) as (JwtPayload & { _id: string });
};

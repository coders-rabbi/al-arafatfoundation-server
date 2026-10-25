import jwt, { SignOptions } from "jsonwebtoken";

type TExpiresIn = NonNullable<SignOptions["expiresIn"]>;

export type TJwtPayload = {
  _id: string;
  adminName: string;
  email: string;
  role: string;
  profileImage: string;
};

export const createToken = (
  payload: TJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  const options: SignOptions = { expiresIn: expiresIn as TExpiresIn };
  return jwt.sign(payload, secret, options);
};
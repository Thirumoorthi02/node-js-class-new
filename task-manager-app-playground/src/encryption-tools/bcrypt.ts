import * as bcrypt from "bcrypt";

export const hashPassword = async (data: string | Buffer) => {
  return await bcrypt.hash(data, 8);
};

export const hashPasswordSync = (data: string | Buffer) => {
  return bcrypt.hashSync(data, 8);
};

export const validatePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

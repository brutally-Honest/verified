import bcrypt from "bcryptjs";
import chalk from "chalk";
import jwt from "jsonwebtoken";
const source = "->helpers";

export const generateEncryptedPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(
      chalk.bgRedBright(`Error in ${source}Password Generation - ${error}`)
    );
    throw error;
  }
};

export const checkPassword = async (
  actualPassword: string,
  enteredPassword: string
) => {
  try {
    const validPassword = await bcrypt.compare(enteredPassword, actualPassword);
    // console.log(validPassword);

    return validPassword;
  } catch (error) {
    console.log(
      chalk.bgRedBright(`Error in ${source}Password Comparision - ${error}`)
    );
    throw error;
  }
};

export const generateToken = (tokenData: { id: string; role: string }) => {
  const token = jwt.sign(tokenData, "gg", { expiresIn: "2d" });
  return token;
};

export const generateCode=()=>{
  const string =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let Code = "";
  for (let i = 0; i < 6; i++) {
    Code += string[Math.floor(Math.random() * string.length)];
  }
  return Code;
}
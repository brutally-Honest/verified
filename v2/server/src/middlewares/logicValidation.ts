import { User } from "../api/users/model.js";
import { Group } from "../api/groups/model.js";
import { NextFunction, Request, Response } from "express";
import { APIError } from "../utils/errors.js";
import { checkPassword } from "../utils/helpers.js";
const source = "logicValidation->";

export const registerValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, role, groupCode } = req.body;
    // Existing Email
    const exisitingUserEmail = await User.findOne({ email });
    if (exisitingUserEmail)
      return res.status(400).json({ message: "Account already registered" });
    // Invalid Group Code
    if (role === "member") {
      const group = await Group.findOne({ staus: "approved", groupCode });
      if (!group)
        return res.status(400).json({ message: "Invalid Group Code" });
      res.locals.groupId = group._id;
    }
    return next();
  } catch (error) {
    console.log(`${source} Logic Validation Failed`);
    next(error);
  }
};

export const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    // Email
    const existingUser = await User.findOne({ email }).lean();
    if (!existingUser)
      return res.status(404).json({ message: "Invalid Email/Password" });
    // Password
    const validUser = await checkPassword(
      existingUser.password as string,
      password
    );
    if (!validUser)
      return res.status(404).json({ message: "Invalid Email/Password" });
    res.locals.user = existingUser;
    return next();
  } catch (error) {
    console.log("Logic Validation Failed");
    next(error);
  }
};

export const groupValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
  } catch (error) {
    console.log("Logic Validation Failed");
    next(error);
  }
};

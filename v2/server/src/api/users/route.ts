import express from "express";
const router = express.Router();
import { User, UserDetails } from "./model.js";
import { registerSchema, loginSchema } from "./validations.js";
import { validate } from "../../middlewares/validate.js";
import {
  generateEncryptedPassword,
  generateToken,
} from "../../utils/helpers.js";
import {
  loginValidation,
  registerValidation,
} from "../../middlewares/logicValidation.js";
import { APIError } from "../../utils/errors.js";
const source = "userRoute";

router.post(
  "/register",
  validate(registerSchema),
  registerValidation,
  async (req, res, next) => {
    try {
      const { name, email, password, phoneNumber, role } = req.body;
      const usersCount = await User.countDocuments();
      const user = new User({
        name,
        email,
        password: await generateEncryptedPassword(password),
        phoneNumber,
        role,
      });

      if (usersCount === 0) user.role = "admin";
      await user.save();
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      if (!user) return res.status(500).json({message:"Account Creation Failed!"});

      if (user.role === "admin") {
        res.status(201).json({
          message: "User Successfully created!",
          data: userWithoutPassword,
        });
      } else if (user.role === "groupAdmin") {
        const userDetails = new UserDetails({
          userId: user._id,
        });
        await userDetails.save();
        res.status(201).json({
          message: "Account Successfully created!",
          data: userWithoutPassword,
        });
      } else if (user.role === "member") {
        const userDetails = new UserDetails({
          userId: user._id,
          applyingTo: res.locals?.groupId,
        });
        await userDetails.save();
        res.status(201).json({
          message: "Account Successfully created!",
          data: userWithoutPassword,
        });
      }
    } catch (error) {
      next(new APIError(500, "Internal Server Error", source));
    }
  }
);
router.post(
  "/login",
  validate(loginSchema),
  loginValidation,
  async (req, res, next) => {
    try {
      const user = res.locals?.user;
      if (!user)
        next(
          new APIError(500, "Internal Server Error - User Not Found", source)
        );

      const tokenData: { id: string; role: string } = {
        id: user._id,
        role: user.role,
      };
      const token = generateToken(tokenData);
      if (!token) next(new APIError(500, "Token Generation Failed", source));

      res.status(200).json({ message: "Logged In Successfully!", data: token });
    } catch (error) {
      next(new APIError(500, "Internal Server Error", source));
    }
  }
);


export default router;

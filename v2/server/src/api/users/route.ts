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
      const uCount = await User.countDocuments();
      const uDCount=await UserDetails.countDocuments()
      const user = new User({
        name,
        email,
        password: await generateEncryptedPassword(password),
        phoneNumber,
      });
      
      
      const userDetails=new UserDetails({role})
      if (uCount === 0 && uDCount===0) userDetails.role = "admin";
      
      if (!user||!userDetails) return res.status(500).json({message:"Account Creation Failed!"});
      
      if (userDetails.role === "admin" || userDetails.role==="groupAdmin") {
        await user.save();
        if(userDetails.role==="admin") userDetails.status="approved"
        userDetails.userId=user._id
        await userDetails.save()
        const userWithoutPassword=await userDetails.populate({path:"userId",select:"-password",model:"User"})
        res.status(201).json({
          message: "User Successfully created!",
          data: userWithoutPassword,
        });
      } else if (userDetails.role === "member") {
        userDetails.applyingTo=res.locals?.groupId
        await user.save();
        userDetails.userId=user._id
        await userDetails.save();
        const userWithoutPassword=await userDetails.populate({path:"userId",select:"-password",model:"User"})
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
        const userDetails = await UserDetails.findOne({ userId: user._id });
        if (!userDetails)
          return res.status(404).json({ message: "User not Found" });
        const tokenData: { id: string; role: string } = {
          id: userDetails._id.toString(),
          role: userDetails.role as string,
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

import { AnyZodObject, z,ZodEffects,ZodError } from "zod";
import { Request, Response, NextFunction} from 'express';

export const validate =
  (schema: AnyZodObject| ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result=await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // console.log({result});
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(error.errors);
      }
      next(error);
      // return res.status(400).json(error);
    }
  };

  const emailSchema=z
  .string({ required_error: "Email is required" })
  .email("Invalid email")

  const passwordSchemaRegister=z
  .string({ required_error: "Password is required" })
  .refine(
    (value) => {
      return value.length >= 8;
    },
    {
      message: "Minimum 8 characters required!",
    }
  )

  const passwordSchemaLogin=z
  .string({ required_error: "Password is required" })
  //User Schema
  export const registerSchema = z.object({
    body: z.object({
      name: z.string({
        required_error: "User Name is required",
        message: "User Name cannot be empty",
      }),
      email: emailSchema,
      password: passwordSchemaRegister,
      phoneNumber: z
        .number({ required_error: "Phone Number is required" })
        .refine(
          (value) => {
            return value.toString().length === 10;
          },
          {
            message: "Please enter your 10 digit Phone Number",
          }
        ),
      role: z.enum(["groupAdmin", "member"],{message:"Invalid Role"}),
      groupCode:z.string().optional()
    }),
  }).refine(data=>{
    if(data?.body?.role=="member" && !data?.body?.groupCode ) return false
    return true
  },{message:"Group code is required",path:["groupCode"]})


  export const loginSchema = z.object({
    body: z.object({
      email: emailSchema,
      password: passwordSchemaLogin,
    }),
  })

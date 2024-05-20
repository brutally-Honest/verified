import { NextFunction, Request, Response } from "express";
import { AnyZodObject,ZodEffects,ZodError } from "zod";

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
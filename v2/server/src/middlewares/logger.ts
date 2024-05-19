import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

export const logger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(chalk.bgBlueBright.bold(`[REQUEST] : ${req.url} `));
  next();
};

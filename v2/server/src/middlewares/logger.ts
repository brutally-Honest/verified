import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

export const logger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(chalk.bgBlueBright(`[/${req.method}]`),":",chalk.bgWhiteBright.blackBright.bold(`${req.url}`));
  next();
};

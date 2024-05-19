import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { APIError } from "../utils/errors.js";

export const errorHandler = (
  error: APIError,
  req: Request,
  res: Response,
) => {
  console.log(
    chalk.bgRedBright(chalk.bold(`[ERROR]`)),
    `${error.name}\nSource: ${error.source} \nMessage: ${error.message}\nDetails: ${error.stack}`
  );
  res
    .status(error.status ? error.status : 500)
    .json({ message: error.message ? error.message : "Internal Server Error" });
};

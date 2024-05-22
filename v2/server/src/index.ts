import  "dotenv/config"
import express, { Application } from 'express'
import chalk from "chalk"
import {logger} from "./middlewares/logger.js"
import {ENVLIST,envs} from "./utils/envChecks.js"
import {configureDB} from "./config/db.js"
import Router from './router.js'
import { errorHandler } from "./middlewares/errorHandler.js"

ENVLIST()
const app:Application = express();
const PORT = envs.port || 3000;
configureDB()
app.use(express.json())
app.use('/v2',logger,Router,errorHandler)
app.listen(PORT, () => {
  console.log(`[PORT] :`,chalk.bgGreen(` ${PORT} `))
});

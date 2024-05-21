import { NextFunction, Request, Response } from "express"
import { APIError } from "../utils/errors.js"
import jwt from "jsonwebtoken";

const source="->auth"

export const authenticateUser=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token=req["headers"]["authorization"]
        if(!token) return res.status(400).json({message:"JWT missing!"})
        const tokenData=jwt.verify(token,"gg");
        res.locals.user=tokenData
        next()
        
    }catch(error){
        const err = error as Error;
        const authError=new APIError(401,err.name,source)
        next(authError)
    }
}
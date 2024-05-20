import { z } from "zod";
import {  isValidObjectId } from "mongoose";

//Group Schema
const unitSchema=z.object({
    unitNumber:z.number({required_error:"Unit Number is required", message: "Unit Number cannot be empty",}),
    blockName:z.string({
        required_error: "Block Name is required",
        message: "Block Name cannot be empty",
      }),
})
export const groupSchema=z.object({
    body:z.object({
        name:z.string({
            required_error: "Group Name is required",
            message: "Group Name cannot be empty",
          }),
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
        admin:z.string({required_error:"Group Admin Id is required",message: "Group Admin cannot be empty"}).refine((gId)=>{
            const result=isValidObjectId(gId);
            return result
        },{message:"Invalid Object Id"}),
        units:z.array(unitSchema).refine((units) => {
            const unitsByBlock: Record<string, Set<number>> = {};
          
            for (const unit of units) {
              if (!unitsByBlock[unit.blockName]) {
                unitsByBlock[unit.blockName] = new Set();
              }
              if (unitsByBlock[unit.blockName].has(unit.unitNumber)) {
                return false;
              }
              unitsByBlock[unit.blockName].add(unit.unitNumber);
            }
            return true;
          }, {
            message: "Unit Numbers must be unique within the same Block",
          }),
          address:z.string().optional()
    })
})
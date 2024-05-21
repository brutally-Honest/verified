import express from "express";
const router = express.Router();
import {  Group, Unit } from "./model.js";
import { generateCode } from "../../utils/helpers.js";
import { validate } from "../../middlewares/validate.js";
import { groupSchema } from "./validations.js";
import { groupValidation } from "../../middlewares/logicValidation.js";
import { UserDetails } from "../users/model.js";
import { authenticateUser } from "../../middlewares/auth.js";
const source = "->groupsRoute";

router.post("/create",authenticateUser,validate(groupSchema),groupValidation,async (req, res, next) => {
  try {
    const { name, phoneNumber, units,admin } = req.body;

    const group = new Group({
      name,
      phoneNumber,
      groupCode: generateCode(),
      admin
    });

    units.forEach(
      async (
        block: { blockName: string; unitNumber: number },
        index: number
      ) => {
        const blockName = block.blockName;
        const unitNumber = block.unitNumber;
        const unit = new Unit({
          blockName,
          unitNumber,
          group: group._id,
        });
        group.units.push({ unitId: unit._id, blockName, unitNumber });
        await unit.save();
      }
    );
    await group.save();
    if (!group)
      return res.status(500).json({ messsage: "Group Creation Failed" });

    res
      .status(201)
      .json({ message: "Group Created Successfully!", data: group });
  } catch (error) {
    console.log("GG");

    next(error);
  }
});

//validation
//admin only
router.put("/update-status/:gId",authenticateUser,async(req,res,next)=>{
  try{
    const {gId}=req.params
    const {status,userId}=req.body
    const group=await Group.findOneAndUpdate({_id:gId},{status}).lean()
    if(status==="approved") {
      const user=await UserDetails.findOneAndUpdate({_id:userId},{status}).lean()
      //send Mail to user regarding group status approved
    }
    res.status(200).json({message:"Group Status updated Successfully",data:group})
  }catch(error){
    console.log(source,error);
    
    next(error)
  }
})
export default router;

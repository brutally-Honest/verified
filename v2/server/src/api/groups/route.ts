import express from "express";
const router = express.Router();
import {  Group, Unit } from "./model.js";
import { generateCode } from "../../utils/helpers.js";
const source = "->groupsRoute";

//TODO  - Validation
router.post("/create", async (req, res, next) => {
  try {
    const { name, phoneNumber, units } = req.body;
    // const groupAdmin=res.locals.groupAdmin
    // if(!groupAdmin) return res.status(500).json({messsage:""})
    const group = new Group({
      name,
      phoneNumber,
      groupCode: generateCode(),
      // groupAdmin
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

export default router;

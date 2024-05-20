import express from "express";
const router = express.Router();
import {  Group, Unit } from "./model.js";
import { generateCode } from "../../utils/helpers.js";
import { validate } from "../../middlewares/validate.js";
import { groupSchema } from "./validations.js";
import { groupValidation } from "../../middlewares/logicValidation.js";
const source = "->groupsRoute";

router.post("/create",validate(groupSchema),groupValidation,async (req, res, next) => {
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

export default router;

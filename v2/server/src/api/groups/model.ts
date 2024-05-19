import mongoose from "mongoose";
const { Schema, model } = mongoose;

const groupSchema = new Schema(
  {
    name: String,
    phoneNumber: Number,
    groupCode: String,
    admin: { type: Schema.Types.ObjectId, ref: "UserDetails" },
    gaurd: { type: Schema.Types.ObjectId, ref: "UserDetails" },
    members: [
      {
        memberId: { type: Schema.Types.ObjectId, ref: "UserDetails" },
        _id: false,
      },
    ],
    units: [
      {
        unitNumber: Number,
        blockName: String,
        unitId: { type: Schema.Types.ObjectId, ref: "Unit" },
        _id: false,
      },
    ],
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    address: String,
  },
  { timestamps: true }
);

const unitSchema = new Schema(
  {
    unitNumber: Number,
    blockName: String,
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    members: [
      { memberId: { type: Schema.Types.ObjectId, ref: "User" }, _id: false },
    ],
    visitors:[{ visitorId:{ type: Schema.Types.ObjectId, ref: "Visitor" },_id:false}],
  },
  { timestamps: true }
);

export const Unit = model("Unit", unitSchema);
export const Group = model("Group", groupSchema);

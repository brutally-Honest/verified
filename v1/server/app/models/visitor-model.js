const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const visitorSchema = new Schema(
  {
    visitorName: String,
    visitorPhoneNumber: String,
    block: { type: Schema.Types.ObjectId, ref: "Block" },
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    visitorType: { type: Schema.Types.ObjectId, ref: "VisitorType" },
    visitorPhoto: String,
    approvedBy: Schema.Types.ObjectId,
    response: { type: Boolean, default: false },
    createdBy: { enum: ["Member", "Gaurd"], type: String },
    status: { enum: ["arrived", "expected"], type: String },
    key: String,
    otp: { data: String, expiresIn: Date },
    permission: Boolean,
  },
  { timestamps: true }
);

const Visitor = model("Visitor", visitorSchema);

module.exports = Visitor;

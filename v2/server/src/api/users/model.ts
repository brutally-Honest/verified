import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    phoneNumber: Number,
    email: String,
    password: String,
  },
  { timestamps: true }
);

const userDetailsSchema = new Schema(
  {
    role: { type: String, enum: ["admin", "groupAdmin", "member", "gaurd"] },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    property: { type: Schema.Types.ObjectId, ref: "Unit" },
    status: {
      type: String,
      enum: ["pending", "approved","rejected"],
      default: "pending",
    },
    applyingTo:{type: Schema.Types.ObjectId, ref: "Group"},
    payment: [
      {
        paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
export const UserDetails = model("UserDetails", userDetailsSchema);



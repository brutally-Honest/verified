const UserAuth = require("../models/userAuth-model");
const Group = require("../models/group-model");
const Block = require("../models/block-model");
const Unit = require("../models/unit-model");

const userAuthSchema = {
  userName: {
    notEmpty: { errorMessage: "Name should not be empty" },
  },
  email: {
    notEmpty: { errorMessage: "Email is required", bail: true },
    isEmail: { errorMessage: "Invalid Email format", bail: true },
    custom: {
      options: async (value) => {
        const user = await UserAuth.findOne({ email: value });
        if (!user) return true;
        throw new Error("Oops! Email already taken!");
      },
    },
  },
  password: {
    notEmpty: { errorMessage: "Password should not be empty", bail: true },
    isStrongPassword: {
      errorMessage:
        "Password is weak!",
      options: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
    },
  },
  userPhoneNumber: {
    notEmpty: { errorMessage: "Phone number should not be empty", bail: true },
    isInt: { errorMessage: "Phone Number must be 10 digit number", bail: true },
    isLength: {
      errorMessage: "Phone Number must be 10 digit number",
      options: { min: 10, max: 10 },
    },
  },
};

const memberRegisterationSchema = {
  userName: userAuthSchema.userName,
  userPhoneNumber: userAuthSchema.userPhoneNumber,
  email: userAuthSchema.email,
  password: userAuthSchema.password,
  groupCode: {
    notEmpty: { errorMessage: "Group Code is required", bail: true },
    custom: {
      options: async (value, { req }) => {
        const group = await Group.findOne({
          groupCode: value,
          status: "approved",
        });
        if (!group) throw new Error("Invalid Group Code!");
        else return true;
      },
    },
  },
};

const userLoginSchema = {
  email: {
    notEmpty: { errorMessage: "Email should not be empty", bail: true },
    isEmail: { errorMessage: "Invalid email format" },
  },
  password: { notEmpty: { errorMessage: "Password is required" } },
};

const userEditAccountSchema = {
  userName: userAuthSchema.userName,
  email: {
    notEmpty: { errorMessage: "Email is required", bail: true },
    isEmail: { errorMessage: "Invalid Email format", bail: true },
    custom: {
      options: async (value, { req }) => {
        const user = await UserAuth.findOne({ email: value });
        if (!user) return true;
        if (String(user._id) !== req.user.id)
          throw new Error("Account with this Email exists");
        else return true;
      },
    },
  },
  userPhoneNumber: userAuthSchema.userPhoneNumber,
};

const addGroupAdminUnitSchema = {
  group: {
    notEmpty: { errorMessage: "Group is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value, { req }) => {
        const group = await Group.findOne({
          _id: value,
          groupAdmin: req.body.groupAdmin,
          status:"approved"
        });
        if (!group) throw new Error("Group not found");
        else return true;
      },
      bail: { level: "request" },
    },
  },
  groupAdmin: {
    notEmpty: { errorMessage: "Group Admin is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
  },
  block: {
    notEmpty: { errorMessage: "Block details required", bail: true },
    isObject: { errorMessage: "Invalid Format" },
    custom: {
      options: async (value, { req }) => {
        const block = await Block.findOne({
          blockName: value.blockName,
          group: req.body.group,
        });
        if (!block) throw new Error("Invalid Block");
        else {
          const unit = await Unit.findOne({
            group: req.body.group,
            unitNumber: value.unitNumber,
            block: block._id,
          });
          if (!unit) throw new Error("Invalid Unit");
          else return true;
        }
      },
    },
  },
};

const gaurdRegisterationSchema = {
  userName: userAuthSchema.userName,
  email: userAuthSchema.email,
  password: userAuthSchema.password,
  userPhoneNumber: userAuthSchema.userPhoneNumber,
  group: {
    notEmpty: { errorMessage: "Group is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value) => {
        const group = await Group.findById(value);
        if (!group) throw new Error("Group not Found");
        else {
          if (group.gaurd) throw new Error("Group already has gaurd");
          else return true;
        }
      },
    },
  },
};

module.exports = {
  adminRegister: userAuthSchema,
  memberRegister: memberRegisterationSchema,
  login: userLoginSchema,
  gaurdRegister: gaurdRegisterationSchema,
  updateAccount: userEditAccountSchema,
  groupAdminUnit: addGroupAdminUnitSchema,
};

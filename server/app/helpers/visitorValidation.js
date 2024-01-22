const Visitor = require("../models/visitor-model");
const VisitorType = require("../models/visitorType-model");
const Group = require("../models/group-model");
const Block = require("../models/block-model");
const Unit = require("../models/unit-model");

const { adminRegister } = require("../helpers/userValidation");

const visitorTypeSchema = {
  type: {
    notEmpty: { errorMessage: "Type is required" },
    custom: {
      options: async (value) => {
        const type = await VisitorType.findOne({
          type: { $regex: value, $options: "i" },
        });
        if (type) throw new Error("Type Already Present");
        else return true;
      },
    },
  },
};

const newVisitorSchema = {
  visitorName: adminRegister.userName,
  visitorPhoneNumber: adminRegister.userPhoneNumber,
  group: {
    notEmpty: { errorMessage: "Group is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value) => {
        const group = await Group.findById(value);
        if (!group) throw new Error("Group not Found");
        return true;
      },
      bail: { level: "request" },
    },
  },
  block: {
    notEmpty: { errorMessage: "Block is required", bail: true },
    custom: {
      options: async (value, { req }) => {
        const block = await Block.findOne({
          _id: value,
          group: req.body.group,
        });
        if (!block) throw new Error("Invalid Block");
        return true;
      },
      bail: { level: "request" },
    },
  },
  unit: {
    notEmpty: { errorMessage: "Unit is required", bail: true },
    custom: {
      options: async (value, { req }) => {
        const unit = await Unit.findOne({
          _id: value,
          group: req.body.group,
        });
        if (!unit) throw new Error("Invalid Unit");
        else return true;
      },
      bail: { level: "request" },
    },
  },
  visitorType: {
    notEmpty: { errorMessage: "Type is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value) => {
        const type = await VisitorType.findById(value);
        if (!type) throw new Error("Visitor Type not Found");
      },
    },
  },
  visitorPhoto: {
    custom: {
      options: async (value, { req }) => {
        const visitor = await Visitor.findOne({
          visitorPhoneNumber: req.body.visitorPhoneNumber,
        });
        if (visitor) {
          req.user.visitorImage = visitor.visitorPhoto;
          return true;
        }
        if (!req.file) throw new Error("Image should be uploaded!");
        if (
          !(
            req.file.mimetype == "image/jpeg" ||
            req.file.mimetype == "image/png" ||
            req.file.mimetype == "image/jpg"
          )
        )
          throw new Error("Upload image in .jpg, .jpeg, or .png format");
        else return true;
      },
    },
  },
};

const visitorPermissionResponse = {
  permission: {
    notEmpty: { errorMessage: "permission is required", bail: true },
    isBoolean: { errorMessage: "Invalid Format" },
  },
  response: {
    notEmpty: { errorMessage: "Response is required", bail: true },
    isBoolean: { errorMessage: "Response must be boolean" },
  },
  approvedBy: {
    notEmpty: { errorMessage: "ApprovedBy is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
  },
  unit: {
    notEmpty: { errorMessage: "Unit is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId" },
  },
  visitorPhoneNumber: {
    notEmpty: { errorMessage: "Phone number should not be empty", bail: true },
    isInt: { errorMessage: "Phone Number must be 10 digit number", bail: true },
    isLength: {
      errorMessage: "Phone Number must be 10 digit number",
      options: { min: 10, max: 10 },
    },
    custom: {
      options: async (value, { req }) => {
        const visitor = await Visitor.findOne({
          visitorPhoneNumber: value,
          unit: req.body.unit,
        });
        if (!visitor) throw new Error("Visitor not Found");
        else return true;
      },
    },
  },
};

const newVisitorMemberSchema = {
  visitors: {
    isArray: {
      errorMessage: "Array containing visitors is required!",
      bail: true,
      options: { min: 1 },
    },
  },
  "visitors.*.visitorName": adminRegister.userName,
  "visitors.*.visitorPhoneNumber": adminRegister.userPhoneNumber,
  group: {
    notEmpty: { errorMessage: "Group is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value) => {
        const group = await Group.findById(value);
        if (!group) throw new Error("Group not Found");
        return true;
      },
      bail: { level: "request" },
    },
  },
  block: {
    notEmpty: { errorMessage: "Block is required", bail: true },
    custom: {
      options: async (value, { req }) => {
        const block = await Block.findOne({
          _id: value,
          group: req.body.group,
        });
        if (!block) throw new Error("Invalid Block");
        return true;
      },
      bail: { level: "request" },
    },
  },
  unit: {
    notEmpty: { errorMessage: "Unit is required", bail: true },
    custom: {
      options: async (value, { req }) => {
        const unit = await Unit.findOne({
          _id: value,
          group: req.body.group,
        });
        if (!unit) throw new Error("Invalid Unit");
        else return true;
      },
      bail: { level: "request" },
    },
  },
  visitorType: {
    notEmpty: { errorMessage: "Type is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value) => {
        const type = await VisitorType.findById(value);
        if (!type) throw new Error("Visitor Type not Found");
      },
    },
  },
  response: {
    notEmpty: { errorMessage: "Response is required", bail: true },
    isBoolean: { errorMessage: "Response must be boolean" },
  },
  permission: {
    notEmpty: { errorMessage: "permission is required", bail: true },
    isBoolean: { errorMessage: "Invalid Format" },
  },
};

const keyVerificationSchema = {
  key: {
    notEmpty: { errorMessage: "Key is required", bail: true },
    isLength: {
      options: {
        min: 6,
        max: 6,
        errorMessage: "Invalid Key Length!!",
      },
    },
  },
  group: {
    notEmpty: { errorMessage: "Group is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId" },
  },
  visitorPhoneNumber: {
    notEmpty: { errorMessage: "Visitor Phone Number is required", bail: true },
    isInt: { errorMessage: "Phone Number must be 10 digit number", bail: true },
    isLength: {
      errorMessage: "Phone Number must be 10 digit number",
      options: { min: 10, max: 10 },
    },
  },
  visitorId: {
    notEmpty: { errorMessage: "Visitor id is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value, { req }) => {
        const visitor = await Visitor.findOne({
          _id: value,
          visitorPhoneNumber: req.body.visitorPhoneNumber,
          group: req.body.group,
          status: "expected",
        });
        if (!visitor) throw new Error("Visitor not Found!");
        return true;
      },
    },
  },
};

const otpVerificationSchema = {
  otp: {
    notEmpty: { errorMessage: "OTP is required", bail: true },
    isLength: {
      options: {
        min: 6,
        max: 6,
        errorMessage: "Invalid Key Length!!",
      },
    },
  },
  visitorId: {
    notEmpty: { errorMessage: "Visitor id is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
  },
};
module.exports = {
  visitorTypeSchema,
  newVisitorSchema,
  visitorPermissionResponse,
  newVisitorMemberSchema,
  keyVerificationSchema,
  otpVerificationSchema,
};

const Group = require("../models/group-model");
const GroupAdmin = require("../models/groupAdmin-model");
const UserAuth = require("../models/userAuth-model");
const Unit = require("../models/unit-model");
const Block = require("../models/block-model");
const Member = require("../models/member-model");
const _=require('lodash')

const { gaurdRegister } = require("./userValidation");

const groupRegisterationSchema = {
  groupName: {
    notEmpty: { errorMessage: "Group Name is required", bail: true },
    isString: { errorMessage: "Group Name is must be String" },
    custom: {
      options: async (value) => {
        const group = await Group.findOne({ groupName: value });
        if (!group) return true;
        throw new Error("Group Name must be unique");
      },
      bail: { level: "request" },
    },
  },
  groupPhoneNumber: {
    notEmpty: { errorMessage: "Phone Number is required", bail: true },
    isInt: { errorMessage: "Phone Number must number", bail: true },
    isLength: {
      errorMessage: "Phone Number must be 10 digit number",
      options: { min: 10 },
    },
  },
  blocks: {
    notEmpty: { errorMessage: "Blocks is required", bail: true },
    isArray: {
      errorMessage: "Invalid format / Minimum 2 blocks required",
      options: { min: 2 },
    },
  },
  "blocks.*.blockName": {
    notEmpty: { errorMessage: "Block name is required" },
  },
  "blocks.*.blockUnits": {
    notEmpty: { errorMessage: "Block Units are required  ", bail: true },
    isArray: {
      errorMessage: "Invalid format / Minimum 3 units required ",
      options: { min: 3 },
    },
    custom: {
      options: (value) => {
        const filter = value.filter((e, i) => value.indexOf(e) !== i);
        if (filter.length !== 0) throw new Error("Units must be unique");
        else return true;
      },
    },
  },
  groupAdmin: {
    // UserAuthID is received here
    notEmpty: { errorMessage: "Group Admin is required  ", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value, { req }) => {
        const groupAdmin = await GroupAdmin.findById(value);
        if (!groupAdmin) throw new Error("Account not Found");
        if (groupAdmin.group) {
          throw new Error("Cant create two groups with same account");
        }
        return true;
      },
    },
  },
  // address: { notEmpty: { errorMessage: "Group Address is required" } },
};

const groupStatusChangeSchema = {
  group: {
    notEmpty: { errorMessage: "Group ID is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value) => {
        const group = await Group.findOne({ _id: value, status: "pending" });
        if (!group) throw new Error("Group not Found");
        else return true;
      },
    },
  },
  groupAdmin:{
    notEmpty: { errorMessage: "Group Admin is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom:{
      options:async(value)=>{
        const groupAdmin=await GroupAdmin.findById(value)
        if(!groupAdmin) throw new Error('GroupAdmin not Found')
        if(_.isEmpty(groupAdmin.payment)) throw new Error('Initial Payment not made!')
        else return true
      }
    }
  }

};

const gaurdRegisterationSchema = {
  userName: gaurdRegister.userName,
  email: gaurdRegister.email,
  password: gaurdRegister.password,
  userPhoneNumber: gaurdRegister.userPhoneNumber,
  groupAdmin: {
    notEmpty: { errorMessage: "Group Admin is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
  },
  group: {
    notEmpty: { errorMessage: "Group ID is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value, { req }) => {
        const group = await Group.findOne({
          _id: value,
          groupAdmin: req.body.groupAdmin,
          status: "approved",
        });
        if (!group) throw new Error("Group not Found");
        else {
          if (group.gaurd) throw new Error("Group already has Gaurd");
          return true;
        }
      },
    },
  },
};

const addMemberSchema = {
  email: {
    notEmpty: { errorMessage: "Email is required", bail: true },
    isEmail: { errorMessage: "Invalid Email Format" },
    custom: {
      options: async (value, { req }) => {
        const user = await UserAuth.findOne({ email: value, role: "user" });
        if (!user) {
          throw new Error("Email not found");
        } else {
          // req.userToBeAdded = user._id;
          return true;
        }
      },
      bail: { level: "request" },
    },
  },
  groupAdmin: {
    notEmpty: { errorMessage: "Group Admin is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
  },
  group: {
    notEmpty: { errorMessage: "Group is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value, { req }) => {
        const group = await Group.findOne({
          _id: value,
          groupAdmin: req.body.groupAdmin,
          status: "approved",
        });
        if (!group) throw new Error("Group not found");
        else return true;
      },
      bail: { level: "request" },
    },
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

const changeMemberStatusAndUpdateUnit = {
  group: {
    notEmpty: { errorMessage: "Group is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value, { req }) => {
        const group = await Group.findOne({
          _id: value,
          groupAdmin: req.body.groupAdmin,
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
    //to make sure only member's group admin can set member's unit
    custom: {
      options: async (value, { req }) => {
        const groupAdmin = await GroupAdmin.findOne({
          userAuthId: req.user.id,
          _id: value,
        });
        if (!groupAdmin) throw new Error("Cannot add members to other groups");
        else return true;
      },
    },
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

const changeMemberUnitSchema = {
  groupAdmin: addMemberSchema.groupAdmin,
  group: addMemberSchema.group,
  member: {
    notEmpty: { errorMessage: "Member is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value, { req }) => {
        const member = await Member.findOne({
          _id: value,
          group: req.body.group,
        });
        if (!member) throw new Error("Member not Found");
        else return true;
      },
      bail: { level: "request" },
    },
  },
  currentUnit: {
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
            "members.memberId": req.body.member,
          });
          if (!unit)
            throw new Error("Invalid Unit / Member doesnt belong to this unit");
          else return true;
        }
      },
      bail: { level: "request" },
    },
  },
  newUnit: {
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
          else {
            if (req.body.currentUnit.blockName === value.blockName) {
              if (req.body.currentUnit.unitNumber === value.unitNumber)
                throw new Error("Nothing to Change");
            }
            return true;
          }
        }
      },
    },
  },
};

const acceptMemberSchema={
  groupAdmin: {
    notEmpty: { errorMessage: "Group Admin is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
  },
  group: {
    notEmpty: { errorMessage: "Group is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value, { req }) => {
        const group = await Group.findOne({
          _id: value,
          groupAdmin: req.body.groupAdmin,
          members:{memberId:req.body.id}
        });
        if (!group) throw new Error("Group not Found");
      },
      bail: { level: "request" },
    },
  },
  id:{
    notEmpty:{errorMessage: "Member is required", bail: true},
    isMongoId: { errorMessage: "Invalid MongoId", bail: true }
  }
}

const approveMemberSchema = {
  groupAdmin: {
    notEmpty: { errorMessage: "Group Admin is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
  },
  group: {
    notEmpty: { errorMessage: "Group is required", bail: true },
    isMongoId: { errorMessage: "Invalid MongoId", bail: true },
    custom: {
      options: async (value, { req }) => {
        const group = await Group.findOne({
          _id: value,
          groupAdmin: req.body.groupAdmin,
        });
        if (!group) throw new Error("Group not Found");
      },
      bail: { level: "request" },
    },
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

module.exports = {
  groupRegisterationSchema,
  groupStatusChangeSchema,
  addMemberSchema,
  gaurdRegisterationSchema,
  changeMemberUnitSchema,
  changeMemberStatusAndUpdateUnit,
  approveMemberSchema,
  acceptMemberSchema
};

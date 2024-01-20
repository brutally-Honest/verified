const UserAuth = require("../models/userAuth-model");
const GroupAdmin = require("../models/groupAdmin-model");
const Gaurd = require("../models/gaurd-model");
const Group = require("../models/group-model");
const Member = require("../models/member-model");
const Block = require("../models/block-model");
const Unit = require("../models/unit-model");
const bcryptjs = require("bcryptjs");
const _ = require("lodash");

const groupsCltr = {};

function generateCode() {
  const string =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let Code = "";
  for (let i = 0; i < 6; i++) {
    Code += string[Math.floor(Math.random() * string.length)];
  }
  return Code;
} 

groupsCltr.register = async (req, res) => {
  const body = _.pick(req.body, [
    "groupName",
    "groupPhoneNumber",
    "blocks",
    "groupAdmin",
  ]);
  try {
    //Creating new Group
    const group = new Group({
      groupName: body.groupName,
      groupPhoneNumber: body.groupPhoneNumber,
      groupCode: generateCode(), //new
      groupAdmin: body.groupAdmin,
    });
    //Creating Blocks for new Group
    body.blocks.forEach(async (block, index) => {
      const createdBlock = new Block({
        blockName: block.blockName,
        group: group._id,
      });
      group.blocks.push({ blockId: createdBlock._id });
      //Creating Units for Blocks of new Group
      block.blockUnits.forEach(async (e, i) => {
        const unit = new Unit({
          unitNumber: e,
          group: group._id,
          block: createdBlock._id,
        });
        createdBlock.units.push({ unitId: unit._id });
        await unit.save();
      });
      await createdBlock.save();
    });
    //Creating GroupAdmin instance
    await GroupAdmin.findByIdAndUpdate(
      body.groupAdmin,
      { group: group._id },
      { new: true }
    );
    if (req.user.role === "admin") {
      //admin created groups are auto approved
      group.status = "approved";
    }
    await group.save();
    await group.populate([
      {
        path: "groupAdmin",
        model: "GroupAdmin",
        populate: {
          path: "userAuthId",
          model: "UserAuth",
          select: "-password",
        },
      },
      {
        path: "blocks",
        model: "Block",
        select: { createdAt: 0, updatedAt: 0, __v: 0 },
        populate: {
          path: "blockId",
          model: "Block",
          select: { createdAt: 0, updatedAt: 0, __v: 0 },
          populate: {
            path: "units",
            model: "Unit",
            select: { createdAt: 0, updatedAt: 0, __v: 0 },
            populate: {
              path: "unitId",
              model: "Unit",
              select: { createdAt: 0, updatedAt: 0, __v: 0 },
            },
          },
        },
      },
    ]);
    res.status(201).json(group);
  } catch (e) {
    res.status(500).json(e);
  }
};

groupsCltr.myAccount = async (req, res) => {
  let user;
  try {
    const { role } = await UserAuth.findById(req.user.id);
    if (role === "groupAdmin") {
      user = await GroupAdmin.findOne({ userAuthId: req.user.id });
    } else if (role === "member") {
      user = await Member.findOne({ userAuthId: req.user.id });
    } else if (role === "gaurd") {
      user = await Gaurd.findOne({ userAuthId: req.user.id });
    }
    const group = await Group.findById(user.group, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    })
      .populate({
        path: "groupAdmin",
        model: "GroupAdmin",
        select: { createdAt: 0, updatedAt: 0, __v: 0 },
        populate: {
          path: "userAuthId",
          model: "UserAuth",
          select: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 },
        },
      })
      .populate({
        path: "members",
        model: "Member",
        populate: {
          path: "memberId",
          model: "Member",
          select: { createdAt: 0, updatedAt: 0, __v: 0 },
          populate: [
            {
              path: "userAuthId",
              model: "UserAuth",
              select: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 },
            },
            {
              path: "property",
              model: "Unit",
              select: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
                members: 0,
                visitors: 0,
              },
              populate: {
                path: "block",
                model: "Block",
                select: { blockName: 1 },
              },
            },
          ],
        },
      })
      .populate({
        path: "gaurd",
        model: "Gaurd",
        select: { createdAt: 0, updatedAt: 0, __v: 0 },
        populate: {
          path: "userAuthId",
          model: "UserAuth",
          select: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 },
        },
      })
      .populate({
        path: "blocks",
        model: "Block",
        populate: {
          path: "blockId",
          model: "Block",
          select: { createdAt: 0, updatedAt: 0, __v: 0 },
          populate: {
            path: "units",
            model: "Unit",
            select: { createdAt: 0, updatedAt: 0, __v: 0 },
            populate: {
              path: "unitId",
              model: "Unit",
              select: { createdAt: 0, updatedAt: 0, __v: 0 },
            },
          },
        },
      });
    res.json(group);
  } catch (e) {
    res.status(500).json(e);
  }
};

groupsCltr.all = async (req, res) => {
  try {
    const groups = await Group.find({}, { createdAt: 0, updatedAt: 0, __v: 0 })
      .populate({
        path: "groupAdmin",
        model: "GroupAdmin",
        select: { createdAt: 0, updatedAt: 0, __v: 0 },
        populate: {
          path: "userAuthId",
          model: "UserAuth",
          select: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 },
        },
      })
      .populate({
        path: "members",
        model: "Member",
        populate: {
          path: "memberId",
          model: "Member",
          select: { createdAt: 0, updatedAt: 0, __v: 0 },
          populate: [
            {
              path: "userAuthId",
              model: "UserAuth",
              select: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 },
            },
            {
              path: "property",
              model: "Unit",
              select: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
                members: 0,
                visitors: 0,
              },
            },
          ],
        },
      })
      .populate({
        path: "gaurd",
        model: "Gaurd",
        select: { createdAt: 0, updatedAt: 0, __v: 0 },
        populate: {
          path: "userAuthId",
          model: "UserAuth",
          select: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 },
        },
      })
      .populate({
        path: "blocks",
        model: "Block",
        populate: {
          path: "blockId",
          model: "Block",
          select: { createdAt: 0, updatedAt: 0, __v: 0 },
          populate: {
            path: "units",
            model: "Unit",
            select: { createdAt: 0, updatedAt: 0, __v: 0 },
            populate: {
              path: "unitId",
              model: "Unit",
              select: { createdAt: 0, updatedAt: 0, __v: 0 },
            },
          },
        },
      });
    res.json(groups);
  } catch (e) {
    res.status(500).json(e);
  }
};
//only for admin
groupsCltr.changeStatus = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.body.group,
      { status: "approved" },
      { new: true }
    );
    res.json(group);
  } catch (e) {
    res.status(500).json(e);
  }
};

groupsCltr.createGaurd = async (req, res) => {
  const body = _.pick(req.body, [
    "userName",
    "email",
    "password",
    "userPhoneNumber",
    "group",
  ]);
  body.role = "gaurd";
  try {
    const newUser = new UserAuth(body);
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(body.password, salt);
    newUser.password = hashedPassword;
    await newUser.save();
    const gaurd = new Gaurd({ group: body.group, userAuthId: newUser._id });
    await gaurd.save();
    await Group.findByIdAndUpdate(
      body.group,
      { gaurd: gaurd._id },
      { new: true }
    );
    await gaurd.populate({
      path: "userAuthId",
      model: "UserAuth",
      select: "-password",
    });
    res.json(gaurd);
  } catch (e) {
    res.status(500).json(e);
  }
};

groupsCltr.acceptMember=async(req,res)=>{
  try{
    const member=await Member.findByIdAndUpdate(req.body.id,{status:"Unit Pending"},{new:true})
    res.json(member)
  }catch(e){
    res.status(500).json(e)
  }
}


groupsCltr.approveMember = async (req, res) => {
  const body = _.pick(req.body, ["block", "group"]);
  const { id } = req.params;
  try {
    const unit = await Unit.findOneAndUpdate(
      { unitNumber: body.block.unitNumber, group: body.group },
      { $push: { members: { memberId: id } } },
      { new: true }
    );
    const member = await Member.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    res.json({ unit, member });
  } catch (e) {
    res.status(500).json(e);
  }
};


//experimental
groupsCltr.memberStatusAndUnit = async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["block"]);
  try {
    const unit = await Unit.findOneAndUpdate(
      { unitNumber: body.block.unitNumber },
      { $push: { members: { memberId: id } } },
      { new: true }
    );
    const member = await Member.findByIdAndUpdate(
      id,
      { status: "approved", property: unit._id },
      { new: true }
    ).populate([
      {
        path: "userAuthId",
        model: "UserAuth",
        select: "-password",
      },
      {
        path: "property",
        model: "Unit",
        select: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          members: 0,
          visitors: 0,
        },
      },
    ]);
    res.json(member);
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = groupsCltr;

const UserAuth = require("../models/userAuth-model");
const GroupAdmin = require("../models/groupAdmin-model");
const Gaurd = require("../models/gaurd-model");
const Member = require("../models/member-model");
const Group = require("../models/group-model");
const Unit = require("../models/unit-model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const usersCltr = {};

usersCltr.registerAdmin = async (req, res) => {
  const body = _.pick(req.body, [
    "email",
    "password",
    "userPhoneNumber",
    "userName",
  ]);
  body.role = "groupAdmin";
  try {
    const user = new UserAuth(body);
    const usersCount = await UserAuth.countDocuments();
    if (usersCount == 0) user.role = "admin";
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(user.password, salt);
    user.password = hashedPassword;
    await user.save();
    if (user.role === "admin") {
      res.status(201).json(user);
    } else {
      const groupAdmin = new GroupAdmin({
        userAuthId: user._id,
      });
      await groupAdmin.save();
      await groupAdmin.populate({
        path: "userAuthId",
        model: "UserAuth",
        select: "-password",
      });
      res.status(201).json(groupAdmin);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

usersCltr.registerMember = async (req, res) => {
  const body = _.pick(req.body, [
    "email",
    "password",
    "userPhoneNumber",
    "userName",
    "groupCode",
  ]);
  body.role = "member";
  try {
    const user = new UserAuth(body);
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(user.password, salt);
    user.password = hashedPassword;
    await user.save();
    const member = new Member({
      userAuthId: user._id,
    });
    const group = await Group.findOneAndUpdate(
      { groupCode: body.groupCode },
      { $push: { members: { memberId: member._id } } },
      { new: true }
    );
    member.group=group._id
    await member.save();
    await member.populate({
      path: "userAuthId",
      model: "UserAuth",
      select: "-password",
    });
    res.status(201).json( member);
  } catch (e) {
    res.status(500).json(e);
  }
};

usersCltr.login = async (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  try {
    const user = await UserAuth.findOne({ email: body.email });
    if (!user) return res.status(404).json("Invalid email/password");
    const compare = await bcryptjs.compare(body.password, user.password);
    if (!compare) return res.status(404).json("Invalid email/password");
    const tokenData = { id: user._id, role: user.role };
    const token = jwt.sign(tokenData, process.env.JWT_KEY, { expiresIn: "2d" });
    return res.json(token);
  } catch (e) {
    res.status(500).json(e);
  }
};

usersCltr.myAccount = async (req, res) => {
  let user;
  const select={
    password: 0,
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
  }
  const groupAdminAndMemberFields=[{
    path: "userAuthId",
    model: "UserAuth",
    select: { createdAt: 0, updatedAt: 0, __v: 0, password: 0 },
  },
  {
    path: "property",
    model: "Unit",
    select: { unitNumber: 1, block: 1 },
    populate: { path: "block", model: "Block", select: { blockName: 1 } },
  },]
  try {
    const { role } = await UserAuth.findById(req.user.id);
    if (role === "admin" ) {
      user = await UserAuth.findOne(
        { _id: req.user.id },
        select
      );
    } else if (role === "groupAdmin") {
      user = await GroupAdmin.findOne(
        { userAuthId: req.user.id },
        select
      ).populate(groupAdminAndMemberFields);
    } else if (role === "member") {
      user = await Member.findOne(
        { userAuthId: req.user.id },
        select
      ).populate(groupAdminAndMemberFields);
    } else if (role === "gaurd") {
      user = await Gaurd.findOne(
        { userAuthId: req.user.id },
        select
      ).populate("userAuthId", [
        "_id",
        "userName",
        "email",
        "userPhoneNumber",
        "role",
      ]);
    }
    res.json(user);
  } catch (e) {
    res.status(500).json(e);
  }
};

usersCltr.allUsers = async (req, res) => {
  const allUsers = {};
  try {
    const select={ createdAt: 0, updatedAt: 0, __v: 0 }
    const fields=["userAuthId",
    ["_id", "userName", "email", "userPhoneNumber"],
    "group",]
    allUsers.groupAdmins = await GroupAdmin.find(
      {},
      select
    ).populate(fields);
    allUsers.members = await Member.find(
      {},
      select
    ).populate(fields);
    allUsers.gaurds = await Gaurd.find(
      {},
      select
    ).populate(fields);
    res.json(allUsers);
  } catch (e) {
    res.status(500).json(e);
  }
};

usersCltr.edit = async (req, res) => {
  const body = _.pick(req.body, ["userName", "userPhoneNumber", "email"]);
  try {
    const user = await UserAuth.findOneAndUpdate({ _id: req.user.id }, body, {
      new: true,
    });
    res.json(user);
  } catch (e) {
    res.status(500).json(e);
  }
};

usersCltr.addGroupAdminUnit = async (req, res) => {
  const body = _.pick(req.body, ["block", "group", "groupAdmin"]);

  try {
    const unit = await Unit.findOneAndUpdate(
      { unitNumber: body.block.unitNumber, group: body.group },
      { $push: { members: { memberId: body.groupAdmin } } },
      { new: true }
    );
    const groupAdmin = await GroupAdmin.findByIdAndUpdate(
      body.groupAdmin,
      { property: unit._id },
      { new: true }
    ).populate([
      {
        path: "userAuthId",
        model: "UserAuth",
        select: { createdAt: 0, updatedAt: 0, __v: 0, password: 0 },
      },
      {
        path: "property",
        model: "Unit",
        select: { unitNumber: 1, block: 1 },
        populate: { path: "block", model: "Block", select: { blockName: 1 } },
      },
    ]);
    res.json(groupAdmin);
  } catch (e) {
    res.status(500).json(e);
  }
};

usersCltr.addMemberUnit=async(req,res)=>{
  const body= _.pick(req.body, ["block", "group"]);
  const {id}=req.params
  try {
    const unit = await Unit.findOne(
      { unitNumber: body.block.unitNumber, group: body.group }
    );
    const member = await Member.findByIdAndUpdate(
      id,
      { property: unit._id ,status:"Unit Pending"},
      { new: true }
    ).populate([
      {
        path: "userAuthId",
        model: "UserAuth",
        select: { createdAt: 0, updatedAt: 0, __v: 0, password: 0 },
      },
      {
        path: "property",
        model: "Unit",
        select: { unitNumber: 1, block: 1 },
        populate: { path: "block", model: "Block", select: { blockName: 1 } },
      },
    ]);
    res.json(member);
  } catch (e) {
    res.status(500).json(e);
  }
}

module.exports = usersCltr;

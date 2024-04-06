const VisitorType = require("../models/visitorType-model");
const Visitor = require("../models/visitor-model");
const _ = require("lodash");
const { getUrl,uploadImage } = require("../aws/s3");
const { sendSMS } = require("../twilio/sms");

const visitorsCltr = {};

function generate(data) {
  let string;
  if (data === "key")
  string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
if (data === "otp") string = "0123456789";
let OTP = "";
for (let i = 0; i < 6; i++) {
  OTP += string[Math.floor(Math.random() * string.length)];
}
  return OTP;
}

visitorsCltr.checkPhone = async (req, res) => {
  try {
    const ph = await Visitor.findOne({
      visitorPhoneNumber: req.params.vph,
      group:req.body.group
    });
    if (ph) {
        ph.visitorPhoto = await getUrl(ph.visitorPhoto);
        return res.json({
        visitorName: ph.visitorName,
        visitorPhoto: ph.visitorPhoto,
      });
    }
    return res.status(404).json("First Time Visitor");
  } catch (e) {
    res.status(500).json(e);
  }
};

visitorsCltr.getTypes = async (req, res) => {
  try {
    const types = await VisitorType.find(
      {},
      { createdAt: 0, __v: 0, updatedAt: 0 }
    );
    res.json(types);
  } catch (e) {
    res.status(500).json(e);
  }
};

visitorsCltr.newType = async (req, res) => {
  try {
    const type = new VisitorType({ type: req.body.type });
    await type.save();
    res.json(type);
  } catch (e) {
    res.status(500).json(e);
  }
};

visitorsCltr.newVisitor = async (req, res) => {
  const body = _.pick(req.body, [
    "visitorName",
    "visitorPhoneNumber",
    "block",
    "unit",
    "visitorType",
    "group",
  ]);
  // console.log(req.body,req.file);
  let imageName;
  if (!req.user.visitorImage) imageName = `${req.file.originalname}${Date.now()}`;
    
    try {
      if (!req.user.visitorImage) {
        await uploadImage(imageName,req.file.buffer,req.file.mimetype)
        delete req.user.visitorImage;
      }
      const visitor = new Visitor(body);
      visitor.visitorPhoto = imageName || req.user.visitorImage;
      visitor.status = "arrived";
      await visitor.save();
        visitor.visitorPhoto = await getUrl(visitor.visitorPhoto);
        res.json(visitor);
      } catch (e) {
        res.status(500).json(e);
      }
    };
    
    visitorsCltr.response = async (req, res) => {
      const body = _.pick(req.body, [
        "unit",
        "visitorPhoneNumber",
        "permission",
        "approvedBy",
      ]);
      try {
        const visitor = await Visitor.findOneAndUpdate(
      { unit: body.unit, visitorPhoneNumber: body.visitorPhoneNumber },
      {
        permission: body.permission,
        approvedBy: body.approvedBy,
        response: true,
      },
      { new: true }
    );
    //send image for this visitor
    res.json(visitor);
  } catch (e) {
    res.status(500).json(e);
  }
};

visitorsCltr.newVisitorMember = async (req, res) => {
  let expected = [];
  const body = _.pick(req.body, [
    "block",
    "unit",
    "visitorType",
    "permission",
    "approvedBy",
    "group",
    "visitors",
    "response",
  ]);
  try {
    body.visitors.forEach(async (newVisitor) => {
      const visitor = new Visitor({
        visitorName: newVisitor.visitorName,
        visitorPhoneNumber: newVisitor.visitorPhoneNumber,
        block: body.block,
        unit: body.unit,
        visitorType: body.visitorType,
        permission: body.permission,
        approvedBy: body.approvedBy,
        group: body.group,
        response: body.response,
      });
      visitor.status = "expected";
      visitor.key = generate("key");
      expected.push(visitor);
      await visitor.save();
    });
    res.json(expected);
  } catch (e) {
    res.status(500).json(e);
  }
};

visitorsCltr.verifyKey = async (req, res) => {
  const body = _.pick(req.body, ["key", "visitorId", "visitorPhoneNumber"]);
  try {
    const visitor = await Visitor.findOne({
      _id: body.visitorId,
      key: body.key,
      visitorPhoneNumber: body.visitorPhoneNumber,
    });
    if (!visitor) return res.status(400).json("!Invalid Key");
    // if (!visitor.otp)
    visitor.otp.data = generate("otp");
    visitor.otp.expiresIn = Date.now() + 1 * 60 * 1000;
    await visitor.save();
    const message = await sendSMS(visitor.otp.data);
    if(!message) throw new Error("Unable to send Message!!!")
    res.json(message);
  } catch (e) {
    res.status(500).json(e);
  }
};

visitorsCltr.verifyOtp = async (req, res) => {
  const body = _.pick(req.body, ["otp", "visitorId"]);
  try {
    const visitor = await Visitor.findOne({
      _id: body.visitorId,
    });
    if (!(Date.now() <= visitor.otp.expiresIn)) {
      // visitor.permission=false
      return res.json("OTP expired");
    }
    if (!(visitor.otp.data === body.otp)) return res.json("Invalid OTP!!");
    visitor.status = "arrived";
    
    await visitor.save();
    return res.json("OTP Verified");
  } catch (e) {
    res.status(500).json(e);
  }
};

visitorsCltr.myVisitors = async (req, res) => {
  try {
    // console.log(s3);
    const query = {
      unit: req.params.unit,
      status: "arrived",
    };
    const myVisitors = await Visitor.find(query)
    .limit(req.query.limit)
    .skip(req.query.skip)
    .sort({ createdAt: "desc" });
    const count = await Visitor.countDocuments(query);

    for (const myVisitor of myVisitors) {
      if (myVisitor.visitorPhoto) {
        myVisitor.visitorPhoto =  await getUrl(myVisitor.visitorPhoto);
      }
    }
    res.json({ myVisitors, total: count });
  } catch (e) {
    res.status(500).json(e);
  }
};

visitorsCltr.expectedVisitors = async (req, res) => {
  try {
    let ev;
    if (req.user.role === "gaurd") {
      ev = await Visitor.find({
        status: "expected",
        group: req.body.group,
      });
    } else {
      ev = await Visitor.find({
        status: "expected",
        group: req.body.group,
        unit: req.body.unit,
      });
    }
    res.json(ev);
  } catch (e) {
    res.status(500).json(e);
  }
};

visitorsCltr.visitorsToday = async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  try {
    const query = {
      createdAt: { $gte: todayStart, $lt: todayEnd },
      group: req.params.group,
      status: "arrived",
    };
    const visitors = await Visitor.find(query)
    .limit(req.query.limit)
    .skip(req.query.skip)
    .sort({ createdAt: "desc" });
    const count = await Visitor.countDocuments(query);
    for (const myVisitor of visitors) {
      if (myVisitor.visitorPhoto) {
          myVisitor.visitorPhoto = await getUrl(myVisitor.visitorPhoto);;
        }
      }
      
      res.json({ visitors, total: count });
    } catch (e) {
      res.status(500).json(e);
  }
};

module.exports = visitorsCltr;

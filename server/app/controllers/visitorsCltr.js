const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const VisitorType = require("../models/visitorType-model");
const Visitor = require("../models/visitor-model");
const _ = require("lodash");
const {
  TWILIO_SERVICE_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_ACCOUNT_SID,
  TWILIO_FROM,
  TWILIO_TO,
  S3_BUCKET_NAME,
  S3_BUCKET_REGION,
  S3_ACCESS_KEY,
  S3_SECRET_KEY,
} = process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const s3 = new S3Client({
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  region: S3_BUCKET_REGION,
});
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

visitorsCltr.checkPhone=async(req,res)=>{
  try{
    const ph=await Visitor.findOne({visitorPhoneNumber:req.params.vph})
    if(ph) return res.json(ph.visitorPhoto)
    return res.status(404).json("First Time Visitor")
  }catch(e){
    res.status(500).json(e)
  }
}

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
    // "image"
  ]);
//if (prevImage) then dont upload image
  // console.log(body);
  const imageName = `${req.file.originalname}${Date.now()}`;
  const putCommand = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  });

  try {
  //  if(!visitor)
   await s3.send(putCommand);
    const visitor = new Visitor(body);
    visitor.visitorPhoto = imageName;
    visitor.status = "arrived";
    await visitor.save();
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
    const msgOptions = {
      body: visitor.otp.data,
      // to: `+91${visitor.visitorPhoneNumber}`, // actuall visitor Number
      to: TWILIO_TO,
      from: TWILIO_FROM, // From a valid Twilio number
    };
    const message = await client.messages.create(msgOptions);
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
    const query={
      unit: req.params.unit,
      status: "arrived",
    }
    const myVisitors = await Visitor.find(query).limit(req.query.limit)
    .skip(req.query.skip).sort({createdAt:'desc'})
    const count=await Visitor.countDocuments(query)
    console.log("got my Visitors");
    for (const myVisitor of myVisitors) {
      if (myVisitor.visitorPhoto) {
        const getObjectParams = {
          Bucket: S3_BUCKET_NAME,
          Key: myVisitor.visitorPhoto,
        };
        const getCommand = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
        myVisitor.visitorPhoto = url;
      }
    }
    res.json({myVisitors,total:count});
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
      .sort({createdAt:'desc'})
    const count=await Visitor.countDocuments(query)
    for (const myVisitor of visitors) {
      if (myVisitor.visitorPhoto) {
        const getObjectParams = {
          Bucket: S3_BUCKET_NAME,
          Key: myVisitor.visitorPhoto,
        };
        const getCommand = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
        myVisitor.visitorPhoto = url;
      }
    }

    res.json({ visitors, total: count });
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = visitorsCltr;

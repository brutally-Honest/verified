const Notice = require("../models/notice-model");
const _=require('lodash')
const noticesCltr = {};

noticesCltr.create = async (req, res) => {
  const body = _.pick(req.body, ["group", "notice"]);
  try {
    const notice = new Notice(body);
    await notice.save();
    res.json(notice);
  } catch (e) {
    // res.status(500).json(e);
    next(e)
  }
};

noticesCltr.allNotices = async (req, res) => {
  try {
    const notices = await Notice.find({group:req.params.id});
    res.json(notices);
  } catch (e) {
    // res.status(500).json(e);
    next(e)
  }
};

module.exports = noticesCltr;

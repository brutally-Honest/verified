const Unit = require("../models/unit-model");

const unitsCltr = {};
//only for socket
unitsCltr.getMembers = async (id) => {
  try {
    const members = await Unit.findById(id)
    return members.members;
  } catch (e) {
    console.log(e);
  }
};

module.exports = unitsCltr;

const jwt = require("jsonwebtoken");
const UserAuth = require("../models/userAuth-model");
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const tokenData = jwt.verify(token, process.env.JWT_KEY);
    req.user = tokenData;
    next();
  } catch (e) {
    res.status(400).json(e);
  }
};
const authorizeUser=(roles)=>async(req,res,next)=>{
  try{
    const user =await UserAuth.findById(req.user.id)
    if(roles.includes(user.role)) next()
    else res.status(403).json({msg:"Access Forbidden",userRole:user.role})
  }
  catch(e){
    res.status(400).json(e);
  }
}

module.exports = {
  authenticateUser,
  authorizeUser
};

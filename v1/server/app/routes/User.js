const express=require("express")
const router= express.Router()
const { checkSchema } = require("express-validator");
const validate = require("../middlewares/validate");
const {authenticateUser,authorizeUser} = require("../middlewares/auth");
const {
  adminRegister,
  memberRegister,
  login,
  updateAccount,
  groupAdminUnit
} = require("../validations/userValidation");
const usersCltr = require("../controllers/usersCltr");

router.post("/register/groupAdmin",checkSchema(adminRegister),validate,usersCltr.registerAdmin);
router.post("/register/member",checkSchema(memberRegister),validate,usersCltr.registerMember);
router.post("/login",checkSchema(login),validate,usersCltr.login);
router.get("/account", authenticateUser, usersCltr.myAccount);
router.get("/all",authenticateUser,authorizeUser(["admin"]),usersCltr.allUsers);
router.put("/edit",authenticateUser,checkSchema(updateAccount),validate,usersCltr.edit)
router.post(
  "/groupAdmin/unit",
  authenticateUser,
  authorizeUser(["groupAdmin"]),
  checkSchema(groupAdminUnit),
  validate,
  usersCltr.addGroupAdminUnit
);
//
router.post(
  "/member/unit/:id",
  authenticateUser,
  authorizeUser(["member"]),
  // checkSchema(groupAdminUnit),
  // validate,
  usersCltr.addMemberUnit
);

module.exports=router
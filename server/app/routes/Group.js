const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const validate = require("../middlewares/validate");
const { authenticateUser, authorizeUser } = require("../middlewares/auth");
const {
  groupRegisterationSchema,
  groupStatusChangeSchema,
  gaurdRegisterationSchema,
  addMemberSchema,
  changeMemberUnitSchema,
  changeMemberStatusAndUpdateUnit,
  approveMemberSchema,
  acceptMemberSchema
} = require("../helpers/groupValidation");
const groupsCltr = require("../controllers/groupsCltr");

router.post(
  "/register",
  authenticateUser,
  authorizeUser(["admin", "groupAdmin"]),
  checkSchema(groupRegisterationSchema),
  validate,
  groupsCltr.register
);

router.get("/account", authenticateUser, groupsCltr.myAccount);
router.get("/all", authenticateUser, authorizeUser(["admin"]), groupsCltr.all);

router.put(
  "/status",
  authenticateUser,
  authorizeUser(["admin"]),
  checkSchema(groupStatusChangeSchema),
  validate,
  groupsCltr.changeStatus
);

router.post(
  "/createGaurd",
  authenticateUser,
  authorizeUser(["groupAdmin", "admin"]),
  checkSchema(gaurdRegisterationSchema),
  validate,
  groupsCltr.createGaurd
);

router.put(
  "/accept-member/",
  authenticateUser,
  authorizeUser(["groupAdmin"]),
  checkSchema(acceptMemberSchema),
  validate,
  groupsCltr.acceptMember
)
router.put(
  "/member/:id",
  authenticateUser,
  authorizeUser(["groupAdmin"]),
  checkSchema(approveMemberSchema),
  validate,
  groupsCltr.approveMember
)
/////////////////////////////////////////////////
router.put(
  "/memberUpdate/:id",
  authenticateUser,
  authorizeUser(["groupAdmin"]),
  checkSchema(changeMemberStatusAndUpdateUnit),
  validate,
  groupsCltr.memberStatusAndUnit
);


module.exports = router;

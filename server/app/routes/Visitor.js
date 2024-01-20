const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { checkSchema } = require("express-validator");
const validate = require("../middlewares/validate");
const { authenticateUser, authorizeUser } = require("../middlewares/auth");
const {
  visitorTypeSchema,
  newVisitorSchema,
  visitorPermissionResponse,
  newVisitorMemberSchema,
  keyVerificationSchema,
  otpVerificationSchema,
} = require("../helpers/visitorValidation");
const visitorsCltr = require("../controllers/visitorsCltr");

router.get("/types", authenticateUser, visitorsCltr.getTypes);
router.post(
  "/types/new",
  authenticateUser,
  authorizeUser(["admin"]),
  checkSchema(visitorTypeSchema),
  validate,
  visitorsCltr.newType
);

router.get(
  "/checkPhone/:vph",
  authenticateUser,
  authorizeUser(["gaurd"]),
  visitorsCltr.checkPhone
);

router.post(
  "/new",
  authenticateUser,
  authorizeUser(["gaurd"]),
  upload.single("visitorPhoto"),
  checkSchema(newVisitorSchema),
  validate,
  visitorsCltr.newVisitor
);

router.put(
  "/permission-response",
  authenticateUser,
  authorizeUser(["gaurd"]),
  checkSchema(visitorPermissionResponse),
  validate,
  visitorsCltr.response
);

router.post(
  "/new/member",
  authenticateUser,
  authorizeUser(["member", "groupAdmin"]),
  checkSchema(newVisitorMemberSchema),
  validate,
  visitorsCltr.newVisitorMember
);

router.put(
  "/verify-key",
  authenticateUser,
  authorizeUser(["gaurd"]),
  checkSchema(keyVerificationSchema),
  validate,
  visitorsCltr.verifyKey
);

router.post(
  "/verify-otp",
  authenticateUser,
  authorizeUser(["gaurd"]),
  checkSchema(otpVerificationSchema),
  validate,
  visitorsCltr.verifyOtp
);
//this is actually get with group in body
router.post(
  "/expected",
  authenticateUser,
  authorizeUser(["gaurd", "member", "groupAdmin"]),
  visitorsCltr.expectedVisitors
);

router.get(
  "/:group/today",
  authenticateUser,
  authorizeUser(["gaurd"]),
  visitorsCltr.visitorsToday
);

router.get(
  "/myVisitors/:unit",
  authenticateUser,
  authorizeUser(["groupAdmin", "member"]),
  visitorsCltr.myVisitors
);
module.exports = router;

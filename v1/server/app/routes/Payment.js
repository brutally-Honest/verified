const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const validate = require("../middlewares/validate");
const { authenticateUser, authorizeUser } = require("../middlewares/auth");
const paymentsCltr = require("../controllers/paymentsCltr");

router.post(
  "/stripe-subscription-session",
  authenticateUser,
  authorizeUser(["groupAdmin"]),
  paymentsCltr.create
);
router.get(
  "/all",
  authenticateUser,
  authorizeUser(["admin"]),
  paymentsCltr.all
);
router.get(
  "/myPayments/:id",
  authenticateUser,
  authorizeUser(["groupAdmin"]),
  paymentsCltr.myPayments
);
module.exports = router;

const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeUser } = require("../middlewares/auth");
const  statisticsCltr  = require("../controllers/statisticsCltr");

router.get(
  "/payments",
  authenticateUser,
  authorizeUser(["admin"]),
  statisticsCltr.paymentStats
);

module.exports = router;

const Payment = require("../models/payment-model");
const UserAuth = require("../models/userAuth-model");

const statisticsCltr = {};

statisticsCltr.paymentStats = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([{
        $group:{_id:null,total:{$sum:"$amount"}}
    }])
    const monthlyRevenue = await Payment.aggregate([
      {
        $group: {
          _id: {$month:"$createdAt"},
          monthlyRevenue:{$sum:"$amount"}
        },
      },
    ]);
    res.json({totalRevenue,monthlyRevenue})
  } catch (e) {
    res.status(500).json(e);
  }
};

statisticsCltr.userStats = async (req, res) => {
    try {
      const totalUsers = await UserAuth.countDocuments();
      const roleCount = await UserAuth.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]);
      res.json({totalUsers,roleCount})
    } catch (e) {
      res.status(500).json(e);
    }
  };

module.exports = statisticsCltr;

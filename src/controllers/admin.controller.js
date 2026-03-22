const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// ================= DASHBOARD =================
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      revenueResult,
      statusStats
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),

      Order.aggregate([
        { $match: { status: "DONE" } },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: { $add: ["$total", "$shippingFee"] }
            }
          }
        }
      ]),

      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const revenue = revenueResult[0]?.totalRevenue || 0;

    const statusMap = {
      PENDING: 0,
      CONFIRMED: 0,
      SHIPPING: 0,
      DONE: 0,
      CANCEL: 0
    };

    statusStats.forEach(item => {
      statusMap[item._id] = item.count;
    });

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      revenue,
      statusStats: statusMap
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= REVENUE BY DATE =================
exports.getRevenueByDate = async (req, res) => {
  try {
    const { month, year } = req.query;

    let match = { status: "DONE" };

    if (month && year) {
      match.createdAt = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      };
    }

    const data = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" }
          },
          revenue: {
            $sum: { $add: ["$total", "$shippingFee"] }
          }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    const result = data.map(item => ({
      date: `Day ${item._id.day}`,
      revenue: item.revenue
    }));

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= TOP PRODUCTS =================
exports.getTopProducts = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { status: "DONE" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= TOP USERS =================
exports.getTopUsers = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { status: "DONE" } },
      {
        $group: {
          _id: "$idUser",
          totalSpent: { $sum: "$total" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
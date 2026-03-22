const crypto = require("crypto");
const qs = require("qs");
const Order = require("../models/Order");

// =======================
// SORT PARAMS
// =======================
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();

  keys.forEach((key) => {
    sorted[key] = obj[key];
  });

  return sorted;
}

// =======================
// CREATE PAYMENT
// =======================
exports.createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      idUser: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order không tồn tại" });
    }

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    const date = new Date();
    const createDate = date
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);

    // ✅ FIX IP
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    if (ipAddr.includes(":")) {
      ipAddr = "127.0.0.1";
    }

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: order.total * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: order._id.toString(),
      vnp_OrderInfo: "Thanh toan don hang",
      vnp_OrderType: "other",
      vnp_Locale: "vn",
      vnp_ReturnUrl: returnUrl,
      vnp_CreateDate: createDate,
      vnp_IpAddr: ipAddr,
    };

    vnp_Params = sortObject(vnp_Params);

    // 🔥 DEBUG CREATE
    console.log("========== CREATE PAYMENT ==========");
    console.log("PARAMS:", vnp_Params);

    const signData = Object.keys(vnp_Params)
  .map(key => {
    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(vnp_Params[key]).replace(/%20/g, "+")
    );
  })
  .join("&");

    console.log("SIGN DATA:", signData);

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(signData).digest("hex");

    console.log("SIGNED:", signed);

    vnp_Params["vnp_SecureHash"] = signed;

   const paymentUrl =
  vnpUrl +
  "?" +
  Object.keys(vnp_Params)
    .map(key => `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, "+")}`)
    .join("&");

    console.log("PAYMENT URL:", paymentUrl);

    return res.json({ paymentUrl });

  } catch (error) {
    console.error("CREATE PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// RETURN
// =======================
exports.vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = { ...req.query };

    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    const secretKey = process.env.VNP_HASH_SECRET;

    // SORT
    vnp_Params = sortObject(vnp_Params);

    // 🔥 FIX CHUẨN VNPay (GIỐNG CREATE)
    const signData = Object.keys(vnp_Params)
      .map(key => {
        return (
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(vnp_Params[key]).replace(/%20/g, "+")
        );
      })
      .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(signData).digest("hex");

    console.log("========== RETURN FIXED ==========");
    console.log("SIGN DATA:", signData);
    console.log("VNPay Hash:", secureHash);
    console.log("Server Hash:", signed);

    if (secureHash !== signed) {
      console.log("❌ SIGNATURE MISMATCH");
      return res.send("Sai chữ ký");
    }

    console.log("✅ SIGNATURE OK");

    const orderId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];

    const order = await Order.findById(orderId);

    if (!order) {
      return res.send("Order not found");
    }

    if (responseCode === "00") {
      order.paymentStatus = "PAID";
      order.status = "CONFIRMED";
      await order.save();

      return res.redirect(
        `https://ecommerce-frontend-ckjq.onrender.com/success?orderId=${orderId}`
      );
    } else {
      return res.redirect("https://ecommerce-frontend-ckjq.onrender.com/fail");
    }

  } catch (error) {
    console.error("RETURN ERROR:", error);
    res.status(500).send("Server error");
  }
};

exports.recreatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      idUser: req.user._id,
    });

    if (!order) return res.status(404).json({ message: "Order không tồn tại" });

    if (order.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Đơn đã thanh toán" });
    }

    // Tạo link VNPay mới giống createPayment
    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    const date = new Date();
    const createDate = date.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);

    let ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    if (ipAddr.includes(":")) ipAddr = "127.0.0.1";

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: order.total * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: order._id.toString(),
      vnp_OrderInfo: "Thanh toan don hang",
      vnp_OrderType: "other",
      vnp_Locale: "vn",
      vnp_ReturnUrl: returnUrl,
      vnp_CreateDate: createDate,
      vnp_IpAddr: ipAddr,
    };

    vnp_Params = sortObject(vnp_Params);

    const signData = Object.keys(vnp_Params)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(vnp_Params[key]).replace(/%20/g, "+"))
      .join("&");

    const hmac = require("crypto").createHmac("sha512", secretKey);
    const signed = hmac.update(signData).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;

    const paymentUrl = vnpUrl + "?" + Object.keys(vnp_Params)
      .map(key => `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, "+")}`)
      .join("&");

    return res.json({ paymentUrl });

  } catch (error) {
    console.error("RECREATE PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
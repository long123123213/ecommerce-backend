const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const ProductVariant = require("../models/ProductVariant");

async function autoCancelPendingOrders(minutes = 5) {
  try {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - minutes * 60 * 1000);

    // Tìm tất cả order PENDING > cutoffTime và phương thức VNPay
    const orders = await Order.find({
      status: "PENDING",
      createdAt: { $lte: cutoffTime },
      shippingMethod: "VNPAY"
    });

    for (const order of orders) {
      // Hoàn lại stock
      const items = await OrderItem.find({ idOrder: order._id });
      for (const item of items) {
        const variant = await ProductVariant.findById(item.idProductVariant);
        if (variant) {
          variant.stock += item.quantity;
          await variant.save();
        }
      }

      // Update status order
      order.status = "CANCEL";
      await order.save();

      console.log(`[AUTO-CANCEL] Order ${order._id} đã bị hủy sau ${minutes} phút.`);
    }
  } catch (error) {
    console.error("Auto-cancel orders error:", error);
  }
}

module.exports = autoCancelPendingOrders;
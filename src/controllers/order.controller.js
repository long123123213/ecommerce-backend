const Order=require("../models/Order");
const OrderItem=require("../models/OrderItem");
const Cart=require("../models/Cart");
const CartItem=require("../models/CartItem");
const ProductVariant=require("../models/ProductVariant");

//Create order
async function createOrder(req, res) {
  try {

    const {
      receiverName,
      phone,
      addressLine,
      ward,
      district,
      city,
      shippingMethod,
      shippingFee = 0
    } = req.body;

    // 1️⃣ Lấy cart
    const cart = await Cart.findOne({ idUser: req.user._id });

    if (!cart) {
      return res.status(400).json({
        message: "Giỏ hàng trống"
      });
    }

    // 2️⃣ Lấy cart items
    const cartItems = await CartItem.find({ idCart: cart._id })
      .populate("idProductVariant");

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Giỏ hàng trống"
      });
    }

    // 3️⃣ CHECK TỒN KHO
    for (const item of cartItems) {

      const variant = item.idProductVariant;

      if (!variant) {
        return res.status(400).json({
          message: "Sản phẩm không tồn tại"
        });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm không đủ tồn kho`
        });
      }

    }

    // 4️⃣ TÍNH TỔNG TIỀN
    let subTotal = 0;

    for (const item of cartItems) {
      subTotal += item.idProductVariant.price * item.quantity;
    }

    const total = subTotal + shippingFee;

    // 5️⃣ TẠO ORDER
    const order = await Order.create({
      idUser: req.user._id,
      receiverName,
      phone,
      addressLine,
      ward,
      district,
      city,
      shippingMethod,
      shippingFee,
      total,
      status: "PENDING"
    });

    // 6️⃣ TẠO ORDER ITEMS + TRỪ KHO
    for (const item of cartItems) {

      const variant = item.idProductVariant;

      await OrderItem.create({
        idOrder: order._id,
        idProductVariant: variant._id,
        quantity: item.quantity,
        price: variant.price
      });

      // trừ kho
      variant.stock -= item.quantity;
      await variant.save();

    }

    // 7️⃣ XÓA GIỎ HÀNG
    await CartItem.deleteMany({ idCart: cart._id });

    // 8️⃣ RESPONSE
    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
}

//Get my order
async function getMyOrders(req,res){
try{

const orders = await Order.find({
  idUser: req.user._id
})
.sort({createdAt:-1})
.lean();

for(const order of orders){

  const items = await OrderItem.find({
    idOrder: order._id
  })
  .populate({
    path:"idProductVariant",
    populate:{
      path:"idProduct"
    }
  });

  order.items = items;

}

res.json(orders);

}catch(error){
res.status(500).json({message:error.message});
}
};

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const idOrder = req.params.id;

     // Tìm và update
    const updateData = { status };

    // Nếu đổi sang DONE thì auto cập nhật paymentStatus
    if (status === "DONE") {
      updateData.paymentStatus = "PAID";
    }
    
    const order = await Order.findByIdAndUpdate(
      idOrder,
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      message: "Cập nhật trạng thái thành công",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function cancelOrder(req, res) {
  try {
    const idOrder = req.params.id;

    const order = await Order.findOne({
      _id: idOrder,
      idUser: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({
        message: "Không thể hủy đơn này",
      });
    }

    // 🔥 Hoàn lại stock
    const items = await OrderItem.find({ idOrder: order._id });

    for (const item of items) {
      const variant = await ProductVariant.findById(item.idProductVariant);
      if (variant) {
        variant.stock += item.quantity;
        await variant.save();
      }
    }

    order.status = "CANCEL";
    await order.save();

    res.json({
      message: "Đã hủy đơn hàng",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getAllOrders(req,res){
try{

const orders=await Order.find()
.sort({createdAt:-1})
.populate("idUser","name email")
.lean();

for(const order of orders){

const items=await OrderItem.find({
idOrder:order._id
})
.populate({
path:"idProductVariant",
populate:{
path:"idProduct"
}
});

order.items=items;

}

res.json(orders);

}catch(error){
res.status(500).json({message:error.message});
}
}
module.exports={createOrder,getMyOrders,updateOrderStatus,cancelOrder,getAllOrders};
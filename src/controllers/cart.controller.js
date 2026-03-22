const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");

// =====================
// GET CART
// =====================
async function getCart(req, res) {
  let cart = await Cart.findOne({ idUser: req.user._id });

  if (!cart) {
    cart = await Cart.create({ idUser: req.user._id });
  }

  const items = await CartItem.find({ idCart: cart._id })
    .populate("idProductVariant");

  res.json({ cart, items });
}

// =====================
// ADD TO CART
// =====================
async function addToCart(req, res) {
  const { idProductVariant, quantity } = req.body;

  let cart = await Cart.findOne({ idUser: req.user._id });

  if (!cart) {
    cart = await Cart.create({ idUser: req.user._id });
  }

  let item = await CartItem.findOne({
    idCart: cart._id,
    idProductVariant,
  });

  if (item) {
    item.quantity += quantity;
    await item.save();
  } else {
    item = await CartItem.create({
      idCart: cart._id,
      idProductVariant,
      quantity,
    });
  }

  res.json(item);
}

// =====================
// UPDATE CART ITEM
// =====================
async function updateCartItem(req, res) {
  const { idItem, quantity } = req.body;

  const item = await CartItem.findById(idItem);

  if (!item) {
    return res.status(404).json({ message: "Item không tồn tại" });
  }

  item.quantity = quantity;
  await item.save();

  res.json(item);
}

// =====================
// REMOVE ITEM
// =====================
async function removeCartItem(req, res) {
  const item = await CartItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Item không tồn tại" });
  }

  await item.deleteOne();

  res.json({ message: "Đã xóa sản phẩm khỏi giỏ" });
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
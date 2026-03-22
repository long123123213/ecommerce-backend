const ProductVariant = require("../models/ProductVariant");
const Product = require("../models/Product");

// CREATE
async function createVariant(req, res) {
  try {
    const { idProduct, size, color, price, stock } = req.body;

    // check product tồn tại
    const product = await Product.findById(idProduct);
    if (!product) {
      return res.status(404).json({ message: "Product không tồn tại" });
    }

    // check duplicate
    const existed = await ProductVariant.findOne({
      idProduct,
      size,
      color,
    });

    if (existed) {
      return res.status(400).json({ message: "Variant đã tồn tại" });
    }

    const variant = await ProductVariant.create({
      idProduct,
      size,
      color,
      price,
      stock,
    });

    res.status(201).json(variant);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate variant" });
    }

    res.status(500).json({ message: error.message });
  }
}

// UPDATE
async function updateVariant(req, res) {
  try {
    const variant = await ProductVariant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!variant) {
      return res.status(404).json({ message: "Không tìm thấy variant" });
    }

    res.json(variant);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE
async function deleteVariant(req, res) {
  try {
    const variant = await ProductVariant.findByIdAndDelete(req.params.id);

    if (!variant) {
      return res.status(404).json({ message: "Không tìm thấy variant" });
    }

    res.json({ message: "Xóa variant thành công" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createVariant,
  updateVariant,
  deleteVariant,
};
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const slugify = require("slugify");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

// ==============================
// CREATE PRODUCT
// ==============================
async function createProduct(req, res) {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Phải có ít nhất 1 ảnh" });
    }

    const imagePaths = req.files.map(file => file.path);

    // slug unique
    let slug = slugify(req.body.nameProduct, {
      lower: true,
      strict: true
    });

    let exist = await Product.findOne({ slug });

    while (exist) {
      slug = slug + "-" + Math.floor(Math.random() * 10000);
      exist = await Product.findOne({ slug });
    }

    // parse tags an toàn
    let selectedTags = [];
    let customTags = [];

    try {
      if (req.body.selectedTags) {
        selectedTags = JSON.parse(req.body.selectedTags);
      }
    } catch {
      return res.status(400).json({ message: "selectedTags không hợp lệ" });
    }

    try {
      if (req.body.customTags) {
        customTags = JSON.parse(req.body.customTags);
      }
    } catch {
      return res.status(400).json({ message: "customTags không hợp lệ" });
    }

    const product = await Product.create({
      nameProduct: req.body.nameProduct,
      description: req.body.description,
      idCategory: req.body.idCategory,
      slug,
      images: imagePaths,
      selectedTags,
      customTags
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ==============================
// GET PRODUCTS (FILTER + PAGINATION)
// ==============================
async function getProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40;
    const skip = (page - 1) * limit;

    const { size, color, category, price, sort, search } = req.query;

    let priceMatch = {};

    if (price === "0-200") priceMatch = { $lte: 200000 };
    if (price === "200-400") priceMatch = { $gt: 200000, $lte: 400000 };
    if (price === "400-600") priceMatch = { $gt: 400000, $lte: 600000 };
    if (price === "600+") priceMatch = { $gt: 600000 };

    const pipeline = [
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "idProduct",
          as: "variants"
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "idCategory",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $addFields: {
          category: { $arrayElemAt: ["$category", 0] },
          minPrice: { $min: "$variants.price" },
          totalStock: { $sum: "$variants.stock" }
        }
      }
    ];

    // search
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { nameProduct: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    // filter
    if (size) {
      pipeline.push({
        $match: { variants: { $elemMatch: { size } } }
      });
    }

    if (color) {
      pipeline.push({
        $match: { variants: { $elemMatch: { color } } }
      });
    }

    if (Object.keys(priceMatch).length > 0) {
      pipeline.push({
        $match: { minPrice: priceMatch }
      });
    }

    if (category) {
      pipeline.push({
        $match: { "category.nameCategory": category }
      });
    }

    // sort
    if (sort === "price_asc") pipeline.push({ $sort: { minPrice: 1 } });
    if (sort === "price_desc") pipeline.push({ $sort: { minPrice: -1 } });

    // count
    const totalResult = await Product.aggregate([...pipeline, { $count: "total" }]);
    const total = totalResult[0]?.total || 0;

    // pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const products = await Product.aggregate(pipeline);

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ==============================
// GET BY CATEGORY
// ==============================
async function getProductsByCategory(req, res) {
  try {
    const products = await Product.find({
      idCategory: req.params.categoryId
    }).populate("idCategory");

    if (products.length === 0) {
      return res.json({ message: "Không có sản phẩm" });
    }

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ==============================
// UPDATE PRODUCT
// ==============================
async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // images
    const newImages = req.files?.map(f => f.path) || [];

    let oldImages = product.images;

    try {
      if (req.body.oldImages) {
        oldImages = JSON.parse(req.body.oldImages);
      }
    } catch {
      return res.status(400).json({ message: "oldImages không hợp lệ" });
    }

    const finalImages = [...oldImages, ...newImages];

    if (finalImages.length === 0) {
      return res.status(400).json({ message: "Phải có ít nhất 1 ảnh" });
    }

    // slug
    let slug = product.slug;

    if (req.body.nameProduct) {
      slug = slugify(req.body.nameProduct, {
        lower: true,
        strict: true
      });

      let exist = await Product.findOne({ slug });

      while (exist && exist._id.toString() !== req.params.id) {
        slug = slug + "-" + Math.floor(Math.random() * 10000);
        exist = await Product.findOne({ slug });
      }
    }

    // parse tags
    let selectedTags = [];
    let customTags = [];

    try {
      if (req.body.selectedTags) {
        selectedTags = JSON.parse(req.body.selectedTags);
      }
    } catch {
      return res.status(400).json({ message: "selectedTags không hợp lệ" });
    }

    try {
      if (req.body.customTags) {
        customTags = JSON.parse(req.body.customTags);
      }
    } catch {
      return res.status(400).json({ message: "customTags không hợp lệ" });
    }

    const updateData = {
      nameProduct: req.body.nameProduct,
      description: req.body.description,
      idCategory: req.body.idCategory,
      slug,
      images: finalImages,
      selectedTags,
      customTags
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ==============================
// GET PRODUCT BY ID OR SLUG
// ==============================
async function getProductByParam(req, res) {
  try {
    const { param } = req.params;

    let product;

    if (mongoose.Types.ObjectId.isValid(param)) {
      product = await Product.findById(param).populate("idCategory");
    }

    if (!product) {
      product = await Product.findOne({ slug: param }).populate("idCategory");
    }

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const variants = await ProductVariant.find({
      idProduct: product._id
    });

    res.json({ product, variants });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ==============================
// DELETE PRODUCT
// ==============================
async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // delete cloudinary images
    for (let img of product.images) {
      const publicId = img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await Product.findByIdAndDelete(req.params.id);
    await ProductVariant.deleteMany({ idProduct: req.params.id });

    res.json({ message: "Xóa sản phẩm thành công" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ==============================
// GET FILTER OPTIONS
// ==============================
async function getFilters(req, res) {
  try {
    const sizes = await ProductVariant.distinct("size");
    const colors = await ProductVariant.distinct("color");

    const categories = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "idCategory",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.nameCategory"
        }
      }
    ]);

    res.json({
      sizes: sizes.filter(Boolean),
      colors: colors.filter(Boolean),
      categories: categories.map(c => c._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  getProductByParam,
  getFilters
};
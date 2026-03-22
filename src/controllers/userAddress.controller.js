const UserAddress = require("../models/UserAddress");

// GET ALL ADDRESSES OF USER
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await UserAddress.find({ idUser: userId });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE ADDRESS
exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.body.isDefault) {
      await UserAddress.updateMany({ idUser: userId }, { isDefault: false });
    }

    const newAddress = new UserAddress({
      idUser: userId,
      ...req.body
    });

    const saved = await newAddress.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ADDRESS
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    if (req.body.isDefault) {
      await UserAddress.updateMany({ idUser: userId }, { isDefault: false });
    }

    const address = await UserAddress.findByIdAndUpdate(
      addressId,
      req.body,
      { new: true }
    );

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ADDRESS
exports.deleteAddress = async (req, res) => {
  try {
    await UserAddress.findByIdAndDelete(req.params.id);
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SET DEFAULT ADDRESS
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    await UserAddress.updateMany({ idUser: userId }, { isDefault: false });
    const address = await UserAddress.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true }
    );

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
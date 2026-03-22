module.exports = (schema) => {
  return (req, res, next) => {
    const data = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    const { error, value } = schema.validate(data, {
      abortEarly: false,   // lấy tất cả lỗi
      allowUnknown: true,  // cho phép field ngoài schema
      stripUnknown: true,  // tự động xoá field rác
    });

    // ❌ Nếu có lỗi
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((e) => ({
          field: e.path.join("."), // vd: body.price
          message: e.message,
        })),
      });
    }

    // ✅ Ghi đè lại dữ liệu đã được clean
    req.body = value.body || {};
    req.query = value.query || {};
    req.params = value.params || {};

    next();
  };
};
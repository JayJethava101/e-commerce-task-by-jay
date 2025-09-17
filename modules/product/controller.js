const productService = require("./service");

exports.createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const product = await productService.createProduct(productData);
    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log("Error in createProduct controller", error);
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  const products = await productService.getAllProducts(req.query);
  res.status(200).json({
    status: "success",
    message: "Get product list successfully",
    data: products,
  });
};

const createHttpError = require("http-errors");
const Product = require("./model");
const { Op } = require("sequelize");

exports.createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

exports.getAllProducts = async (queryOptions = {}) => {
  const { page = 1, limit = 10, category, minPrice, maxPrice } = queryOptions;

  const filter = {};
  const offset = (page - 1) * limit;

  if (category)
    // filter.category = {
    //   [Op.iLike]: `%${category}%`,
    // };
    filter.category = category;

  if (minPrice)
    filter.price = {
      [Op.gte]: minPrice,
    };

  if (maxPrice)
    filter.price = {
      [Op.lte]: maxPrice,
    };

  const products = await Product.findAll({
    where: filter,
    limit,
    offset,
  });
  return products;
};

exports.checkProductStock = async (productId, quantity) => {
  const product = await Product.findByPk(productId, {
    attributes: ["id", "name", "stockQuantity", "price"],
  });
  if (!product) {
    throw new createHttpError(404, "Product not found");
  }

  if (product.stockQuantity < quantity) {
    throw new createHttpError(
      400,
      `Insufficient stock for product ${product.name}. Available stock: ${product.stock}`
    );
  }

  return product;
};

exports.adjustProductStock = async (productId, quantity) => {
  try {
    const product = await Product.increment(
      { stockQuantity: quantity },
      { where: { id: productId } }
    );
  } catch (error) {
    console.error("Error adjusting product stock:", error);
  }
};

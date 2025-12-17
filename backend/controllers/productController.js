const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/productModel');

// @desc    Fetch all products with Search and Sort
// @route   GET /api/products?keyword=...&sort=...
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i', // Case insensitive
        },
      }
    : {};

  // Sorting Logic
  let sort = { createdAt: -1 }; // Default: Newest first
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price-asc':
        sort = { price: 1 };
        break;
      case 'price-desc':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
  }

  const products = await Product.find({ ...keyword }).sort(sort);
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } = req.body;
  console.log('[Backend] Creating:', name);

  const product = new Product({
    name: name || 'Sample Name',
    price: price !== undefined ? price : 0,
    user: req.user._id,
    image: image || '/images/sample.jpg',
    brand: brand || 'Sample Brand',
    category: category || 'Sample Category',
    countInStock: countInStock !== undefined ? countInStock : 0,
    numReviews: 0,
    description: description || 'Sample Description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id.trim();
  console.log(`[Backend] Update Request for ID: ${id}`);

  const product = await Product.findById(id);

  if (product) {
    product.name = req.body.name || product.name;
    product.price = req.body.price !== undefined ? req.body.price : product.price;
    product.description = req.body.description || product.description;
    product.image = req.body.image || product.image;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.countInStock = req.body.countInStock !== undefined ? req.body.countInStock : product.countInStock;

    const updatedProduct = await product.save();
    console.log('[Backend] Update Success.');
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id.trim();
  const deletedProduct = await Product.findByIdAndDelete(id);

  if (deletedProduct) {
    console.log(`[Backend] Successfully deleted product: ${id}`);
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
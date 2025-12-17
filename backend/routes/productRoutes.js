const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Root Route: /api/products
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// 2. Top Products Route: /api/products/top
router.route('/top').get(getTopProducts);

// 3. ID Routes: /api/products/:id
// THIS IS THE MISSING PART causing your 404s
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct) // Links to updateProduct controller
  .delete(protect, admin, deleteProduct); // Links to deleteProduct controller

// 4. Review Route: /api/products/:id/reviews
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
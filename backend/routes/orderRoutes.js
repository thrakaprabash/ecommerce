const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders); // Admin route to get all orders
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, deleteOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered); // Admin route to mark delivered

module.exports = router;
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required',
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items: cart.items,
      totalAmount: cart.total,
      deliveryAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      orderStatus: 'Pending',
    });

    cart.items = [];
    cart.subtotal = 0;
    cart.deliveryCharge = 0;
    cart.total = 0;
    cart.updatedAt = new Date();
    await cart.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
};

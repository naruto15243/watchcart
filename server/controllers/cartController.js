const Cart = require('../models/Cart');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          userId: req.user._id,
          items: [],
          subtotal: 0,
          deliveryCharge: 0,
          total: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { itemType, itemId, name, price, quantity, image } = req.body;

    if (!itemType || !itemId || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required cart item fields',
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [],
        subtotal: 0,
        deliveryCharge: 0,
        total: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.itemId.toString() === itemId.toString() && item.itemType === itemType
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity || 1);
    } else {
      cart.items.push({
        itemType,
        itemId,
        name,
        price: Number(price),
        quantity: Number(quantity || 1),
        image: image || '',
      });
    }

    cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.deliveryCharge = cart.items.length > 0 ? 40 : 0;
    cart.total = cart.subtotal + cart.deliveryCharge;
    cart.updatedAt = new Date();

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.find((entry) => entry._id.toString() === id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    item.quantity = Number(quantity);
    cart.subtotal = cart.items.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);
    cart.deliveryCharge = cart.items.length > 0 ? 40 : 0;
    cart.total = cart.subtotal + cart.deliveryCharge;
    cart.updatedAt = new Date();

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message,
    });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== id);
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.deliveryCharge = cart.items.length > 0 ? 40 : 0;
    cart.total = cart.subtotal + cart.deliveryCharge;
    cart.updatedAt = new Date();

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Cart item removed',
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to remove cart item',
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};

const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// Tạo đơn hàng COD
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      totalAmount,
      cartId,
    } = req.body;

    if (!userId || !cartItems || cartItems.length === 0 || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin để tạo đơn hàng.",
      });
    }

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",        // mặc định đang chờ xác nhận
      paymentMethod: "cod",          // Thanh toán khi nhận hàng
      paymentStatus: "unpaid",       // chưa thanh toán
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });

    await newOrder.save();

    // Xoá giỏ hàng sau khi tạo đơn hàng
    if (cartId) {
      await Cart.findByIdAndDelete(cartId);
    }

    res.status(201).json({
      success: true,
      message: "Đơn hàng COD đã được tạo thành công.",
      orderId: newOrder._id,
      data: newOrder,
    });
  } catch (e) {
    console.error("❌ Lỗi khi tạo đơn hàng COD:", e.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo đơn hàng.",
    });
  }
};

// Lấy danh sách đơn hàng theo user
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng nào.",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng.",
    });
  }
};

// Lấy chi tiết đơn hàng
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết đơn hàng.",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
};

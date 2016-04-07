var Order = require('./gen-nodejs/Order_types');

var OrderServiceImpl = {
  ping: function(result) {
    console.log("call ping");
    return result(null, "pong");
  },

  getOrder: function(orderId, result) {
    return result(null, new Order.Order({orderId: orderId, orderTitle: 'example_nodejs'}));
  }
};

module.exports = OrderServiceImpl;
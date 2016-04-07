namespace java demo.service.api.order
namespace php tutorial

include "Order.thrift"

service OrderService{

    string ping();

    Order.Order getOrder(1:i32 orderId);

}
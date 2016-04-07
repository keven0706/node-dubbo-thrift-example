/**************************
 * @description
 *   结论：provider通过zookeeper注册dobbo服务，
 *   dubbo服务可以通过zookeeper获取，并调用成功，走通
 *   但是如果需要进入项目阶段需要对nodejs进行封装
 **************************/

var _ = require('underscore');
var thrift = require('thrift');
var ZKClient = require('./zookeeper');

var SERVER_PORT = 9090;

var OrderService = require('./service/gen-nodejs/OrderService');
var OrderServiceImpl = require('./service/OrderServiceImpl');

// 对应thrift在dubbo端的设置需求，指定TFramedTransport和TCompactProtocol
var options = {
  transport: thrift.TFramedTransport,
  protocol: thrift.TCompactProtocol
};
var server = thrift.createServer(OrderService, OrderServiceImpl, options);
server.listen(SERVER_PORT);

var SERVICE_PACKAGE_NAME = 'demo.service.api.order.OrderService$Iface';
var PROTOCOL = 'thrift2:';
var HOST = '127.0.0.1';
var PORT = 2181;
var PROVIDERS = 'providers';
var ROOT_NODE = 'dubbo'

// 根据dubbo服务需求，暴露更多的信息给zookeeper
var serviceinfo = [{
    key: 'anyhost',
    value: true
  },

  {
    key: 'application',
    value: 'hello-service-producer'
  },

  {
    key: 'application.version',
    value: '1.0'
  },

  {
    key: 'dubbo',
    value: '2.8.4a'
  },

  {
    key: 'generic',
    value: false
  },

  {
    key: 'interface',
    value: SERVICE_PACKAGE_NAME
  },

  {
    key: 'methods',
    value: 'ping,getOrder'
  },

  {
    key: 'organization',
    value: 'github'
  },

  {
    key: 'owner',
    value: 'leewind'
  },

  {
    key: 'pid',
    value: 35682
  },

  {
    key: 'revision',
    value: '1.0'
  },

  {
    key: 'service.filter',
    value: 'serviceFilter'
  },

  {
    key: 'side',
    value: 'provider'
  },

  {
    key: 'timeout',
    value: 10000
  },

  {
    key: 'timestamp',
    value: Date.now()
  }
]

// 拼接参数
var arr = [];
_.each(serviceinfo, function(item) {
  arr.push(item.key + '=' + item.value)
});

var point = PROTOCOL + '//' + HOST + ':' + SERVER_PORT + '/' + SERVICE_PACKAGE_NAME + '?' + arr.join('&');
var path = '/' + ROOT_NODE + '/' + encodeURIComponent(SERVICE_PACKAGE_NAME) + '/' + PROVIDERS + '/' + encodeURIComponent(point);

var zk = new ZKClient(HOST, PORT);
zk.connect()
  .then(function () {
    return zk.create(path);
  })
  .then(function () {

  });

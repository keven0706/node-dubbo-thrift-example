// 结论：consomer通过zookeeper获取dobbo服务，并且通过thrift访问dubbo，走通，但是如果需要进入项目阶段需要对nodejs进行封装

var zookeeper = require('node-zookeeper-client');
var thrift = require('thrift');
var url = require('url');

var OrderService = require('./service/gen-nodejs/OrderService');
var ZKClient = require('./zookeeper');

var HOST = '127.0.0.1';
var PORT = 2181;
var SERVICE_PACKAGE_NAME = 'demo.service.api.order.OrderService$Iface';
var ROOT_NODE = 'dubbo';
var PROVIDERS = 'providers';
var PROTOCOL = 'thrift2:';

var path ='/' + ROOT_NODE + '/' + encodeURIComponent(SERVICE_PACKAGE_NAME) + '/' + PROVIDERS;

var zk = new ZKClient(HOST, PORT);


function listChildren(client, path) {
  zk.client.getChildren(
    path,
    function(event) {
      console.log('Got watcher event: %s', event);
      listChildren(client, path);
    },
    function(error, children, stat) {
      if (error) {
        console.log(
          'Failed to list children of %s due to: %s.',
          path,
          error
        );
        return;
      }

      for (var i = 0; i < children.length; i++) {

        console.log(decodeURIComponent(children[i]))

        var result = url.parse(decodeURIComponent(children[i]));
        if (result.protocol != PROTOCOL) continue;

        var connection = thrift.createConnection(result.hostname, result.port, {
          transport: thrift.TFramedTransport,
          protocol: thrift.TCompactProtocol
        });
        var thriftClient = thrift.createClient(OrderService, connection);

        thriftClient.getOrder(1, function(err, response) {
          console.log(err)
          console.log(response)
        })

      }
    }
  );
}

zk.connect()
  .then(function () {
    listChildren(zk.client, path)
  });
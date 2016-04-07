node-dubbo-thrift-example
==============

与项目[https://github.com/yjmyzz/dubbox-sample](https://github.com/yjmyzz/dubbox-sample)配套使用，实现了`nodejs`和`dubbo`通过`thrift`进行交互

1. `server.js`是服务提供方，会将自身服务注册到`zookeeper`的`dubbo`目录中，使用[https://github.com/yjmyzz/dubbox-sample](https://github.com/yjmyzz/dubbox-sample)中`consumer`可以进行交互
2. `client.js`是服务消费方，会通过`zookeeper`获取`dubbo`节点下的服务，并进行消费
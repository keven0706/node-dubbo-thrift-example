var Q = require('q');
var zookeeper = require('node-zookeeper-client');

function Client(host, port) {
  this.link = host + ':' + port;
  this.init();
}

Client.prototype.init = function() {
  this.client = zookeeper.createClient(this.link);
};

Client.prototype.connect = function() {
  var deferred = Q.defer();

  this.client.once('connected', function() {
    console.log('Connected to the server.');

    deferred.resolve();
  });

  this.client.connect();

  return deferred.promise;
};

Client.prototype.create = function(path) {
  var deferred = Q.defer();

  this.client.create(path, function(error) {
    if (error) {
      console.log('Failed to create node: %s due to: %s.', path, error);
      deferred.reject(error);
    } else {
      console.log('Node: %s is successfully created.', path);
      deferred.resolve();
    }
  });

  return deferred.promise;
};

Client.prototype.close = function() {
  this.client.close();
};


module.exports = exports = Client;
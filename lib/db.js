var mongodb = require('mongodb');

var connection;
var db;

var guard = module.exports.guard = function guard(onError, onSuccess) {
  return function(error, data) {
    if(error) return onError(error);
    onSuccess(data);
  }
};

var connect = module.exports.connect = function connect(onConnect) {
  if(!connection)
    connection = new mongodb.Db('prestijs', new mongodb.Server("127.0.0.1",27017, { auto_reconnect : true }), {});

  if(db) return onConnect(null,db);

  connection.open(function(error, db_) {
    db = db_;
    onConnect(null,db);
  });
};

module.exports.collection_functor = function(collectionName) {
  return function(onLoad) {
    connect(function(error, db) {
      if(error) return onLoad(error);
      db.collection(collectionName, onLoad);
    });
  };
};

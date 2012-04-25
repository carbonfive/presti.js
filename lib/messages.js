var db = require('./db');

var messages = db.collection_functor('messages');

module.exports.save = function(message, onSaved) {
  return messages(db.guard(onSaved,save));
  function save(messageCollection) {
    messageCollection.save(message, onSaved);
  }
};

module.exports.stream = function(onEach,onDone) {
  var cursor, messageCollection;
  return messages(db.guard(onEach,withCollection));

  function withCollection(messageCollection_) {
    messageCollection = messageCollection_;
    start();
  }
  function start() {
    cursor = messageCollection.find();
    cursor.nextObject(next);
  }
  function next(error, message) {
    if(!error && !message) return onDone ? onDone() : null;
    onEach(error, message);
    cursor.nextObject(next);
  }
}

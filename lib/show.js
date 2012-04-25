var connect = require('connect');
var utils = connect.utils;
var messages = require('./messages');

module.exports.init = function(io, sessionStore) {
  var slideNumber = 0;

  io.set('authorization', function(data, accept) {
    if(data.headers.cookie) {
      data.cookie = utils.parseCookie(data.headers.cookie);
      data.sessionId = data.cookie['express.sid'];
      data.sessionStore = sessionStore;
      sessionStore.get(data.sessionId, function(error, session) {
        if(error || !session) {
          accept('Error', false);
        } else {
          data.session = new connect.middleware.session.Session(data, session);
          accept(null, true);
        }
      });
    } else {
      return accept('No cookie transmitted', false);
    }
  });

  var show = io.on('connection', onConnect);

  return show;

  function onConnect(socket) {
    var handshake = socket.handshake;
    handshake.session.reload(function() {
      if(handshake.session.presenter) {
        socket.on('sync', onSync);
      }
    });
    socket.on('message', onMessage);
    socket.emit('sync', { 'slideNumber' : slideNumber });
    messages.stream(function(error, message) {
      if(!error && message) {
        message.replay = true;
        socket.emit('message', message);
      }
    });

    function onSync(data) {
      slideNumber = data.slideNumber;
      show.sockets.emit('sync', { 'slideNumber' : slideNumber });
    }

    function onMessage(data) {
      var handshake = socket.handshake;
      handshake.session.reload(function() {
        var auth = handshake.session.auth;
        var user = auth.user;
        var messageBody = {
          from : { 
            email : user.email,
            name : user.name
          },
          message : data.message
        };
        if(user.picture) {
          messageBody.from.picture = user.picture;
        }
        messages.save(messageBody, onSaved);
        function onSaved(error) {
          show.sockets.emit('message', messageBody);
        }
      });
    }
  }
};

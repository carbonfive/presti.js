var connect = require('connect');
var utils = connect.utils;
var crypto = require('crypto');
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
      var auth = handshake.session.auth;
      var user = handshake.session.auth.user;
      if(auth && user) {
        socket.broadcast.emit('joined', { connection : socket.id,
                                          name : user.name,
                                          picture : userPicture(user) });
      }
    });
    for(var id in show.sockets.sockets) {
      var existingSocket = show.sockets.sockets[id];
      var handshake = existingSocket.handshake;
      var auth = handshake.session.auth;
      var user = handshake.session.auth.user;
      if(auth && user) {
        socket.emit('joined', { connection : id,
                    name : user.name,
                    picture : userPicture(user) });
      }
    }
    socket.on('message', onMessage);
    socket.on('disconnect', onDisconnect);
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
            name : user.name,
            picture: userPicture(user)
          },
          message : data.message
        };
        messages.save(messageBody, onSaved);
        function onSaved(error) {
          show.sockets.emit('message', messageBody);
        }
      });
    }

    function onDisconnect() {
      show.sockets.emit('disconnected', { id : socket.id });
    }
  }

  function userPicture(user) {
    if(user.picture) return user.picture;
    var md5 = crypto.createHash('md5');
    md5.update(user.email);
    return "http://www.gravatar.com/avatar/" + md5.digest('hex') + "?d=retro";
  }
}

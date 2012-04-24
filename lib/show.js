var Session = require('connect').middleware.session.Session;
var parseCookie = require('connect').utils.parseCookie;

module.exports.init = function(io, sessionStore) {
  var slideNumber = 0;

  io.set('authorization', function(data, accept) {
    if(data.headers.cookie) {
      data.cookie = parseCookie(data.headers.cookie);
      data.sessionId = data.cookie['express.sid'];
      data.sessionStore = sessionStore;
      sessionStore.get(data.sessionId, function(error, session) {
        if(error || !session) {
          accept('Error', false);
        } else {
          data.session = new Session(data, session);
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
    socket.emit('sync', { 'slideNumber' : slideNumber });
  }

  function onSync(data) {
    slideNumber = data.slideNumber;
    show.sockets.emit('sync', { 'slideNumber' : slideNumber });
  }
};

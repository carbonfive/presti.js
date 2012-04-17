module.exports.init = function(io) {
  var slideNumber = 0;
  var show = io.on('connection', onConnect);

  return show;

  function onConnect(socket) {
    socket.on('sync', onSync);
    socket.emit('sync', { 'slideNumber' : slideNumber });
  }

  function onSync(data) {
    slideNumber = data.slideNumber;
    show.sockets.emit('sync', { 'slideNumber' : slideNumber });
  }
};

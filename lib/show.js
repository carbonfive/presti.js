module.exports.init = function(io) {
  var connections = {};
  var show = io.on('connection', onConnect);

  return show;

  function onConnect(socket) {
    socket.on('next', onNext);
    socket.on('prev', onPrev);
  }

  function onNext() {
    show.sockets.emit('next');
  }

  function onPrev() {
    show.sockets.emit('prev');
  }
};

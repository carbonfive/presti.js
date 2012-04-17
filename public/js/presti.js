jQuery(function($){
  var slideNumber = 0;
  var show = io.connect();

  $('.slideshow').cycle({
    'fx' : 'none'
  }).cycle('pause');

  show.on('sync', onSync);
  $(document).keyup(onKeyReleased);

  function onSync(data) {
    console.log(data);
    $('.slideshow').cycle(data.slideNumber);
  }

  function onKeyReleased(event) {
    if(event.keyCode == 37) {
      slideNumber = slideNumber <= 0 ? 2 : slideNumber - 1;
      show.emit('sync', { 'slideNumber' : slideNumber });
    } else if (event.keyCode == 39) {
      slideNumber = slideNumber >= 2 ? 0 : slideNumber + 1;
      show.emit('sync', { 'slideNumber' : slideNumber });
    }
  }
});

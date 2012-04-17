jQuery(function($){
  var numberOfSlides = $('.slideshow').children().size();
  var slideNumber = 0;
  var show = io.connect();

  $('.slideshow').cycle({
    'fx' : 'none'
  }).cycle('pause');

  show.on('sync', onSync);
  $(document).keyup(onKeyReleased);

  function onSync(data) {
    slideNumber = data.slideNumber;
    $('.slideshow').cycle(data.slideNumber);
  }

  function onKeyReleased(event) {
    if(event.keyCode == 37) {
      slideNumber = slideNumber <= 0 ? numberOfSlides - 1 : slideNumber - 1;
      show.emit('sync', { 'slideNumber' : slideNumber });
    } else if (event.keyCode == 39) {
      slideNumber = slideNumber >= numberOfSlides - 1 ? 0 : slideNumber + 1;
      show.emit('sync', { 'slideNumber' : slideNumber });
    }
  }
});

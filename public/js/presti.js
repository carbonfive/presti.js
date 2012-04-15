jQuery(function($){
  var show = io.connect();

  $('.slideshow').cycle({
    'fx' : 'none'
  }).cycle('pause');

  show.on('next', onNext);
  show.on('prev', onPrev);
  $(document).keyup(onKeyReleased);

  function onNext() {
    $('.slideshow').cycle('next');
  }

  function onPrev() {
    $('.slideshow').cycle('prev');
  }

  function onKeyReleased(event) {
    if(event.keyCode == 37) {
      show.emit('prev');
    } else if (event.keyCode == 39) {
      show.emit('next');
    }
  }
});
